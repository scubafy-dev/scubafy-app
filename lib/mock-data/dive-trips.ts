// Mock data for dive trips for each dive center

export interface DiveTrip {
  id: string;
  title: string;
  date: string;
  location: string;
  capacity: number;
  booked: number;
  price: number;
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
  diveMaster: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  center?: string; // Optional center name for all centers view
  instructor: string;
  vehicle: {
    name: string;
    type: 'boat' | 'speedboat' | 'catamaran';
    capacity: number;
  };
  participants: Array<{
    name: string;
    certification: string;
    level: string;
  }>;
}

// Dive trips for Dauin
const dauinTrips: DiveTrip[] = [
  {
    id: "DT-1001",
    title: "Coral Reef Exploration",
    date: "2025-03-28",
    location: "Dauin Marine Sanctuary",
    capacity: 12,
    booked: 8,
    price: 120,
    status: 'upcoming',
    diveMaster: "Alex Rodriguez",
    description: "Explore the beautiful coral reefs of Dauin Marine Sanctuary with our experienced dive masters.",
    duration: "4 hours",
    difficulty: "beginner",
    instructor: "Maria Santos",
    vehicle: {
      name: "Blue Pearl",
      type: "boat",
      capacity: 15
    },
    participants: [
      { name: "John Smith", certification: "PADI Open Water", level: "Beginner" },
      { name: "Emma Wilson", certification: "SSI Advanced Open Water", level: "Advanced" },
      { name: "Mike Chen", certification: "PADI Rescue Diver", level: "Advanced" },
      { name: "Sarah Johnson", certification: "PADI Open Water", level: "Beginner" },
      { name: "David Lee", certification: "SSI Open Water", level: "Beginner" },
      { name: "Lisa Wong", certification: "PADI Advanced Open Water", level: "Intermediate" },
      { name: "Tom Brown", certification: "PADI Open Water", level: "Beginner" },
      { name: "Anna Garcia", certification: "SSI Open Water", level: "Beginner" }
    ]
  },
  {
    id: "DT-1002",
    title: "Muck Diving Adventure",
    date: "2025-03-29",
    location: "Car Cemetery",
    capacity: 8,
    booked: 6,
    price: 150,
    status: 'upcoming',
    diveMaster: "Sarah Johnson",
    description: "Discover the incredible macro life at one of the world's premier muck diving sites.",
    duration: "4 hours",
    difficulty: "advanced",
    instructor: "James Wilson",
    vehicle: {
      name: "Muck Explorer",
      type: "speedboat",
      capacity: 10
    },
    participants: [
      { name: "Robert Chen", certification: "PADI Advanced Open Water", level: "Advanced" },
      { name: "Julia Martinez", certification: "SSI Advanced Open Water", level: "Advanced" },
      { name: "Peter Kim", certification: "PADI Rescue Diver", level: "Advanced" },
      { name: "Sophie Taylor", certification: "PADI Advanced Open Water", level: "Advanced" },
      { name: "Mark Davis", certification: "SSI Advanced Open Water", level: "Advanced" },
      { name: "Rachel Wong", certification: "PADI Advanced Open Water", level: "Advanced" }
    ]
  },
  {
    id: "DT-1003",
    title: "Night Dive Experience",
    date: "2025-03-30",
    location: "Sahara Beach",
    capacity: 6,
    booked: 4,
    price: 135,
    status: 'upcoming',
    diveMaster: "Michael Chen",
    description: "Experience the magic of the reef at night with our expert-guided night dive.",
    duration: "2 hours",
    difficulty: "intermediate",
    instructor: "Elena Rodriguez",
    vehicle: {
      name: "Night Diver",
      type: "boat",
      capacity: 8
    },
    participants: [
      { name: "Chris Johnson", certification: "PADI Advanced Open Water", level: "Intermediate" },
      { name: "Maria Garcia", certification: "SSI Advanced Open Water", level: "Intermediate" },
      { name: "Alex Kim", certification: "PADI Advanced Open Water", level: "Advanced" },
      { name: "Laura Chen", certification: "PADI Advanced Open Water", level: "Intermediate" }
    ]
  },
  {
    id: "DT-1004",
    title: "Apo Island Day Trip",
    date: "2025-04-05",
    location: "Apo Island",
    capacity: 10,
    booked: 7,
    price: 175,
    status: 'upcoming',
    diveMaster: "Lisa Wong",
    description: "Full day trip to the famous Apo Island with its pristine reefs and abundant marine life.",
    duration: "8 hours",
    difficulty: "intermediate",
    instructor: "David Martinez",
    vehicle: {
      name: "Island Explorer",
      type: "catamaran",
      capacity: 12
    },
    participants: [
      { name: "Thomas Brown", certification: "PADI Open Water", level: "Intermediate" },
      { name: "Hannah Lee", certification: "SSI Advanced Open Water", level: "Advanced" },
      { name: "James Wilson", certification: "PADI Advanced Open Water", level: "Advanced" },
      { name: "Emily Davis", certification: "PADI Open Water", level: "Intermediate" },
      { name: "Michael Park", certification: "SSI Open Water", level: "Intermediate" },
      { name: "Sofia Rodriguez", certification: "PADI Advanced Open Water", level: "Advanced" },
      { name: "Daniel Kim", certification: "PADI Open Water", level: "Intermediate" }
    ]
  },
];

