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
import { getDiveCenterByStaffCode } from "./staffs";

interface DiveCenterContextType {
  currentCenter: DiveCenter | null;
  isAllCenters: boolean;
  allCentersStats: DiveCenterConst["stats"];
  centers: DiveCenter[];
  setDiveCenters: (centers: DiveCenter[]) => void;
  setCurrentCenter: (center: DiveCenter | null) => void;
  setIsAllCenters: (isAll: boolean) => void;
  updateCenter: (updatedCenter: DiveCenter) => void;
  getCenterSpecificData: <T>(dataMap: Record<string, T>, allData: T) => T;
  getDiveCenterByStaffCode: (staffCode: string) => Promise<{ success: boolean; diveCenter?: DiveCenter; staff?: any; message?: string }>;
  setStaffDiveCenter: (staffCode: string) => Promise<{ success: boolean; message?: string }>;
}

const DiveCenterContext = createContext<DiveCenterContextType | undefined>(
  undefined,
);

export function DiveCenterProvider({ children }: { children: ReactNode }) {
  const [diveCenters, setDiveCenters] = useState<DiveCenter[]>([]);
  const [currentCenter, setCurrentCenter] = useState<DiveCenter | null>(null);
  const [isAllCenters, setIsAllCenters] = useState(false);
  const allCentersStats = getAggregatedStats();
  const pathname = usePathname();
  const router = useRouter();

  // Add logging for state changes
  useEffect(() => {
    console.log("DiveCenter state changed:", {
      diveCenters: diveCenters.length,
      currentCenter: currentCenter?.name || "null",
      isAllCenters
    });
  }, [diveCenters, currentCenter, isAllCenters]);

  useEffect(() => {
    // Fetch dive centers from the server or any data source
    const fetchDiveCenters = async () => {
      try {
        console.log("Fetching dive centers...");
        const centers = await getAllDiveCenters();
        console.log("Fetched dive centers:", centers);
        
        if (!centers || centers.length === 0) {
          console.warn("No dive centers found for user");
          setDiveCenters([]);
          setCurrentCenter(null);
          return;
        }
        
        setDiveCenters(centers);
        
        // --- Staff logic: use currentDiveCenter from localStorage if present ---
        const staffData = typeof window !== "undefined" ? localStorage.getItem("staffData") : null;
        const savedDiveCenter = typeof window !== "undefined" ? localStorage.getItem("currentDiveCenter") : null;
        if (staffData) {
          try {
            let center = null;
            if (savedDiveCenter) {
              center = JSON.parse(savedDiveCenter);
            } else {
              // If no saved dive center, try to get it from staff data
              const staff = JSON.parse(staffData);
              if (staff.staffCode) {
                // Use the new function to get dive center by staff code
                const diveCenterResult = await getDiveCenterByStaffCode(staff.staffCode);
                if (diveCenterResult.success) {
                  center = diveCenterResult.diveCenter;
                  // Save it for future use
                  localStorage.setItem("currentDiveCenter", JSON.stringify(center));
                }
              } else {
                // Fallback to staff.diveCenter if available
                center = staff.diveCenter || null;
              }
            }
            if (center) {
              console.log("Setting staff center:", center.name);
              setCurrentCenter(center);
              setIsAllCenters(false);
              return;
            }
          } catch (e) {
            console.error("Error parsing staff data:", e);
            // fallback to old logic if parsing fails
          }
        }
        // --- Manager logic: fallback to existing selection logic ---
        const savedCenterId = localStorage.getItem("currentCenterId");
        const savedIsAllCenters = localStorage.getItem("isAllCenters") === "true";

        if (savedIsAllCenters) {
          console.log("Setting to all centers mode");
          setIsAllCenters(true);
          setCurrentCenter(null);
        } else if (savedCenterId && centers.length > 0) {
          const center = centers.find((c) => c.id === savedCenterId);
          if (center) {
            console.log("Setting saved center:", center.name);
            setCurrentCenter(center);
            setIsAllCenters(false);
          } else {
            console.log("Saved center not found, setting first center");
            setCurrentCenter(centers[0]);
            setIsAllCenters(false);
          }
        } else if (centers.length > 0) {
          console.log("No saved selection, setting first center");
          setCurrentCenter(centers[0]);
          setIsAllCenters(false);
        }
      } catch (error) {
        console.error("Failed to load dive centers:", error);
        // Set empty state on error
        setDiveCenters([]);
        setCurrentCenter(null);
      }
    };
    fetchDiveCenters();
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

  // Function to update a specific center in the centers array
  const updateCenter = (updatedCenter: DiveCenter) => {
    setDiveCenters(prevCenters => 
      prevCenters.map(center => 
        center.id === updatedCenter.id ? updatedCenter : center
      )
    );
    
    // If this is the current center, update it as well
    if (currentCenter?.id === updatedCenter.id) {
      setCurrentCenter(updatedCenter);
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

  // Function to get dive center by staff code
  const getDiveCenterByStaffCodeFromContext = async (staffCode: string) => {
    try {
      return await getDiveCenterByStaffCode(staffCode);
    } catch (error) {
      console.error("Error getting dive center by staff code:", error);
      return { success: false, message: "Error retrieving dive center details" };
    }
  };

  // Function to set staff dive center
  const setStaffDiveCenter = async (staffCode: string) => {
    try {
      const result = await getDiveCenterByStaffCode(staffCode);
      if (result.success && result.diveCenter) {
        // Set the current center to the staff's dive center
        setCurrentCenter(result.diveCenter);
        setIsAllCenters(false);
        
        // Save to localStorage for staff
        localStorage.setItem("currentDiveCenter", JSON.stringify(result.diveCenter));
        
        // Clean up any manager-specific localStorage items
        localStorage.removeItem("currentCenterId");
        localStorage.removeItem("isAllCenters");
        
        console.log("Staff dive center set successfully:", result.diveCenter.name);
        return { success: true, message: "Staff dive center set successfully" };
      } else {
        return { success: false, message: result.message || "Failed to set staff dive center" };
      }
    } catch (error) {
      console.error("Error setting staff dive center:", error);
      return { success: false, message: "Error setting staff dive center" };
    }
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
        updateCenter,
        getCenterSpecificData,
        getDiveCenterByStaffCode: getDiveCenterByStaffCodeFromContext,
        setStaffDiveCenter,
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
