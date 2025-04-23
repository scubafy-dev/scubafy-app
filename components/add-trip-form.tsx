"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Anchor, Car, Ship } from "lucide-react"

// Sample vehicle data for demo purposes
// In a real app, this would be fetched from an API
interface Vehicle {
  id: string
  name: string
  type: "boat" | "car" | "liveaboard"
  size: string
  capacity: number
  imageUrl?: string
}

const SAMPLE_VEHICLES: Vehicle[] = [
  {
    id: "v1",
    name: "Sea Explorer",
    type: "boat",
    size: "42 ft",
    capacity: 12,
    imageUrl: "/vehicles/boat1.jpg"
  },
  {
    id: "v2",
    name: "Reef Ranger",
    type: "liveaboard",
    size: "85 ft",
    capacity: 24,
    imageUrl: "/vehicles/liveaboard1.jpg"
  },
  {
    id: "v3",
    name: "Dive Transport",
    type: "car",
    size: "SUV",
    capacity: 7,
    imageUrl: "/vehicles/car1.jpg"
  }
]

// Add these interfaces after the existing Vehicle interface
interface Staff {
  id: string;
  name: string;
  role: "instructor" | "divemaster";
  certifications: string[];
}

interface Customer {
  id: string;
  name: string;
  certification: string;
}

// Add sample data after SAMPLE_VEHICLES
const SAMPLE_STAFF: Staff[] = [
  {
    id: "s1",
    name: "Maria Santos",
    role: "instructor",
    certifications: ["PADI IDC Staff Instructor", "EFR Instructor"]
  },
  {
    id: "s2",
    name: "Alex Rodriguez",
    role: "divemaster",
    certifications: ["PADI Divemaster", "Rescue Diver"]
  },
  {
    id: "s3",
    name: "James Wilson",
    role: "instructor",
    certifications: ["SSI Open Water Instructor", "Nitrox Instructor"]
  }
];

const SAMPLE_CUSTOMERS: Customer[] = [
  {
    id: "c1",
    name: "John Smith",
    certification: "PADI Open Water"
  },
  {
    id: "c2",
    name: "Emma Wilson",
    certification: "SSI Advanced Open Water"
  },
  {
    id: "c3",
    name: "Mike Chen",
    certification: "PADI Rescue Diver"
  }
];

// Extended form schema with the new fields
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Trip name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  date: z.date({
    required_error: "A date is required.",
  }),
  time: z.string().min(1, {
    message: "Time is required.",
  }),
  capacity: z.coerce.number().min(1, {
    message: "Capacity must be at least 1.",
  }),
  price: z.string().min(1, {
    message: "Price is required.",
  }),
  description: z.string().optional(),
  diveType: z.string({
    required_error: "Please select a dive type.",
  }),
  vehicleId: z.string({
    required_error: "Please select a vehicle.",
  }),
  // Expense tracking
  expenses: z.object({
    boatInsurance: z.string().optional(),
    fuel: z.string().optional(),
    crewWages: z.string().optional(),
    foodAndSupplies: z.string().optional(),
    fees: z.string().optional(),
    other: z.string().optional()
  }),
  instructorId: z.string({
    required_error: "Please select an instructor.",
  }),
  diveMasterId: z.string({
    required_error: "Please select a dive master.",
  }),
  useCustomerDatabase: z.boolean().default(true),
  participants: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string(),
      certification: z.string()
    })
  ),
  selectedCustomerIds: z.array(z.string()),
})

