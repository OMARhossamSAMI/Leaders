"use client";

import { createContext, useContext, useState } from "react";

type StudentsLifeTabsContextType = {
  studentsLifeSection: string;
  setStudentsLifeSection: (section: string) => void;
};

const StudentsLifeTabsContext = createContext<
  StudentsLifeTabsContextType | undefined
>(undefined);

export function StudentsLifeTabsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [studentsLifeSection, setStudentsLifeSection] = useState("athletics");

  return (
    <StudentsLifeTabsContext.Provider
      value={{ studentsLifeSection, setStudentsLifeSection }}
    >
      {children}
    </StudentsLifeTabsContext.Provider>
  );
}

export function useStudentsLifeTabs() {
  const context = useContext(StudentsLifeTabsContext);
  if (!context) {
    throw new Error(
      "useStudentsLifeTabs must be used within a StudentsLifeTabsProvider"
    );
  }
  return context;
}
