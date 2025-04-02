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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  MoreHorizontal,
  Edit,
  Trash,
  AlertTriangle,
  CheckCircle,
  History,
  Plus,
  DollarSign,
  Calendar,
  FileText,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function EquipmentInventory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [rentalDuration, setRentalDuration] = useState("1")
  const [selectedCustomer, setSelectedCustomer] = useState("")

  const equipment = [
    {
      id: "EQ-1001",
      type: "Scuba Tank",
      serialNumber: "ST-12345",
      size: "80 cu ft",
      lastInspection: "2025-01-15",
      nextInspection: "2025-07-15",
      status: "available",
      condition: "good",
      rentalRate: "$15.00",
      rentalRateValue: 15,
    },
    {
      id: "EQ-1002",
      type: "Scuba Tank",
      serialNumber: "ST-12346",
      size: "80 cu ft",
      lastInspection: "2025-01-15",
      nextInspection: "2025-07-15",
      status: "in-use",
      condition: "good",
      rentalRate: "$15.00",
      rentalRateValue: 15,
    },
    {
      id: "EQ-1003",
      type: "Scuba Tank",
      serialNumber: "ST-12347",
      size: "63 cu ft",
      lastInspection: "2025-01-20",
      nextInspection: "2025-07-20",
      status: "maintenance",
      condition: "fair",
      rentalRate: "$12.00",
      rentalRateValue: 12,
    },
    {
      id: "EQ-1004",
      type: "BCD",
      serialNumber: "BCD-5001",
      size: "Medium",
      lastInspection: "2025-02-10",
      nextInspection: "2025-08-10",
      status: "available",
      condition: "excellent",
      rentalRate: "$20.00",
      rentalRateValue: 20,
    },
    {
      id: "EQ-1005",
      type: "BCD",
      serialNumber: "BCD-5002",
      size: "Large",
      lastInspection: "2025-02-10",
      nextInspection: "2025-08-10",
      status: "rented",
      condition: "good",
      rentalRate: "$20.00",
      rentalRateValue: 20,
      rentedTo: "John Smith",
      rentedUntil: "2025-03-28",
    },
    {
      id: "EQ-1006",
      type: "Regulator",
      serialNumber: "REG-3001",
      size: "N/A",
      lastInspection: "2025-03-01",
      nextInspection: "2025-09-01",
      status: "available",
      condition: "good",
      rentalRate: "$25.00",
      rentalRateValue: 25,
    },
    {
      id: "EQ-1007",
      type: "Wetsuit",
      serialNumber: "WS-2001",
      size: "Medium",
      lastInspection: "2025-02-15",
      nextInspection: "2025-08-15",
      status: "maintenance",
      condition: "poor",
      rentalRate: "$18.00",
      rentalRateValue: 18,
    },
    {
      id: "EQ-1008",
      type: "Wetsuit",
      serialNumber: "WS-2002",
      size: "Large",
      lastInspection: "2025-02-15",
      nextInspection: "2025-08-15",
      status: "rented",
      condition: "fair",
      rentalRate: "$18.00",
      rentalRateValue: 18,
      rentedTo: "Sarah Johnson",
      rentedUntil: "2025-03-30",
    },
  ]

  const customers = [
    {
      id: "C-1001",
      name: "John Smith",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "C-1002",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1 (555) 234-5678",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "C-1003",
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "+1 (555) 345-6789",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "C-1004",
      name: "Emily Davis",
      email: "emily@example.com",
      phone: "+1 (555) 456-7890",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "C-1005",
      name: "David Wilson",
      email: "david@example.com",
      phone: "+1 (555) 567-8901",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || item.type.toLowerCase().includes(typeFilter.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  // Calculate equipment statistics
  const totalEquipment = equipment.length
  const availableEquipment = equipment.filter((item) => item.status === "available").length
  const inUseEquipment = equipment.filter((item) => item.status === "in-use").length
  const maintenanceEquipment = equipment.filter((item) => item.status === "maintenance").length
  const rentedEquipment = equipment.filter((item) => item.status === "rented").length

  // Handle equipment rental
  const handleRentEquipment = (item) => {
    setSelectedEquipment(item)
    setRentalDuration("1")
    setSelectedCustomer("")
  }

  // Calculate rental total
  const calculateRentalTotal = () => {
    if (!selectedEquipment) return "$0.00"
    const total = selectedEquipment.rentalRateValue * Number.parseInt(rentalDuration)
    return `$${total.toFixed(2)}`
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEquipment}</div>
            <Progress value={100} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableEquipment}</div>
            <Progress value={(availableEquipment / totalEquipment) * 100} className="h-2 mt-2 text-green-500" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Use</CardTitle>
            <History className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inUseEquipment}</div>
            <Progress value={(inUseEquipment / totalEquipment) * 100} className="h-2 mt-2 text-blue-500" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rented</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rentedEquipment}</div>
            <Progress value={(rentedEquipment / totalEquipment) * 100} className="h-2 mt-2 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenanceEquipment}</div>
            <Progress value={(maintenanceEquipment / totalEquipment) * 100} className="h-2 mt-2 text-amber-500" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Equipment Inventory</CardTitle>
              <CardDescription>Manage all your dive equipment.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Equipment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Equipment</DialogTitle>
                    <DialogDescription>Enter the details for the new equipment item.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">
                        Type
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scuba-tank">Scuba Tank</SelectItem>
                          <SelectItem value="bcd">BCD</SelectItem>
                          <SelectItem value="regulator">Regulator</SelectItem>
                          <SelectItem value="wetsuit">Wetsuit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="serial" className="text-right">
                        Serial Number
                      </Label>
                      <Input id="serial" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="size" className="text-right">
                        Size
                      </Label>
                      <Input id="size" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="condition" className="text-right">
                        Condition
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="rental-rate" className="text-right">
                        Rental Rate
                      </Label>
                      <div className="col-span-3 flex items-center">
                        <span className="mr-2">$</span>
                        <Input id="rental-rate" type="number" min="0" step="0.01" />
                        <span className="ml-2">per day</span>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save Equipment</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">
                      <FileText className="mr-2 h-4 w-4" /> Generate Report
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Generate an equipment inventory report</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex flex-1 items-center">
              <Input
                placeholder="Search by ID or serial number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-[300px]"
              />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Equipment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="scuba tank">Scuba Tanks</SelectItem>
                  <SelectItem value="bcd">BCDs</SelectItem>
                  <SelectItem value="regulator">Regulators</SelectItem>
                  <SelectItem value="wetsuit">Wetsuits</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="in-use">In Use</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Rental Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Rental Info</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.serialNumber}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>{item.rentalRate}/day</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "available"
                            ? "default"
                            : item.status === "in-use"
                              ? "secondary"
                              : item.status === "rented"
                                ? "outline"
                                : "outline"
                        }
                        className={
                          item.status === "maintenance"
                            ? "border-amber-500 text-amber-500"
                            : item.status === "rented"
                              ? "border-primary text-primary"
                              : ""
                        }
                      >
                        {item.status === "in-use"
                          ? "In Use"
                          : item.status === "available"
                            ? "Available"
                            : item.status === "rented"
                              ? "Rented"
                              : "Maintenance"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          item.condition === "excellent"
                            ? "border-green-500 text-green-500"
                            : item.condition === "good"
                              ? "border-blue-500 text-blue-500"
                              : item.condition === "fair"
                                ? "border-amber-500 text-amber-500"
                                : "border-red-500 text-red-500"
                        }
                      >
                        {item.condition}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.status === "rented" ? (
                        <div className="text-xs">
                          <div>To: {item.rentedTo}</div>
                          <div>Until: {item.rentedUntil}</div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {item.status === "available" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 text-xs"
                            onClick={() => handleRentEquipment(item)}
                          >
                            <DollarSign className="mr-1 h-3 w-3" /> Rent
                          </Button>
                        )}
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
                              <History className="mr-2 h-4 w-4" /> Maintenance History
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {item.status === "rented" && (
                              <DropdownMenuItem>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Mark as Returned
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" /> Mark for Maintenance
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash className="mr-2 h-4 w-4" /> Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Rental Sheet */}
      <Sheet open={!!selectedEquipment} onOpenChange={(open) => !open && setSelectedEquipment(null)}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Rent Equipment</SheetTitle>
            <SheetDescription>Complete the form to rent out equipment to a customer.</SheetDescription>
          </SheetHeader>
          {selectedEquipment && (
            <div className="py-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <h3 className="text-sm font-medium">Equipment Details</h3>
                  <div className="rounded-md border p-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">ID:</div>
                      <div>{selectedEquipment.id}</div>
                      <div className="font-medium">Type:</div>
                      <div>{selectedEquipment.type}</div>
                      <div className="font-medium">Size:</div>
                      <div>{selectedEquipment.size}</div>
                      <div className="font-medium">Rental Rate:</div>
                      <div>{selectedEquipment.rentalRate}/day</div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={customer.avatar} alt={customer.name} />
                              <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {customer.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="duration">Rental Duration (days)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={rentalDuration}
                      onChange={(e) => setRentalDuration(e.target.value)}
                    />
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">days</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Any special instructions or notes..." />
                </div>

                <Separator />

                <div className="rounded-md border p-3 bg-muted/50">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Total Rental Cost:</div>
                    <div className="text-lg font-bold">{calculateRentalTotal()}</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {selectedEquipment.rentalRate} × {rentalDuration} day
                    {Number.parseInt(rentalDuration) !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            </div>
          )}
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button disabled={!selectedCustomer || Number.parseInt(rentalDuration) < 1}>Complete Rental</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}

