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
import { Equipment, EquipmentFormType } from "@/lib/equipment";
import { ActionMode } from "@/types/all";
import { useRouter } from "next/navigation";
import { rentEquipment } from "@/lib/equipment";
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

interface RentEquipmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    equipment: Equipment | null;
}

const formSchema = z.object({
    rentedTo: z.string(),
});

export function RentEquipmentDialog(
    { open, onOpenChange, equipment }: RentEquipmentDialogProps,
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

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    });

    useEffect(() => {
        // Fetch staff members from the server or context
        const fetchCustomers = async () => {
            try {
                const customer = await getAllCustomers();
                setCustomers(customer as Customer[]);
            } catch (error) {
                console.error("Error fetching customers.", error);
            }
        };
        fetchCustomers();
    }, []);

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
        onOpenChange(false);
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(async () => {
            try {
                const formData = new FormData();
                Object.entries(values).forEach(([key, value]) => {
                    formData.append(key, value.toString());
                });
                if (!equipment) {
                    console.error("No equipment selected for rental.");
                    setIsSubmitting(false);
                    return;
                }
                await rentEquipment(
                    equipment?.id,
                    formData.get("rentedTo") as string,
                );
            } catch (error) {
                console.error("Error creating task:", error);
                setIsSubmitting(false);
                return;
            }
            console.log(values);
            setIsSubmitting(false);
            form.reset();
            router.refresh(); // Refresh the page to show the new task
        }, 1000);
    }

    return (
        <div className="p-4">
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
        </div>
    );
}