// Dive trips for Malapascua
const malapascuaTrips: DiveTrip[] = [
  {
    id: "MT-1001",
    title: "Thresher Shark Dive",
    date: "2025-04-02",
    location: "Monad Shoal",
    capacity: 10,
    booked: 7,
    price: 185,
    status: 'upcoming',
    diveMaster: "John Parker",
    description: "Early morning dive to witness the majestic thresher sharks at their cleaning station.",
    duration: "3 hours",
    difficulty: "advanced",
    instructor: "Sarah Thompson",
    vehicle: {
      name: "Shark Seeker",
      type: "speedboat",
      capacity: 12
    },
    participants: [
      { name: "Richard Lee", certification: "PADI Advanced Open Water", level: "Advanced" },
      { name: "Amanda Chen", certification: "SSI Advanced Open Water", level: "Advanced" },
      { name: "Kevin Wilson", certification: "PADI Rescue Diver", level: "Advanced" },
      { name: "Jessica Park", certification: "PADI Advanced Open Water", level: "Advanced" },
      { name: "Brian Taylor", certification: "SSI Advanced Open Water", level: "Advanced" },
      { name: "Michelle Wong", certification: "PADI Advanced Open Water", level: "Advanced" },
      { name: "David Garcia", certification: "PADI Advanced Open Water", level: "Advanced" }
    ]
  },
  {
    id: "MT-1002",
    title: "Reef Conservation Dive",
    date: "2025-04-03",
    location: "Lighthouse Reef",
    capacity: 8,
    booked: 5,
    price: 120,
    status: 'upcoming',
    diveMaster: "Emma Wilson",
    description: "Participate in coral reef monitoring and conservation efforts with our marine biologists.",
    duration: "4 hours",
    difficulty: "intermediate",
    instructor: "Dr. Maya Patel",
    vehicle: {
      name: "Research One",
      type: "boat",
      capacity: 10
    },
    participants: [
      { name: "Alice Thompson", certification: "PADI Advanced Open Water", level: "Intermediate" },
      { name: "John Miller", certification: "SSI Advanced Open Water", level: "Advanced" },
      { name: "Sarah Davis", certification: "PADI Rescue Diver", level: "Advanced" },
      { name: "Michael Lee", certification: "PADI Advanced Open Water", level: "Intermediate" },
      { name: "Emma Chen", certification: "SSI Advanced Open Water", level: "Intermediate" }
    ]
  },
  {
    id: "MT-1003",
    title: "Gato Island Trip",
    date: "2025-04-10",
    location: "Gato Island",
    capacity: 8,
    booked: 6,
    price: 165,
    status: 'upcoming',
    diveMaster: "Mark Sullivan",
    description: "Explore the tunnels and caves of Gato Island, home to white tip reef sharks and various macro life.",
    duration: "6 hours",
    difficulty: "intermediate",
    instructor: "Thomas Anderson",
    vehicle: {
      name: "Cave Explorer",
      type: "speedboat",
      capacity: 10
    },
    participants: [
      { name: "Ryan Park", certification: "PADI Advanced Open Water", level: "Advanced" },
      { name: "Sophie Martinez", certification: "SSI Advanced Open Water", level: "Advanced" },
      { name: "David Kim", certification: "PADI Advanced Open Water", level: "Intermediate" },
      { name: "Laura Wilson", certification: "PADI Advanced Open Water", level: "Advanced" },
      { name: "Chris Lee", certification: "SSI Advanced Open Water", level: "Advanced" },
      { name: "Maria Chen", certification: "PADI Advanced Open Water", level: "Intermediate" }
    ]
  },
  {
    id: "MT-1004",
    title: "Manta Bowl Expedition",
    date: "2025-04-15",
    location: "Ticao Pass",
    capacity: 8,
    booked: 4,
    price: 220,
    status: 'upcoming',
    diveMaster: "Carlos Mendoza",
    description: "Advance drift diving at the Manta Bowl, with chances to see manta rays and other pelagics.",
    duration: "Full day",
    difficulty: "advanced",
    instructor: "James Rodriguez",
    vehicle: {
      name: "Manta Seeker",
      type: "speedboat",
      capacity: 10
    },
    participants: [
      { name: "Daniel Park", certification: "PADI Advanced Open Water", level: "Advanced" },
      { name: "Emily Chen", certification: "SSI Advanced Open Water", level: "Advanced" },
      { name: "Alex Kim", certification: "PADI Rescue Diver", level: "Advanced" },
      { name: "Michelle Lee", certification: "PADI Advanced Open Water", level: "Advanced" }
    ]
  },
];

