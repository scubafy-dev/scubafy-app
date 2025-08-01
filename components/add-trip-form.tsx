"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Anchor, Car, Ship } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FullDiveTrip } from "@/lib/dive-trips";
import { ActionMode } from "@/types/all";
import { useDiveCenter } from "@/lib/dive-center-context";
import { getAllStaff } from "@/lib/staffs";
import { getAllCustomers } from "@/lib/customers";
import { Customer, Staff } from "@/app/generated/prisma";
import { getAllFleetVehicles } from "@/lib/vehicles";

// Add these interfaces after the existing Vehicle interface
// interface Staff {
//   id: string;
//   name: string;
//   role: "instructor" | "divemaster";
//   certifications: string[];
// }

// interface Customer {
//   id: string;
//   name: string;
//   certification: string;
// }

// const SAMPLE_STAFF: Staff[] = [
//   {
//     id: "s1",
//     name: "Maria Santos",
//     role: "instructor",
//     certifications: ["PADI IDC Staff Instructor", "EFR Instructor"],
//   },
//   {
//     id: "s2",
//     name: "Alex Rodriguez",
//     role: "divemaster",
//     certifications: ["PADI Divemaster", "Rescue Diver"],
//   },
//   {
//     id: "s3",
//     name: "James Wilson",
//     role: "instructor",
//     certifications: ["SSI Open Water Instructor", "Nitrox Instructor"],
//   },
// ];

// const SAMPLE_CUSTOMERS: Customer[] = [
//   {
//     id: "c1",
//     name: "John Smith",
//     certification: "PADI Open Water",
//   },
//   {
//     id: "c2",
//     name: "Emma Wilson",
//     certification: "SSI Advanced Open Water",
//   },
//   {
//     id: "c3",
//     name: "Mike Chen",
//     certification: "PADI Rescue Diver",
//   },
// ];

// Extended form schema with the new fields
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Trip name must be at least 2 characters.",
  }),
  location: z.string().optional(),
  status: z.string().optional(),
  date: z.date().optional(),
  time: z.string().optional(),
  capacity: z.coerce.number().optional(),
  price: z.string().optional(),
  description: z.string().optional(),
  diveType: z.string().optional(),
  fleetVehicleId: z.string().optional(),
  // New Expense tracking fields
  expenses: z.object({
    tankRental: z.string().optional(),
    weightsRental: z.string().optional(),
    boatFees: z.string().optional(),
    diveGuidePay: z.string().optional(),
    marineParkFee: z.string().optional(),
    transportation: z.string().optional(),
    diveEquipmentRental: z.string().optional(),
    snacks: z.string().optional(),
    compressorUse: z.string().optional(),
    permits: z.string().optional(),
    staffMeals: z.string().optional(),
    fuelSurcharges: z.string().optional(),
    boatCaptainCrewTips: z.string().optional(),
    insurance: z.string().optional(),
    equipmentMaintenance: z.string().optional(),
    lastMinuteRentals: z.string().optional(),
  }),
  instructor: z.string().optional(), // Keep for backward compatibility
  selectedInstructorIds: z.array(z.string()).default([]), // New field for multiple instructors
  diveMaster: z.string().optional(), // Keep for backward compatibility
  selectedDiveMasterIds: z.array(z.string()).default([]), // New field for multiple dive masters
  useCustomerDatabase: z.boolean().default(true),
  participants: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().optional(),
      certification: z.string().optional(),
      level: z.string().optional(),
    }),
  ).default([]),
  selectedCustomerIds: z.array(z.string()).default([]),
});

type FormData = z.infer<typeof formSchema>;

