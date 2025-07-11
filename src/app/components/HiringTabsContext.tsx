"use client";

import { createContext, useContext, useState } from "react";

type HiringTabsContextType = {
  hiringSection: string;
  setHiringSection: (section: string) => void;
};

const HiringTabsContext = createContext<HiringTabsContextType | undefined>(
  undefined
);

export function HiringTabsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hiringSection, setHiringSection] = useState("opening");

  return (
    <HiringTabsContext.Provider value={{ hiringSection, setHiringSection }}>
      {children}
    </HiringTabsContext.Provider>
  );
}

export function useHiringTabs() {
  const context = useContext(HiringTabsContext);
  if (!context) {
    throw new Error("useHiringTabs must be used within a HiringTabsProvider");
  }
  return context;
}