// Dive trips for Siquijor
const siquijorTrips: DiveTrip[] = [
  {
    id: "ST-1001",
    title: "Wall Dive Adventure",
    date: "2025-04-05",
    location: "Tubod Marine Sanctuary",
    capacity: 8,
    booked: 6,
    price: 140,
    status: 'upcoming',
    diveMaster: "Nina Patel",
    description: "Experience the dramatic wall dive at Tubod Marine Sanctuary with its colorful corals and fish.",
    duration: "4 hours",
    difficulty: "intermediate",
    instructor: "Marco Silva",
    vehicle: {
      name: "Wall Runner",
      type: "boat",
      capacity: 10
    },
    participants: [
      { name: "Steven Park", certification: "PADI Advanced Open Water", level: "Intermediate" },
      { name: "Linda Chen", certification: "SSI Advanced Open Water", level: "Advanced" },
      { name: "George Kim", certification: "PADI Advanced Open Water", level: "Intermediate" },
      { name: "Catherine Lee", certification: "PADI Advanced Open Water", level: "Advanced" },
      { name: "Paul Martinez", certification: "SSI Advanced Open Water", level: "Intermediate" },
      { name: "Jennifer Wong", certification: "PADI Advanced Open Water", level: "Intermediate" }
    ]
  },
  {
    id: "ST-1002",
    title: "Beginner Reef Tour",
    date: "2025-04-06",
    location: "Paliton Beach",
    capacity: 6,
    booked: 4,
    price: 110,
    status: 'upcoming',
    diveMaster: "David Thompson",
    description: "Perfect introduction to diving for beginners in the calm, shallow waters of Paliton Beach.",
    duration: "3 hours",
    difficulty: "beginner",
    instructor: "Lisa Chen",
    vehicle: {
      name: "Reef Runner",
      type: "boat",
      capacity: 8
    },
    participants: [
      { name: "Karen Lee", certification: "PADI Open Water", level: "Beginner" },
      { name: "Jason Kim", certification: "SSI Open Water", level: "Beginner" },
      { name: "Amy Chen", certification: "PADI Open Water", level: "Beginner" },
      { name: "Mark Wilson", certification: "PADI Open Water", level: "Beginner" }
    ]
  },
  {
    id: "ST-1003",
    title: "Cave Exploration",
    date: "2025-04-07",
    location: "Cantabon Cave",
    capacity: 6,
    booked: 3,
    price: 160,
    status: 'upcoming',
    diveMaster: "Ryan Cooper",
    description: "Explore the underwater caves and caverns around Siquijor Island.",
    duration: "3 hours",
    difficulty: "advanced",
    instructor: "Michael Torres",
    vehicle: {
      name: "Cave Master",
      type: "speedboat",
      capacity: 8
    },
    participants: [
      { name: "Peter Chen", certification: "PADI Advanced Open Water", level: "Advanced" },
      { name: "Sarah Kim", certification: "SSI Cave Diver", level: "Advanced" },
      { name: "Tom Wilson", certification: "PADI Cave Diver", level: "Advanced" }
    ]
  },
];

