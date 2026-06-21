"use client";

import React, { useState, useEffect } from "react";
import { Users, Store, Banknote, ChevronLeft, ChevronRight, Activity } from "lucide-react";

// Self-contained counter sub-component to animate numeric string values upward
function AnimatedCounter({ targetValue, prefix = "" }: { targetValue: string; prefix?: string }) {
  const numericTarget = parseInt(targetValue.replace(/[^0-9]/g, ""), 10) || 0;
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const duration = 1200; 

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOutQuad = (x: number) => 1 - (1 - x) * (1 - x);
      const currentCount = Math.floor(easeOutQuad(progress) * numericTarget);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [numericTarget]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
    </span>
  );
}

export function OverviewTab() {
  const [isMounted, setIsMounted] = useState(false);

  // Trigger element drawing calculations on browser mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const analyticsCards = [
    { title: "Active Collectors", value: "36,159", prefix: "", change: "+ 4.31%", detail: "Since Last Month", icon: Users },
    { title: "Registered Vendors", value: "3,159", prefix: "", change: "+ 2.11%", detail: "Since Last Month", icon: Store },
    { title: "Earning (MWK)", value: "6,159,000", prefix: "K", change: "+ 5.72%", detail: "Since Last Month", icon: Banknote, dark: true },
  ];

  const calendarDays = [
    { label: "Mon", num: 15 },
    { label: "Tue", num: 16 },
    { label: "Wed", num: 17 },
    { label: "Thu", num: 18 },
    { label: "Fri", num: 19 },
    { label: "Sat", num: 20, active: true },
    { label: "Sun", num: 21 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* LEFT & CENTER RESPONSIVE GRID BLOCK */}
      <div className="col-span-1 lg:col-span-2 space-y-6">
        
        {/* Statistics Metric Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {analyticsCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div 
                key={i} 
                className={`p-5 rounded-2xl border transition-all duration-300 ${
                  card.dark 
                    ? "bg-[#5684ff] border-[#5684ff] text-white shadow-lg" 
                    : "bg-white border-slate-200 text-slate-800 shadow-sm"
                }`}
              >
                <div className="flex items-center space-x-2 mb-2.5">
                  <div className={`p-1.5 rounded-lg ${card.dark ? "bg-white/20" : "bg-slate-100"}`}>
                    <Icon className={`h-4 w-4 ${card.dark ? "text-white" : "text-[#5684ff]"}`} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${card.dark ? "text-white/80" : "text-slate-400"}`}>
                    {card.title}
                  </span>
                </div>
                <div className="text-xl font-black tracking-tight mb-0.5">
                  <AnimatedCounter targetValue={card.value} prefix={card.prefix} />
                </div>
                <div className="flex items-center space-x-1 text-[10px]">
                  <span className={card.dark ? "text-white font-bold" : "text-emerald-500 font-bold"}>{card.change}</span>
                  <span className={card.dark ? "text-white/60" : "text-slate-400"}>{card.detail}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Real-time Synchronization Analytics Wave Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <div>
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Revenue Stream Timeline</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Real-time sync performance analytics across municipal markets</p>
            </div>
            <span className="bg-blue-50/60 text-[#5684ff] text-[10px] px-2 py-0.5 rounded-md font-bold self-start sm:self-auto flex items-center gap-1">
              <Activity className="h-3 w-3 animate-pulse" /> +48.56% YoY Sync
            </span>
          </div>
          
          <div className="w-full h-44 relative">
            <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5684ff" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#5684ff" stopOpacity="0.00" />
                </linearGradient>
              </defs>
              
              {/* Animated Background Area Under Fill */}
              <path 
                d="M0,150 Q50,140 100,110 T200,120 T300,105 T400,40 T500,75 T600,60 L600,200 L0,200 Z" 
                fill="url(#chartGrad)" 
                className="transition-opacity duration-1000 delay-500"
                style={{ opacity: isMounted ? 1 : 0 }}
              />

              {/* Grid Lines */}
              <line x1="0" y1="50" x2="600" y2="50" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="100" x2="600" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="150" x2="600" y2="150" stroke="#f1f5f9" strokeWidth="1" />

              {/* Animated Stroke Path Line Drawing Effect */}
              <path 
                d="M0,150 Q50,140 100,110 T200,120 T300,105 T400,40 T500,75 T600,60" 
                fill="none" 
                stroke="#5684ff" 
                strokeWidth="3.5" 
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{
                  strokeDasharray: 1000,
                  strokeDashoffset: isMounted ? 0 : 1000
                }}
              />

              {/* Live Tracking Pin Indicator on Peak Point */}
              {isMounted && (
                <g transform="translate(400, 40)" className="animate-bounce">
                  <circle r="6" fill="#5684ff" className="animate-ping opacity-75" />
                  <circle r="4" fill="#1e293b" stroke="#ffffff" strokeWidth="1.5" />
                </g>
              )}
            </svg>
          </div>
          <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 px-1 pt-3 border-t border-slate-50 overflow-x-auto whitespace-nowrap gap-2">
            {["Limbe", "Lunzu", "Ndirande", "Mpemba", "Muzuzu", "Chilobwe", "Chadzunda", "Ntonda"].map((market) => (
              <span key={market}>{market}</span>
            ))}
          </div>
        </div>

        {/* Calendar Box Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-black text-slate-800">June 2026</h4>
            <div className="flex space-x-1.5 text-slate-400">
              <button className="p-1 hover:bg-slate-50 border border-slate-100 rounded-md"><ChevronLeft className="h-3 w-3" /></button>
              <button className="p-1 hover:bg-slate-50 border border-slate-100 rounded-md"><ChevronRight className="h-3 w-3" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 text-center gap-1 overflow-x-auto">
            {calendarDays.map((d, idx) => (
              <div key={idx} className="space-y-1 min-w-[35px]">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-tight">{d.label}</span>
                <button 
                  className={`w-8 h-8 rounded-full text-xs font-bold mx-auto transition-all ${
                    d.active 
                      ? "bg-[#5684ff] text-white shadow-[0_3px_10px_rgba(86,132,255,0.3)]" 
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  {d.num}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT RESPONSIVE SIDEBAR BLOCK */}
      <div className="space-y-6">
        
        {/* Dynamic Tariffs Doughnut Allocation Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-5">Tariff Revenue Share</h4>
          
          <div className="flex flex-col items-center py-2">
            <div className="relative w-32 h-32 mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Background Ring */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4.2" />
                
                {/* 60% Market Vendors (Stroke Circumference total is ~100) */}
                <circle 
                  cx="18" 
                  cy="18" 
                  r="15.915" 
                  fill="none" 
                  stroke="#5684ff" 
                  strokeWidth="4.2" 
                  strokeDasharray="60 100" 
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out origin-center"
                  style={{
                    strokeDashoffset: isMounted ? 0 : 60,
                  }}
                />
                
                {/* 25% Bulk Traders distribution */}
                <circle 
                  cx="18" 
                  cy="18" 
                  r="15.915" 
                  fill="none" 
                  stroke="#0f172a" 
                  strokeWidth="4.2" 
                  strokeDasharray="25 100" 
                  className="transition-all duration-1000 ease-out origin-center"
                  style={{
                    strokeDashoffset: isMounted ? -60 : -35,
                  }}
                />
              </svg>
              
              {/* Inner Label Overlay */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Total Yield</span>
                <span className="text-base font-black text-slate-800 leading-tight">
                  <AnimatedCounter targetValue="95" />K
                </span>
              </div>
            </div>

            <div className="w-full space-y-2 text-[10px] font-bold text-slate-500 px-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2"><div className="w-2.5 h-2.5 rounded bg-[#5684ff] transition-transform duration-500 hover:scale-125" /> <span>Market Vendors (MWK 300)</span></div>
                <span className="text-slate-800">60%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2"><div className="w-2.5 h-2.5 rounded bg-[#0f172a] transition-transform duration-500 hover:scale-125" /> <span>Bulk Traders (MWK 2000)</span></div>
                <span className="text-slate-800">25%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2"><div className="w-2.5 h-2.5 rounded bg-slate-200 transition-transform duration-500 hover:scale-125" /> <span>Restaurants (MWK 500)</span></div>
                <span className="text-slate-800">15%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sync Status Progress Channel Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Sync Status Overview</h4>
          
          {[
            { channel: "Real-time POS Sync", percentage: 85, color: "bg-[#5684ff]" },
            { channel: "Offline Cached Batches", percentage: 12, color: "bg-[#0f172a]" },
            { channel: "Unsynchronized Errors", percentage: 3, color: "bg-rose-500" },
          ].map((source, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-slate-500">{source.channel}</span>
                <span className="text-slate-800">{source.percentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                {/* Smooth metric loading transitions bar */}
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${source.color}`} 
                  style={{ width: isMounted ? `${source.percentage}%` : "0%" }} 
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}