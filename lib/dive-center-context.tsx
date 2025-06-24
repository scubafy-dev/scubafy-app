"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  DiveCenterConst,
  diveCentersConst,
  getAggregatedStats,
} from "./dive-center-data";
import { usePathname, useRouter } from "next/navigation";
import { DiveCenter } from "@/app/generated/prisma";
import { getAllDiveCenters } from "./dive-center";

interface DiveCenterContextType {
  currentCenter: DiveCenter | null;
  isAllCenters: boolean;
  allCentersStats: DiveCenterConst["stats"];
  centers: DiveCenter[];
  setDiveCenters: (centers: DiveCenter[]) => void;
  setCurrentCenter: (center: DiveCenter | null) => void;
  setIsAllCenters: (isAll: boolean) => void;
  getCenterSpecificData: <T>(dataMap: Record<string, T>, allData: T) => T;
}

const DiveCenterContext = createContext<DiveCenterContextType | undefined>(
  undefined,
);

export function DiveCenterProvider({ children }: { children: ReactNode }) {
  const [diveCenters, setDiveCenters] = useState<DiveCenter[]>([]);

  const [currentCenter, setCurrentCenter] = useState<DiveCenter | null>(
    null,
  );
  const [isAllCenters, setIsAllCenters] = useState(false);
  const allCentersStats = getAggregatedStats();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Fetch dive centers from the server or any data source
    const fetchDiveCenters = async () => {
      try {
        const centers = await getAllDiveCenters();
        setDiveCenters(centers);
        // diveCenters.push(...centers);
        if (centers.length > 0) {
          setCurrentCenter(centers[0]);
        }
      } catch (error) {
        console.error("Failed to load dive centers:", error);
      }
    };
    fetchDiveCenters();
  }, []);

  // Load saved center selection from localStorage on initial load
  useEffect(() => {
    const savedCenterId = localStorage.getItem("currentCenterId");
    const savedIsAllCenters = localStorage.getItem("isAllCenters") === "true";

    if (savedIsAllCenters) {
      setIsAllCenters(true);
      setCurrentCenter(null);
    } else if (savedCenterId) {
      const center = diveCenters.find((c) => c.id === savedCenterId);
      if (center) {
        setCurrentCenter(center);
        setIsAllCenters(false);
      }
    }
  }, []);

  // Save center selection to localStorage when it changes
  const handleCenterChange = (center: DiveCenter | null) => {
    setCurrentCenter(center);
    if (center) {
      localStorage.setItem("currentCenterId", center.id);
      localStorage.setItem("isAllCenters", "false");
    }
  };

  const handleAllCentersChange = (isAll: boolean) => {
    setIsAllCenters(isAll);
    localStorage.setItem("isAllCenters", isAll.toString());
    if (isAll) {
      setCurrentCenter(null);
      localStorage.removeItem("currentCenterId");
    }
  };

  // Generic function to get data specific to the current center
  const getCenterSpecificData = <T,>(
    dataMap: Record<string, T>,
    allData: T,
  ): T => {
    if (isAllCenters) {
      return allData;
    }

    if (!currentCenter || !diveCenters.length) {
      return allData;
    }

    return currentCenter
      ? dataMap[currentCenter.id as keyof typeof dataMap] ||
        dataMap[diveCenters[0].id]
      : dataMap[diveCenters[0].id];
  };

  return (
    <DiveCenterContext.Provider
      value={{
        currentCenter,
        isAllCenters,
        allCentersStats,
        centers: diveCenters,
        setDiveCenters: setDiveCenters,
        setCurrentCenter: handleCenterChange,
        setIsAllCenters: handleAllCentersChange,
        getCenterSpecificData,
      }}
    >
      {children}
    </DiveCenterContext.Provider>
  );
}

export function useDiveCenter() {
  const context = useContext(DiveCenterContext);
  if (context === undefined) {
    throw new Error("useDiveCenter must be used within a DiveCenterProvider");
  }
  return context;
}
