"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { CalendarIcon, DollarSign } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

// Define the form schema with Zod
const formSchema = z.object({
  type: z.string().min(2, {
    message: "Equipment type is required.",
  }),
  sku: z.string().min(2, {
    message: "SKU is required.",
  }),
  make: z.string().min(1, {
    message: "Make is required.",
  }),
  model: z.string().min(1, {
    message: "Model is required.",
  }),
  serialNumber: z.string().min(2, {
    message: "Serial number is required.",
  }),
  size: z.string().min(1, {
    message: "Size is required.",
  }),
  location: z.string().min(1, {
    message: "Storage location is required.",
  }),
  condition: z.string({
    required_error: "Please select condition.",
  }),
  lastInspection: z.date({
    required_error: "Last inspection date is required.",
  }),
  nextInspection: z.date({
    required_error: "Next inspection date is required.",
  }),
  quantity: z.number().min(0, {
    message: "Quantity must be a positive number",
  }),
  trackMinQuantity: z.boolean().default(false),
  minQuantity: z.number().min(0, {
    message: "Minimum quantity must be a positive number",
  }).optional(),
  trackUsage: z.boolean().default(false),
  usageLimit: z.number().min(1, {
    message: "Usage limit must be at least 1",
  }).optional(),
  itemValue: z.string().min(1, {
    message: "Item value is required.",
  }),
  rentalRate: z.string().min(1, {
    message: "Rental rate is required.",
  }),
  rentalTimeframe: z.string({
    required_error: "Please select rental timeframe.",
  }),
}).refine(
  (data) => !data.trackMinQuantity || (data.minQuantity !== undefined && data.minQuantity !== null),
  {
    message: "Minimum quantity is required when tracking is enabled",
    path: ["minQuantity"],
  }
)

// Use Zod's infer to get the form schema type
type FormValues = z.infer<typeof formSchema>

export function AddEquipmentForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize the form with useForm hook
  const form = useForm<FormValues>({
    resolver: zodResolver<FormValues>(formSchema),
    defaultValues: {
      type: "",
      sku: "",
      make: "",
      model: "",
      serialNumber: "",
      size: "",
      location: "",
      quantity: 1,
      trackMinQuantity: false,
      minQuantity: 0,
      trackUsage: false,
      usageLimit: 100,
      itemValue: "",
      rentalRate: "",
      rentalTimeframe: "per dive",
    },
  })

  // Watch the tracking fields to conditionally show/hide related inputs
  const trackUsage = form.watch('trackUsage')
  const trackMinQuantity = form.watch('trackMinQuantity')

  // Form submission handler
  function onSubmit(values: FormValues) {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log({
        ...values,
        minQuantity: values.trackMinQuantity ? values.minQuantity : null,
        usageCount: values.trackUsage ? 0 : null,
        usageLimit: values.trackUsage ? values.usageLimit : null,
        needsMaintenance: false
      })
      setIsSubmitting(false)

      toast({
        title: "Equipment added successfully",
        description: `${values.type} (${values.serialNumber}) has been added to your inventory.`,
      })

      form.reset()
      onSuccess()
      router.refresh()
    }, 1000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="rental">Rental Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipment Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Scuba Tank, BCD, Regulator, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="SK-12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Make</FormLabel>
                    <FormControl>
                      <Input placeholder="Manufacturer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="Model name/number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input placeholder="ST-12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <FormControl>
                      <Input placeholder="80 cu ft / Medium / etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Warehouse A, Shelf B3, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="1" 
                        onChange={e => field.onChange(parseInt(e.target.value))} 
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="trackMinQuantity"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Track Minimum Quantity</FormLabel>
                      <FormDescription>
                        Enable low stock alerts
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {trackMinQuantity && (
              <FormField
                control={form.control}
                name="minQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Quantity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="1" 
                        onChange={e => field.onChange(e.target.value === "" ? undefined : parseInt(e.target.value))} 
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Alert when stock falls below this level
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="trackUsage"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Track Usage</FormLabel>
                    <FormDescription>
                      Enable usage tracking for maintenance alerts
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {trackUsage && (
              <FormField
                control={form.control}
                name="usageLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usage Limit</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        step="1" 
                        onChange={e => field.onChange(parseInt(e.target.value))} 
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      Number of uses before maintenance is recommended
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lastInspection"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Last Inspection</FormLabel>
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
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nextInspection"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Next Inspection</FormLabel>
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
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="rental" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="itemValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Value</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input className="pl-8" placeholder="250.00" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rentalRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rental Rate</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-8" placeholder="15.00" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rentalTimeframe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rental Timeframe</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="per dive">Per Dive</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" type="button" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Equipment"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

