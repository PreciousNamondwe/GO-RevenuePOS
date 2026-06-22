"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, Layers, Banknote, ShieldAlert, Settings,
  Search, Mail, Bell, ChevronDown, LogOut, ChevronLeft, ChevronRight,
  Menu, X,
} from "lucide-react";
import { OverviewTab } from "./OverviewTab";
import { SubModules } from "./SubModules";

export function DashboardFrame() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [isMinimized, setIsMinimized] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState({
    fullName: "Loading...",
    role: "System Operator",
    avatar: "",
  });

  useEffect(() => {
    async function fetchActiveUserContext() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from("users")
            .select("full_name, role, avatar_url")
            .eq("email", session.user.email)
            .maybeSingle();

          if (profile) {
            setCurrentUser({
              fullName: profile.full_name || "User",
              role: profile.role?.replace(/_/g, " ") || "Field Agent",
              avatar: profile.avatar_url || "",
            });
          } else {
            setCurrentUser({
              fullName: session.user.email?.split("@")[0] || "Agent",
              role: "Field Agent",
              avatar: "",
            });
          }
        }
      } catch (err) {
        console.error("Context sync error:", err);
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

  const avatarSrc = currentUser.avatar 
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.fullName)}&background=5684ff&color=fff&size=100&bold=true`;

  return (
    <div className="h-screen w-screen bg-[#f4f7fc] flex flex-col md:flex-row overflow-hidden font-sans antialiased text-slate-800">
      
      {/* DESKTOP SIDEBAR */}
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

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* TOP HEADER - PROFILE TOP RIGHT */}
        <header className="bg-[#5684ff] h-16 md:h-20 px-4 md:px-8 flex items-center justify-between shadow-md select-none shrink-0">
          
          {/* Left: Logo / Title */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="md:hidden flex items-center gap-2">
              <img src="/gov_arm.png" alt="Gov Logo" className="h-7 w-auto object-contain" />
              <span className="text-white font-black text-sm tracking-wider">GO-Revenue</span>
            </div>
            
            {/* Desktop Search */}
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
          </div>

          {/* Right: Icons + Profile */}
          <div className="flex items-center gap-3 md:gap-5">
            
            {/* Notification Icons */}
            <div className="hidden sm:flex items-center gap-3 text-white/70">
              <button className="relative hover:text-white transition-colors">
                <Mail className="h-4 w-4" />
              </button>
              <button className="relative hover:text-white transition-colors">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-[#5684ff]"></span>
              </button>
            </div>

            {/* Divider */}
            <div className="hidden sm:block h-6 w-px bg-white/20"></div>

            {/* USER PROFILE - TOP RIGHT CORNER */}
            <div 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-2.5 md:gap-3 cursor-pointer group"
            >
              {/* Name & Role - Right of Avatar, Right Aligned */}
              <div className="text-right hidden sm:block leading-tight">
                <p className="text-white text-xs font-black uppercase tracking-wide group-hover:text-white/90 transition-colors truncate max-w-[140px]">
                  {currentUser.fullName}
                </p>
                <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wider mt-0.5">
                  {currentUser.role}
                </p>
              </div>

              {/* Avatar with Online Status */}
              <div className="relative shrink-0">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-300 to-blue-600 border-2 border-white/40 overflow-hidden shadow-md">
                  <img 
                    src={avatarSrc}
                    alt={currentUser.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-[#5684ff] rounded-full"></div>
              </div>

              {/* Dropdown Chevron */}
              <ChevronDown className="h-3.5 w-3.5 text-white/50 hidden sm:block group-hover:text-white/80 transition-colors shrink-0" />
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white p-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 scroll-smooth">
          <div className="max-w-[1600px] mx-auto w-full">
            {renderTabContent()}
          </div>
        </main>

        {/* MOBILE BOTTOM NAV */}
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
                  {item.name}
                </span>
              </button>
            );
          })}
        </nav>

        {/* MOBILE PROFILE DRAWER */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 md:hidden flex justify-end animate-fade-in">
            <div className="w-64 bg-[#1e293b] h-full p-6 flex flex-col justify-between shadow-2xl border-l border-slate-700/40 text-slate-300">
              <div>
                <div className="flex justify-between items-center mb-6 border-b border-slate-700/50 pb-4">
                  <span className="font-bold text-white text-xs uppercase tracking-wider">Account</span>
                  <X className="h-4 w-4 cursor-pointer text-slate-400 hover:text-white" onClick={() => setMobileMenuOpen(false)} />
                </div>
                
                {/* Drawer Profile Info */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-300 to-blue-600 border-2 border-white/30 overflow-hidden">
                    <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-bold truncate">{currentUser.fullName}</p>
                    <p className="text-[10px] text-[#5684ff] font-semibold uppercase tracking-wider">{currentUser.role}</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold tracking-wider transition-colors shadow-lg"
              >
                <LogOut className="h-4 w-4" />
                <span className="uppercase">Logout</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}