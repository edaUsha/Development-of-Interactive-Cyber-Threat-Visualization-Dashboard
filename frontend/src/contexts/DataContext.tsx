import { createContext, useContext, useState, type ReactNode } from "react";
import type { ThreatData } from "@/data/mockThreats";

interface DataContextType {
  dataLoaded: boolean;
  setDataLoaded: (loaded: boolean) => void;
  threats: ThreatData[];
  setThreats: React.Dispatch<React.SetStateAction<ThreatData[]>>;
  alertsEnabled: boolean;
  setAlertsEnabled: (enabled: boolean) => void;
}

const DataContext = createContext<DataContextType>({
  dataLoaded: false,
  setDataLoaded: () => {},
  threats: [],
  setThreats: () => {},
  alertsEnabled: true,
  setAlertsEnabled: () => {},
});

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [dataLoaded, setDataLoaded] = useState(() => localStorage.getItem("dataLoaded") === "true");
  const [threats, setThreats] = useState<ThreatData[]>([]);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  const handleSetDataLoaded = (loaded: boolean) => {
    setDataLoaded(loaded);
    localStorage.setItem("dataLoaded", String(loaded));
  };

  return (
    <DataContext.Provider value={{
      dataLoaded,
      setDataLoaded: handleSetDataLoaded,
      threats,
      setThreats,
      alertsEnabled,
      setAlertsEnabled,
    }}>
      {children}
    </DataContext.Provider>
  );
};
