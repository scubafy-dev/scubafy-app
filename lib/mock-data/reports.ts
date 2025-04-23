export interface DiveReport {
  id: string;
  tripName: string;
  date: string;
  location: string;
  staffName: string;
  participants: number;
  maxDepth: number;
  diveDuration: number;
  visibility: number;
  waterTemp: number;
  center?: string;
}

export const reportsByCenter: Record<string, DiveReport[]> = {
  "center-1": [
    {
      id: "1",
      tripName: "Morning Reef Dive",
      date: "2024-03-15",
      location: "Coral Garden",
      staffName: "Alex Thompson",
      participants: 6,
      maxDepth: 18,
      diveDuration: 45,
      visibility: 15,
      waterTemp: 26
    },
    {
      id: "2",
      tripName: "Afternoon Wall Dive",
      date: "2024-03-15",
      location: "Deep Wall",
      staffName: "Sarah Chen",
      participants: 4,
      maxDepth: 30,
      diveDuration: 40,
      visibility: 20,
      waterTemp: 25
    }
  ],
  "center-2": [
    {
      id: "3",
      tripName: "Wreck Exploration",
      date: "2024-03-14",
      location: "USS Liberty",
      staffName: "Mike Brown",
      participants: 8,
      maxDepth: 28,
      diveDuration: 50,
      visibility: 18,
      waterTemp: 27
    }
  ]
}

export const allCentersReports: DiveReport[] = Object.entries(reportsByCenter).flatMap(
  ([centerId, reports]) => reports.map(report => ({
    ...report,
    center: centerId === "center-1" ? "Bali Dive Resort" : "Lombok Diving Center"
  }))
) 