"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ConsultationContextType {
  isConsultationSelected: boolean;
  setIsConsultationSelected: (val: boolean) => void;
  leadSource: string;
  setLeadSource: (val: string) => void;
}

const ConsultationContext = createContext<ConsultationContextType | undefined>(undefined);

export function ConsultationProvider({ children }: { children: React.ReactNode }) {
  const [isConsultationSelected, setIsConsultationSelected] = useState(false);
  const [leadSource, setLeadSourceState] = useState("Unknown");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("kash_lead_source");
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLeadSourceState(stored);
      }
    }
  }, []);

  const setLeadSource = (val: string) => {
    setLeadSourceState(val);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("kash_lead_source", val);
    }
  };

  return (
    <ConsultationContext.Provider 
      value={{ 
        isConsultationSelected, 
        setIsConsultationSelected, 
        leadSource, 
        setLeadSource 
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
}

export function useConsultation() {
  const context = useContext(ConsultationContext);
  if (context === undefined) {
    throw new Error("useConsultation must be used within a ConsultationProvider");
  }
  return context;
}
