export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  category: 'maintenance' | 'training' | 'administrative' | 'equipment';
}

// Tasks for Dauin
const dauinTasks: Task[] = [
  {
    id: "TD-1001",
    title: "Equipment Maintenance Check",
    description: "Perform monthly maintenance check on all diving equipment",
    assignedTo: "Alex Rodriguez",
    dueDate: "2025-03-25",
    priority: "high",
    status: "in_progress",
    category: "maintenance"
  },
  {
    id: "TD-1002",
    title: "New Staff Training",
    description: "Conduct orientation for new dive masters",
    assignedTo: "Sarah Johnson",
    dueDate: "2025-03-28",
    priority: "medium",
    status: "pending",
    category: "training"
  }
];

// Tasks for Malapascua
const malapascuaTasks: Task[] = [
  {
    id: "TM-1001",
    title: "Boat Maintenance",
    description: "Schedule annual maintenance for dive boats",
    assignedTo: "John Parker",
    dueDate: "2025-03-26",
    priority: "high",
    status: "pending",
    category: "maintenance"
  },
  {
    id: "TM-1002",
    title: "Update Safety Procedures",
    description: "Review and update emergency response procedures",
    assignedTo: "Emma Wilson",
    dueDate: "2025-03-29",
    priority: "medium",
    status: "in_progress",
    category: "administrative"
  }
];

// Tasks for Siquijor
const siquijorTasks: Task[] = [
  {
    id: "TS-1001",
    title: "Inventory Check",
    description: "Complete monthly inventory of rental equipment",
    assignedTo: "Nina Patel",
    dueDate: "2025-03-27",
    priority: "medium",
    status: "pending",
    category: "equipment"
  },
  {
    id: "TS-1002",
    title: "Staff Meeting",
    description: "Monthly staff meeting and performance review",
    assignedTo: "David Thompson",
    dueDate: "2025-03-30",
    priority: "low",
    status: "pending",
    category: "administrative"
  }
];

// Tasks for Sipalay
const sipalayTasks: Task[] = [
  {
    id: "TSP-1001",
    title: "Equipment Inspection",
    description: "Inspect and test all regulators",
    assignedTo: "James Wilson",
    dueDate: "2025-03-28",
    priority: "high",
    status: "in_progress",
    category: "equipment"
  },
  {
    id: "TSP-1002",
    title: "Customer Service Training",
    description: "Conduct customer service workshop for staff",
    assignedTo: "Sophia Martinez",
    dueDate: "2025-03-31",
    priority: "medium",
    status: "pending",
    category: "training"
  }
];

// Combined data for "All Centers" view
const allTasks = [
  ...dauinTasks.map(task => ({...task, center: "Sea Explorers Dauin"})),
  ...malapascuaTasks.map(task => ({...task, center: "Sea Explorers Malapascua"})),
  ...siquijorTasks.map(task => ({...task, center: "Sea Explorers Siquijor"})),
  ...sipalayTasks.map(task => ({...task, center: "Sea Explorers Sipalay"})),
] as const;

export const tasksByCenter = {
  dauin: dauinTasks,
  malapascua: malapascuaTasks,
  siquijor: siquijorTasks,
  sipalay: sipalayTasks,
} as const;

export const allCentersTasks = allTasks; 