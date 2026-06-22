// @/components/GeofenceTracker.tsx
"use client";

import dynamic from "next/dynamic";

// Next.js will completely bypass compiling the internal map engine 
// on the server, saving it strictly for client browser execution.
export const GeofenceTracker = dynamic(
  () => import("./GeofenceMapInner"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[550px] bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center text-xs font-black text-slate-400 uppercase tracking-widest gap-2">
        <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
        Initializing GO-Revenue GIS Matrix...
      </div>
    )
  }
);