"use client";

import React, { useState } from "react";
import { 
  Radio, Smartphone, Clock, Compass, ChevronDown, 
  MapPin, ShieldAlert, WifiOff, Activity, UserCheck 
} from "lucide-react";

// Mock database structured by Market territories housing multiple unique agent nodes
const marketTerritoriesData = {
  "Mpemba Market Hub": {
    coordinates: "15.8341° S, 35.0021° E",
    fenceCircle: { cx: 400, cy: 200, r: 180 },
    agents: [
      { id: "Agent 001", name: "Chikondi Phiri", device: "Samsung Galaxy A15", uuid: "8f3c4d2e-b1a9-44ef", os: "Android 14 (v1.0)", active: true, compliance: "100% Secure", lastPing: "Just now", cx: 420, cy: 150, breadcrumbs: [{ time: "08:15 AM", zone: "North Gate Gatehouse", status: "Checked In" }, { time: "10:30 AM", zone: "Produce Row Aisle A", status: "Collecting" }] },
      { id: "Agent 004", name: "Ephraim Banda", device: "Tecno Spark 20", uuid: "4e5f6g7h-b2c3-99aa", os: "Android 13 (v1.1)", active: false, compliance: "Disconnected", lastPing: "42 mins ago", cx: 320, cy: 260, breadcrumbs: [{ time: "08:00 AM", zone: "Main Revenue Office", status: "Device Synced" }, { time: "09:12 AM", zone: "Unknown Perimeter", status: "Signal Dropped" }] }
    ]
  },
  "Limbe Main Market": {
    coordinates: "15.8167° S, 35.0500° E",
    fenceCircle: { cx: 380, cy: 220, r: 210 },
    agents: [
      { id: "Agent 012", name: "Mary Kachale", device: "Xiaomi Redmi Note 13", uuid: "3a9b8c7d-e6f5-22d1", os: "Android 14 (v1.0)", active: true, compliance: "98% Secure", lastPing: "2 mins ago", cx: 460, cy: 180, breadcrumbs: [{ time: "07:30 AM", zone: "Bus Depot Terminal", status: "Checked In" }, { time: "11:00 AM", zone: "Wholesale Fish Market", status: "Active Sync" }] },
      { id: "Agent 019", name: "John Mussa", device: "Samsung Galaxy A05", uuid: "9f8e7d6c-5b4a-33fe", os: "Android 13 (v1.0)", active: true, compliance: "100% Secure", lastPing: "5 mins ago", cx: 300, cy: 290, breadcrumbs: [{ time: "07:45 AM", zone: "Hardware Gate entrance", status: "Checked In" }] },
      { id: "Agent 007", name: "Zione Alide", device: "Infinix Hot 40i", uuid: "1a2b3c4d-5e6f-77gh", os: "Android 14 (v1.2)", active: false, compliance: "GEOFENCE BREACH", lastPing: "18 mins ago", cx: 580, cy: 120, breadcrumbs: [{ time: "08:10 AM", zone: "Central Clothes Plaza", status: "Collecting" }, { time: "10:46 AM", zone: "Outside Registered Boundary", status: "Breach Flag" }] }
    ]
  },
  "Ndirande Market Hub": {
    coordinates: "15.7833° S, 35.0167° E",
    fenceCircle: { cx: 410, cy: 190, r: 160 },
    agents: [
      { id: "Agent 024", name: "Patrick Dzimbiri", device: "Nokia G22 Enterprise", uuid: "5f4e3d2c-1b0a-99bc", os: "Android 13 (v2.0)", active: true, compliance: "94% Secure", lastPing: "1 min ago", cx: 430, cy: 160, breadcrumbs: [{ time: "08:00 AM", zone: "Ndirande Post Office Ring", status: "Checked In" }, { time: "10:15 AM", zone: "Timber Merchant Compound", status: "Collecting" }] }
    ]
  }
};

