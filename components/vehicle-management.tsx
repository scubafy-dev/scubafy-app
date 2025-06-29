"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Image as ImageIcon, Anchor, Car, Ship, MoreHorizontal, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useDiveCenter } from "@/lib/dive-center-context"
import { useToast } from "@/hooks/use-toast"
import {
  createFleetVehicle,
  updateFleetVehicle,
  deleteFleetVehicle,
  getAllFleetVehicles,
  type FleetVehicle,
  type VehicleFormData
} from "@/lib/vehicles"
import { getAllStaff } from "@/lib/staffs"
import { Staff } from "@/app/generated/prisma"

// Types for the vehicle management
interface StaffMember {
  id: string
  name: string
  position: string
  imageUrl?: string
  role?: string // Add optional role field for assignment
}

interface Vehicle {
  id: string
  name: string
  type: "boat" | "speedboat" | "liveaboard" | "car" // Fixed type to be more specific
  size: string // e.g., length for boats, passenger capacity for cars
  capacity: number
  crew: StaffMember[]
  imageUrl?: string
  description?: string
  maintenanceSchedule?: string
  insuranceInfo?: string
  registrationNumber?: string
}

// Sample staff members for demo purposes
const SAMPLE_STAFF: StaffMember[] = [
  { id: "s1", name: "James Wilson", position: "Captain", imageUrl: "/avatars/james.jpg" },
  { id: "s2", name: "Sarah Miller", position: "Dive Instructor", imageUrl: "/avatars/sarah.jpg" },
  { id: "s3", name: "Michael Brown", position: "Boat Engineer", imageUrl: "/avatars/michael.jpg" },
  { id: "s4", name: "Emma Davis", position: "Dive Guide", imageUrl: "/avatars/emma.jpg" },
  { id: "s5", name: "Robert Johnson", position: "Assistant", imageUrl: "/avatars/robert.jpg" },
]

