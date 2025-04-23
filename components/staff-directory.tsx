"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash, Calendar, Mail, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Define the permissions available in the system
const accessOptions = [
  { id: "dive-trips", label: "Dive Trips" },
  { id: "customers", label: "Customers" },
  { id: "equipment", label: "Equipment" },
  { id: "staff", label: "Staff" },
  { id: "tasks", label: "Tasks" },
  { id: "reports", label: "Reports" },
  { id: "course-tracker", label: "Course Tracker" },
  { id: "calendar", label: "Calendar" },
  { id: "finances", label: "Finances" },
]

// Define staff member type
export type StaffMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  age?: string;
  gender?: string;
  address?: string;
  emergencyContact?: string; 
  bio?: string;
  certification?: string; // Keep for backward compatibility
  specialties: string[]; // Used for access permissions
  status: "active" | "on-leave";
  avatar: string;
}

// Initial staff data
const initialStaff: StaffMember[] = [
  {
    id: "S-1001",
    name: "Michael Rodriguez",
    email: "michael@scubafy.com",
    phone: "+1 (555) 123-4567",
    role: "Dive Instructor",
    age: "32",
    gender: "male",
    specialties: ["dive-trips", "customers", "calendar"],
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "S-1002",
    name: "Jennifer Lee",
    email: "jennifer@scubafy.com",
    phone: "+1 (555) 234-5678",
    role: "Senior Instructor",
    age: "29",
    gender: "female",
    specialties: ["dive-trips", "customers", "course-tracker", "calendar"],
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "S-1003",
    name: "Robert Chen",
    email: "robert@scubafy.com",
    phone: "+1 (555) 345-6789",
    role: "Operations Manager",
    age: "41",
    gender: "male",
    specialties: ["equipment", "staff", "reports", "tasks"],
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "S-1004",
    name: "Sarah Johnson",
    email: "sarah@scubafy.com",
    phone: "+1 (555) 456-7890",
    role: "General Manager",
    age: "36",
    gender: "female",
    specialties: ["customers", "staff", "equipment", "reports", "finances"],
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "S-1005",
    name: "David Wilson",
    email: "david@scubafy.com",
    phone: "+1 (555) 567-8901",
    role: "Boat Captain",
    age: "45",
    gender: "male",
    specialties: ["dive-trips", "equipment"],
    status: "on-leave",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

// Helper function to get access label from ID
function getAccessLabel(accessId: string): string {
  const option = accessOptions.find(opt => opt.id === accessId);
  return option ? option.label : accessId;
}

// Main component
export function StaffDirectory({ staff }: { staff: StaffMember[] }) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search staff by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-[300px]"
            />
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Age/Gender</TableHead>
                <TableHead>Access Permissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{member.name}</span>
                        <span className="text-xs text-muted-foreground">{member.id}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center text-sm">
                        <Mail className="mr-1 h-3 w-3" />
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="mr-1 h-3 w-3" />
                        <span>{member.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    {member.age && member.gender ? (
                      <span>{member.age} / {member.gender.charAt(0).toUpperCase() + member.gender.slice(1)}</span>
                    ) : (
                      <span className="text-muted-foreground">Not specified</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {member.specialties.map((accessId, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {getAccessLabel(accessId)}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={member.status === "active" ? "default" : "outline"}
                      className={member.status === "on-leave" ? "border-amber-500 text-amber-500" : ""}
                    >
                      {member.status === "active" ? "Active" : "On Leave"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" /> Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="mr-2 h-4 w-4" /> View Schedule
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash className="mr-2 h-4 w-4" /> Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

