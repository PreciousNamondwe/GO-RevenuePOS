"use client";

import React, { useState } from "react";
import { 
  Store, Users, UserCheck, Smartphone, RefreshCw, 
  History, Settings, ShieldCheck, ArrowUpRight, Network, ArrowLeft
} from "lucide-react";
import { GeofenceTracker } from "./GeofenceTracker";

export function AppGallery() {
  // Track which application view state context is currently open
  const [activeAppId, setActiveAppId] = useState<string | null>(null);

  const modulesList = [
    {
      id: "vendor_registry",
      title: "Manage Vendor Registry",
      metric: "3,159",
      label: "Registered",
      icon: Store,
    },
    {
      id: "revenue_collectors",
      title: "Manage Revenue Collectors",
      metric: "81",
      label: "Active Field Agents",
      icon: UserCheck, // Mounts the custom interactive Geofence Map
    },
    {
      id: "user_management",
      title: "Manage Admin Users",
      metric: "14",
      label: "System Admins",
      icon: Users,
    },
    {
      id: "device_management",
      title: "Manage Handheld Devices",
      metric: "96",
      label: "Terminals Bound",
      icon: Smartphone,
    },
    {
      id: "database_sync",
      title: "Database Sync Hub",
      metric: "99.8%",
      label: "Core Cloud Uptime",
      icon: RefreshCw,
    },
    {
      id: "ifmis_sync",
      title: "Sync to IFMIS",
      metric: "Direct",
      label: "Treasury Ledger Link",
      icon: Network,
    },
    {
      id: "audit_trail",
      title: "System Audit Trail",
      metric: "24.8K",
      label: "Events Logged",
      icon: History,
    },
  ];

  // Lookup info for the currently selected active app context view
  const currentApp = modulesList.find((mod) => mod.id === activeAppId);

  return (
    <div className="space-y-4 w-full antialiased text-slate-800">
      
      {/* BRAND CONTROL HEADER */}
      <div className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
        <div className="flex items-center space-x-2.5">
          {activeAppId ? (
            // BACK INTERACTION STATE BUTTON
            <button 
              onClick={() => setActiveAppId(null)}
              className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition-colors flex items-center justify-center cursor-pointer group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            </button>
          ) : (
            <div className="p-2 bg-blue-50 text-[#5684ff] rounded-xl border border-blue-100">
              <Settings className="h-4 w-4" />
            </div>
          )}
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              {activeAppId ? currentApp?.title : "System Command Gallery"}
            </h3>
            <p className="text-[11px] text-slate-400">
              {activeAppId ? `Active Workspace Node Workspace Environment` : "Direct workspace shortcuts and active diagnostic node metrics."}
            </p>
          </div>
        </div>
      </div>

      {/* DYNAMIC VIEW ROUTING HOUSING LAYER */}
      {activeAppId ? (
        <div className="animate-in fade-in duration-200 object-contain w-full">
          {activeAppId === "revenue_collectors" ? (
            /* MOUNTS THE REVENUE TRACKER HIGH DEFINITION MAP CONTAINER */
            <GeofenceTracker />
          ) : (
            /* SECURE GENERAL MODULE GATEWAY TEMPLATE HOUSING */
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-4 shadow-xs min-h-[400px] flex flex-col items-center justify-center">
              <div className="p-4 bg-blue-50 text-[#5684ff] rounded-full border border-blue-100/60 w-max mx-auto">
                {currentApp && React.createElement(currentApp.icon, { className: "h-8 w-8 stroke-[1.8]" })}
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">{currentApp?.title} Portal</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Connecting to live environment database pipelines for secure asset cluster verification management logs.
                </p>
              </div>
              <div className="inline-flex items-center space-x-3 bg-slate-50 border border-slate-150 px-4 py-2 rounded-xl text-xs font-mono text-slate-500">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5684ff]" />
                </span>
                <span>Active Nodes: {currentApp?.metric} {currentApp?.label}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* MAIN GALLERY DASHBOARD LAYER */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-150">
          {modulesList.map((mod) => {
            const IconComponent = mod.icon;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveAppId(mod.id)}
                className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between text-left transition-all duration-150 hover:border-[#5684ff]/60 hover:shadow-sm group cursor-pointer relative overflow-hidden focus:outline-none"
              >
                <div className="flex items-center space-x-3.5 z-10">
                  {/* Monochromatic Blue Icon Housing */}
                  <div className="p-2.5 rounded-xl border bg-blue-50/60 text-[#5684ff] border-blue-100/70 shrink-0 transition-transform duration-200 group-hover:scale-105">
                    <IconComponent className="h-4 w-4 stroke-[2.5]" />
                  </div>
                  
                  {/* Information Cluster */}
                  <div className="space-y-0.5">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-slate-900 transition-colors">
                      {mod.title}
                    </h4>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-sm font-black tracking-tight leading-none text-slate-900">
                        {mod.metric}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {mod.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Accent Navigation Interactive Chevron */}
                <div className="p-1 text-slate-300 group-hover:text-[#5684ff] bg-slate-50 group-hover:bg-blue-50 border border-transparent group-hover:border-blue-100/60 rounded-lg transition-all z-10">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>

                {/* Background decorative watermark */}
                <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-[0.01] group-hover:opacity-[0.03] text-[#5684ff] pointer-events-none transition-opacity">
                  <IconComponent className="w-16 h-16" />
                </div>
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
}