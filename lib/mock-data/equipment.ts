// Mock data for equipment inventory for each dive center

// Define equipment item interface
export interface EquipmentItem {
  id: string;
  type: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  lastService: string;
  nextService: string;
  status: "available" | "in-use" | "maintenance" | "rented";
  condition: "excellent" | "good" | "fair" | "poor";
  notes: string;
  rentedTo?: string;
  rentedToEmail?: string;
  rentedSince?: string;
  rentedUntil?: string;
  rentalRate?: string;
  rentalTimeframe?: string;
  center?: string; // Center name (added for the all centers view)
  trackUsage?: boolean;
  usageCount?: number;
  usageLimit?: number;
}

// Define equipment data for each center by center ID
export const equipmentByCenter: Record<string, EquipmentItem[]> = {
  "dauin": [
    {
      id: "EQ-D001",
      type: "BCD",
      brand: "Scubapro",
      model: "Hydros Pro",
      serialNumber: "SP-HP-2021-7834",
      purchaseDate: "2021-05-10",
      lastService: "2023-11-15",
      nextService: "2024-11-15",
      status: "available",
      condition: "excellent",
      notes: "Regularly cleaned and maintained",
      trackUsage: true,
      usageCount: 75,
      usageLimit: 100
    },
    {
      id: "EQ-D002",
      type: "Regulator",
      brand: "Aqualung",
      model: "Legend LX",
      serialNumber: "AL-LL-2022-4562",
      purchaseDate: "2022-02-18",
      lastService: "2024-01-20",
      nextService: "2025-01-20", 
      status: "in-use",
      condition: "good",
      notes: "Second stage has minor scratches",
      trackUsage: true,
      usageCount: 95,
      usageLimit: 100
    },
    {
      id: "EQ-D003",
      type: "Wetsuit",
      brand: "Mares",
      model: "Flexa 3.2.2",
      serialNumber: "MA-F322-2020-9012",
      purchaseDate: "2020-09-05",
      lastService: "2023-08-10",
      nextService: "2024-08-10",
      status: "available",
      condition: "good",
      notes: "Small tear on left sleeve, repaired",
      trackUsage: false
    },
    {
      id: "EQ-D004",
      type: "Dive Computer",
      brand: "Suunto",
      model: "D5",
      serialNumber: "SU-D5-2023-3456",
      purchaseDate: "2023-04-12",
      lastService: "2023-04-12",
      nextService: "2025-04-12",
      status: "in-use",
      condition: "excellent",
      notes: "Battery replaced in April 2023",
      trackUsage: true,
      usageCount: 75,
      usageLimit: 100
    },
    {
      id: "EQ-D005",
      type: "Fins",
      brand: "TUSA",
      model: "SF-22",
      serialNumber: "TU-SF22-2022-7891",
      purchaseDate: "2022-06-30",
      lastService: "2023-12-05",
      nextService: "2024-12-05",
      status: "maintenance",
      condition: "fair",
      notes: "Buckle needs replacing",
      trackUsage: true,
      usageCount: 95,
      usageLimit: 100
    }
  ],
  "malapascua": [
    {
      id: "EQ-M001",
      type: "BCD",
      brand: "Cressi",
      model: "Aquapro 5",
      serialNumber: "CR-AP5-2021-1234",
      purchaseDate: "2021-03-15",
      lastService: "2023-10-10",
      nextService: "2024-10-10",
      status: "available",
      condition: "good",
      notes: "One D-ring replaced in 2023",
      trackUsage: true,
      usageCount: 75,
      usageLimit: 100
    },
    {
      id: "EQ-M002",
      type: "Regulator",
      brand: "Scubapro",
      model: "MK25 EVO/A700",
      serialNumber: "SP-MK25-2023-5678",
      purchaseDate: "2023-01-05",
      lastService: "2024-01-05",
      nextService: "2025-01-05",
      status: "available",
      condition: "excellent",
      notes: "Premium regulator for advanced dives",
      trackUsage: true,
      usageCount: 75,
      usageLimit: 100
    },
    {
      id: "EQ-M003",
      type: "Mask",
      brand: "Atomic",
      model: "Venom",
      serialNumber: "AT-VEN-2022-9101",
      purchaseDate: "2022-05-20",
      lastService: "2023-11-25",
      nextService: "2024-11-25",
      status: "in-use",
      condition: "good",
      notes: "Ultra-clear lenses",
      trackUsage: true,
      usageCount: 95,
      usageLimit: 100
    },
    {
      id: "EQ-M004",
      type: "Tank",
      brand: "Faber",
      model: "HP 12L",
      serialNumber: "FB-HP12-2019-1121",
      purchaseDate: "2019-08-12",
      lastService: "2023-08-12",
      nextService: "2024-08-12",
      status: "available",
      condition: "good",
      notes: "Hydrostatic test due in 2024",
      trackUsage: false
    },
    {
      id: "EQ-M005",
      type: "Dive Computer",
      brand: "Garmin",
      model: "Descent Mk2i",
      serialNumber: "GA-DMK2-2022-3141",
      purchaseDate: "2022-09-10",
      lastService: "2023-09-10",
      nextService: "2024-09-10",
      status: "maintenance",
      condition: "good",
      notes: "Software update needed",
      trackUsage: true,
      usageCount: 75,
      usageLimit: 100
    }
  ],
  "siquijor": [
    {
      id: "EQ-S001",
      type: "BCD",
      brand: "Aqualung",
      model: "Rogue",
      serialNumber: "AL-RG-2021-5161",
      purchaseDate: "2021-04-22",
      lastService: "2023-12-22",
      nextService: "2024-12-22",
      status: "in-use",
      condition: "excellent",
      notes: "Lightweight travel BCD",
      trackUsage: true,
      usageCount: 95,
      usageLimit: 100
    },
    {
      id: "EQ-S002",
      type: "Regulator",
      brand: "Mares",
      model: "Rover 15X",
      serialNumber: "MA-R15X-2020-7181",
      purchaseDate: "2020-11-15",
      lastService: "2023-11-15",
      nextService: "2024-11-15",
      status: "available",
      condition: "good",
      notes: "Very reliable regulator",
      trackUsage: true,
      usageCount: 75,
      usageLimit: 100
    },
    {
      id: "EQ-S003",
      type: "Wetsuit",
      brand: "O'Neill",
      model: "Epic 4/3",
      serialNumber: "ON-E43-2022-9192",
      purchaseDate: "2022-07-28",
      lastService: "2023-07-28",
      nextService: "2024-07-28",
      status: "available",
      condition: "excellent",
      notes: "Perfect for Siquijor waters",
      trackUsage: true,
      usageCount: 75,
      usageLimit: 100
    },
    {
      id: "EQ-S004",
      type: "Camera",
      brand: "Olympus",
      model: "TG-6",
      serialNumber: "OL-TG6-2023-0123",
      purchaseDate: "2023-02-14",
      lastService: "2023-08-14",
      nextService: "2024-08-14",
      status: "in-use",
      condition: "excellent",
      notes: "With underwater housing",
      trackUsage: true,
      usageCount: 95,
      usageLimit: 100
    },
    {
      id: "EQ-S005",
      type: "Dive Light",
      brand: "Big Blue",
      model: "VTL3100P",
      serialNumber: "BB-VTL-2021-2324",
      purchaseDate: "2021-10-30",
      lastService: "2023-10-30",
      nextService: "2024-10-30",
      status: "maintenance",
      condition: "fair",
      notes: "Battery not holding full charge",
      trackUsage: true,
      usageCount: 75,
      usageLimit: 100
    }
  ],
  "sipalay": [
    {
      id: "EQ-SP001",
      type: "BCD",
      brand: "Hollis",
      model: "LTS",
      serialNumber: "HO-LTS-2020-2526",
      purchaseDate: "2020-06-15",
      lastService: "2023-06-15",
      nextService: "2024-06-15",
      status: "available",
      condition: "good",
      notes: "Durable backplate and wing system",
      trackUsage: true,
      usageCount: 75,
      usageLimit: 100
    },
    {
      id: "EQ-SP002",
      type: "Regulator",
      brand: "Atomic",
      model: "T3",
      serialNumber: "AT-T3-2022-2728",
      purchaseDate: "2022-03-10",
      lastService: "2024-03-10",
      nextService: "2025-03-10",
      status: "in-use",
      condition: "excellent",
      notes: "High-performance regulator",
      trackUsage: true,
      usageCount: 95,
      usageLimit: 100
    },
    {
      id: "EQ-SP003",
      type: "Fins",
      brand: "ScubaPro",
      model: "Seawing Nova",
      serialNumber: "SP-SWN-2021-2930",
      purchaseDate: "2021-09-22",
      lastService: "2023-09-22",
      nextService: "2024-09-22",
      status: "available",
      condition: "good",
      notes: "Medium size, black color",
      trackUsage: true,
      usageCount: 75,
      usageLimit: 100
    },
    {
      id: "EQ-SP004",
      type: "Tank",
      brand: "Catalina",
      model: "S80",
      serialNumber: "CA-S80-2019-3132",
      purchaseDate: "2019-05-18",
      lastService: "2023-05-18",
      nextService: "2024-05-18",
      status: "maintenance",
      condition: "fair",
      notes: "Valve needs inspection",
      trackUsage: false
    },
    {
      id: "EQ-SP005",
      type: "Surface Marker Buoy",
      brand: "DiveSmart",
      model: "Pro DSMB",
      serialNumber: "DS-DSMB-2023-3334",
      purchaseDate: "2023-01-25",
      lastService: "2023-01-25",
      nextService: "2025-01-25",
      status: "in-use",
      condition: "excellent",
      notes: "High-visibility orange",
      trackUsage: true,
      usageCount: 75,
      usageLimit: 100
    }
  ]
};

// Import the dive centers data to get name mapping
import { diveCentersConst } from "../dive-center-data";

// Function to add center name to each item for the "All Centers" view
function addCenterToEquipment(): EquipmentItem[] {
  let allCenterItems: any[] = [];
  
  // Create a mapping from center ID to center name
  const centerNameMap = Object.fromEntries(
    diveCentersConst.map(center => [center.id, center.name])
  );
  
  Object.entries(equipmentByCenter).forEach(([centerId, items]) => {
    const centerName = centerNameMap[centerId] || centerId;
    const itemsWithCenter = items.map(item => ({
      ...item,
      center: centerName
    }));
    allCenterItems = [...allCenterItems, ...itemsWithCenter];
  });
  
  return allCenterItems;
}

// All equipment data combined
export const allEquipment = addCenterToEquipment(); 