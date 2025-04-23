export interface DiveCenter {
  id: string;
  name: string;
  location: string;
  stats: {
    totalBookings: number;
    bookingsChange: number;
    activeDivers: number;
    newDivers: number;
    upcomingDives: number;
    revenue: number;
    revenueChange: number;
  };
}

// Import finances data to ensure revenue consistency
import { financesByCenter, allFinances } from "./mock-data/finances";

export const diveCenters: DiveCenter[] = [
  {
    id: "dauin",
    name: "Sea Explorers Dauin",
    location: "Dauin, Philippines",
    stats: {
      totalBookings: 128,
      bookingsChange: 14,
      activeDivers: 42,
      newDivers: 8,
      upcomingDives: 12,
      revenue: financesByCenter.dauin.revenue.annual,
      revenueChange: 15,
    },
  },
  {
    id: "malapascua",
    name: "Sea Explorers Malapascua",
    location: "Malapascua, Philippines",
    stats: {
      totalBookings: 94,
      bookingsChange: 8,
      activeDivers: 36,
      newDivers: 5,
      upcomingDives: 8,
      revenue: financesByCenter.malapascua.revenue.annual,
      revenueChange: 13,
    },
  },
  {
    id: "siquijor",
    name: "Sea Explorers Siquijor",
    location: "Siquijor, Philippines",
    stats: {
      totalBookings: 76,
      bookingsChange: 11,
      activeDivers: 28,
      newDivers: 6,
      upcomingDives: 6,
      revenue: financesByCenter.siquijor.revenue.annual,
      revenueChange: 12,
    },
  },
  {
    id: "sipalay",
    name: "Sea Explorers Sipalay",
    location: "Sipalay, Philippines",
    stats: {
      totalBookings: 62,
      bookingsChange: 9,
      activeDivers: 24,
      newDivers: 3,
      upcomingDives: 5,
      revenue: financesByCenter.sipalay.revenue.annual,
      revenueChange: 11,
    },
  },
];

// Helper function to calculate aggregated stats for all dive centers
export function getAggregatedStats(): DiveCenter['stats'] {
  return {
    totalBookings: diveCenters.reduce((sum, center) => sum + center.stats.totalBookings, 0),
    bookingsChange: Math.round(diveCenters.reduce((sum, center) => sum + center.stats.bookingsChange, 0) / diveCenters.length),
    activeDivers: diveCenters.reduce((sum, center) => sum + center.stats.activeDivers, 0),
    newDivers: diveCenters.reduce((sum, center) => sum + center.stats.newDivers, 0),
    upcomingDives: diveCenters.reduce((sum, center) => sum + center.stats.upcomingDives, 0),
    revenue: allFinances.revenue.annual, // Use the same total as in the finances data
    revenueChange: 14, // Average of all centers, matching the financial data
  };
} 