export function AddTripForm(
  { onSuccess, mode, trip, actionCreate, actionUpdate, setIsAddTripOpen, setIsEditTripOpen }: {
    onSuccess: () => void;
    mode: ActionMode;
    trip: FullDiveTrip | null;
    actionCreate: (formData: FormData, diveCenterId: string) => Promise<void>;
    actionUpdate: (id: string | null, formData: FormData) => Promise<void>;
    setIsAddTripOpen?: any;
    setIsEditTripOpen?: any;
  },
) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>("all");
  const [staff, setStaff] = useState<Staff[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [manualParticipants, setManualParticipants] = useState<
    Array<{ name: string; certification: string }>
  >([]);
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  const { currentCenter, isAllCenters, getCenterSpecificData, centers } =
    useDiveCenter();

  // Add a fallback for when currentCenter is undefined
  const effectiveCenter = currentCenter || (centers.length > 0 ? centers[0] : null);

  // Filter vehicles based on the selected type
  const filteredVehicles = selectedVehicleType === "all"
    ? vehicles
    : vehicles.filter((vehicle) => vehicle.type === selectedVehicleType);

  const form = useForm({
    defaultValues: {
      title: trip?.title ?? "",
      status: trip?.status ?? "upcoming",
      location: trip?.location ?? "",
      time: "",
      date: trip?.date ? new Date(trip.date) : undefined,
      capacity: trip?.capacity ?? 0,
      price: trip?.price ? trip.price.toString() : "",
      description: trip?.description ?? "",
      diveType: trip?.diveType ?? "",
      fleetVehicleId: trip?.fleetVehicleId ?? "",
      expenses:
        trip && typeof trip.expenses === 'object' && trip.expenses !== null && !Array.isArray(trip.expenses)
          ? {
              tankRental: (trip.expenses as any).tankRental ?? '',
              weightsRental: (trip.expenses as any).weightsRental ?? '',
              boatFees: (trip.expenses as any).boatFees ?? '',
              diveGuidePay: (trip.expenses as any).diveGuidePay ?? '',
              marineParkFee: (trip.expenses as any).marineParkFee ?? '',
              transportation: (trip.expenses as any).transportation ?? '',
              diveEquipmentRental: (trip.expenses as any).diveEquipmentRental ?? '',
              snacks: (trip.expenses as any).snacks ?? '',
              compressorUse: (trip.expenses as any).compressorUse ?? '',
              permits: (trip.expenses as any).permits ?? '',
              staffMeals: (trip.expenses as any).staffMeals ?? '',
              fuelSurcharges: (trip.expenses as any).fuelSurcharges ?? '',
              boatCaptainCrewTips: (trip.expenses as any).boatCaptainCrewTips ?? '',
              insurance: (trip.expenses as any).insurance ?? '',
              equipmentMaintenance: (trip.expenses as any).equipmentMaintenance ?? '',
              lastMinuteRentals: (trip.expenses as any).lastMinuteRentals ?? '',
            }
          : {
              tankRental: '',
              weightsRental: '',
              boatFees: '',
              diveGuidePay: '',
              marineParkFee: '',
              transportation: '',
              diveEquipmentRental: '',
              snacks: '',
              compressorUse: '',
              permits: '',
              staffMeals: '',
              fuelSurcharges: '',
              boatCaptainCrewTips: '',
              insurance: '',
              equipmentMaintenance: '',
              lastMinuteRentals: '',
            },
      instructor: trip?.instructor ?? "",
      selectedInstructorIds: [], // New field for multiple instructors
      diveMaster: trip?.diveMaster ?? "",
      selectedDiveMasterIds: [], // New field for multiple dive masters
      useCustomerDatabase: true,
      participants: [],
      selectedCustomerIds: [],
    },
  });

  // Update capacity when vehicle is selected
  const watchVehicleId = form.watch("fleetVehicleId");


  useEffect(() => {
    const fetchStaffMembers = async () => {
      try {
        const staffData = await getAllStaff(currentCenter?.id);
        setStaff(staffData);
      } catch (error) {
        console.error("Error fetching staff members:", error);
      }
    };
    fetchStaffMembers();
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customersData = await getAllCustomers(currentCenter?.id);
        console.log('customers', customersData)
        setCustomers(customersData);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  // Prefill participants when editing a trip
  useEffect(() => {
    if (mode === ActionMode.update && trip && Array.isArray(trip.participants)) {
      const selectedCustomerIds: string[] = [];
      const manualParts: Array<{ name: string; certification: string }> = [];
      trip.participants.forEach((p: any) => {
        if (p.customerId) {
          selectedCustomerIds.push(p.customerId);
        } else {
          manualParts.push({
            name: p.name || '',
            certification: p.certification || '',
          });
        }
      });
      setManualParticipants(manualParts);
      form.reset({ ...form.getValues(), selectedCustomerIds: selectedCustomerIds as any });
    }
  }, [mode, trip, customers, form]);

  // Prefill instructors when editing a trip
  useEffect(() => {
    if (mode === ActionMode.update && trip) {
      // Handle new assignment structure
      if (trip.instructorAssignments && Array.isArray(trip.instructorAssignments)) {
        const instructorIds = trip.instructorAssignments.map((assignment: any) => assignment.staffId);
        form.setValue('selectedInstructorIds', instructorIds as any);
      } else if (trip.instructor) {
        // Fallback for old comma-separated string format
        const instructorIds = trip.instructor.split(',').filter(id => id.trim() !== '');
        form.setValue('selectedInstructorIds', instructorIds as any);
      }
    }
  }, [mode, trip, form]);

  // Prefill dive masters when editing a trip
  useEffect(() => {
    if (mode === ActionMode.update && trip) {
      // Handle new assignment structure
      if (trip.diveMasterAssignments && Array.isArray(trip.diveMasterAssignments)) {
        const diveMasterIds = trip.diveMasterAssignments.map((assignment: any) => assignment.staffId);
        form.setValue('selectedDiveMasterIds', diveMasterIds as any);
      } else if (trip.diveMaster) {
        // Fallback for old comma-separated string format
        const diveMasterIds = trip.diveMaster.split(',').filter(id => id.trim() !== '');
        form.setValue('selectedDiveMasterIds', diveMasterIds as any);
      }
    }
  }, [mode, trip, form]);

  // Prefill diveType when editing a trip
  useEffect(() => {
    if (mode === ActionMode.update && trip && trip.diveType) {
      form.setValue('diveType', trip.diveType);
    }
  }, [mode, trip, form]);

  // Add these helper functions before onSubmit
  const addManualParticipant = () => {
    setManualParticipants([...manualParticipants, {
      name: "",
      certification: "",
    }]);
  };

  const removeManualParticipant = (index: number) => {
    const updated = [...manualParticipants];
    updated.splice(index, 1);
    setManualParticipants(updated);
  };

  const updateManualParticipant = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updated = [...manualParticipants];
    updated[index] = { ...updated[index], [field]: value };
    setManualParticipants(updated);
  };

  console.log('tripData for Update', trip)

  useEffect(() => {
    async function fetchVehicles() {
      if (effectiveCenter?.id) {
        try {
          const realVehicles = await getAllFleetVehicles(effectiveCenter.id);
          setVehicles(realVehicles);
        } catch (error) {
          console.error("Error fetching vehicles:", error);
          setVehicles([]);
        }
      }
    }
    fetchVehicles();
  }, [effectiveCenter]);

  async function onSubmit(values: any) {
    console.log('form value', values)
    setIsSubmitting(true);

    try {
      // Build participants array
      let participants = [];

      // Add manual participants
      participants = [
        ...manualParticipants.map((p) => ({
          id: uuidv4(),
          name: p.name,
          certification: p.certification,
          level: 'Unknown', // Add level field as required by schema
        })),
      ];

      // Add selected customers from database
      if (values.selectedCustomerIds && Array.isArray(values.selectedCustomerIds)) {
        const selectedCustomers = customers.filter((c) =>
          values.selectedCustomerIds.includes(c.id)
        );
        participants = [
          ...participants,
          ...selectedCustomers.map((c) => ({
            id: uuidv4(), // Generate new UUID for participant
            name: c.fullName,
            certification: c.certificationLevel || 'Unknown',
            level: 'Unknown', // Add level field as required by schema
            customerId: c.id, // Link to the customer in the database
          })),
        ];
      }
      console.log('after adding participents from DB', participants)
      // Set the participants field in the values object
      values.participants = participants;
      console.log('formValues', values)
      // Call the appropriate server action
      if (mode === ActionMode.create && effectiveCenter?.id) {
        try {
          await actionCreate(values, effectiveCenter.id);
          onSuccess();
          toast({
            title: "Trip created successfully",
            description: `${values.title} has been added to your dive trips.`,
          });
        } catch (e) {
          toast({
            title: "Trip creation failed",
            description: `Failed to create trip. Please try again.`,
            variant: "destructive",
          });
        }
      } else if (mode === ActionMode.update && trip?.id) {
        await actionUpdate(trip.id, values);
        onSuccess();
        toast({
          title: "Trip updated successfully",
          description: `${values.title} has been updated.`,
        });
      } else {
        console.error("Missing required data:", { mode, effectiveCenter, trip });
        throw new Error("Missing required data for trip creation");
      }

      form.reset();
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to save trip. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const getVehicleTypeIcon = (type: string) => {
    switch (type) {
      case "boat":
        return <Anchor className="h-4 w-4" />;
      case "car":
        return <Car className="h-4 w-4" />;
      case "liveaboard":
        return <Ship className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Check if form has data
  const hasFormData = () => {
    const values = form.getValues();
    return (
      values.title ||
      values.location ||
      values.description ||
      values.diveType ||
      values.fleetVehicleId ||
      values.selectedInstructorIds?.length > 0 ||
      values.selectedDiveMasterIds?.length > 0 ||
      manualParticipants.length > 0 ||
      values.selectedCustomerIds?.length > 0 ||
      Object.values(values.expenses).some(expense => expense && expense !== "")
    );
  };

  // Handle close attempt
  const handleCloseAttempt = () => {
    // Only show confirmation for create mode, not for update mode
    if (mode === ActionMode.create && hasFormData()) {
      setShowCloseConfirmation(true);
    } else {
      handleClose();
    }
  };

  // Handle actual close
  const handleClose = () => {
    setIsAddTripOpen && setIsAddTripOpen(false);
    setIsEditTripOpen && setIsEditTripOpen(false);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="details" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="details">Trip Details</TabsTrigger>
              <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
              <TabsTrigger value="participants">Participants</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
            </TabsList>

            {/* Trip Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trip Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Coral Reef Exploration"
                          {...field}
                        />
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

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select trip status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem
                              value="upcoming"
                              className="text-blue-700"
                            >
                              Upcoming
                            </SelectItem>
                            <SelectItem
                              value="in_progress"
                              className="text-yellow-700"
                            >
                              In progress
                            </SelectItem>
                            <SelectItem
                              value="completed"
                              className="text-orange-700"
                            >
                              Completed
                            </SelectItem>
                            <SelectItem
                              value="cancelled"
                              className="text-red-700"
                            >
                              Cancelled
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    //@ts-ignore
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value
                                  ? format((field.value as any), "PPP")
                                  : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value as any}
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


                  {/* <FormField
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
                  /> */}

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum number of divers
                        </FormDescription>
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
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
                          <SelectItem value="discovery">
                            Discovery Dive
                          </SelectItem>
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
                <div className="text-sm text-muted-foreground mb-4">
                  Vehicle selection is optional. You can create a dive trip without assigning a vehicle.
                </div>
                <div className="flex space-x-2 pb-2">
                  <Button
                    type="button"
                    variant={selectedVehicleType === "all"
                      ? "default"
                      : "outline"}
                    onClick={() => setSelectedVehicleType("all")}
                  >
                    All
                  </Button>
                  <Button
                    type="button"
                    variant={selectedVehicleType === "boat"
                      ? "default"
                      : "outline"}
                    onClick={() => setSelectedVehicleType("boat")}
                  >
                    <Anchor className="mr-2 h-4 w-4" />
                    Boats
                  </Button>
                  <Button
                    type="button"
                    variant={selectedVehicleType === "liveaboard"
                      ? "default"
                      : "outline"}
                    onClick={() => setSelectedVehicleType("liveaboard")}
                  >
                    <Ship className="mr-2 h-4 w-4" />
                    Liveaboards
                  </Button>
                  <Button
                    type="button"
                    variant={selectedVehicleType === "car"
                      ? "default"
                      : "outline"}
                    onClick={() => setSelectedVehicleType("car")}
                  >
                    <Car className="mr-2 h-4 w-4" />
                    Cars
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name="fleetVehicleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Vehicle (Optional)</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                        {filteredVehicles.map((vehicle) => (
                          <Card
                            key={vehicle.id}
                            className={cn(
                              "cursor-pointer hover:border-primary transition-colors",
                              field.value === vehicle.id &&
                              "border-2 border-primary",
                            )}
                            onClick={() => field.onChange(vehicle.id)}
                          >
                            <CardHeader className="p-3 pb-0">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  {getVehicleTypeIcon(vehicle.type)}
                                  <CardTitle className="text-base">
                                    {vehicle.name}
                                  </CardTitle>
                                </div>
                                <RadioGroup
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  className="hidden"
                                >
                                  <RadioGroupItem
                                    value={vehicle.id}
                                    id={`vehicle-${vehicle.id}`}
                                  />
                                </RadioGroup>
                              </div>
                              <CardDescription className="text-xs">
                                {vehicle.type.charAt(0).toUpperCase() +
                                  vehicle.type.slice(1)} • {vehicle.size}
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
                                <span className="text-muted-foreground">
                                  Capacity:
                                </span>
                                <Badge variant="outline">
                                  {vehicle.capacity} people
                                </Badge>
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
                  name="selectedInstructorIds"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Instructors</FormLabel>
                        <FormDescription>
                          Select one or more instructors for this trip
                          {form.watch('selectedInstructorIds')?.length > 0 && (
                            <span className="ml-2 text-blue-600">
                              ({form.watch('selectedInstructorIds').length} selected)
                            </span>
                          )}
                        </FormDescription>
                      </div>
                      {staff
                        .filter((s) => s.roleTitle?.toLowerCase().includes('instructor'))
                        .length > 0 ? (
                        staff
                          .filter((s) => s.roleTitle?.toLowerCase().includes('instructor'))
                          .map((instructor) => (
                            <FormField
                              key={instructor.id}
                              control={form.control}
                              name="selectedInstructorIds"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={instructor.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={((field.value || []) as string[]).includes(
                                          instructor?.id,
                                        )}
                                        onCheckedChange={(checked) => {
                                          const currentValue =
                                            (field.value as string[] | undefined) || [];
                                          return checked
                                            ? field.onChange([...currentValue, instructor.id])
                                            : field.onChange(currentValue.filter(
                                              (value: string) => value !== instructor.id,
                                            ));
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="text-sm font-medium">
                                        {instructor.fullName}
                                      </FormLabel>
                                      <FormDescription className="text-xs">
                                        {instructor.roleTitle}
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                );
                              }}
                            />
                          ))
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          No instructors found. All staff members are shown below.
                        </div>
                      )}
                      {staff
                        .filter((s) => !s.roleTitle?.toLowerCase().includes('instructor'))
                        .map((staffMember) => (
                          <FormField
                            key={staffMember.id}
                            control={form.control}
                            name="selectedInstructorIds"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={staffMember.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={((field.value || []) as string[]).includes(
                                        staffMember?.id,
                                      )}
                                      onCheckedChange={(checked) => {
                                        const currentValue =
                                          (field.value as string[] | undefined) || [];
                                        return checked
                                          ? field.onChange([...currentValue, staffMember.id])
                                          : field.onChange(currentValue.filter(
                                            (value: string) => value !== staffMember.id,
                                          ));
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="text-sm font-medium">
                                      {staffMember.fullName}
                                    </FormLabel>
                                    <FormDescription className="text-xs">
                                      {staffMember.roleTitle}
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="selectedDiveMasterIds"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Dive Masters</FormLabel>
                        <FormDescription>
                          Select one or more dive masters for this trip
                          {form.watch('selectedDiveMasterIds')?.length > 0 && (
                            <span className="ml-2 text-blue-600">
                              ({form.watch('selectedDiveMasterIds').length} selected)
                            </span>
                          )}
                        </FormDescription>
                      </div>
                      {staff
                        .filter((s) => s.roleTitle?.toLowerCase().includes('divemaster') || s.roleTitle?.toLowerCase().includes('dive master'))
                        .length > 0 ? (
                        staff
                          .filter((s) => s.roleTitle?.toLowerCase().includes('divemaster') || s.roleTitle?.toLowerCase().includes('dive master'))
                          .map((divemaster) => (
                            <FormField
                              key={divemaster.id}
                              control={form.control}
                              name="selectedDiveMasterIds"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={((field.value || []) as string[]).includes(
                                          divemaster?.id,
                                        )}
                                        onCheckedChange={(checked) => {
                                          const currentValue =
                                            (field.value as string[] | undefined) || [];
                                          return checked
                                            ? field.onChange([...currentValue, divemaster.id])
                                            : field.onChange(currentValue.filter(
                                              (value: string) => value !== divemaster.id,
                                            ));
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="text-sm font-medium">
                                        {divemaster.fullName}
                                      </FormLabel>
                                      <FormDescription className="text-xs">
                                        {divemaster.roleTitle}
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                );
                              }}
                            />
                          ))
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          No dive masters found. All staff members are shown below.
                        </div>
                      )}
                      {staff
                        .filter((s) => !s.roleTitle?.toLowerCase().includes('divemaster') && !s.roleTitle?.toLowerCase().includes('dive master'))
                        .map((staffMember) => (
                          <FormField
                            key={staffMember.id}
                            control={form.control}
                            name="selectedDiveMasterIds"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={((field.value || []) as string[]).includes(
                                        staffMember?.id,
                                      )}
                                      onCheckedChange={(checked) => {
                                        const currentValue =
                                          (field.value as string[] | undefined) || [];
                                        return checked
                                          ? field.onChange([...currentValue, staffMember.id])
                                          : field.onChange(currentValue.filter(
                                            (value: string) => value !== staffMember.id,
                                          ));
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="text-sm font-medium">
                                      {staffMember.fullName}
                                    </FormLabel>
                                    <FormDescription className="text-xs">
                                      {staffMember.roleTitle}
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
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
                  <div
                    key={index}
                    className="flex gap-4 items-start border rounded-lg p-4"
                  >
                    <div className="flex-1 space-y-4">
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            value={participant.name}
                            onChange={(e) =>
                              updateManualParticipant(
                                index,
                                "name",
                                e.target.value,
                              )}
                            placeholder="Participant name"
                          />
                        </FormControl>
                      </FormItem>
                      <FormItem>
                        <FormLabel>Certification</FormLabel>
                        <FormControl>
                          <Input
                            value={participant.certification}
                            onChange={(e) =>
                              updateManualParticipant(
                                index,
                                "certification",
                                e.target.value,
                              )}
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
                        <FormLabel className="text-base">
                          Use Customer Database
                        </FormLabel>
                        <FormDescription>
                          Switch to select participants from your existing
                          customer database
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
                            <FormLabel className="text-base">
                              Select From Database
                            </FormLabel>
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
                                        checked={((field.value || []) as string[]).includes(
                                          customer?.id,
                                        )}
                                        onCheckedChange={(checked) => {
                                          const currentValue =
                                            (field.value as string[] | undefined) || [];
                                          return checked
                                            ? field.onChange([...currentValue, customer.id])
                                            : field.onChange(currentValue.filter(
                                              (value: string) => value !== customer.id,
                                            ));
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="text-sm font-medium">
                                        {customer.fullName}
                                      </FormLabel>
                                      <FormDescription className="text-xs">
                                        {customer.certificationLevel}
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                );
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
                  Add expected expenses for this trip. This information will be
                  reflected in financial reports.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expenses.tankRental"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tank Rental</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="$"
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
                    name="expenses.weightsRental"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weights Rental</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="$"
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
                    name="expenses.boatFees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Boat Fees</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="$"
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
                    name="expenses.diveGuidePay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dive Guide Pay</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="$"
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
                    name="expenses.marineParkFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marine Park Fee</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="$"
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
                    name="expenses.transportation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transportation (van/pickup)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="$"
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
                    name="expenses.diveEquipmentRental"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dive Equipment Rental</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="$"
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
                    name="expenses.snacks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Snacks</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="$"
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
                    name="expenses.compressorUse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compressor Use</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="$"
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
                    name="expenses.permits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Permits / Government Fees</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="$"
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
                    name="expenses.staffMeals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Staff meals</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="$"
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
                    name="expenses.fuelSurcharges"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fuel surcharges</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="$"
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
                    name="expenses.boatCaptainCrewTips"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Boat captain & crew tips</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="$"
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
                    name="expenses.insurance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Insurance / liability coverage</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="$"
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
                    name="expenses.equipmentMaintenance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equipment maintenance</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="$"
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
                    name="expenses.lastMinuteRentals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last-minute rentals / rush fees</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="$"
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
                        .filter((value) => value !== "")
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
            <Button variant="outline" type="button" onClick={handleCloseAttempt}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? mode === ActionMode.create ? "Creating..." : "Updating..."
                : mode === ActionMode.create
                  ? "Create Trip"
                  : "Update Trip"}
            </Button>
          </div>
        </form>
      </Form>

      <AlertDialog open={showCloseConfirmation} onOpenChange={setShowCloseConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to close?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. If you close now, all your data will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={handleClose}>
              Close Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