export function AddTripForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [vehicles, setVehicles] = useState<Vehicle[]>(SAMPLE_VEHICLES)
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>("all")
  const [staff, setStaff] = useState<Staff[]>(SAMPLE_STAFF)
  const [customers, setCustomers] = useState<Customer[]>(SAMPLE_CUSTOMERS)
  const [manualParticipants, setManualParticipants] = useState<Array<{ name: string; certification: string }>>([])

  // Filter vehicles based on the selected type
  const filteredVehicles = selectedVehicleType === "all"
    ? vehicles
    : vehicles.filter(vehicle => vehicle.type === selectedVehicleType)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      time: "",
      capacity: 8,
      price: "",
      description: "",
      diveType: "",
      vehicleId: "",
      expenses: {
        boatInsurance: "",
        fuel: "",
        crewWages: "",
        foodAndSupplies: "",
        fees: "",
        other: ""
      },
      instructorId: "",
      diveMasterId: "",
      useCustomerDatabase: true,
      participants: [],
      selectedCustomerIds: [],
    },
  })

  // Update capacity when vehicle is selected
  const watchVehicleId = form.watch("vehicleId")
  
  useEffect(() => {
    if (watchVehicleId) {
      const selectedVehicle = vehicles.find(v => v.id === watchVehicleId)
      if (selectedVehicle) {
        form.setValue("capacity", selectedVehicle.capacity)
      }
    }
  }, [watchVehicleId, vehicles, form])

  // Add these helper functions before onSubmit
  const addManualParticipant = () => {
    setManualParticipants([...manualParticipants, { name: "", certification: "" }]);
  };

  const removeManualParticipant = (index: number) => {
    const updated = [...manualParticipants];
    updated.splice(index, 1);
    setManualParticipants(updated);
  };

  const updateManualParticipant = (index: number, field: string, value: string) => {
    const updated = [...manualParticipants];
    updated[index] = { ...updated[index], [field]: value };
    setManualParticipants(updated);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Combine selected customers and manual participants
    const allParticipants = values.useCustomerDatabase
      ? values.selectedCustomerIds.map(id => {
          const customer = customers.find(c => c.id === id);
          return {
            id: customer?.id,
            name: customer?.name || "",
            certification: customer?.certification || ""
          };
        })
      : manualParticipants;

    // Calculate total expenses
    const expenses = values.expenses
    const totalExpenses = Object.values(expenses)
      .filter(value => value !== "")
      .reduce((sum, value) => sum + parseFloat(value || "0"), 0)

    // Simulate API call
    setTimeout(() => {
      console.log({
        ...values,
        participants: allParticipants,
        instructor: staff.find(s => s.id === values.instructorId),
        diveMaster: staff.find(s => s.id === values.diveMasterId),
        totalExpenses
      })
      setIsSubmitting(false)

      toast({
        title: "Trip created successfully",
        description: `${values.name} has been added to your dive trips.`,
      })

      form.reset()
      onSuccess()
      router.refresh()
    }, 1000)
  }

  const getVehicleTypeIcon = (type: string) => {
    switch (type) {
      case "boat": return <Anchor className="h-4 w-4" />
      case "car": return <Car className="h-4 w-4" />
      case "liveaboard": return <Ship className="h-4 w-4" />
      default: return null
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="details" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Trip Details</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>
          
          {/* Trip Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trip Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Coral Reef Exploration" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Blue Lagoon Reef" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input placeholder="9:00 AM - 1:00 PM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormDescription>Maximum number of divers</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input placeholder="$120.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="diveType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dive Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select dive type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fun">Fun Dive</SelectItem>
                        <SelectItem value="coastal">Coastal Dive</SelectItem>
                        <SelectItem value="night">Night Dive</SelectItem>
                        <SelectItem value="deep">Deep Dive</SelectItem>
                        <SelectItem value="wreck">Wreck Dive</SelectItem>
                        <SelectItem value="cave">Cave Dive</SelectItem>
                        <SelectItem value="drift">Drift Dive</SelectItem>
                        <SelectItem value="discovery">Discovery Dive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter trip details, requirements, and what divers can expect..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          
          {/* Vehicle Selection Tab */}
          <TabsContent value="vehicle">
            <div className="space-y-4">
              <div className="flex space-x-2 pb-2">
                <Button
                  type="button" 
                  variant={selectedVehicleType === "all" ? "default" : "outline"}
                  onClick={() => setSelectedVehicleType("all")}
                >
                  All
                </Button>
                <Button 
                  type="button"
                  variant={selectedVehicleType === "boat" ? "default" : "outline"}
                  onClick={() => setSelectedVehicleType("boat")}
                >
                  <Anchor className="mr-2 h-4 w-4" />
                  Boats
                </Button>
                <Button 
                  type="button"
                  variant={selectedVehicleType === "liveaboard" ? "default" : "outline"}
                  onClick={() => setSelectedVehicleType("liveaboard")}
                >
                  <Ship className="mr-2 h-4 w-4" />
                  Liveaboards
                </Button>
                <Button 
                  type="button"
                  variant={selectedVehicleType === "car" ? "default" : "outline"}
                  onClick={() => setSelectedVehicleType("car")}
                >
                  <Car className="mr-2 h-4 w-4" />
                  Cars
                </Button>
              </div>

              <FormField
                control={form.control}
                name="vehicleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Vehicle</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                      {filteredVehicles.map((vehicle) => (
                        <Card 
                          key={vehicle.id} 
                          className={cn(
                            "cursor-pointer hover:border-primary transition-colors",
                            field.value === vehicle.id && "border-2 border-primary"
                          )}
                          onClick={() => field.onChange(vehicle.id)}
                        >
                          <CardHeader className="p-3 pb-0">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                {getVehicleTypeIcon(vehicle.type)}
                                <CardTitle className="text-base">{vehicle.name}</CardTitle>
                              </div>
                              <RadioGroup value={field.value} onValueChange={field.onChange} className="hidden">
                                <RadioGroupItem value={vehicle.id} id={`vehicle-${vehicle.id}`} />
                              </RadioGroup>
                            </div>
                            <CardDescription className="text-xs">
                              {vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)} • {vehicle.size}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-3 pt-2">
                            {vehicle.imageUrl && (
                              <div className="w-full h-28 rounded-md overflow-hidden mb-2">
                                <img 
                                  src={vehicle.imageUrl} 
                                  alt={vehicle.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="text-xs flex justify-between">
                              <span className="text-muted-foreground">Capacity:</span>
                              <Badge variant="outline">{vehicle.capacity} people</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          
          {/* Staff Tab */}
          <TabsContent value="staff" className="space-y-4">
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="instructorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an instructor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {staff
                          .filter(s => s.role === "instructor")
                          .map(instructor => (
                            <SelectItem key={instructor.id} value={instructor.id}>
                              <div className="flex flex-col">
                                <span>{instructor.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {instructor.certifications.join(", ")}
                                </span>
                              </div>
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="diveMasterId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dive Master</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a dive master" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {staff
                          .filter(s => s.role === "divemaster")
                          .map(divemaster => (
                            <SelectItem key={divemaster.id} value={divemaster.id}>
                              <div className="flex flex-col">
                                <span>{divemaster.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {divemaster.certifications.join(", ")}
                                </span>
                              </div>
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          {/* Participants Tab */}
          <TabsContent value="participants" className="space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <FormLabel className="text-base">Participants</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addManualParticipant}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Participant
                </Button>
              </div>
              {manualParticipants.map((participant, index) => (
                <div key={index} className="flex gap-4 items-start border rounded-lg p-4">
                  <div className="flex-1 space-y-4">
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          value={participant.name}
                          onChange={(e) => updateManualParticipant(index, "name", e.target.value)}
                          placeholder="Participant name"
                        />
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormLabel>Certification</FormLabel>
                      <FormControl>
                        <Input
                          value={participant.certification}
                          onChange={(e) => updateManualParticipant(index, "certification", e.target.value)}
                          placeholder="e.g. PADI Open Water"
                        />
                      </FormControl>
                    </FormItem>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeManualParticipant(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <FormField
                control={form.control}
                name="useCustomerDatabase"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-6">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Use Customer Database</FormLabel>
                      <FormDescription>
                        Switch to select participants from your existing customer database
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("useCustomerDatabase") && (
                <div className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="selectedCustomerIds"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Select From Database</FormLabel>
                          <FormDescription>
                            Choose participants from your customer database
                          </FormDescription>
                        </div>
                        {customers.map((customer) => (
                          <FormField
                            key={customer.id}
                            control={form.control}
                            name="selectedCustomerIds"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={customer.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(customer.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, customer.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== customer.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="text-sm font-medium">
                                      {customer.name}
                                    </FormLabel>
                                    <FormDescription className="text-xs">
                                      {customer.certification}
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Expenses Tab */}
          <TabsContent value="expenses">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground mb-2">
                Add expected expenses for this trip. This information will be reflected in financial reports.
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="expenses.boatInsurance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="$0.00" 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="expenses.fuel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuel</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="$0.00" 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="expenses.crewWages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crew Wages</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="$0.00" 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="expenses.foodAndSupplies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Food & Supplies</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="$0.00" 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="expenses.fees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Park/Location Fees</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="$0.00" 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="expenses.other"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Expenses</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="$0.00" 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm font-medium">
                  <span>Total Expenses:</span>
                  <span>
                    $
                    {Object.values(form.watch("expenses"))
                      .filter(value => value !== "")
                      .reduce((sum, value) => sum + parseFloat(value || "0"), 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  These expenses will be tracked in the finance section
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" type="button" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Trip"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

