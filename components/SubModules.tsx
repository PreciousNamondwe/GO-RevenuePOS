"use client";

import React from "react";
// 1. Ensure ShieldCheck is correctly imported here
import { UserCheck, Store, ShieldCheck, Ticket } from "lucide-react";
import { MarketDecisionMatrix } from "./MarketDecisionMatrix";
import { MarketCollectionsLog } from "./MarketCollectionsLog";
import { AppGallery } from "./AppGalley";
import { GeofenceTracker } from "./GeofenceTracker";

export function SubModules({ activeTab }: { activeTab: string }) {
  if (activeTab === "Decision Matrix") {
    return (
      <div>
        <MarketDecisionMatrix/>
      </div>
    );
  }

  if (activeTab === "Settings") {
    return (
      <div>
        <AppGallery/>
      </div>
    );
  }

  if (activeTab === "Collections") {
    return (
      <div>
        <MarketCollectionsLog/>
      </div>
    );
  }

  return (
    <div>
      <GeofenceTracker/>
    </div>
  );
}