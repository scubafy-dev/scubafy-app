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
import { MoreHorizontal, Edit, Trash, Users, Calendar, ChevronDown, ChevronRight, Anchor, Car, Ship, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DiveTripsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [expandedRows, setExpandedRows] = useState<string[]>([])

  const toggleRowExpansion = (tripId: string) => {
    setExpandedRows(prev => 
      prev.includes(tripId) 
        ? prev.filter(id => id !== tripId) 
        : [...prev, tripId]
    )
  }

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
      participants: ["Jane Smith", "John Doe", "Emily Johnson", "Michael Brown", "Sarah Wilson", "David Taylor", "Lisa Anderson", "Robert Clark"],
      description: "Explore the vibrant coral reefs and diverse marine life of Blue Lagoon. Suitable for intermediate divers.",
      vehicle: "Dive Boat: Sea Explorer",
      diveMaster: "Captain Mike Wilson",
      equipment: "Standard scuba gear included, underwater cameras available for rent"
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
      participants: ["Robert Johnson", "Emma Williams", "Daniel Brown", "Olivia Davis", "William Miller", "Sophia Wilson"],
      description: "Explore the historic shipwreck of the S.S. Thaddeus, a cargo vessel that sank in 1942. Advanced divers only.",
      vehicle: "Charter Boat: Deep Blue",
      diveMaster: "James Rodriguez",
      equipment: "Advanced diving gear required, torches provided"
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
      participants: ["Thomas Clark", "Jennifer Lewis", "Michael Scott", "Rebecca Turner"],
      description: "Experience the magic of the reef at night when different marine species become active. See bioluminescent organisms and nocturnal predators.",
      vehicle: "Speedboat: Night Rider",
      diveMaster: "Laura Chen",
      equipment: "Special night diving lights included"
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
      participants: ["Ryan Cooper", "Melissa Garcia", "Kevin Patel"],
      description: "Certification dive for Deep Diver specialty. Includes theory session and two deep dives with an instructor.",
      vehicle: "Dive Boat: Poseidon",
      diveMaster: "Carlos Mendez",
      equipment: "Complete deep diving equipment provided"
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
      participants: ["Amanda Price", "Justin Lee", "Stephanie Wong", "Brandon Taylor", "Nicole Johnson", "Eric Smith", "Katherine Martin", "Andrew Wilson", "Rachel Davis", "Tyler Rodriguez"],
      description: "Perfect first dive for beginners in shallow, protected waters with abundant marine life.",
      vehicle: "Catamaran: Easy Rider",
      diveMaster: "Samantha Lee",
      equipment: "All gear included, simplified for beginners"
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
      participants: ["Jordan Matthews", "Alexis Richardson", "Cameron Blake", "Morgan Frost"],
      description: "Explore underwater cave systems with expert guides. Cave diving certification required.",
      vehicle: "Specialized Dive Boat: Cave Runner",
      diveMaster: "Diego Alvarez",
      equipment: "Cave diving equipment, safety lines, and backup lights provided"
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
      participants: [],
      description: "Learn underwater photography techniques in one of the most picturesque reef settings. Bring your underwater camera or rent one from us.",
      vehicle: "Charter Boat: Photo Safari",
      diveMaster: "Alex Kim",
      equipment: "Underwater camera rentals available"
    },
  ]

  const filteredTrips = diveTrips.filter((trip) => {
    const matchesSearch =
      trip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || trip.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Helper function to get appropriate icon for vehicle
  const getVehicleIcon = (vehicle: string) => {
    if (vehicle.toLowerCase().includes('boat')) return <Ship className="h-4 w-4 mr-2" />;
    if (vehicle.toLowerCase().includes('catamaran')) return <Anchor className="h-4 w-4 mr-2" />;
    if (vehicle.toLowerCase().includes('speedboat')) return <Ship className="h-4 w-4 mr-2" />;
    return <Car className="h-4 w-4 mr-2" />;
  }

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
              <TableHead className="w-8"></TableHead>
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
              <>
                <TableRow 
                  key={trip.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleRowExpansion(trip.id)}
                >
                  <TableCell>
                    <div className="flex items-center justify-center">
                      {expandedRows.includes(trip.id) ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                    </div>
                  </TableCell>
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
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
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
                {expandedRows.includes(trip.id) && (
                  <TableRow className="bg-muted/30">
                    <TableCell colSpan={8} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Description</h4>
                          <p className="text-sm text-muted-foreground mb-4">{trip.description}</p>
                          
                          <h4 className="text-sm font-semibold mb-2">Vehicle</h4>
                          <div className="flex items-center text-sm text-muted-foreground mb-4">
                            {getVehicleIcon(trip.vehicle)}
                            {trip.vehicle}
                          </div>
                          
                          <h4 className="text-sm font-semibold mb-2">Dive Master</h4>
                          <p className="text-sm text-muted-foreground mb-4">{trip.diveMaster}</p>
                          
                          <h4 className="text-sm font-semibold mb-2">Equipment</h4>
                          <p className="text-sm text-muted-foreground">{trip.equipment}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold mb-2 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" /> Location Details
                          </h4>
                          <p className="text-sm text-muted-foreground mb-4">{trip.location}</p>
                          
                          <h4 className="text-sm font-semibold mb-2 flex items-center">
                            <Users className="h-4 w-4 mr-1" /> Participants ({trip.participants.length})
                          </h4>
                          {trip.participants.length > 0 ? (
                            <div className="text-sm text-muted-foreground mb-4 grid grid-cols-1 md:grid-cols-2 gap-1">
                              {trip.participants.map((participant, index) => (
                                <div key={index} className="flex items-center">
                                  <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                                  {participant}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground mb-4">No participants registered</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

