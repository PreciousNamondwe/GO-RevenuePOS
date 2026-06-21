"use client";

import React, { useState, useEffect } from "react";
import { 
  Building2, ChevronDown, Wallet, Users, Milestone, Activity 
} from "lucide-react";

function MatrixNumberCounter({ targetValue, prefix = "" }: { targetValue: string; prefix?: string }) {
  const numericTarget = parseInt(targetValue.replace(/[^0-9]/g, ""), 10) || 0;
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const duration = 500; 

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuad = (x: number) => 1 - (1 - x) * (1 - x);
      
      setCount(Math.floor(easeOutQuad(progress) * numericTarget));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [numericTarget]);

  return <span>{prefix}{count.toLocaleString()}</span>;
}

export function MarketDecisionMatrix() {
  const [isMounted, setIsMounted] = useState(false);
  
  const marketRegistry = {
    "All Territories": { growth: "9.8%", growthRaw: 9.8, amount: "6,400,000", active: 81, inactive: 15, performance: [35, 55, 45, 75, 50, 85], baseVendor: 3159, secondaryVal: "3,468,960", baseRate: "432" },
    "Limbe Market": { growth: "12.4%", growthRaw: 12.4, amount: "1,450,000", active: 18, inactive: 2, performance: [40, 65, 55, 85, 60, 92], baseVendor: 840, secondaryVal: "1,450,000", baseRate: "432" },
    "Lunzu Market": { growth: "8.1%", growthRaw: 8.1, amount: "890,000", active: 9, inactive: 1, performance: [30, 45, 40, 60, 50, 74], baseVendor: 410, secondaryVal: "890,000", baseRate: "432" },
    "Ndirande Market": { growth: "15.8%", growthRaw: 15.8, amount: "2,100,000", active: 24, inactive: 4, performance: [50, 75, 65, 95, 70, 98], baseVendor: 1120, secondaryVal: "2,100,000", baseRate: "432" },
    "Mpemba Market": { growth: "3.2%", growthRaw: 3.2, amount: "420,000", active: 5, inactive: 0, performance: [20, 35, 25, 45, 30, 42], baseVendor: 210, secondaryVal: "420,000", baseRate: "432" },
    "Muzuzu Market": { growth: "9.5%", growthRaw: 9.5, amount: "1,150,000", active: 12, inactive: 3, performance: [35, 50, 45, 70, 55, 85], baseVendor: 390, secondaryVal: "1,150,000", baseRate: "432" },
    "Chilobwe Market": { growth: "2.1%", growthRaw: 2.1, amount: "310,000", active: 4, inactive: 2, performance: [15, 25, 20, 35, 25, 31], baseVendor: 94, secondaryVal: "310,000", baseRate: "432" },
    "Chadzunda Market": { growth: "4.7%", growthRaw: 4.7, amount: "560,000", active: 6, inactive: 1, performance: [25, 40, 35, 50, 40, 58], baseVendor: 145, secondaryVal: "560,000", baseRate: "432" },
    "Ntonda Sub Office": { growth: "-1.5%", growthRaw: -1.5, amount: "280,000", active: 3, inactive: 2, performance: [20, 30, 22, 28, 15, 10], baseVendor: 65, secondaryVal: "280,000", baseRate: "432" }
  };

  const [selectedMarket, setSelectedMarket] = useState<keyof typeof marketRegistry>("All Territories");
  const [activeTab, setActiveTab] = useState<"DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY">("MONTHLY");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentData = marketRegistry[selectedMarket];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const points = currentData.performance.map((val, i) => ({
    x: 35 + (i * 93), 
    y: 110 - (val * 0.9)
  }));
  
  let pathD = `M 35,${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const cpX1 = points[i].x + 46;
    const cpY1 = points[i].y;
    const cpX2 = points[i + 1].x - 46;
    const cpY2 = points[i + 1].y;
    pathD += ` C ${cpX1},${cpY1} ${cpX2},${cpY2} ${points[i+1].x},${points[i+1].y}`;
  }
  const areaD = `${pathD} L ${points[points.length - 1].x},110 L 35,110 Z`;

  const growthValue = currentData.growthRaw;
  const growthPercentageCap = Math.max(0, Math.min(100, Math.round((growthValue / 20) * 100)));

  return (
    <div className="w-full h-screen max-h-screen overflow-hidden flex flex-col p-4 bg-[#f8fafc]/40 text-slate-900 font-sans select-none box-border">
      
      {/* 1. STATE CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0 mb-3">
        {/* Card 1 */}
        <div className="bg-gradient-to-br from-[#5684ff] to-[#4373f0] rounded-xl p-4 text-white flex justify-between items-center shadow-sm">
          <div className="flex flex-col justify-between h-full min-h-[65px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">Total Devices</span>
            <div>
              <span className="text-xl font-bold tracking-tight block">
                <MatrixNumberCounter targetValue={String(currentData.baseVendor)} />
              </span>
              <span className="text-[8px] text-white/70 uppercase tracking-widest mt-0.5 block">Growth Pool: {currentData.growth}</span>
            </div>
          </div>
          <div className="flex items-end space-x-1 h-8 opacity-80">
            {[40, 70, 30, 90, 50, 85].map((h, idx) => (
              <div key={idx} className="w-[2.5px] bg-white rounded-t-sm" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 text-white flex flex-col justify-between min-h-[100px] relative overflow-hidden shadow-sm">
          <div className="z-10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Collectors</span>
            <span className="text-xl font-bold tracking-tight block mt-1.5">
              <MatrixNumberCounter targetValue={String(currentData.active)} />
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-10 pointer-events-none opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
              <path d="M0,40 Q25,10 50,30 T100,20 L100,40 Z" fill="white" />
            </svg>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-gradient-to-br from-[#5684ff]/90 to-[#5684ff] rounded-xl p-4 text-white flex flex-col justify-between min-h-[100px] relative overflow-hidden shadow-sm">
          <div className="flex justify-between items-start z-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">Offline Devices</span>
              <span className="text-xl font-bold tracking-tight block mt-1">
                <MatrixNumberCounter targetValue={String(currentData.inactive)} />
              </span>
            </div>
            <div className="relative">
              <span className="bg-white/10 border border-white/20 text-white font-bold text-[8px] rounded px-1.5 py-0.5 block">
                {currentData.inactive > 0 ? "Alert Cycle" : "Clear"}
              </span>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-2 px-4 opacity-90">
            <svg className="w-full h-5 overflow-visible" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0,10 Q20,2 40,15 T80,5 T100,12" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-4 text-white flex justify-between items-center shadow-sm">
          <div className="flex flex-col justify-between h-full min-h-[65px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Suspended Terminals</span>
            <div>
              <span className="text-xl font-bold tracking-tight block">
                <MatrixNumberCounter targetValue={currentData.amount} prefix="MWK " />
              </span>
              <span className="text-[8px] text-slate-400 uppercase tracking-widest mt-0.5 block">Dynamic Yield Ledger</span>
            </div>
          </div>
          <div className="flex items-end space-x-1 h-8 opacity-40">
            {[30, 50, 80, 40, 90, 60].map((h, idx) => (
              <div key={idx} className="w-[2.5px] bg-white rounded-t-sm" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>

      {/* 2. CORE PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 shrink-0">
        
        {/* GRAPH PANEL WITH ULTRA COLORFUL MULTI-STOP GRADIENT */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 flex flex-col justify-between lg:col-span-2 shadow-sm overflow-hidden h-[340px]">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-2.5 gap-2 shrink-0">
            <div>
              <p className="text-[10px] text-slate-400">Overview</p>
            </div>
            
            {/* UNIFIED CONTROL SYSTEM */}
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/60 rounded-lg p-1.5 px-2">
              <div className="flex items-center space-x-1.5 border-r border-slate-200 pr-3">
                <div className="relative">
                  <select 
                    value={selectedMarket}
                    onChange={(e) => setSelectedMarket(e.target.value as keyof typeof marketRegistry)}
                    className="bg-transparent text-slate-900 font-bold text-[10px] pr-5 appearance-none focus:outline-none cursor-pointer hover:text-[#5684ff] transition-colors"
                  >
                    {Object.keys(marketRegistry).map((name) => (
                      <option className="text-slate-900" key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  <ChevronDown className="h-3 w-3 text-slate-500 absolute right-0 top-0.5 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center space-x-3 text-[9px] font-bold tracking-wider text-slate-400">
                {(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`transition-colors ${activeTab === tab ? "text-[#5684ff]" : "hover:text-slate-600"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-end relative pb-1 flex-1 min-h-0 pt-4 pl-1">
            <svg className="w-full h-full max-h-[165px] overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
              <defs>
                {/* Colorful Multi-stop Shader: Blue transitions into rich violet before transparency */}
                <linearGradient id="matrixGradPrimaryShaded" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5684ff" stopOpacity="0.45" />
                  <stop offset="45%" stopColor="#7c3aed" stopOpacity="0.25" />
                  <stop offset="80%" stopColor="#8b5cf6" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Vertical Scale numbers */}
              <text x="5" y="24" fill="#94a3b8" className="text-[9px] font-bold font-sans">100</text>
              <text x="5" y="54" fill="#94a3b8" className="text-[9px] font-bold font-sans">75</text>
              <text x="5" y="84" fill="#94a3b8" className="text-[9px] font-bold font-sans">50</text>
              <text x="5" y="113" fill="#94a3b8" className="text-[9px] font-bold font-sans">25</text>

              {/* Grid Lines */}
              <line x1="32" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="32" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="32" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="32" y1="110" x2="500" y2="110" stroke="#e2e8f0" strokeWidth="1.2" />

              {/* Shaded Area Geometry with colorful gradient reference */}
              <path d={areaD} fill="url(#matrixGradPrimaryShaded)" />
              <path d={pathD} fill="none" stroke="#5684ff" strokeWidth="2.5" strokeLinecap="round" />
              
              <circle cx={points[5].x} cy={points[5].y} r="3.5" fill="#5684ff" stroke="white" strokeWidth="1.5" />
            </svg>
            
            <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider pl-9 pr-1 mt-2 shrink-0">
              {months.map((m, i) => <span key={i}>{m}</span>)}
            </div>
          </div>

        </div>

        {/* DONUT CARD */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 flex flex-col justify-between shadow-sm overflow-hidden h-[340px]">
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Growth of Markets</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Dynamic Territory Indexing</p>
          </div>

          <div className="flex items-center justify-center py-1 flex-1 min-h-0">
            <div className="w-24 h-24 relative max-h-[100px]">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#5684ff" strokeWidth="3" strokeDasharray={`${growthPercentageCap * 0.85} 100`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Growth</span>
                <span className="text-base font-black text-[#5684ff] tracking-tight">{currentData.growth}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-2.5 text-center shrink-0">
            <span className="text-[9px] font-bold text-slate-700 uppercase tracking-wider block">Target Development Vector</span>
            <p className="text-[8px] text-slate-400 mt-0.5 leading-relaxed">Evaluated relative to regional operational benchmarks.</p>
          </div>
        </div>

      </div>

    </div>
  );
}