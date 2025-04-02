"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function StaffDirectory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  const staff = [
    {
      id: "S-1001",
      name: "Michael Rodriguez",
      email: "michael@scubafy.com",
      phone: "+1 (555) 123-4567",
      role: "Dive Instructor",
      certification: "PADI Master Instructor",
      specialties: ["Deep Diving", "Wreck Diving", "Night Diving"],
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "S-1002",
      name: "Jennifer Lee",
      email: "jennifer@scubafy.com",
      phone: "+1 (555) 234-5678",
      role: "Dive Instructor",
      certification: "SSI Instructor",
      specialties: ["Underwater Photography", "Marine Life"],
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "S-1003",
      name: "Robert Chen",
      email: "robert@scubafy.com",
      phone: "+1 (555) 345-6789",
      role: "Divemaster",
      certification: "PADI Divemaster",
      specialties: ["Equipment Maintenance", "Rescue"],
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "S-1004",
      name: "Sarah Johnson",
      email: "sarah@scubafy.com",
      phone: "+1 (555) 456-7890",
      role: "Shop Manager",
      certification: "PADI Rescue Diver",
      specialties: ["Customer Service", "Inventory Management"],
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "S-1005",
      name: "David Wilson",
      email: "david@scubafy.com",
      phone: "+1 (555) 567-8901",
      role: "Boat Captain",
      certification: "USCG Licensed Captain",
      specialties: ["Navigation", "Boat Maintenance"],
      status: "on-leave",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || member.role.toLowerCase() === roleFilter.toLowerCase()
    return matchesSearch && matchesRole
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Directory</CardTitle>
        <CardDescription>View and manage your dive center staff.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex flex-1 items-center">
            <Input
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-[300px]"
            />
          </div>
          <div className="w-full md:w-auto">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="dive instructor">Dive Instructors</SelectItem>
                <SelectItem value="divemaster">Divemasters</SelectItem>
                <SelectItem value="shop manager">Shop Managers</SelectItem>
                <SelectItem value="boat captain">Boat Captains</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Certification</TableHead>
                <TableHead>Specialties</TableHead>
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
                  <TableCell>{member.certification}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {member.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
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

