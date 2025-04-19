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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Edit, Trash, FileText, Award, Home, Calendar, Package, Scroll, CheckCircle, DollarSign } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Equipment {
  item: string
  dueDate: string
  condition: string
  cost: number
}

interface Dive {
  date: string
  site: string
  type: string
  cost: number
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  certificationLevel: string
  room: string
  numberOfNights: number
  roomCost: number
  lastDive: string
  avatar: string
  currentCourse: string
  courseStartDate?: string
  courseEndDate?: string
  courseCost?: number
  upcomingDives: Dive[]
  rentedEquipment: Equipment[]
}

export function CustomersTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const customers = [
    {
      id: "C-1001",
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
      id: "C-1002",
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
    },
    {
      id: "C-1003",
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
      id: "C-1004",
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
    },
    {
      id: "C-1005",
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
  ]

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.certificationLevel.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleRowClick = (customer: Customer) => {
    setSelectedCustomer(customer)
  }

  // Calculate total amount for a customer
  const calculateTotalAmount = (customer: Customer): number => {
    let total = 0;
    
    // Add room cost
    total += customer.roomCost || 0;
    
    // Add course cost
    if (customer.currentCourse && customer.courseCost) {
      total += customer.courseCost;
    }
    
    // Add dive costs
    if (customer.upcomingDives && customer.upcomingDives.length > 0) {
      customer.upcomingDives.forEach(dive => {
        total += dive.cost || 0;
      });
    }
    
    // Add equipment rental costs
    if (customer.rentedEquipment && customer.rentedEquipment.length > 0) {
      customer.rentedEquipment.forEach(equipment => {
        total += equipment.cost || 0;
      });
    }
    
    return total;
  };

  return (
    <>
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-1 items-center space-x-2">
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[300px]"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Certification</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Last Dive</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow 
                  key={customer.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(customer)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={customer.avatar} alt={customer.name} />
                        <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{customer.name}</span>
                        <span className="text-xs text-muted-foreground">{customer.id}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{customer.email}</span>
                      <span className="text-xs text-muted-foreground">{customer.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      {customer.certificationLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {customer.room ? (
                      <div className="flex items-center gap-1">
                        <Home className="h-3 w-3 text-muted-foreground" />
                        <span>{customer.room}</span>
                        {customer.numberOfNights > 0 && (
                          <span className="text-xs text-muted-foreground ml-1">
                            ({customer.numberOfNights} nights)
                          </span>
                        )}
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>{customer.lastDive}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
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
                          <FileText className="mr-2 h-4 w-4" /> View Dive Log
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash className="mr-2 h-4 w-4" /> Delete
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

      {selectedCustomer && (
        <Dialog open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedCustomer.avatar} alt={selectedCustomer.name} />
                  <AvatarFallback>{selectedCustomer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{selectedCustomer.name}</span>
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="overview" className="mt-4">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="dives">Dives</TabsTrigger>
                <TabsTrigger value="equipment">Equipment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Contact Information</p>
                    <p className="text-sm">{selectedCustomer.email}</p>
                    <p className="text-sm">{selectedCustomer.phone}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Certification</p>
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      <Award className="h-3 w-3" />
                      {selectedCustomer.certificationLevel}
                    </Badge>
                    <p className="text-sm">Last Dive: {selectedCustomer.lastDive}</p>
                  </div>
                  
                  {selectedCustomer.room && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Accommodation</p>
                      <div className="flex items-center gap-1">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">Room {selectedCustomer.room}</p>
                      </div>
                      <p className="text-sm">{selectedCustomer.numberOfNights} nights</p>
                      <p className="text-sm">${selectedCustomer.roomCost} total</p>
                    </div>
                  )}
                  
                  {selectedCustomer.currentCourse && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Current Course</p>
                      <p className="text-sm">{selectedCustomer.currentCourse}</p>
                      {selectedCustomer.courseStartDate && (
                        <p className="text-sm">
                          {selectedCustomer.courseStartDate} to {selectedCustomer.courseEndDate}
                        </p>
                      )}
                      {selectedCustomer.courseCost && (
                        <p className="text-sm">${selectedCustomer.courseCost} total</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-1 bg-muted/20 p-3 rounded-md col-span-2 mt-2">
                    <p className="font-medium flex items-center gap-1 mb-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      Revenue Breakdown
                    </p>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        {selectedCustomer.roomCost > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Accommodation</span>
                            <span>${selectedCustomer.roomCost.toFixed(2)}</span>
                          </div>
                        )}
                        
                        {selectedCustomer.currentCourse && selectedCustomer.courseCost && (
                          <div className="flex justify-between text-sm">
                            <span>{selectedCustomer.currentCourse} Course</span>
                            <span>${selectedCustomer.courseCost.toFixed(2)}</span>
                          </div>
                        )}
                        
                        {selectedCustomer.upcomingDives && selectedCustomer.upcomingDives.length > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Dive Trips ({selectedCustomer.upcomingDives.length})</span>
                            <span>${selectedCustomer.upcomingDives.reduce((sum, dive) => sum + (dive.cost || 0), 0).toFixed(2)}</span>
                          </div>
                        )}
                        
                        {selectedCustomer.rentedEquipment && selectedCustomer.rentedEquipment.length > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Equipment Rentals ({selectedCustomer.rentedEquipment.length})</span>
                            <span>${selectedCustomer.rentedEquipment.reduce((sum, equip) => sum + (equip.cost || 0), 0).toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="pt-2 mt-2 border-t border-border">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Total</span>
                          <span className="text-lg font-bold text-green-600">
                            ${calculateTotalAmount(selectedCustomer).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="courses">
                {selectedCustomer.currentCourse ? (
                  <div className="rounded-md border p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Scroll className="h-5 w-5 text-blue-500" />
                      <p className="font-medium">{selectedCustomer.currentCourse} Course</p>
                    </div>
                    
                    {selectedCustomer.courseStartDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">
                          {selectedCustomer.courseStartDate} - {selectedCustomer.courseEndDate}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <p>In Progress</p>
                        <p className="text-muted-foreground">Instructor: Alex Martinez</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No active courses</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="dives">
                {selectedCustomer.upcomingDives && selectedCustomer.upcomingDives.length > 0 ? (
                  <div className="space-y-3">
                    <p className="font-medium">Upcoming Dives</p>
                    {selectedCustomer.upcomingDives.map((dive, index) => (
                      <div key={index} className="rounded-md border p-3 flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm font-medium">{dive.date}</p>
                          </div>
                          <p className="text-sm">{dive.site}</p>
                          <Badge variant="secondary" className="text-xs">{dive.type}</Badge>
                        </div>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No upcoming dives</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="equipment">
                {selectedCustomer.rentedEquipment && selectedCustomer.rentedEquipment.length > 0 ? (
                  <div className="space-y-4">
                    <p className="font-medium">Rented Equipment</p>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Condition</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedCustomer.rentedEquipment.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Package className="h-4 w-4 text-muted-foreground" />
                                  {item.item}
                                </div>
                              </TableCell>
                              <TableCell>{item.dueDate}</TableCell>
                              <TableCell>
                                <Badge variant={
                                  item.condition === "Excellent" ? "default" : 
                                  item.condition === "Good" ? "secondary" : 
                                  "outline"
                                }>
                                  {item.condition}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No equipment currently rented</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

