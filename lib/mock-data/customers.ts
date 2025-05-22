// Mock customer data for each dive center

import { diveCenters } from "../dive-center-data";

export interface Equipment {
  item: string;
  dueDate: string;
  condition: string;
  cost: number;
}

export interface Dive {
  date: string;
  site: string;
  type: string;
  cost: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  certificationLevel: string;
  room: string;
  numberOfNights: number;
  roomCost: number;
  lastDive: string;
  avatar: string;
  currentCourse: string;
  courseStartDate?: string;
  courseEndDate?: string;
  courseCost?: number;
  upcomingDives: Dive[];
  rentedEquipment: Equipment[];
  center?: string; // For all centers view
}

// Define customer data for each center by center ID
export const customersByCenter: Record<string, Customer[]> = {
  "dauin": [
    {
      id: "CD-1001",
      name: "John Smith",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      certificationLevel: "Advanced Open Water",
      room: "101",
      numberOfNights: 5,
      roomCost: 750,
      lastDive: "2025-03-15",
      avatar: "/placeholder.svg?height=40&width=40",
      currentCourse: "Rescue Diver",
      courseStartDate: "2025-04-01",
      courseEndDate: "2025-04-05",
      courseCost: 595,
      upcomingDives: [
        { date: "2025-03-28", site: "Blue Hole", type: "Wall Dive", cost: 120 },
        { date: "2025-03-29", site: "Shark Reef", type: "Drift Dive", cost: 150 }
      ],
      rentedEquipment: [
        { item: "BCD - Medium", dueDate: "2025-03-30", condition: "Good", cost: 20 },
        { item: "Regulator Set", dueDate: "2025-03-30", condition: "Excellent", cost: 25 },
        { item: "Wetsuit - 5mm", dueDate: "2025-03-30", condition: "Good", cost: 18 }
      ],
    },
    {
      id: "CD-1002",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1 (555) 234-5678",
      certificationLevel: "Open Water",
      room: "",
      numberOfNights: 0,
      roomCost: 0,
      lastDive: "2025-03-10",
      avatar: "/placeholder.svg?height=40&width=40",
      currentCourse: "",
      upcomingDives: [],
      rentedEquipment: [
        { item: "Fins - Medium", dueDate: "2025-03-25", condition: "Fair", cost: 10 }
      ],
    }
  ],
  "malapascua": [
    {
      id: "CM-1001",
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "+1 (555) 345-6789",
      certificationLevel: "Rescue Diver",
      room: "205",
      numberOfNights: 3,
      roomCost: 450,
      lastDive: "2025-03-20",
      avatar: "/placeholder.svg?height=40&width=40",
      currentCourse: "Divemaster",
      courseStartDate: "2025-03-25",
      courseEndDate: "2025-04-10",
      courseCost: 895,
      upcomingDives: [
        { date: "2025-03-26", site: "Coral Garden", type: "Training Dive", cost: 100 },
        { date: "2025-03-27", site: "Manta Point", type: "Training Dive", cost: 100 },
        { date: "2025-03-29", site: "Wreck Site", type: "Training Dive", cost: 100 }
      ],
      rentedEquipment: [
        { item: "BCD - Large", dueDate: "2025-04-11", condition: "Excellent", cost: 20 },
        { item: "Regulator Set", dueDate: "2025-04-11", condition: "Excellent", cost: 25 },
        { item: "Dive Computer", dueDate: "2025-04-11", condition: "Excellent", cost: 30 }
      ],
    },
    {
      id: "CM-1002",
      name: "Emily Davis",
      email: "emily@example.com",
      phone: "+1 (555) 456-7890",
      certificationLevel: "Divemaster",
      room: "310",
      numberOfNights: 7,
      roomCost: 1050,
      lastDive: "2025-03-22",
      avatar: "/placeholder.svg?height=40&width=40",
      currentCourse: "Instructor",
      courseStartDate: "2025-04-01",
      courseEndDate: "2025-04-15",
      courseCost: 1200,
      upcomingDives: [
        { date: "2025-03-25", site: "Deep Blue", type: "Fun Dive", cost: 120 }
      ],
      rentedEquipment: [],
    }
  ],
  "siquijor": [
    {
      id: "CS-1001",
      name: "David Wilson",
      email: "david@example.com",
      phone: "+1 (555) 567-8901",
      certificationLevel: "Open Water",
      room: "",
      numberOfNights: 0,
      roomCost: 0,
      lastDive: "2025-02-15",
      avatar: "/placeholder.svg?height=40&width=40",
      currentCourse: "",
      upcomingDives: [
        { date: "2025-03-30", site: "Turtle Bay", type: "Fun Dive", cost: 100 }
      ],
      rentedEquipment: [
        { item: "Full Equipment Set", dueDate: "2025-03-31", condition: "Good", cost: 60 }
      ],
    },
    {
      id: "CS-1002",
      name: "Lisa Martinez",
      email: "lisa@example.com",
      phone: "+1 (555) 678-9012",
      certificationLevel: "Advanced Open Water",
      room: "118",
      numberOfNights: 4,
      roomCost: 600,
      lastDive: "2025-03-18",
      avatar: "/placeholder.svg?height=40&width=40",
      currentCourse: "",
      upcomingDives: [
        { date: "2025-03-26", site: "Coral Garden", type: "Fun Dive", cost: 100 },
        { date: "2025-03-27", site: "Shark Point", type: "Fun Dive", cost: 120 }
      ],
      rentedEquipment: [
        { item: "Regulator Set", dueDate: "2025-03-28", condition: "Excellent", cost: 25 }
      ],
    }
  ],
  "sipalay": [
    {
      id: "CSP-1001",
      name: "Robert Taylor",
      email: "robert@example.com",
      phone: "+1 (555) 789-0123",
      certificationLevel: "Open Water",
      room: "202",
      numberOfNights: 3,
      roomCost: 450,
      lastDive: "2025-03-16",
      avatar: "/placeholder.svg?height=40&width=40",
      currentCourse: "Advanced Open Water",
      courseStartDate: "2025-03-25",
      courseEndDate: "2025-03-28",
      courseCost: 495,
      upcomingDives: [
        { date: "2025-03-26", site: "Reef Garden", type: "Training Dive", cost: 100 },
        { date: "2025-03-27", site: "Wreck Site", type: "Training Dive", cost: 120 }
      ],
      rentedEquipment: [
        { item: "Full Equipment Set", dueDate: "2025-03-29", condition: "Good", cost: 60 }
      ],
    },
    {
      id: "CSP-1002",
      name: "Jennifer Lewis",
      email: "jennifer@example.com",
      phone: "+1 (555) 890-1234",
      certificationLevel: "Rescue Diver",
      room: "",
      numberOfNights: 0,
      roomCost: 0,
      lastDive: "2025-03-19",
      avatar: "/placeholder.svg?height=40&width=40",
      currentCourse: "",
      upcomingDives: [
        { date: "2025-03-25", site: "Shark Alley", type: "Fun Dive", cost: 130 }
      ],
      rentedEquipment: [],
    }
  ]
};

