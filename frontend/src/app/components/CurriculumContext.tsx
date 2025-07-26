"use client";

import { createContext, useContext, useState } from "react";

type CurriculumContextType = {
  curriculumTab: string;
  setCurriculumTab: (tab: string) => void;
};

const CurriculumContext = createContext<CurriculumContextType | undefined>(
  undefined
);

export function CurriculumProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [curriculumTab, setCurriculumTab] = useState("pyp");

  return (
    <CurriculumContext.Provider value={{ curriculumTab, setCurriculumTab }}>
      {children}
    </CurriculumContext.Provider>
  );
}

export function useCurriculum() {
  const context = useContext(CurriculumContext);
  if (!context) {
    throw new Error("useCurriculum must be used within a CurriculumProvider");
  }
  return context;
}
