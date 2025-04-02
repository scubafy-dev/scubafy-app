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
import { MoreHorizontal, Edit, Trash, Users, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DiveTripsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const diveTrips = [
    {
      id: "DT-1001",
      name: "Coral Reef Exploration",
      location: "Blue Lagoon Reef",
      date: "2025-03-28",
      time: "9:00 AM - 1:00 PM",
      capacity: 12,
      booked: 8,
      price: "$120.00",
      status: "upcoming",
    },
    {
      id: "DT-1002",
      name: "Wreck Dive Adventure",
      location: "Shipwreck Point",
      date: "2025-03-29",
      time: "8:00 AM - 12:00 PM",
      capacity: 8,
      booked: 6,
      price: "$150.00",
      status: "upcoming",
    },
    {
      id: "DT-1003",
      name: "Night Dive Experience",
      location: "Coral Gardens",
      date: "2025-03-30",
      time: "7:00 PM - 9:00 PM",
      capacity: 6,
      booked: 4,
      price: "$135.00",
      status: "upcoming",
    },
    {
      id: "DT-1004",
      name: "Deep Dive Certification",
      location: "Blue Hole",
      date: "2025-04-01",
      time: "8:00 AM - 2:00 PM",
      capacity: 6,
      booked: 3,
      price: "$200.00",
      status: "upcoming",
    },
    {
      id: "DT-1005",
      name: "Beginner Reef Dive",
      location: "Shallow Reef",
      date: "2025-03-15",
      time: "10:00 AM - 12:00 PM",
      capacity: 10,
      booked: 10,
      price: "$100.00",
      status: "completed",
    },
    {
      id: "DT-1006",
      name: "Advanced Cave Dive",
      location: "Crystal Caves",
      date: "2025-03-10",
      time: "9:00 AM - 3:00 PM",
      capacity: 6,
      booked: 4,
      price: "$180.00",
      status: "completed",
    },
    {
      id: "DT-1007",
      name: "Underwater Photography",
      location: "Coral Gardens",
      date: "2025-04-15",
      time: "10:00 AM - 2:00 PM",
      capacity: 8,
      booked: 0,
      price: "$160.00",
      status: "cancelled",
    },
  ]

  const filteredTrips = diveTrips.filter((trip) => {
    const matchesSearch =
      trip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || trip.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dive Trips</CardTitle>
        <CardDescription>Manage all your scheduled dive trips.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-1 items-center space-x-2">
            <Input
              placeholder="Search trips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[300px]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trips</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrips.map((trip) => (
              <TableRow key={trip.id}>
                <TableCell className="font-medium">{trip.name}</TableCell>
                <TableCell>{trip.location}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      <span>{trip.date}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{trip.time}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Users className="mr-1 h-3 w-3" />
                    <span>
                      {trip.booked}/{trip.capacity}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{trip.price}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      trip.status === "upcoming" ? "default" : trip.status === "completed" ? "secondary" : "destructive"
                    }
                  >
                    {trip.status}
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
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Users className="mr-2 h-4 w-4" /> View Participants
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="mr-2 h-4 w-4" /> Cancel Trip
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

