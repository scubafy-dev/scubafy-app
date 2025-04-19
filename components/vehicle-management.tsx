"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Image as ImageIcon, Anchor, Car, Ship, MoreHorizontal } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
  type: string // Changed from enum type to string to allow custom types
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
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "v1",
      name: "Sea Explorer",
      type: "boat",
      size: "42 ft",
      capacity: 12,
      crew: [SAMPLE_STAFF[0], SAMPLE_STAFF[1]],
      imageUrl: "https://boholfundivers.com/wp-content/uploads/2013/09/Our-Dive-Boats-01.jpg",
      description: "Spacious dive boat with shaded area and equipment storage",
      registrationNumber: "BT-2023-456",
      insuranceInfo: "Marine Insurance Co. #MA789456"
    },
    {
      id: "v2",
      name: "M/Y Gypsy",
      type: "liveaboard",
      size: "85 ft",
      capacity: 24,
      crew: [SAMPLE_STAFF[0], SAMPLE_STAFF[2], SAMPLE_STAFF[3]],
      imageUrl: "https://img.liveaboard.com/picture_library/boat/6320/DJI_0822.jpg?tr=w-857,h-570",
      description: "Comfortable liveaboard with 10 cabins, dining area, and dive deck",
      registrationNumber: "LB-2022-789",
      insuranceInfo: "Ocean Guard Insurance #LB220578"
    },
    {
      id: "v3",
      name: "Dive Transport",
      type: "car",
      size: "SUV",
      capacity: 7,
      crew: [SAMPLE_STAFF[4]],
      imageUrl: "https://boholfundivers.com/wp-content/uploads/2013/09/Our-Dive-Boats-03.jpg",
      description: "Transportation vehicle for divers and equipment",
      registrationNumber: "CT-2023-123",
      insuranceInfo: "Auto Insurance Co. #AU675432"
    }
  ])

  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false)
  const [isEditVehicleOpen, setIsEditVehicleOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    size: "",
    capacity: "",
    description: "",
    registrationNumber: "",
    insuranceInfo: "",
    customType: ""
  })
  
  const [selectedCrew, setSelectedCrew] = useState<string[]>([])
  const [crewRoles, setCrewRoles] = useState<{[key: string]: string}>({})
  const [vehicleImage, setVehicleImage] = useState<File | null>(null)

  // Filter vehicles based on active tab
  const filteredVehicles = activeTab === "all" 
    ? vehicles 
    : vehicles.filter(vehicle => vehicle.type === activeTab)

  const handleAddVehicle = () => {
    setFormData({
      name: "",
      type: "",
      size: "",
      capacity: "",
      description: "",
      registrationNumber: "",
      insuranceInfo: "",
      customType: ""
    })
    setSelectedCrew([])
    setCrewRoles({})
    setVehicleImage(null)
    setIsAddVehicleOpen(true)
  }

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setFormData({
      name: vehicle.name,
      type: vehicle.type,
      size: vehicle.size,
      capacity: vehicle.capacity.toString(),
      description: vehicle.description || "",
      registrationNumber: vehicle.registrationNumber || "",
      insuranceInfo: vehicle.insuranceInfo || "",
      customType: ""
    })
    
    // Extract existing crew IDs and their roles
    const crewIds = vehicle.crew.map(member => member.id)
    const roles: {[key: string]: string} = {}
    vehicle.crew.forEach(member => {
      if (member.role) {
        roles[member.id] = member.role
      }
    })
    
    setSelectedCrew(crewIds)
    setCrewRoles(roles)
    setVehicleImage(null)
    setIsEditVehicleOpen(true)
  }

  const handleDeleteVehicle = (id: string) => {
    setVehicles(vehicles.filter(vehicle => vehicle.id !== id))
  }

  const handleSaveVehicle = () => {
    // Create crew members with assigned roles
    const crewMembers = SAMPLE_STAFF
      .filter(staff => selectedCrew.includes(staff.id))
      .map(staff => ({
        ...staff,
        role: crewRoles[staff.id] || staff.position // Use assigned role or default to position
      }))
    
    // For the demo, we're just assigning a random image URL
    const vehicleImageUrl = vehicleImage 
      ? URL.createObjectURL(vehicleImage)
      : getDefaultImageForType(formData.type)
    
    // Handle custom type
    const finalType = formData.type === "custom" && formData.customType 
      ? formData.customType 
      : formData.type
    
    const newVehicle: Vehicle = {
      id: selectedVehicle ? selectedVehicle.id : `v${Date.now()}`,
      name: formData.name,
      type: finalType,
      size: formData.size,
      capacity: parseInt(formData.capacity) || 0,
      crew: crewMembers,
      imageUrl: vehicleImageUrl,
      description: formData.description,
      registrationNumber: formData.registrationNumber,
      insuranceInfo: formData.insuranceInfo
    }

    if (selectedVehicle) {
      // Edit existing vehicle
      setVehicles(vehicles.map(v => v.id === selectedVehicle.id ? newVehicle : v))
      setIsEditVehicleOpen(false)
    } else {
      // Add new vehicle
      setVehicles([...vehicles, newVehicle])
      setIsAddVehicleOpen(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVehicleImage(e.target.files[0])
    }
  }

  const getDefaultImageForType = (type: string) => {
    switch (type) {
      case "boat": return "https://stock.adobe.com/images/a-small-scuba-diving-boat-anchored-at-the-drop-off-edge-of-a-tropical-coral-reef-in-bunaken-national-park/462528421"
      case "speedboat": return "https://stock.adobe.com/images/stunning-aerial-footage-of-a-high-speed-dive-boat-cruising-through-the-pristine-blue-waters-of-alor-indonesia-captured-from-a-drone-following-from-behind-and-slightly-to-the-side-the-shot-highlight/530756518"
      case "car": return "https://stock.adobe.com/images/dive-transport/538125820"
      case "liveaboard": return "https://www.liveaboard.com/images/cruises/boat/aqua-cat-thumb.jpg"
      default: return "/vehicles/default.jpg"
    }
  }

  const getVehicleTypeIcon = (type: string) => {
    switch (type) {
      case "boat": return <Anchor className="h-4 w-4" />
      case "speedboat": return <Anchor className="h-4 w-4" />
      case "car": return <Car className="h-4 w-4" />
      case "liveaboard": return <Ship className="h-4 w-4" />
      default: return <Anchor className="h-4 w-4" /> // Default to anchor icon
    }
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
                  {vehicle.imageUrl && (
                    <div className="w-full h-40 rounded-md overflow-hidden">
                      <img 
                        src={vehicle.name === "M/Y Gypsy" 
                          ? "https://img.liveaboard.com/picture_library/boat/6320/DJI_0822.jpg?tr=w-857,h-570"
                          : vehicle.type === "boat" ? "https://boholfundivers.com/wp-content/uploads/2013/09/Our-Dive-Boats-01.jpg" 
                          : vehicle.type === "car" ? "https://boholfundivers.com/wp-content/uploads/2013/09/Our-Dive-Boats-03.jpg" 
                          : vehicle.type === "speedboat" ? "https://boholfundivers.com/wp-content/uploads/2013/09/Our-Dive-Boats-04.jpg" 
                          : vehicle.type === "liveaboard" ? "https://www.liveaboard.com/images/cruises/boat/aqua-cat-01.jpg" 
                          : vehicle.imageUrl}
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span>{vehicle.capacity} people</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Crew:</span>
                      <span>{vehicle.crew.length} assigned</span>
                    </div>
                    {vehicle.registrationNumber && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reg #:</span>
                        <span>{vehicle.registrationNumber}</span>
                      </div>
                    )}
                  </div>

                  {vehicle.crew.length > 0 && (
                    <div className="pt-2 border-t">
                      <h4 className="text-xs font-semibold mb-2">Assigned Crew</h4>
                      <div className="space-y-2">
                        {vehicle.crew.slice(0, 3).map((member) => (
                          <div key={member.id} className="flex justify-between items-center text-xs">
                            <span>{member.name}</span>
                            <Badge variant="outline" className="text-xs">{member.role || member.position}</Badge>
                          </div>
                        ))}
                        {vehicle.crew.length > 3 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{vehicle.crew.length - 3} more
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
        </TabsContent>
        
        <TabsContent value="liveaboard" className="space-y-4">
          {/* Content for liveaboards tab - uses same grid with filtered data */}
        </TabsContent>
        
        <TabsContent value="car" className="space-y-4">
          {/* Content for cars tab - uses same grid with filtered data */}
        </TabsContent>
      </Tabs>

      {/* Add Vehicle Dialog */}
      <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
        <DialogContent className="sm:max-w-[600px]">
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
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter vehicle name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Vehicle Type</Label>
                <div className="grid grid-cols-1 gap-2">
                  <Select 
                    value={formData.type}
                    onValueChange={(value) => setFormData({...formData, type: value})}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boat">Boat</SelectItem>
                      <SelectItem value="speedboat">Speed Boat</SelectItem>
                      <SelectItem value="liveaboard">Liveaboard</SelectItem>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="custom">Custom Type</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.type === "custom" && (
                    <Input 
                      placeholder="Enter custom vehicle type" 
                      value={formData.customType || ""}
                      onChange={(e) => setFormData({...formData, customType: e.target.value})}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="size">Size/Dimensions</Label>
                <Input 
                  id="size" 
                  value={formData.size}
                  onChange={(e) => setFormData({...formData, size: e.target.value})}
                  placeholder="e.g., 42 ft or SUV"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Passenger Capacity</Label>
                <Input 
                  id="capacity" 
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                  placeholder="Registration ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insuranceInfo">Insurance Information</Label>
                <Input 
                  id="insuranceInfo" 
                  value={formData.insuranceInfo}
                  onChange={(e) => setFormData({...formData, insuranceInfo: e.target.value})}
                  placeholder="Policy number or details"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                    {SAMPLE_STAFF.map((staff) => (
                      <SelectItem 
                        key={staff.id} 
                        value={staff.id}
                        disabled={selectedCrew.includes(staff.id)}
                      >
                        {staff.name} ({staff.position})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedCrew.length > 0 && (
                  <div className="rounded-md border p-2">
                    <h4 className="text-sm font-medium mb-2">Assigned Crew</h4>
                    {selectedCrew.map((staffId) => {
                      const staff = SAMPLE_STAFF.find(s => s.id === staffId)
                      if (!staff) return null
                      
                      return (
                        <div key={staff.id} className="flex items-center justify-between py-1 border-b last:border-0">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{staff.name}</div>
                            <div className="text-xs text-muted-foreground">({staff.position})</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Role on vessel"
                              value={crewRoles[staff.id] || ''}
                              onChange={(e) => setCrewRoles({
                                ...crewRoles,
                                [staff.id]: e.target.value
                              })}
                              className="h-7 w-40 text-xs"
                            />
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => setSelectedCrew(selectedCrew.filter(id => id !== staff.id))}
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
              <Input
                id="vehicleImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              {vehicleImage && (
                <div className="mt-2 relative w-full h-40 rounded-md overflow-hidden">
                  <img 
                    src={URL.createObjectURL(vehicleImage)} 
                    alt="Selected vehicle image"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddVehicleOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveVehicle}>Save Vehicle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Vehicle Dialog - uses the same structure as Add Vehicle Dialog */}
      <Dialog open={isEditVehicleOpen} onOpenChange={setIsEditVehicleOpen}>
        <DialogContent className="sm:max-w-[600px]">
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
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Vehicle Type</Label>
                <div className="grid grid-cols-1 gap-2">
                  <Select 
                    value={formData.type}
                    onValueChange={(value) => setFormData({...formData, type: value})}
                  >
                    <SelectTrigger id="edit-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boat">Boat</SelectItem>
                      <SelectItem value="speedboat">Speed Boat</SelectItem>
                      <SelectItem value="liveaboard">Liveaboard</SelectItem>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="custom">Custom Type</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.type === "custom" && (
                    <Input 
                      placeholder="Enter custom vehicle type" 
                      value={formData.customType || ""}
                      onChange={(e) => setFormData({...formData, customType: e.target.value})}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-size">Size/Dimensions</Label>
                <Input 
                  id="edit-size" 
                  value={formData.size}
                  onChange={(e) => setFormData({...formData, size: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-capacity">Passenger Capacity</Label>
                <Input 
                  id="edit-capacity" 
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-registrationNumber">Registration Number</Label>
                <Input 
                  id="edit-registrationNumber" 
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-insuranceInfo">Insurance Information</Label>
                <Input 
                  id="edit-insuranceInfo" 
                  value={formData.insuranceInfo}
                  onChange={(e) => setFormData({...formData, insuranceInfo: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea 
                id="edit-description" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                    {SAMPLE_STAFF.map((staff) => (
                      <SelectItem 
                        key={staff.id} 
                        value={staff.id}
                        disabled={selectedCrew.includes(staff.id)}
                      >
                        {staff.name} ({staff.position})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedCrew.length > 0 && (
                  <div className="rounded-md border p-2">
                    <h4 className="text-sm font-medium mb-2">Assigned Crew</h4>
                    {selectedCrew.map((staffId) => {
                      const staff = SAMPLE_STAFF.find(s => s.id === staffId)
                      if (!staff) return null
                      
                      return (
                        <div key={staff.id} className="flex items-center justify-between py-1 border-b last:border-0">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{staff.name}</div>
                            <div className="text-xs text-muted-foreground">({staff.position})</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Role on vessel"
                              value={crewRoles[staff.id] || ''}
                              onChange={(e) => setCrewRoles({
                                ...crewRoles,
                                [staff.id]: e.target.value
                              })}
                              className="h-7 w-40 text-xs"
                            />
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => setSelectedCrew(selectedCrew.filter(id => id !== staff.id))}
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
              <Input
                id="edit-vehicleImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              {vehicleImage ? (
                <div className="mt-2 relative w-full h-40 rounded-md overflow-hidden">
                  <img 
                    src={URL.createObjectURL(vehicleImage)} 
                    alt="Selected vehicle image"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : selectedVehicle?.imageUrl && (
                <div className="mt-2 relative w-full h-40 rounded-md overflow-hidden">
                  <img 
                    src={selectedVehicle.imageUrl} 
                    alt={selectedVehicle.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditVehicleOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveVehicle}>Update Vehicle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 