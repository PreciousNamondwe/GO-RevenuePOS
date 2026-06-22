"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, Users, Store, Banknote, ShieldAlert,
  Search, MoreHorizontal, Mail, Bell, ChevronDown, LogOut,
  ChevronLeft, ChevronRight, Menu, X, Layers, Settings,
} from "lucide-react";
import { OverviewTab } from "./OverviewTab";
import { SubModules } from "./SubModules";

export function DashboardFrame() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Controls dynamic mobile profile drawer view overrides
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState({
    fullName: "Loading Profiles...",
    role: "System Operator",
  });

  useEffect(() => {
    async function fetchActiveUserContext() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from("users")
            .select("full_name, role")
            .eq("email", session.user.email)
            .maybeSingle();

          if (profile) {
            setCurrentUser({
              fullName: profile.full_name,
              role: profile.role.replace("_", " "),
            });
          } else {
            setCurrentUser({
              fullName: session.user.email?.split("@")[0] || "Active Admin",
              role: "Administrator",
            });
          }
        }
      } catch (err) {
        console.error("Context synchronization error:", err);
      }
    }
    fetchActiveUserContext();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "Decision Matrix", icon: Layers },
    { name: "Collections", icon: Banknote },
    { name: "Zone Tracking", icon: ShieldAlert },
    { name: "Settings", icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return <OverviewTab />;
      default:
        return <SubModules activeTab={activeTab} />;
    }
  };

  return (
    <div className="h-screen w-screen bg-[#f4f7fc] flex flex-col md:flex-row overflow-hidden font-sans antialiased text-slate-800">
      
      {/* 1. DESKTOP ONLY: SLATE-GRAY SIDEBAR PANEL */}
      <aside 
        className={`hidden md:flex bg-[#1e293b] text-slate-300 flex-col justify-between p-4 shrink-0 h-full relative transition-all duration-300 border-r border-slate-700/40 ${
          isMinimized ? "w-[80px]" : "w-[280px]"
        }`}
      >
        <button 
          onClick={() => setIsMinimized(!isMinimized)}
          className="absolute -right-3 top-7 bg-[#5684ff] hover:bg-[#4673ec] text-white p-1 rounded-full shadow-md border border-slate-800 z-50 transition-colors"
        >
          {isMinimized ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>

        <div>
          <div className={`mb-10 pt-4 flex items-center ${isMinimized ? "justify-center" : "px-3"}`}>
            <img src="/gov_arm.png" alt="Gov Logo" className="h-9 w-auto object-contain shrink-0" />
            {!isMinimized && (
              <div className="ml-3 overflow-hidden whitespace-nowrap transition-all duration-200">
                <div className="text-[10px] text-[#5684ff] font-bold tracking-widest uppercase mt-0.5">Go Revenue Core</div>
              </div>
            )}
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  title={isMinimized ? item.name : undefined}
                  className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isMinimized ? "justify-center p-3" : "px-4 py-3 space-x-3.5"
                  } ${isActive ? "bg-[#5684ff] text-white shadow-[0_4px_20px_rgba(86,132,255,0.35)]" : "hover:bg-white/5 hover:text-white"}`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  {!isMinimized && <span className="truncate">{item.name}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        <button onClick={handleLogout} className={`w-full bg-[#5684ff] hover:bg-[#4673ec] text-white flex items-center justify-center py-3 rounded-xl text-xs font-bold tracking-wider transition-colors shadow-lg mt-auto ${isMinimized ? "px-0" : "space-x-2"}`}>
          <LogOut className="h-4 w-4 shrink-0" />
          {!isMinimized && <span className="uppercase truncate">Logout</span>}
        </button>
      </aside>

      {/* PRIMARY WORKSPACE MAIN TRACK WRAPPER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* RESPONSIVE TOP HEADER BAR */}
        <header className="bg-[#5684ff] h-16 md:h-20 px-4 md:px-8 flex items-center justify-between shadow-md select-none shrink-0 transition-colors">
          
          {/* Mobile Identity Viewport Row */}
          <div className="flex items-center md:hidden space-x-2">
            <img src="/gov_arm.png" alt="Gov Logo" className="h-7 w-auto object-contain" />
            <span className="text-white font-black text-sm tracking-wider">GO-Revenue</span>
          </div>

          {/* Desktop Search Component */}
          <div className="relative hidden md:block w-80">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-white/70" />
            </span>
            <input 
              type="text" 
              placeholder="Search records, vendors or devices..." 
              className="w-full bg-white/10 border border-white/20 text-white placeholder-white/60 text-xs rounded-full pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
            />
          </div>

          {/* Identity Navigation Controls */}
          <div className="flex items-center space-x-3 md:space-x-6">
            <div className="hidden sm:flex items-center space-x-3 text-white/80">
              <MoreHorizontal className="h-4 w-4 cursor-pointer hover:text-white" />
              <Mail className="h-4 w-4 cursor-pointer hover:text-white" />
              <Bell className="h-4 w-4 cursor-pointer hover:text-white" />
            </div>
            <div className="hidden sm:block h-5 w-[1px] bg-white/20" />
            
           {/* User Profile Hook */}
          <div 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center space-x-2 md:space-x-3 cursor-pointer group"
          >
            {/* FIXED LAYOUT CONTAINER: Changed hidden xs:block to standard sm:block */}
            <div className="text-right hidden sm:block max-w-[140px]">
              <span className="block text-white text-xs font-black uppercase tracking-wide group-hover:text-white/90 truncate">
                {currentUser.fullName}
              </span>
              <span className="block text-[9px] text-white/70 font-bold uppercase tracking-wider mt-0.5">
                {currentUser.role}
              </span>
            </div>
            
            {/* FIXED LAYOUT ICON: Changed hidden xs:block to standard sm:block */}
            <ChevronDown className="h-3 w-3 text-white/80 hidden sm:block shrink-0" />
            
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-slate-300 border border-white/40 overflow-hidden shadow-inner shrink-0">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
          </div>
        </header>

        {/* SCROLLABLE MAIN TAB CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 scroll-smooth">
          <div className="max-w-[1600px] mx-auto w-full">
            {renderTabContent()}
          </div>
        </main>

        {/* 2. MOBILE ONLY: STICKY NATIVE BOTTOM NAVIGATION BAR */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1e293b] border-t border-slate-700/60 h-16 flex items-center justify-around px-2 pb-safe z-40 shadow-[0_-4px_16px_rgba(0,0,0,0.15)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
                  isActive ? "text-[#5684ff]" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : "stroke-[2]"}`} />
                <span className="text-[9px] font-bold tracking-tight mt-1 max-w-[64px] truncate">
                  {item.name === "Revenue Collectors" ? "Agents" : item.name === "Device Security" ? "Security" : item.name}
                </span>
              </button>
            );
          })}
        </nav>

        {/* MOBILE DRAWER OVERLAY (Triggers on Avatar tap to handle explicit profile logouts easily) */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 md:hidden flex justify-end animate-fade-in">
            <div className="w-64 bg-[#1e293b] h-full p-6 flex flex-col justify-between shadow-2xl border-l border-slate-700/40 text-slate-300">
              <div>
                <div className="flex justify-between items-center mb-6 border-b border-slate-700/50 pb-4">
                  <span className="font-bold text-white text-xs uppercase tracking-wider">Account Operations</span>
                  <X className="h-4 w-4 cursor-pointer text-slate-400" onClick={() => setMobileMenuOpen(false)} />
                </div>
                <div className="space-y-1 py-2">
                  <p className="text-white text-sm font-bold tracking-wide truncate">{currentUser.fullName}</p>
                  <p className="text-[10px] text-[#5684ff] font-bold uppercase tracking-widest">{currentUser.role}</p>
                </div>
              </div>
              <button 
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-bold tracking-wider transition-colors shadow-lg"
              >
                <LogOut className="h-4 w-4" />
                <span className="uppercase">Logout Session</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}