export function VehicleManagement() {
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false)
  const [isEditVehicleOpen, setIsEditVehicleOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  const [formData, setFormData] = useState<VehicleFormData>({
    name: "",
    type: "boat" as const, // Fix the type
    size: "",
    capacity: 0,
    description: "",
    registrationNumber: "",
    insuranceInfo: "",
    imageUrl: "",
    crewAssignments: []
  })

  const [selectedCrew, setSelectedCrew] = useState<string[]>([])
  const [crewRoles, setCrewRoles] = useState<{ [key: string]: string }>({})
  const [vehicleImage, setVehicleImage] = useState<File | null>(null)
  const [currentBlobUrl, setCurrentBlobUrl] = useState<string | null>(null)
  const [imageInputMethod, setImageInputMethod] = useState<'file' | 'url'>('file')
  const [isSaving, setIsSaving] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const { currentCenter } = useDiveCenter()
  const { toast } = useToast()

  console.log('currentCenterid', currentCenter)

  // Cleanup blob URLs when component unmounts or vehicleImage changes
  useEffect(() => {
    return () => {
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl)
      }
    }
  }, [currentBlobUrl])

  // Fetch vehicles and staff on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        if (currentCenter?.id) {
          const [vehiclesData, staffData] = await Promise.all([
            getAllFleetVehicles(currentCenter.id),
            getAllStaff()
          ])
          console.log('vehiclesData', vehiclesData)
          setVehicles(vehiclesData)
          setStaff(staffData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load vehicles and staff data",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [currentCenter?.id, toast])

  // Filter vehicles based on active tab
  const filteredVehicles = activeTab === "all"
    ? vehicles
    : vehicles.filter(vehicle => vehicle.type === activeTab)
  console.log('filteredVehicles', filteredVehicles)

  const handleAddVehicle = () => {
    setFormData({
      name: "",
      type: "boat" as const,
      size: "",
      capacity: 0,
      description: "",
      registrationNumber: "",
      insuranceInfo: "",
      imageUrl: "",
      crewAssignments: []
    })
    setSelectedCrew([])
    setCrewRoles({})
    setVehicleImage(null)
    if (currentBlobUrl) {
      URL.revokeObjectURL(currentBlobUrl)
      setCurrentBlobUrl(null)
    }
    setImageInputMethod('file')
    setIsAddVehicleOpen(true)
  }

  const handleEditVehicle = (vehicle: FleetVehicle) => {
    setSelectedVehicle(vehicle)
    setFormData({
      name: vehicle.name,
      type: vehicle.type,
      size: vehicle.size,
      capacity: vehicle.capacity,
      description: vehicle.description || "",
      registrationNumber: vehicle.registrationNumber || "",
      insuranceInfo: vehicle.insuranceInfo || "",
      imageUrl: vehicle.imageUrl || "",
      crewAssignments: vehicle.crewAssignments.map(ca => ({
        staffId: ca.staffId,
        role: ca.role || undefined
      }))
    })

    // Extract existing crew IDs and their roles
    const crewIds = vehicle.crewAssignments.map(ca => ca.staffId)
    const roles: { [key: string]: string } = {}
    vehicle.crewAssignments.forEach(ca => {
      if (ca.role) {
        roles[ca.staffId] = ca.role
      }
    })

    setSelectedCrew(crewIds)
    setCrewRoles(roles)
    setVehicleImage(null)
    // Clean up any existing blob URL
    if (currentBlobUrl) {
      URL.revokeObjectURL(currentBlobUrl)
      setCurrentBlobUrl(null)
    }
    // Set image input method based on existing image
    setImageInputMethod(vehicle.imageUrl && !vehicle.imageUrl.startsWith('blob:') ? 'url' : 'file')
    setIsEditVehicleOpen(true)
  }

  const handleDeleteVehicle = async (id: string) => {
    try {
      await deleteFleetVehicle(id)
      setVehicles(vehicles.filter(vehicle => vehicle.id !== id))
      toast({
        title: "Success",
        description: "Vehicle deleted successfully"
      })
    } catch (error) {
      console.error("Error deleting vehicle:", error)
      toast({
        title: "Error",
        description: "Failed to delete vehicle",
        variant: "destructive"
      })
    }
  }

  const handleSaveVehicle = async () => {
    try {
      setIsSaving(true)
      // Prepare crew assignments
      const crewAssignments = selectedCrew.map(staffId => ({
        staffId,
        role: crewRoles[staffId] || undefined
      }))

      const vehicleData: VehicleFormData = {
        ...formData,
        crewAssignments
      }

      if (currentCenter?.id) {
        // Add new vehicle
        const newVehicle = await createFleetVehicle(vehicleData, currentCenter.id)
        setVehicles([newVehicle, ...vehicles])
        setIsAddVehicleOpen(false)
        toast({
          title: "Success",
          description: "Vehicle created successfully"
        })
      }
    } catch (error) {
      console.error("Error saving vehicle:", error)
      toast({
        title: "Error",
        description: "Failed to save vehicle",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }


  const handleUpdateVehicle = async () => {
    try {
      setIsUpdating(true)
      // Prepare crew assignments
      const crewAssignments = selectedCrew.map(staffId => ({
        staffId,
        role: crewRoles[staffId] || undefined
      }))

      const vehicleData: VehicleFormData = {
        ...formData,
        crewAssignments
      }

      if (selectedVehicle) {
        // Edit existing vehicle
        const updatedVehicle = await updateFleetVehicle(selectedVehicle.id, vehicleData)
        setVehicles(vehicles.map(v => v.id === selectedVehicle.id ? updatedVehicle : v))
        setIsEditVehicleOpen(false)
        toast({
          title: "Success",
          description: "Vehicle updated successfully"
        })
      }
    } catch (error) {
      console.error("Error updating vehicle:", error)
      toast({
        title: "Error",
        description: "Failed to update vehicle",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setVehicleImage(file)

      // Revoke previous blob URL if it exists
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl)
      }

      // Create new blob URL
      const newBlobUrl = URL.createObjectURL(file)
      setCurrentBlobUrl(newBlobUrl)
      setFormData(prev => ({ ...prev, imageUrl: newBlobUrl }))
    }
  }

  // Helper function to get the correct image URL
  const getVehicleImageUrl = (vehicle: FleetVehicle) => {
    // If there's a selected image file, use the blob URL
    if (vehicleImage && currentBlobUrl) {
      return currentBlobUrl
    }

    // If vehicle has an imageUrl and it's not a blob URL, use it
    if (vehicle.imageUrl && !vehicle.imageUrl.startsWith('blob:')) {
      return vehicle.imageUrl
    }

    // Fallback to default images based on vehicle type
    switch (vehicle.type) {
      case "liveaboard":
        return "https://www.liveaboard.com/images/cruises/boat/aqua-cat-01.jpg"
      case "boat":
        return "https://boholfundivers.com/wp-content/uploads/2013/09/Our-Dive-Boats-01.jpg"
      case "speedboat":
        return "https://boholfundivers.com/wp-content/uploads/2013/09/Our-Dive-Boats-04.jpg"
      case "car":
        return "https://boholfundivers.com/wp-content/uploads/2013/09/Our-Dive-Boats-03.jpg"
      default:
        return "https://boholfundivers.com/wp-content/uploads/2013/09/Our-Dive-Boats-01.jpg"
    }
  }

  const getVehicleTypeIcon = (type: string) => {
    switch (type) {
      case "boat": return <Anchor className="h-4 w-4" />
      case "speedboat": return <Anchor className="h-4 w-4" />
      case "car": return <Car className="h-4 w-4" />
      case "liveaboard": return <Ship className="h-4 w-4" />
      default: return <Anchor className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">Vehicle Management</h2>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" /> Add Vehicle
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-100 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="h-40 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-100 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Vehicle Management</h2>
        <Button onClick={handleAddVehicle}>
          <Plus className="mr-2 h-4 w-4" /> Add Vehicle
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Vehicles</TabsTrigger>
          <TabsTrigger value="boat">Boats</TabsTrigger>
          <TabsTrigger value="liveaboard">Liveaboards</TabsTrigger>
          <TabsTrigger value="car">Cars</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVehicles.map((vehicle) => (
              <Card key={vehicle.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getVehicleTypeIcon(vehicle.type)}
                        {vehicle.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Badge variant="outline">{vehicle.type}</Badge>
                        <span className="text-xs">{vehicle.size}</span>
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditVehicle(vehicle)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteVehicle(vehicle.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-0 space-y-3">
                  <div className="w-full h-40 rounded-md overflow-hidden">
                    <img
                      src={getVehicleImageUrl(vehicle)}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span>{vehicle.capacity} people</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Crew:</span>
                      <span>{vehicle.crewAssignments.length} assigned</span>
                    </div>
                    {vehicle.registrationNumber && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reg #:</span>
                        <span>{vehicle.registrationNumber}</span>
                      </div>
                    )}
                  </div>

                  {vehicle.crewAssignments.length > 0 && (
                    <div className="pt-2 border-t">
                      <h4 className="text-xs font-semibold mb-2">Assigned Crew</h4>
                      <div className="space-y-2">
                        {vehicle.crewAssignments.slice(0, 3).map((ca) => (
                          <div key={ca.staffId} className="flex justify-between items-center text-xs">
                            <span>{ca.staff.fullName}</span>
                            <Badge variant="outline" className="text-xs">{ca.role || ca.staff.roleTitle}</Badge>
                          </div>
                        ))}
                        {vehicle.crewAssignments.length > 3 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{vehicle.crewAssignments.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="boat" className="space-y-4">
          {/* Content for boats tab - uses same grid with filtered data */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVehicles.map((vehicle) => (
              <Card key={vehicle.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getVehicleTypeIcon(vehicle.type)}
                        {vehicle.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Badge variant="outline">{vehicle.type}</Badge>
                        <span className="text-xs">{vehicle.size}</span>
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditVehicle(vehicle)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteVehicle(vehicle.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-0 space-y-3">
                  <div className="w-full h-40 rounded-md overflow-hidden">
                    <img
                      src={getVehicleImageUrl(vehicle)}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span>{vehicle.capacity} people</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Crew:</span>
                      <span>{vehicle.crewAssignments.length} assigned</span>
                    </div>
                    {vehicle.registrationNumber && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reg #:</span>
                        <span>{vehicle.registrationNumber}</span>
                      </div>
                    )}
                  </div>

                  {vehicle.crewAssignments.length > 0 && (
                    <div className="pt-2 border-t">
                      <h4 className="text-xs font-semibold mb-2">Assigned Crew</h4>
                      <div className="space-y-2">
                        {vehicle.crewAssignments.slice(0, 3).map((ca) => (
                          <div key={ca.staffId} className="flex justify-between items-center text-xs">
                            <span>{ca.staff.fullName}</span>
                            <Badge variant="outline" className="text-xs">{ca.role || ca.staff.roleTitle}</Badge>
                          </div>
                        ))}
                        {vehicle.crewAssignments.length > 3 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{vehicle.crewAssignments.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="liveaboard" className="space-y-4">
          {/* Content for liveaboards tab - uses same grid with filtered data */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVehicles.map((vehicle) => (
              <Card key={vehicle.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getVehicleTypeIcon(vehicle.type)}
                        {vehicle.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Badge variant="outline">{vehicle.type}</Badge>
                        <span className="text-xs">{vehicle.size}</span>
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditVehicle(vehicle)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteVehicle(vehicle.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-0 space-y-3">
                  <div className="w-full h-40 rounded-md overflow-hidden">
                    <img
                      src={getVehicleImageUrl(vehicle)}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span>{vehicle.capacity} people</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Crew:</span>
                      <span>{vehicle.crewAssignments.length} assigned</span>
                    </div>
                    {vehicle.registrationNumber && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reg #:</span>
                        <span>{vehicle.registrationNumber}</span>
                      </div>
                    )}
                  </div>

                  {vehicle.crewAssignments.length > 0 && (
                    <div className="pt-2 border-t">
                      <h4 className="text-xs font-semibold mb-2">Assigned Crew</h4>
                      <div className="space-y-2">
                        {vehicle.crewAssignments.slice(0, 3).map((ca) => (
                          <div key={ca.staffId} className="flex justify-between items-center text-xs">
                            <span>{ca.staff.fullName}</span>
                            <Badge variant="outline" className="text-xs">{ca.role || ca.staff.roleTitle}</Badge>
                          </div>
                        ))}
                        {vehicle.crewAssignments.length > 3 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{vehicle.crewAssignments.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="car" className="space-y-4">
          {/* Content for cars tab - uses same grid with filtered data */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVehicles.map((vehicle) => (
              <Card key={vehicle.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getVehicleTypeIcon(vehicle.type)}
                        {vehicle.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Badge variant="outline">{vehicle.type}</Badge>
                        <span className="text-xs">{vehicle.size}</span>
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditVehicle(vehicle)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteVehicle(vehicle.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-0 space-y-3">
                  <div className="w-full h-40 rounded-md overflow-hidden">
                    <img
                      src={getVehicleImageUrl(vehicle)}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span>{vehicle.capacity} people</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Crew:</span>
                      <span>{vehicle.crewAssignments.length} assigned</span>
                    </div>
                    {vehicle.registrationNumber && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reg #:</span>
                        <span>{vehicle.registrationNumber}</span>
                      </div>
                    )}
                  </div>

                  {vehicle.crewAssignments.length > 0 && (
                    <div className="pt-2 border-t">
                      <h4 className="text-xs font-semibold mb-2">Assigned Crew</h4>
                      <div className="space-y-2">
                        {vehicle.crewAssignments.slice(0, 3).map((ca) => (
                          <div key={ca.staffId} className="flex justify-between items-center text-xs">
                            <span>{ca.staff.fullName}</span>
                            <Badge variant="outline" className="text-xs">{ca.role || ca.staff.roleTitle}</Badge>
                          </div>
                        ))}
                        {vehicle.crewAssignments.length > 3 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{vehicle.crewAssignments.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Vehicle Dialog */}
      <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
        <DialogContent className="sm:max-w-[600px] h-[500px] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
            <DialogDescription>
              Add a new boat, car, or liveaboard to your fleet.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Vehicle Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter vehicle name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Vehicle Type</Label>
                <div className="grid grid-cols-1 gap-2">
                  <Select
                    value={formData.type}
                    onValueChange={(value: "boat" | "speedboat" | "liveaboard" | "car") => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boat">Boat</SelectItem>
                      <SelectItem value="speedboat">Speed Boat</SelectItem>
                      <SelectItem value="liveaboard">Liveaboard</SelectItem>
                      <SelectItem value="car">Car</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="size">Size/Dimensions</Label>
                <Input
                  id="size"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder="e.g., 42 ft or SUV"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Passenger Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  placeholder="Number of passengers"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  placeholder="Registration ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insuranceInfo">Insurance Information</Label>
                <Input
                  id="insuranceInfo"
                  value={formData.insuranceInfo}
                  onChange={(e) => setFormData({ ...formData, insuranceInfo: e.target.value })}
                  placeholder="Policy number or details"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the vehicle"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Crew Members</Label>
              <div className="space-y-4">
                <Select
                  onValueChange={(value) => {
                    if (!selectedCrew.includes(value) && value) {
                      setSelectedCrew([...selectedCrew, value])
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add crew member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staff.map((staffMember) => (
                      <SelectItem
                        key={staffMember.id}
                        value={staffMember.id}
                        disabled={selectedCrew.includes(staffMember.id)}
                      >
                        {staffMember.fullName} ({staffMember.roleTitle || 'Staff'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedCrew.length > 0 && (
                  <div className="rounded-md border p-2">
                    <h4 className="text-sm font-medium mb-2">Assigned Crew</h4>
                    {selectedCrew.map((staffId) => {
                      const staffMember = staff.find(s => s.id === staffId)
                      if (!staffMember) return null

                      return (
                        <div key={staffMember.id} className="flex items-center justify-between py-1 border-b last:border-0">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{staffMember.fullName}</div>
                            <div className="text-xs text-muted-foreground">({staffMember.roleTitle || 'Staff'})</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Role on vessel"
                              value={crewRoles[staffMember.id] || ''}
                              onChange={(e) => setCrewRoles({
                                ...crewRoles,
                                [staffMember.id]: e.target.value
                              })}
                              className="h-7 w-40 text-xs"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => setSelectedCrew(selectedCrew.filter(id => id !== staffMember.id))}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleImage">Vehicle Image</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Choose how you want to add an image for this vehicle
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="imageFile"
                      name="imageType"
                      value="file"
                      checked={imageInputMethod === 'file'}
                      onChange={() => {
                        setImageInputMethod('file')
                        setFormData(prev => ({ ...prev, imageUrl: '' }))
                        if (currentBlobUrl) {
                          URL.revokeObjectURL(currentBlobUrl)
                          setCurrentBlobUrl(null)
                        }
                        setVehicleImage(null)
                      }}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="imageFile" className="text-sm">Upload File</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="imageUrl"
                      name="imageType"
                      value="url"
                      checked={imageInputMethod === 'url'}
                      onChange={() => {
                        setImageInputMethod('url')
                        setVehicleImage(null)
                        if (currentBlobUrl) {
                          URL.revokeObjectURL(currentBlobUrl)
                          setCurrentBlobUrl(null)
                        }
                      }}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="imageUrl" className="text-sm">Image URL</Label>
                  </div>
                </div>

                {/* File Upload Option */}
                {imageInputMethod === 'file' && (
                  <div className="space-y-2">
                    <Input
                      id="vehicleImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                    {vehicleImage && currentBlobUrl && (
                      <div className="mt-2 relative w-full h-40 rounded-md overflow-hidden">
                        <img
                          src={currentBlobUrl}
                          alt="Selected vehicle image"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* URL Input Option */}
                {imageInputMethod === 'url' && (
                  <div className="space-y-2">
                    <Input
                      id="imageUrlInput"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    />
                    {formData.imageUrl && (
                      <div className="mt-2 relative w-full h-40 rounded-md overflow-hidden">
                        <img
                          src={formData.imageUrl}
                          alt="Vehicle image preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddVehicleOpen(false)} disabled={isSaving}>Cancel</Button>
            <Button onClick={handleSaveVehicle} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Vehicle'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Vehicle Dialog - uses the same structure as Add Vehicle Dialog */}
      <Dialog open={isEditVehicleOpen} onOpenChange={setIsEditVehicleOpen}>
        <DialogContent className="sm:max-w-[600px] h-[500px] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
            <DialogDescription>
              Update the details for this vehicle.
            </DialogDescription>
          </DialogHeader>

          {/* Same form fields as Add Vehicle Dialog */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Vehicle Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Vehicle Type</Label>
                <div className="grid grid-cols-1 gap-2">
                  <Select
                    value={formData.type}
                    onValueChange={(value: "boat" | "speedboat" | "liveaboard" | "car") => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger id="edit-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boat">Boat</SelectItem>
                      <SelectItem value="speedboat">Speed Boat</SelectItem>
                      <SelectItem value="liveaboard">Liveaboard</SelectItem>
                      <SelectItem value="car">Car</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-size">Size/Dimensions</Label>
                <Input
                  id="edit-size"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-capacity">Passenger Capacity</Label>
                <Input
                  id="edit-capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-registrationNumber">Registration Number</Label>
                <Input
                  id="edit-registrationNumber"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-insuranceInfo">Insurance Information</Label>
                <Input
                  id="edit-insuranceInfo"
                  value={formData.insuranceInfo}
                  onChange={(e) => setFormData({ ...formData, insuranceInfo: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Crew Members</Label>
              <div className="space-y-4">
                <Select
                  onValueChange={(value) => {
                    if (!selectedCrew.includes(value) && value) {
                      setSelectedCrew([...selectedCrew, value])
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add crew member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staff.map((staffMember) => (
                      <SelectItem
                        key={staffMember.id}
                        value={staffMember.id}
                        disabled={selectedCrew.includes(staffMember.id)}
                      >
                        {staffMember.fullName} ({staffMember.roleTitle || 'Staff'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedCrew.length > 0 && (
                  <div className="rounded-md border p-2">
                    <h4 className="text-sm font-medium mb-2">Assigned Crew</h4>
                    {selectedCrew.map((staffId) => {
                      const staffMember = staff.find(s => s.id === staffId)
                      if (!staffMember) return null

                      return (
                        <div key={staffMember.id} className="flex items-center justify-between py-1 border-b last:border-0">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{staffMember.fullName}</div>
                            <div className="text-xs text-muted-foreground">({staffMember.roleTitle || 'Staff'})</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Role on vessel"
                              value={crewRoles[staffMember.id] || ''}
                              onChange={(e) => setCrewRoles({
                                ...crewRoles,
                                [staffMember.id]: e.target.value
                              })}
                              className="h-7 w-40 text-xs"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => setSelectedCrew(selectedCrew.filter(id => id !== staffMember.id))}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-vehicleImage">Vehicle Image</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Choose how you want to add an image for this vehicle
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="imageFile"
                      name="imageType"
                      value="file"
                      checked={imageInputMethod === 'file'}
                      onChange={() => {
                        setImageInputMethod('file')
                        setFormData(prev => ({ ...prev, imageUrl: '' }))
                        if (currentBlobUrl) {
                          URL.revokeObjectURL(currentBlobUrl)
                          setCurrentBlobUrl(null)
                        }
                        setVehicleImage(null)
                      }}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="imageFile" className="text-sm">Upload File</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="imageUrl"
                      name="imageType"
                      value="url"
                      checked={imageInputMethod === 'url'}
                      onChange={() => {
                        setImageInputMethod('url')
                        setVehicleImage(null)
                        if (currentBlobUrl) {
                          URL.revokeObjectURL(currentBlobUrl)
                          setCurrentBlobUrl(null)
                        }
                      }}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="imageUrl" className="text-sm">Image URL</Label>
                  </div>
                </div>

                {/* File Upload Option */}
                {imageInputMethod === 'file' && (
                  <div className="space-y-2">
                    <Input
                      id="vehicleImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                    {vehicleImage && currentBlobUrl && (
                      <div className="mt-2 relative w-full h-40 rounded-md overflow-hidden">
                        <img
                          src={currentBlobUrl}
                          alt="Selected vehicle image"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* URL Input Option */}
                {imageInputMethod === 'url' && (
                  <div className="space-y-2">
                    <Input
                      id="imageUrlInput"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    />
                    {formData.imageUrl && (
                      <div className="mt-2 relative w-full h-40 rounded-md overflow-hidden">
                        <img
                          src={formData.imageUrl}
                          alt="Vehicle image preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditVehicleOpen(false)} disabled={isUpdating}>Cancel</Button>
            <Button onClick={handleUpdateVehicle} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Vehicle'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 