// Dive trips for Sipalay
const sipalayTrips: DiveTrip[] = [
  {
    id: "SPT-1001",
    title: "Shipwreck Dive",
    date: "2025-04-10",
    location: "Campomanes Bay",
    capacity: 8,
    booked: 5,
    price: 170,
    status: 'upcoming',
    diveMaster: "James Wilson",
    description: "Dive the mysterious shipwreck in Campomanes Bay, now home to diverse marine life.",
    duration: "4 hours",
    difficulty: "advanced",
    instructor: "Carlos Mendoza",
    vehicle: {
      name: "Wreck Explorer",
      type: "boat",
      capacity: 10
    },
    participants: [
      { name: "Andrew Chen", certification: "PADI Advanced Open Water", level: "Advanced" },
      { name: "Patricia Kim", certification: "SSI Advanced Open Water", level: "Advanced" },
      { name: "Robert Lee", certification: "PADI Rescue Diver", level: "Advanced" },
      { name: "Diana Park", certification: "PADI Advanced Open Water", level: "Advanced" },
      { name: "Timothy Wong", certification: "SSI Advanced Open Water", level: "Advanced" }
    ]
  },
  {
    id: "SPT-1002",
    title: "Coral Garden Tour",
    date: "2025-04-11",
    location: "Sugar Beach",
    capacity: 10,
    booked: 6,
    price: 115,
    status: 'upcoming',
    diveMaster: "Sophia Martinez",
    description: "Discover the vibrant coral gardens just off Sugar Beach with their incredible biodiversity.",
    duration: "4 hours",
    difficulty: "beginner",
    instructor: "Anna Lee",
    vehicle: {
      name: "Coral Explorer",
      type: "catamaran",
      capacity: 12
    },
    participants: [
      { name: "Mike Johnson", certification: "PADI Open Water", level: "Beginner" },
      { name: "Lucy Chen", certification: "SSI Open Water", level: "Beginner" },
      { name: "James Kim", certification: "PADI Open Water", level: "Beginner" },
      { name: "Emma Davis", certification: "PADI Open Water", level: "Beginner" },
      { name: "Oliver Park", certification: "SSI Open Water", level: "Beginner" },
      { name: "Sofia Lee", certification: "PADI Open Water", level: "Beginner" }
    ]
  },
  {
    id: "SPT-1003",
    title: "Deep Reef Expedition",
    date: "2025-04-20",
    location: "Punta Ballo",
    capacity: 6,
    booked: 3,
    price: 145,
    status: 'upcoming',
    diveMaster: "Robert Garcia",
    description: "Experience deeper reef diving with a chance to see larger pelagic species.",
    duration: "5 hours",
    difficulty: "advanced",
    instructor: "David Chen",
    vehicle: {
      name: "Deep Blue",
      type: "speedboat",
      capacity: 8
    },
    participants: [
      { name: "Chris Wilson", certification: "PADI Advanced Open Water", level: "Advanced" },
      { name: "Maria Park", certification: "SSI Advanced Open Water", level: "Advanced" },
      { name: "Steve Lee", certification: "PADI Rescue Diver", level: "Advanced" }
    ]
  },
];

// Combined data for "All Centers" view
const allCentersTrips: DiveTrip[] = [
  ...dauinTrips.map(trip => ({...trip, center: "Sea Explorers Dauin"})),
  ...malapascuaTrips.map(trip => ({...trip, center: "Sea Explorers Malapascua"})),
  ...siquijorTrips.map(trip => ({...trip, center: "Sea Explorers Siquijor"})),
  ...sipalayTrips.map(trip => ({...trip, center: "Sea Explorers Sipalay"})),
] as (DiveTrip & {center: string})[];

export const diveTripsByCenter = {
  dauin: dauinTrips,
  malapascua: malapascuaTrips,
  siquijor: siquijorTrips,
  sipalay: sipalayTrips,
};

export const allDiveTrips = allCentersTrips; 