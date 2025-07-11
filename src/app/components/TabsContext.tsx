"use client";

import { createContext, useContext, useState } from "react";

type TabsContextType = {
  activeSection: string;
  setActiveSection: (section: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export function TabsProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState("apply");

  return (
    <TabsContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </TabsContext.Provider>
  );
}

export function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabs must be used within a TabsProvider");
  }
  return context;
}
