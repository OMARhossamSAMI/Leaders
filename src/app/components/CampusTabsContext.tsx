"use client";

import { createContext, useContext, useState } from "react";

type CampusTabsContextType = {
  campusTab: string;
  setCampusTab: (tab: string) => void;
};

const CampusTabsContext = createContext<CampusTabsContextType | undefined>(
  undefined
);

export function CampusTabsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [campusTab, setCampusTab] = useState("academic");
  return (
    <CampusTabsContext.Provider value={{ campusTab, setCampusTab }}>
      {children}
    </CampusTabsContext.Provider>
  );
}

export function useCampusTabs() {
  const context = useContext(CampusTabsContext);
  if (!context) {
    throw new Error("useCampusTabs must be used within a CampusTabsProvider");
  }
  return context;
}
