"use client";

import React, { useState, useEffect } from "react";
import { 
  Radio, Smartphone, Clock, Compass, ChevronDown 
} from "lucide-react";
import { MapContainer, TileLayer, Circle, Marker, useMap } from "react-leaflet";

// Explicitly patch Leaflet layouts for Next.js build frameworks
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 1. DYNAMIC COLOR MARKER GENERATORS (Standard Blue vs Warning Red)
const BlueIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const RedIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// --- TYPE-SAFETY STRATEGY INTERFACES ---
interface AgentBreadcrumb {
  time: string;
  zone: string;
  status: string;
}

interface Agent {
  id: string;
  name: string;
  device: string;
  uuid: string;
  os: string;
  active: boolean;
  compliance: string;
  lastPing: string;
  lat: number;
  lon: number;
  breadcrumbs: AgentBreadcrumb[];
}

interface MarketTerritory {
  coordinates: string;
  mapCenter: [number, number];
  fenceRadiusMeters: number; // Small customized radii tailored to specific tight areas
  agents: Agent[];
}

// Fixed granular coordinates dataset centered strictly on small localized zones
const marketTerritoriesData: Record<string, MarketTerritory> = {
  "Mpemba Market Hub": {
    coordinates: "15.8341° S, 35.0021° E",
    mapCenter: [-15.8341, 35.0021],
    fenceRadiusMeters: 120, // Very small tight localized radius limit setup
    agents: [
      { id: "Agent 001", name: "Chikondi Phiri", device: "Samsung Galaxy A15", uuid: "8f3c4d2e-b1a9-44ef", os: "Android 14 (v1.0)", active: true, compliance: "100% Secure", lastPing: "Just now", lat: -15.8339, lon: 35.0024, breadcrumbs: [{ time: "08:15 AM", zone: "Inside Perimeter A", status: "Collecting" }] },
      { id: "Agent 004", name: "Ephraim Banda", device: "Tecno Spark 20", uuid: "4e5f6g7h-b2c3-99aa", os: "Android 13 (v1.1)", active: false, compliance: "Disconnected", lastPing: "42 mins ago", lat: -15.8365, lon: 34.9995, breadcrumbs: [{ time: "09:12 AM", zone: "Unknown Perimeter", status: "Out of Bounds" }] }
    ]
  },
  "Limbe Main Market": {
    coordinates: "15.8167° S, 35.0500° E",
    mapCenter: [-15.8167, 35.0500],
    fenceRadiusMeters: 180, // Concentrated tight revenue collection zone
    agents: [
      { id: "Agent 012", name: "Mary Kachale", device: "Xiaomi Redmi Note 13", uuid: "3a9b8c7d-e6f5-22d1", os: "Android 14 (v1.0)", active: true, compliance: "98% Secure", lastPing: "2 mins ago", lat: -15.8162, lon: 35.0505, breadcrumbs: [{ time: "11:00 AM", zone: "Wholesale Terminal", status: "Active Sync" }] },
      { id: "Agent 007", name: "Zione Alide", device: "Infinix Hot 40i", uuid: "1a2b3c4d-5e6f-77gh", os: "Android 14 (v1.2)", active: false, compliance: "GEOFENCE BREACH", lastPing: "18 mins ago", lat: -15.8215, lon: 35.0585, breadcrumbs: [{ time: "10:46 AM", zone: "Outside Boundary Layout", status: "Breach Flag" }] }
    ]
  },
  "Ndirande Market Hub": {
    coordinates: "15.7833° S, 35.0167° E",
    mapCenter: [-15.7833, 35.0167],
    fenceRadiusMeters: 90, // Ultra-compact micro fence parameters
    agents: [
      { id: "Agent 024", name: "Patrick Dzimbiri", device: "Nokia G22 Enterprise", uuid: "5f4e3d2c-1b0a-99bc", os: "Android 13 (v2.0)", active: true, compliance: "94% Secure", lastPing: "1 min ago", lat: -15.7831, lon: 35.0164, breadcrumbs: [{ time: "10:15 AM", zone: "Timber Compound", status: "Collecting" }] }
    ]
  }
};

type MarketKey = keyof typeof marketTerritoriesData;

// Mathematical calculation helper utilizing the Haversine formula to compute live out-of-bounds statuses
function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Radius of the Earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Controller component tasked with framing the map strictly around the active localized market zone
function FocusMarketViewport({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    // Sets focus closely (Zoom 17) to restrict view to the market and its immediate surroundings
    map.setView(center, 17, { animate: true, duration: 1.0 });
  }, [center, map]);
  return null;
}