// Function to add center name to each customer for the "All Centers" view
function addCenterToCustomers(): Customer[] {
  let allCenterCustomers: Customer[] = [];
  
  // Create a mapping from center ID to center name
  const centerNameMap = Object.fromEntries(
    diveCenters.map(center => [center.id, center.name])
  );
  
  Object.entries(customersByCenter).forEach(([centerId, customers]) => {
    const centerName = centerNameMap[centerId] || centerId;
    const customersWithCenter = customers.map(customer => ({
      ...customer,
      center: centerName
    }));
    allCenterCustomers = [...allCenterCustomers, ...customersWithCenter];
  });
  
  return allCenterCustomers;
}

export const mockCustomer = {
  id: "CD-1001",
  name: "John Smith",
  email: "john@example.com",
  phone: "+1 (555) 123-4567",
  certificationLevel: "Advanced Open Water",
  room: "101",
  numberOfNights: 5,
  roomCost: 750,
  lastDive: "2025-03-15",
  avatar: "/placeholder.svg?height=40&width=40",
  currentCourse: "Rescue Diver",
  courseStartDate: "2025-04-01",
  courseEndDate: "2025-04-05",
  center: "Dauin",
  courseCost: 595,
  upcomingDives: [
    { date: "2025-03-28", site: "Blue Hole", type: "Wall Dive", cost: 120 },
    { date: "2025-03-29", site: "Shark Reef", type: "Drift Dive", cost: 150 }
  ],
  rentedEquipment: [
    { item: "BCD - Medium", dueDate: "2025-03-30", condition: "Good", cost: 20 },
    { item: "Regulator Set", dueDate: "2025-03-30", condition: "Excellent", cost: 25 },
    { item: "Wetsuit - 5mm", dueDate: "2025-03-30", condition: "Good", cost: 18 }
  ],
};

// All customers data combined
export const allCustomers = addCenterToCustomers(); 