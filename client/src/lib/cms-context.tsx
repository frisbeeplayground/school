import { createContext, useContext, useState } from "react";
import type { Environment, School } from "@shared/schema";

interface CMSContextType {
  environment: Environment;
  setEnvironment: (env: Environment) => void;
  currentSchool: School | null;
  setCurrentSchool: (school: School | null) => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [environment, setEnvironment] = useState<Environment>("sandbox");
  const [currentSchool, setCurrentSchool] = useState<School | null>({
    id: "1",
    name: "Springfield Academy",
    slug: "springfield",
    logo: null,
    primaryColor: "#1e40af",
    secondaryColor: "#3b82f6",
    tagline: null,
    description: null,
    address: null,
    phone: null,
    email: null,
    operatingHours: null,
  });

  return (
    <CMSContext.Provider
      value={{ environment, setEnvironment, currentSchool, setCurrentSchool }}
    >
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error("useCMS must be used within a CMSProvider");
  }
  return context;
}
