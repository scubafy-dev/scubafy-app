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
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
}

interface Equipment {
  id: string
  type: string
  sku: string
  make: string
  model: string
  serialNumber: string
  size: string
  location: string
  lastInspection: string
  nextInspection: string
  quantity: number
  minQuantity: number
  itemValue: string
  status: "available" | "in-use" | "maintenance" | "rented"
  condition: "excellent" | "good" | "fair" | "poor"
  rentalRate: string
  rentalRateValue: number
  rentalTimeframe: string
  rentedTo?: string
  rentedUntil?: string
  trackUsage: boolean
  usageCount?: number
  usageLimit?: number
  needsMaintenance?: boolean
}

export function EquipmentInventory() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [rentalDuration, setRentalDuration] = useState("1")
  const [selectedCustomer, setSelectedCustomer] = useState("")

  const equipment: Equipment[] = [
    {
      id: "EQ-1001",
      type: "Scuba Tank",
      sku: "TANK-80-001",
      make: "ScubaPro",
      model: "S80",
      serialNumber: "ST-12345",
      size: "80 cu ft",
      location: "Main Storage Room A3",
      lastInspection: "2025-01-15",
      nextInspection: "2025-07-15",
      quantity: 5,
      minQuantity: 2,
      itemValue: "$450.00",
      status: "available",
      condition: "good",
      rentalRate: "$15.00",
      rentalRateValue: 15,
      rentalTimeframe: "per dive",
      trackUsage: true,
      usageCount: 56,
      usageLimit: 100,
      needsMaintenance: false,
    },
    {
      id: "EQ-1002",
      type: "Scuba Tank",
      sku: "TANK-80-002",
      make: "ScubaPro",
      model: "S80",
      serialNumber: "ST-12346",
      size: "80 cu ft",
      location: "Main Storage Room A3",
      lastInspection: "2025-01-15",
      nextInspection: "2025-07-15",
      quantity: 3,
      minQuantity: 2,
      itemValue: "$450.00",
      status: "in-use",
      condition: "good",
      rentalRate: "$15.00",
      rentalRateValue: 15,
      rentalTimeframe: "per dive",
      trackUsage: true,
      usageCount: 78,
      usageLimit: 100,
      needsMaintenance: false,
    },
    {
      id: "EQ-1003",
      type: "Scuba Tank",
      sku: "TANK-63-001",
      make: "Faber",
      model: "F63",
      serialNumber: "ST-12347",
      size: "63 cu ft",
      location: "Main Storage Room A4",
      lastInspection: "2025-01-20",
      nextInspection: "2025-07-20",
      quantity: 2,
      minQuantity: 1,
      itemValue: "$380.00",
      status: "maintenance",
      condition: "fair",
      rentalRate: "$12.00",
      rentalRateValue: 12,
      rentalTimeframe: "per dive",
      trackUsage: true,
      usageCount: 105,
      usageLimit: 100,
      needsMaintenance: true,
    },
    {
      id: "EQ-1004",
      type: "BCD",
      sku: "BCD-MED-001",
      make: "Aqua Lung",
      model: "Wave",
      serialNumber: "BCD-5001",
      size: "Medium",
      location: "Main Storage Room B2",
      lastInspection: "2025-02-10",
      nextInspection: "2025-08-10",
      quantity: 4,
      minQuantity: 2,
      itemValue: "$320.00",
      status: "available",
      condition: "excellent",
      rentalRate: "$20.00",
      rentalRateValue: 20,
      rentalTimeframe: "per dive",
      trackUsage: false,
      needsMaintenance: false,
    },
    {
      id: "EQ-1005",
      type: "BCD",
      sku: "BCD-LRG-001",
      make: "Aqua Lung",
      model: "Wave",
      serialNumber: "BCD-5002",
      size: "Large",
      location: "Main Storage Room B2",
      lastInspection: "2025-02-10",
      nextInspection: "2025-08-10",
      quantity: 3,
      minQuantity: 2,
      itemValue: "$320.00",
      status: "rented",
      condition: "good",
      rentalRate: "$20.00",
      rentalRateValue: 20,
      rentalTimeframe: "per dive",
      rentedTo: "John Smith",
      rentedUntil: "2025-03-28",
      trackUsage: true,
      usageCount: 45,
      usageLimit: 50,
      needsMaintenance: false,
    },
    {
      id: "EQ-1006",
      type: "Regulator",
      sku: "REG-PRO-001",
      make: "Mares",
      model: "Prestige",
      serialNumber: "REG-3001",
      size: "N/A",
      location: "Main Storage Room C1",
      lastInspection: "2025-03-01",
      nextInspection: "2025-09-01",
      quantity: 6,
      minQuantity: 3,
      itemValue: "$550.00",
      status: "available",
      condition: "good",
      rentalRate: "$25.00",
      rentalRateValue: 25,
      rentalTimeframe: "per dive",
      trackUsage: false,
      needsMaintenance: false,
    },
    {
      id: "EQ-1007",
      type: "Wetsuit",
      sku: "WS-MED-001",
      make: "O'Neill",
      model: "Reactor",
      serialNumber: "WS-2001",
      size: "Medium",
      location: "Gear Room A1",
      lastInspection: "2025-02-15",
      nextInspection: "2025-08-15",
      quantity: 2,
      minQuantity: 1,
      itemValue: "$180.00",
      status: "maintenance",
      condition: "poor",
      rentalRate: "$18.00",
      rentalRateValue: 18,
      rentalTimeframe: "per dive",
      trackUsage: true,
      usageCount: 98,
      usageLimit: 90,
      needsMaintenance: true,
    },
    {
      id: "EQ-1008",
      type: "Wetsuit",
      sku: "WS-LRG-001",
      make: "O'Neill",
      model: "Reactor",
      serialNumber: "WS-2002",
      size: "Large",
      location: "Gear Room A1",
      lastInspection: "2025-02-15",
      nextInspection: "2025-08-15",
      quantity: 1,
      minQuantity: 1,
      itemValue: "$180.00",
      status: "rented",
      condition: "fair",
      rentalRate: "$18.00",
      rentalRateValue: 18,
      rentalTimeframe: "per dive",
      rentedTo: "Sarah Johnson",
      rentedUntil: "2025-03-30",
      trackUsage: true,
      usageCount: 86,
      usageLimit: 90,
      needsMaintenance: false,
    },
  ]

  const customers: Customer[] = [
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

  const filteredEquipment = equipment?.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || item.type.toLowerCase().includes(typeFilter.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  }) || []

  // Calculate equipment statistics
  const totalEquipment = equipment?.length || 0
  const availableEquipment = equipment?.filter((item) => item.status === "available").length || 0
  const inUseEquipment = equipment?.filter((item) => item.status === "in-use").length || 0
  const maintenanceEquipment = equipment?.filter((item) => item.status === "maintenance").length || 0
  const rentedEquipment = equipment?.filter((item) => item.status === "rented").length || 0

  // Handle equipment rental
  const handleRentEquipment = (item: Equipment) => {
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

  // Increment usage count
  const handleIncrementUsage = (item: Equipment) => {
    // Skip if usage tracking is disabled
    if (!item.trackUsage) return;

    // In a real app, this would update the database
    // For demo purposes, we'll just update the local state
    if (item.usageCount !== undefined) {
      item.usageCount += 1;
    } else {
      item.usageCount = 1;
    }
    
    // Check if the equipment now needs maintenance
    if (item.usageCount && item.usageLimit && item.usageCount >= item.usageLimit) {
      item.needsMaintenance = true;
      alert(`${item.type} ${item.make} ${item.model} has reached its usage limit and needs maintenance!`);
    } else if (item.usageCount && item.usageLimit && item.usageCount >= item.usageLimit * 0.9 && !item.needsMaintenance) {
      alert(`${item.type} ${item.make} ${item.model} is approaching its usage limit (${item.usageCount}/${item.usageLimit})`);
    }
    
    // Force a re-render
    setSearchTerm(searchTerm);
  }

  // Mark equipment as maintained
  const handleMarkAsMaintained = (item: Equipment) => {
    // Skip if usage tracking is disabled
    if (!item.trackUsage) return;

    // In a real app, this would update the database
    // For demo purposes, we'll just update the local state
    item.usageCount = 0;
    item.needsMaintenance = false;
    
    // If the item is in maintenance status, make it available
    if (item.status === "maintenance") {
      item.status = "available";
    }
    
    // Show confirmation
    alert(`${item.type} ${item.make} ${item.model} has been marked as maintained. Usage count reset to 0.`);
    
    // Force a re-render
    setSearchTerm(searchTerm);
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
        <Card className="cursor-pointer hover:border-green-500 transition-colors" 
              onClick={() => router.push("/equipment/available")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableEquipment}</div>
            <Progress value={(availableEquipment / totalEquipment) * 100} className="h-2 mt-2 text-green-500" />
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-blue-500 transition-colors" 
              onClick={() => router.push("/equipment/in-use")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Use</CardTitle>
            <History className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inUseEquipment}</div>
            <Progress value={(inUseEquipment / totalEquipment) * 100} className="h-2 mt-2 text-blue-500" />
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary transition-colors" 
              onClick={() => router.push("/equipment/rented")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rented</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rentedEquipment}</div>
            <Progress value={(rentedEquipment / totalEquipment) * 100} className="h-2 mt-2 text-primary" />
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-amber-500 transition-colors" 
              onClick={() => router.push("/equipment/maintenance")}>
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
            <div className="invisible" aria-hidden="true">
              <CardTitle>Equipment Inventory</CardTitle>
              <CardDescription>Manage all your dive equipment.</CardDescription>
            </div>
            <div className="flex gap-2 ml-auto">
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
                placeholder="Search by ID, SKU or serial number..."
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
                  <TableHead>SKU</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Make/Model</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Rental Rate</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Rental Info</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.make} {item.model}</TableCell>
                    <TableCell>{item.serialNumber}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{item.quantity}</span>
                        {item.quantity <= item.minQuantity && (
                          <span className="text-xs text-red-500">Low stock!</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{item.rentalRate}/{item.rentalTimeframe}</TableCell>
                    <TableCell>
                      {item.trackUsage ? (
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className={item.usageCount && item.usageLimit && item.usageCount >= item.usageLimit ? "font-medium text-amber-500" : ""}>
                              {item.usageCount}/{item.usageLimit}
                            </span>
                            {item.usageCount && item.usageLimit && item.usageCount >= item.usageLimit && (
                              <AlertTriangle className="h-3 w-3 text-amber-500" />
                            )}
                          </div>
                          {item.usageCount !== undefined && item.usageLimit !== undefined && (
                            <Progress 
                              value={(item.usageCount / item.usageLimit) * 100} 
                              className={`h-1 mt-1 ${
                                item.usageCount >= item.usageLimit 
                                  ? "text-amber-500" 
                                  : item.usageCount >= item.usageLimit * 0.8 
                                    ? "text-orange-400" 
                                    : ""
                              }`}
                            />
                          )}
                          {item.needsMaintenance && (
                            <span className="text-xs text-amber-500 mt-1">Needs maintenance</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not tracked</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.status === "rented" ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="/placeholder.svg?height=24&width=24" />
                            <AvatarFallback>{item.rentedTo?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{item.rentedTo}</div>
                            <div className="text-xs text-muted-foreground">Until {item.rentedUntil}</div>
                          </div>
                        </div>
                      ) : (
                        <Badge
                          variant="outline"
                          className={cn(
                            "capitalize",
                            item.status === "available" && "border-green-500 text-green-500",
                            item.status === "in-use" && "border-blue-500 text-blue-500",
                            item.status === "maintenance" && "border-amber-500 text-amber-500"
                          )}
                        >
                          {item.status}
                        </Badge>
                      )}
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
                    <TableCell>{item.location}</TableCell>
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
                            {item.status === "available" && item.trackUsage && (
                              <DropdownMenuItem onClick={() => handleIncrementUsage(item)}>
                                <Plus className="mr-2 h-4 w-4 text-blue-500" /> Record Usage
                              </DropdownMenuItem>
                            )}
                            {item.status === "rented" && (
                              <DropdownMenuItem>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Mark as Returned
                              </DropdownMenuItem>
                            )}
                            {item.trackUsage && item.needsMaintenance && (
                              <DropdownMenuItem onClick={() => handleMarkAsMaintained(item)}>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Mark as Maintained
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
                      <div className="font-medium">SKU:</div>
                      <div>{selectedEquipment.sku}</div>
                      <div className="font-medium">Type:</div>
                      <div>{selectedEquipment.type}</div>
                      <div className="font-medium">Make/Model:</div>
                      <div>{selectedEquipment.make} {selectedEquipment.model}</div>
                      <div className="font-medium">Size:</div>
                      <div>{selectedEquipment.size}</div>
                      <div className="font-medium">Rental Rate:</div>
                      <div>{selectedEquipment.rentalRate}/{selectedEquipment.rentalTimeframe}</div>
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