export default function GeofenceMapInner() {
  const [selectedMarket, setSelectedMarket] = useState<MarketKey>("Mpemba Market Hub");
  const activeTerritory = marketTerritoriesData[selectedMarket];
  
  const [selectedAgentId, setSelectedAgentId] = useState<string>(activeTerritory.agents[0].id);
  const currentAgent = activeTerritory.agents.find(a => a.id === selectedAgentId) || activeTerritory.agents[0];

  const handleMarketChange = (marketKey: MarketKey) => {
    setSelectedMarket(marketKey);
    setSelectedAgentId(marketTerritoriesData[marketKey].agents[0].id);
  };

  return (
    <div className="space-y-5 w-full antialiased text-slate-800">
      
      {/* 1. SELECTION CONTROLS */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-blue-50 text-[#5684ff] rounded-xl border border-blue-100">
            <Radio className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Live Field Force Positioning Matrix</h3>
            <p className="text-[11px] text-slate-400">Red pins identify collectors operating outside authorized zone limits.</p>
          </div>
        </div>

        <div className="relative min-w-[260px]">
          <select
            value={selectedMarket}
            onChange={(e) => handleMarketChange(e.target.value as MarketKey)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-lg pl-3 pr-9 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-[#5684ff] cursor-pointer transition-all"
          >
            {Object.keys(marketTerritoriesData).map((marketKey) => (
              <option key={marketKey} value={marketKey}>{marketKey}</option>
            ))}
          </select>
          <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
        </div>
      </div>

      {/* 2. CLOSE-FOCUS MAP VIEWPORT LAYER */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <Compass className="h-4 w-4 text-[#5684ff]" />
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
              Target Scope: {selectedMarket} <span className="text-slate-300 font-semibold lowercase ml-1">({activeTerritory.coordinates})</span>
            </span>
          </div>
          <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
            Micro Zone Tracker
          </span>
        </div>

        <div className="w-full h-[440px] rounded-xl overflow-hidden border border-slate-200 relative z-10">
          <MapContainer 
            center={activeTerritory.mapCenter} 
            zoom={17} // Aggressive map zoom framing to isolate view to the immediate market surroundings
            style={{ height: "100%", width: "100%" }}
            zoomControl={true}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <FocusMarketViewport center={activeTerritory.mapCenter} />

            {/* Micro Boundary Target Circle Perimeter */}
            <Circle
              center={activeTerritory.mapCenter}
              radius={activeTerritory.fenceRadiusMeters}
              pathOptions={{
                color: "#5684ff",
                fillColor: "#5684ff",
                fillOpacity: 0.05,
                dashArray: "4, 4",
                weight: 2
              }}
            />

            {/* RENDER AGENT MARKERS WITH LOGICAL STATUS-CHECK EMBEDDED */}
            {activeTerritory.agents.map((agent) => {
              // Calculate live distance from core center point
              const distance = getDistanceInMeters(
                activeTerritory.mapCenter[0], activeTerritory.mapCenter[1],
                agent.lat, agent.lon
              );
              
              // If distance exceeds custom boundary radius rules, flag them as out-of-bounds
              const isBreached = distance > activeTerritory.fenceRadiusMeters;

              return (
                <Marker
                  key={agent.id}
                  position={[agent.lat, agent.lon]}
                  icon={isBreached ? RedIcon : BlueIcon} // Swaps marker pin color to red instantly on breach status
                  eventHandlers={{
                    click: () => setSelectedAgentId(agent.id)
                  }}
                />
              );
            })}
          </MapContainer>

          <div className="absolute top-3 right-3 bg-slate-900/90 border border-slate-800 text-[9px] text-slate-400 font-bold px-2.5 py-1 rounded-lg z-[1000] shadow-md flex items-center gap-3">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#5684ff]" /> Inside Fence</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Out of Bounds</span>
          </div>
        </div>
      </div>

      {/* 3. DETAILS METRICS DASHBOARD CONSOLE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4 text-[#5684ff]" />
              <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Target Terminal Node Profile</h4>
            </div>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
              currentAgent.active ? "bg-blue-50 text-[#5684ff]" : "bg-slate-100 text-slate-500"
            }`}>
              {currentAgent.active ? "Transacting Live" : "Connection Severed"}
            </span>
          </div>

          <div className="text-xs space-y-2">
            <div className="grid grid-cols-2 gap-2 border-b border-slate-50 pb-2">
              <div><span className="text-slate-400 block text-[10px]">Collector Signature</span><span className="font-bold text-slate-800">{currentAgent.name} ({currentAgent.id})</span></div>
              <div><span className="text-slate-400 block text-[10px]">Phone Model Asset</span><span className="font-bold text-slate-800">{currentAgent.device}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-2 border-b border-slate-50 pb-2">
              <div><span className="text-slate-400 block text-[10px]">OS Architecture</span><span className="font-medium text-slate-600">{currentAgent.os}</span></div>
              <div>
                <span className="text-slate-400 block text-[10px]">Network Integrity</span>
                <span className={`font-black ${
                  getDistanceInMeters(activeTerritory.mapCenter[0], activeTerritory.mapCenter[1], currentAgent.lat, currentAgent.lon) > activeTerritory.fenceRadiusMeters 
                    ? "text-rose-500 animate-pulse" 
                    : "text-[#5684ff]"
                }`}>
                  {getDistanceInMeters(activeTerritory.mapCenter[0], activeTerritory.mapCenter[1], currentAgent.lat, currentAgent.lon) > activeTerritory.fenceRadiusMeters 
                    ? "GEOFENCE BREACH DETECTED" 
                    : "System Compliant"}
                </span>
              </div>
            </div>
            <div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight block">Immutable DB System UUID Bind-Key</span>
              <span className="font-mono text-[10px] text-slate-500 bg-slate-50 border border-slate-100 px-2 py-1 rounded block mt-1 select-all truncate">{currentAgent.uuid}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-[#5684ff]" />
              <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Footprint Activity Chronology</h4>
            </div>
            <span className="text-[10px] font-bold text-slate-400">Last Pulse: {currentAgent.lastPing}</span>
          </div>

          <div className="space-y-3 relative before:absolute before:inset-y-1 before:left-2 before:w-0.5 before:bg-slate-100 pl-1">
            {currentAgent.breadcrumbs.map((crumb, idx) => {
              const isAlert = crumb.status.includes("Breach") || crumb.status.includes("Out of Bounds") || crumb.status.includes("Dropped");
              return (
                <div key={idx} className="flex items-start space-x-3 text-xs relative">
                  <div className={`w-4 h-4 rounded-full border-2 bg-white z-10 flex items-center justify-center shrink-0 mt-0.5 ${
                    isAlert ? "border-rose-500" : "border-[#5684ff]"
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isAlert ? "bg-rose-500" : "bg-[#5684ff]"}`} />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-800">{crumb.zone}</span>
                      <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap pl-2">{crumb.time}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-tight">{crumb.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}