// Mock data for staff for each dive center
import { StaffMember } from "@/components/staff-directory"

// Staff for Dauin
const dauinStaff: StaffMember[] = [
  {
    id: "SD-1001",
    name: "Alex Rodriguez",
    email: "alex@seaexplorers.com",
    phone: "+63 917 123 4567",
    role: "Dive Master",
    specialties: ["dive-trips", "customers", "calendar"],
    status: "active",
    avatar: "/placeholder.svg?height=32&width=32",
    age: "32",
    gender: "male",
  },
  {
    id: "SD-1002",
    name: "Sarah Johnson",
    email: "sarah@seaexplorers.com",
    phone: "+63 917 234 5678",
    role: "Senior Instructor",
    specialties: ["dive-trips", "customers", "course-tracker", "calendar"],
    status: "active",
    avatar: "/placeholder.svg?height=32&width=32",
    age: "29",
    gender: "female",
  },
  {
    id: "SD-1003",
    name: "Michael Chen",
    email: "michael@seaexplorers.com",
    phone: "+63 917 345 6789",
    role: "Instructor",
    specialties: ["dive-trips", "customers", "course-tracker"],
    status: "active",
    avatar: "/placeholder.svg?height=32&width=32",
    age: "35",
    gender: "male",
  },
];

// Staff for Malapascua
const malapascuaStaff: StaffMember[] = [
  {
    id: "SM-1001",
    name: "John Parker",
    email: "john@seaexplorers.com",
    phone: "+63 917 678 9012",
    role: "Senior Instructor",
    specialties: ["dive-trips", "customers", "course-tracker", "calendar"],
    status: "active",
    avatar: "/placeholder.svg?height=32&width=32",
    age: "38",
    gender: "male",
  },
  {
    id: "SM-1002",
    name: "Emma Wilson",
    email: "emma@seaexplorers.com",
    phone: "+63 917 789 0123",
    role: "Dive Master",
    specialties: ["dive-trips", "customers", "calendar"],
    status: "active",
    avatar: "/placeholder.svg?height=32&width=32",
    age: "27",
    gender: "female",
  },
];

// Staff for Siquijor
const siquijorStaff: StaffMember[] = [
  {
    id: "SS-1001",
    name: "Nina Patel",
    email: "nina@seaexplorers.com",
    phone: "+63 917 012 3456",
    role: "Senior Instructor",
    specialties: ["dive-trips", "customers", "course-tracker", "calendar"],
    status: "active",
    avatar: "/placeholder.svg?height=32&width=32",
    age: "33",
    gender: "female",
  },
  {
    id: "SS-1002",
    name: "David Thompson",
    email: "david@seaexplorers.com",
    phone: "+63 917 123 4567",
    role: "Dive Master",
    specialties: ["dive-trips", "customers", "calendar"],
    status: "active",
    avatar: "/placeholder.svg?height=32&width=32",
    age: "31",
    gender: "male",
  },
];

// Staff for Sipalay
const sipalayStaff: StaffMember[] = [
  {
    id: "SSP-1001",
    name: "James Wilson",
    email: "james@seaexplorers.com",
    phone: "+63 917 345 6789",
    role: "Senior Instructor",
    specialties: ["dive-trips", "customers", "course-tracker", "calendar"],
    status: "active",
    avatar: "/placeholder.svg?height=32&width=32",
    age: "36",
    gender: "male",
  },
  {
    id: "SSP-1002",
    name: "Sophia Martinez",
    email: "sophia@seaexplorers.com",
    phone: "+63 917 456 7890",
    role: "Dive Master",
    specialties: ["dive-trips", "customers", "calendar"],
    status: "active",
    avatar: "/placeholder.svg?height=32&width=32",
    age: "29",
    gender: "female",
  },
];

// Combined data for "All Centers" view
const allCentersStaff = [
  ...dauinStaff.map(member => ({...member, center: "Sea Explorers Dauin"})),
  ...malapascuaStaff.map(member => ({...member, center: "Sea Explorers Malapascua"})),
  ...siquijorStaff.map(member => ({...member, center: "Sea Explorers Siquijor"})),
  ...sipalayStaff.map(member => ({...member, center: "Sea Explorers Sipalay"})),
] as const;

export const staffByCenter = {
  dauin: dauinStaff,
  malapascua: malapascuaStaff,
  siquijor: siquijorStaff,
  sipalay: sipalayStaff,
} as const;

export const allStaff = allCentersStaff; 