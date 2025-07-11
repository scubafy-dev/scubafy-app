"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
    Equipment,
    EquipmentFormType,
    makeEquipmentAvailable,
} from "@/lib/equipment";
import { ActionMode } from "@/types/all";
import { useRouter } from "next/navigation";
import { rentEquipment } from "@/lib/equipment";
import { useToast } from "@/components/ui/use-toast";
import { Condition, Customer, EquipmentStatus } from "@app/generated/prisma";
import { getAllCustomers } from "@/lib/customers";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { createCustomerAction } from "@/lib/customers";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface RentEquipmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    equipment: Equipment | null;
    diveCenterId: string;
}

const formSchema = z.object({
    rentedTo: z.string().optional(),
    fullName: z.string().optional(),
    email: z.string().email().optional(),
    rentPrice: z.string().optional(),
    quantity: z.string().optional(),
    rentFrom: z.date().optional(),
    rentTo: z.date().optional(),
}).refine((data) => {
    return data.rentedTo || (data.fullName && data.email);
}, {
    message:
        "Please provide either customer from saved list or a new name and email.",
});

export function RentEquipmentDialog(
    { open, onOpenChange, equipment, diveCenterId }: RentEquipmentDialogProps,
) {
    const [activeTab, setActiveTab] = useState<"basic" | "details" | "rental">(
        "basic",
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        rentedTo: "",
    });
    const [customers, setCustomers] = useState<Customer[]>([]);

    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            rentedTo: "",
            fullName: "",
            email: "",
            rentFrom: undefined,
            rentTo: undefined,
        },
    });

    useEffect(() => {
        // Fetch staff members from the server or context
        const fetchCustomers = async () => {
            try {
                const customer = await getAllCustomers(diveCenterId);
                setCustomers(customer as Customer[]);
            } catch (error) {
                console.error("Error fetching customers.", error);
            }
        };
        fetchCustomers();
    }, [diveCenterId]);

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = () => {
        console.log(formData);
        // if (mode === ActionMode.create) {
        //     createEquipment(formData);
        //     router.refresh();
        // } else {
        //     if (equipment) {
        //         updateEquipment(equipment.id, formData);
        //         router.refresh();
        //     }
        // }
        onSubmit(form.getValues());
        onOpenChange(false);
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);

        try {
            if (!equipment) {
                console.error("No equipment selected for rental.");
                setIsSubmitting(false);
                return;
            }

            const existingCustomer = values.rentedTo;
            const rentPrice = values.rentPrice ? parseFloat(values.rentPrice) : 0;
            const rentFrom = values.rentFrom || new Date();
            const rentTo = values.rentTo || null;
            const quantity = values.quantity ? parseInt(values.quantity, 10) : 1;

            if (existingCustomer) {
                // Rent to existing customer
                rentEquipment(
                    equipment.id,
                    existingCustomer,
                    quantity,
                    rentPrice,
                    rentFrom,
                    rentTo,
                ).then(() => {
                    setIsSubmitting(false);
                    form.reset();
                    router.refresh();
                    onOpenChange(false);
                    toast({
                        title: "Equipment Rented",
                        description: "Equipment has been successfully rented.",
                    });
                }).catch((error) => {
                    console.error("Error renting equipment:", error);
                    setIsSubmitting(false);
                    toast({
                        title: "Error",
                        description: "Failed to rent equipment. Please try again.",
                        variant: "destructive",
                    });
                });
            } else if (values.fullName && values.email) {
                // Create new customer and rent
                const formData = new FormData();
                formData.append("fullName", values.fullName);
                formData.append("email", values.email);
                formData.append("diveCenterId", diveCenterId);
                
                createCustomerAction(formData).then((result) => {
                    if (result.success && result.data) {
                        return rentEquipment(
                            equipment.id,
                            result.data.id,
                            quantity,
                            rentPrice,
                            rentFrom,
                            rentTo,
                        );
                    } else {
                        throw new Error("Failed to create customer");
                    }
                }).then(() => {
                    setIsSubmitting(false);
                    form.reset();
                    router.refresh();
                    onOpenChange(false);
                    toast({
                        title: "Equipment Rented",
                        description: "New customer created and equipment rented successfully.",
                    });
                }).catch((error) => {
                    console.error("Error creating customer and renting equipment:", error);
                    setIsSubmitting(false);
                    toast({
                        title: "Error",
                        description: "Failed to create customer and rent equipment. Please try again.",
                        variant: "destructive",
                    });
                });
            } else {
                console.error("No customer selected or new customer details provided");
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error("Error in onSubmit:", error);
            setIsSubmitting(false);
        }
    }

    return (
        <div className="p-4">
            {equipment
                    ?.status ===
                    EquipmentStatus
                        .available
                ? (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="rentedTo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rent to</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select customer" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {customers.map((customer) => (
                                                    <SelectItem
                                                        key={customer.id}
                                                        value={customer.id}
                                                    >
                                                        {customer.fullName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Other Customer Name/Email Field */}
                            {/* <div className="mt-2">
                                Or enter name and email
                            </div>
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="Name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="Email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="rentPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Price"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="quantity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quantity</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    placeholder="1"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                    <FormField
                                        control={form.control}
                                        name="rentFrom"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>From</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "pl-3 text-left font-normal",
                                                                    !field
                                                                        .value &&
                                                                        "text-muted-foreground",
                                                                )}
                                                            >
                                                                {field.value
                                                                    ? format(
                                                                        field
                                                                            .value,
                                                                        "PPP",
                                                                    )
                                                                    : (
                                                                        <span>
                                                                            Pick
                                                                            a
                                                                            date
                                                                        </span>
                                                                    )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-auto p-0"
                                                        align="start"
                                                    >
                                                        <Calendar
                                                            mode="single"
                                                            selected={field
                                                                .value}
                                                            onSelect={field
                                                                .onChange}
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
                                        name="rentTo"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>To</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "pl-3 text-left font-normal",
                                                                    !field
                                                                        .value &&
                                                                        "text-muted-foreground",
                                                                )}
                                                            >
                                                                {field.value
                                                                    ? format(
                                                                        field
                                                                            .value,
                                                                        "PPP",
                                                                    )
                                                                    : (
                                                                        <span>
                                                                            Pick
                                                                            a
                                                                            date
                                                                        </span>
                                                                    )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-auto p-0"
                                                        align="start"
                                                    >
                                                        <Calendar
                                                            mode="single"
                                                            selected={field
                                                                .value}
                                                            onSelect={field
                                                                .onChange}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                            </div>
                            <div className="flex items-center justify-end gap-2 p-4 border-t bg-muted/50">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onOpenChange(false)}
                                >
                                    Cancel
                                </Button>
                                <Button size="sm" onClick={handleSubmit}>
                                    Rent
                                </Button>
                            </div>
                        </form>
                    </Form>
                )
                : (
                    <div className="flex flex-col items-center justify-center h-full p-4">
                        <Button
                            size="sm"
                            onClick={() => {
                                if (
                                    equipment
                                        ?.id
                                ) {
                                    makeEquipmentAvailable(
                                        equipment
                                            ?.id,
                                    );
                                    onOpenChange(false);
                                    router
                                        .refresh();
                                }
                            }}
                        >
                            Make Available
                        </Button>
                    </div>
                )}
        </div>
    );
}