export function GeofenceTracker() {
  const [selectedMarket, setSelectedMarket] = useState<keyof typeof marketTerritoriesData>("Mpemba Market Hub");
  const activeTerritory = marketTerritoriesData[selectedMarket];
  
  // Default selected agent is the first agent of the selected market space
  const [selectedAgentId, setSelectedAgentId] = useState<string>(activeTerritory.agents[0].id);

  // Retrieve matching profile dataset object
  const currentAgent = activeTerritory.agents.find(a => a.id === selectedAgentId) || activeTerritory.agents[0];

  const handleMarketChange = (marketKey: keyof typeof marketTerritoriesData) => {
    setSelectedMarket(marketKey);
    // Automatically focus the first agent available in the newly chosen layout boundary
    setSelectedAgentId(marketTerritoriesData[marketKey].agents[0].id);
  };

  return (
    <div className="space-y-5 w-full antialiased text-slate-800">
      
      {/* 1. ADMINISTRATION TELEMETRY CONTROLS */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-blue-50 text-[#5684ff] rounded-xl border border-blue-100">
            <Radio className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Live Field Force Positioning Matrix</h3>
            <p className="text-[11px] text-slate-400">Click on any agent dot directly within the geofenced workspace coordinates to evaluate node metrics.</p>
          </div>
        </div>

        {/* MARKET JURISDICTION DROP-DOWN */}
        <div className="relative min-w-[260px]">
          <select
            value={selectedMarket}
            onChange={(e) => handleMarketChange(e.target.value as keyof typeof marketTerritoriesData)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-lg pl-3 pr-9 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-[#5684ff] cursor-pointer transition-all"
          >
            {Object.keys(marketTerritoriesData).map((marketKey) => (
              <option key={marketKey} value={marketKey}>{marketKey}</option>
            ))}
          </select>
          <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
        </div>
      </div>

      {/* 2. EXPANDED HUD COMMAND GEOMETRY LAYER */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <Compass className="h-4 w-4 text-[#5684ff]" />
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
              Viewport: {selectedMarket} <span className="text-slate-300 font-semibold lowercase ml-1">({activeTerritory.coordinates})</span>
            </span>
          </div>
          <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
            Interactive Node Mapping
          </span>
        </div>

        {/* HIGH-DENSITY INTERACTIVE RADAR LAYER SCREEN */}
        <div className="bg-slate-950 rounded-xl w-full h-[440px] relative overflow-hidden border border-slate-800 flex items-center justify-center select-none">
          {/* Diagnostic Vector Grid Overlay Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:32px_32px] opacity-50" />
          
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="none">
            {/* Render Selected Market Geofence Perimeter Bounds */}
            <circle 
              cx={activeTerritory.fenceCircle.cx} 
              cy={activeTerritory.fenceCircle.cy} 
              r={activeTerritory.fenceCircle.r} 
              fill="#5684ff" 
              fillOpacity="0.02" 
              stroke="#5684ff" 
              strokeWidth="1.5" 
              strokeDasharray="6 4" 
            />
          </svg>

          {/* GENERATE LIVE INTERACTIVE AGGREGATED AGENT OBJECTS */}
          {activeTerritory.agents.map((agent) => {
            const isTargetNode = selectedAgentId === agent.id;
            const isBreached = agent.compliance.includes("BREACH");
            
            return (
              <button
                key={agent.id}
                onClick={() => setSelectedAgentId(agent.id)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group focus:outline-none transition-transform duration-150 active:scale-95"
                style={{ left: `${(agent.cx / 800) * 100}%`, top: `${(agent.cy / 400) * 100}%` }}
              >
                {/* Visual Ping Layers representing device power parameters */}
                <span className="flex h-6 w-6 relative items-center justify-center">
                  {agent.active ? (
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60" />
                      <span className={`relative inline-flex rounded-full h-4.5 w-4.5 border-2 border-white shadow-md transition-all ${
                        isTargetNode ? "bg-slate-900 scale-110" : "bg-[#5684ff]"
                      }`} />
                    </>
                  ) : (
                    <span className={`relative inline-flex rounded-full h-4 w-4 border-2 border-white shadow-sm transition-all ${
                      isBreached ? "bg-rose-500 animate-pulse" : "bg-slate-500"
                    } ${isTargetNode ? "scale-125 border-slate-900" : ""}`} />
                  )}
                </span>

                {/* Micro Hover Flag Badge Label */}
                <div className={`absolute left-1/2 -translate-x-1/2 top-7 bg-slate-900 text-white font-black text-[9px] px-1.5 py-0.5 rounded border shadow-md whitespace-nowrap opacity-80 transition-opacity group-hover:opacity-100 ${
                  isTargetNode ? "border-[#5684ff] opacity-100" : "border-slate-700"
                }`}>
                  {agent.id} {!agent.active && "• Off-line"}
                </div>
              </button>
            );
          })}

          {/* Quick instructions indicator overlay */}
          <div className="absolute top-3 right-3 bg-slate-900/80 border border-slate-800 text-[9px] text-slate-400 font-bold px-2.5 py-1 rounded-lg">
            Status: Blue = Active Pulse | Gray/Red = Disconnected Nodes
          </div>
        </div>
      </div>

      {/* 3. DUAL-COLUMN DATA TELEMETRY CONSOLE SIDECARS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* PANEL A: TARGET TERMINAL SECURE PROFILE */}
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
              <div><span className="text-slate-400 block text-[10px]">Network Integrity</span><span className={`font-black ${currentAgent.active ? "text-[#5684ff]" : "text-rose-500"}`}>{currentAgent.compliance}</span></div>
            </div>
            <div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight block">Immutable DB System UUID Bind-Key</span>
              <span className="font-mono text-[10px] text-slate-500 bg-slate-50 border border-slate-100 px-2 py-1 rounded block mt-1 select-all truncate">{currentAgent.uuid}</span>
            </div>
          </div>
        </div>

        {/* PANEL B: WORKTIME BREADCRUMB TRAILS LOGS */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-[#5684ff]" />
              <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Footprint Activity Chronology</h4>
            </div>
            <span className="text-[10px] font-bold text-slate-400">Last Pulse: {currentAgent.lastPing}</span>
          </div>

          {/* CONDITIONAL BACKEND LEDGER CHECK OUT */}
          <div className="space-y-3 relative before:absolute before:inset-y-1 before:left-2 before:w-0.5 before:bg-slate-100 pl-1">
            {currentAgent.breadcrumbs.map((crumb, idx) => {
              const isAlert = crumb.status.includes("Breach") || crumb.status.includes("Dropped");
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