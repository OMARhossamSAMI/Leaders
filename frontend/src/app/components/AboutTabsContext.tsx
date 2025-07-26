// src/app/components/AboutTabsContext.tsx
"use client";

import { createContext, useContext, useState } from "react";

type AboutTabsContextType = {
  aboutTab: string;
  setAboutTab: (tab: string) => void;
};

const AboutTabsContext = createContext<AboutTabsContextType | undefined>(
  undefined
);

export function AboutTabsProvider({ children }: { children: React.ReactNode }) {
  const [aboutTab, setAboutTab] = useState("who"); // default tab

  return (
    <AboutTabsContext.Provider value={{ aboutTab, setAboutTab }}>
      {children}
    </AboutTabsContext.Provider>
  );
}

export function useAboutTabs() {
  const context = useContext(AboutTabsContext);
  if (!context) {
    throw new Error("useAboutTabs must be used within AboutTabsProvider");
  }
  return context;
}
