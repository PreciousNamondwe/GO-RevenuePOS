"use client";

import React, { useState } from "react";
import { Ticket, DollarSign, Layers, Calendar, ChevronDown, SlidersHorizontal, Search, ChevronLeft, ChevronRight } from "lucide-react";

export function MarketCollectionsLog() {
  const marketOptions = [
    "All Markets",
    "Limbe Market",
    "Lunzu Market",
    "Ndirande Market",
    "Mpemba Market",
    "Muzuzu Market",
    "Chilobwe Market",
    "Chadzunda Market",
    "Ntonda Market"
  ];

  const coreTransactions = [
    { receipt: "REC-2026-0091", vendor: "John Banda", collector: "Agent 001", market: "Mpemba Market", amount: 300, date: "20 June 2026" },
    { receipt: "REC-2026-0092", vendor: "Mary Phiri", collector: "Agent 012", market: "Limbe Market", amount: 2000, date: "20 June 2026" },
    { receipt: "REC-2026-0093", vendor: "Chikondi Alide", collector: "Agent 005", market: "Ndirande Market", amount: 500, date: "20 June 2026" },
    { receipt: "REC-2026-0094", vendor: "Isaac Kachale", collector: "Agent 001", market: "Mpemba Market", amount: 300, date: "19 June 2026" },
    { receipt: "REC-2026-0095", vendor: "Grace Chimwaza", collector: "Agent 018", market: "Muzuzu Market", amount: 2000, date: "19 June 2026" },
    { receipt: "REC-2026-0096", vendor: "Patrick Mussa", collector: "Agent 024", market: "Ndirande Market", amount: 2000, date: "19 June 2026" },
    { receipt: "REC-2026-0097", vendor: "Elena Dzimbiri", collector: "Agent 009", market: "Lunzu Market", amount: 300, date: "18 June 2026" },
    { receipt: "REC-2026-0098", vendor: "Henry Banda", collector: "Agent 004", market: "Chilobwe Market", amount: 500, date: "18 June 2026" },
    { receipt: "REC-2026-0099", vendor: "Zione Chancy", collector: "Agent 006", market: "Chadzunda Market", amount: 300, date: "18 June 2026" },
    { receipt: "REC-2026-0100", vendor: "Thomson Kanda", collector: "Agent 003", market: "Ntonda Market", amount: 500, date: "17 June 2026" },
  ];

  const [activeMarket, setActiveMarket] = useState("All Markets");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 5;

  const filteredTransactions = coreTransactions.filter((tx) => {
    const matchesMarket = activeMarket === "All Markets" || tx.market === activeMarket;
    const matchesSearch = 
      tx.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.receipt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.collector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.market.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesMarket && matchesSearch;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === "amount") {
      return b.amount - a.amount;
    }
    return b.receipt.localeCompare(a.receipt);
  });

  const totalItems = sortedTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const validatedPage = currentPage > totalPages ? totalPages : currentPage;
  
  const startIndex = (validatedPage - 1) * itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, startIndex + itemsPerPage);
  const marketTotalYield = filteredTransactions.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm space-y-5 w-full font-sans antialiased">
      
      {/* HEADER BLOCK */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#eef4ff] text-[#1e4e8c] rounded-xl shrink-0">
            <Ticket className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Secure Data Structure Scroll Layer Grid Table</h3>
            <p className="text-xs text-slate-400 mt-0.5">Real-time municipal market reporting log matrix infrastructure.</p>
          </div>
        </div>

        {/* METRIC YIELD PILL */}
        <div className="bg-[#5684ff] rounded-xl p-3 flex items-center space-x-4 w-full md:w-auto shadow-sm shrink-0 text-white">
          <div className="p-2 bg-white/10 rounded-lg">
            <DollarSign className="h-4 w-4 text-[#eef4ff]" />
          </div>
          <div>
            <span className="block text-[9px] font-bold text-slate-200 uppercase tracking-wider">
              {activeMarket === "All Markets" ? "Aggregate Total Yield" : `${activeMarket} Run`}
            </span>
            <span className="text-base font-black tracking-tight leading-tight block mt-0.5">
              MWK {marketTotalYield.toLocaleString()}.00
            </span>
          </div>
        </div>
      </div>

      {/* SEARCH, FILTERS & CONTROLS TOOLBAR */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-3 bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-xs">
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 flex-1">
          
          {/* MARKET FILTER */}
          <div className="relative min-w-[220px]">
            <select
              value={activeMarket}
              onChange={(e) => { setActiveMarket(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-lg pl-3 pr-9 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-[#1e4e8c] cursor-pointer transition-all shadow-xs"
            >
              {marketOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "All Markets" ? "All Municipal Markets Scope" : option}
                </option>
              ))}
            </select>
            <ChevronDown className="h-4 w-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* DYNAMIC SEARCH INPUT */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input 
              type="text"
              placeholder="receipt, vendor or log collector identity..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white border border-slate-200 text-slate-700 placeholder-slate-400 font-semibold text-xs rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e4e8c] transition-all shadow-xs"
            />
          </div>

          <div className="flex items-center space-x-1.5 font-bold text-slate-400 tracking-tight pl-1 whitespace-nowrap">
            <Layers className="h-3.5 w-3.5" />
            <span>Found {totalItems} items</span>
          </div>
        </div>

        {/* SORT TOGGLE */}
        <button 
          onClick={() => setSortBy(sortBy === "date" ? "amount" : "date")}
          className="flex items-center space-x-1.5 text-slate-600 font-bold hover:bg-slate-100 bg-white border border-slate-200 shadow-xs px-3 py-2 rounded-lg transition-colors justify-center whitespace-nowrap"
        >
          <SlidersHorizontal className="h-3 w-3 text-slate-400" />
          <span>Sort: {sortBy === "date" ? "Chronological" : "Value Metric"}</span>
        </button>
      </div>

      {/* MAIN DATA STRUCTURE TABLE */}
      <div className="border border-slate-200/80 rounded-xl overflow-hidden shadow-xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#5684ff] text-white font-bold uppercase tracking-wider text-[11px] border-b border-slate-300">
                <th className="p-3.5 font-semibold">Receipt No</th>
                <th className="p-3.5 font-semibold">Market Hub</th>
                <th className="p-3.5 font-semibold">Registered Vendor</th>
                <th className="p-3.5 font-semibold">Field Collector</th>
                <th className="p-3.5 font-semibold">Settlement Amount</th>
                <th className="p-3.5 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors odd:bg-white even:bg-slate-50/30">
                    {/* Receipt Identification String */}
                    <td className="p-3.5">
                      <span className="font-mono text-[10px] text-slate-600 font-bold bg-slate-100 border border-slate-200 rounded px-2 py-0.5">
                        {tx.receipt}
                      </span>
                    </td>
                    
                    {/* Market Center Area */}
                    <td className="p-3.5 font-bold text-slate-800 text-[11px]">{tx.market}</td>
                    
                    {/* Registered Vendor */}
                    <td className="p-3.5 text-slate-600 font-semibold">{tx.vendor}</td>
                    
                    {/* Agent Force Collector */}
                    <td className="p-3.5 text-slate-500 font-semibold">{tx.collector}</td>
                    
                    {/* Balance Volume */}
                    <td className="p-3.5 font-extrabold text-[#5684ff] text-sm tracking-tight">
                      <span className="text-[10px] text-slate-400 font-bold mr-1">MWK</span>
                      {tx.amount.toLocaleString()}
                    </td>
                    
                    {/* Timeline Data */}
                    <td className="p-3.5 text-right text-slate-400 font-semibold text-[11px]">
                      <div className="inline-flex items-center space-x-1.5">
                        <Calendar className="h-3 w-3 text-slate-300" />
                        <span>{tx.date}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400 font-semibold bg-slate-50/30">
                    No indexed server-side transactions cache matches this specific territory selection criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* NAVIGATION PREVIOUS / NEXT ENGINE PANELS */}
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 pt-4 gap-3 text-xs font-bold text-slate-500">
          <div>
            <span className="text-slate-400 font-semibold">Showing </span>
            <span>{startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)}</span>
            <span className="text-slate-400 font-semibold"> of </span>
            <span>{totalItems} entries</span>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Previous Button control layout wrapper */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={validatedPage === 1}
              className="flex items-center space-x-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-xs hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-3.5 w-3.5 text-[#5684ff]" />
              <span>Previous Collection</span>
            </button>

            {/* Step Identity Block */}
            <div className="px-3 py-1.5 bg-[#5684ff] text-white font-extrabold rounded-lg min-w-[40px] text-center shadow-xs">
              {validatedPage}
            </div>

            {/* Next button control layout wrapper */}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={validatedPage === totalPages}
              className="flex items-center space-x-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-xs hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <span>Next Collection</span>
              <ChevronRight className="h-3.5 w-3.5 text-[#5684ff]" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}