"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Customer } from "@/lib/customers";
import { useDiveCenter } from "@/lib/dive-center-context";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phoneNumber: z.string().optional(),
  certificationLevel: z.string({
    required_error: "Please select a certification level.",
  }),
  room: z.string().optional(),
  numberOfNights: z.coerce.number().min(0, {
    message: "Number of nights must be a positive number.",
  }).optional(),
  roomCost: z.coerce.number().min(0, {
    message: "Room cost must be a positive number.",
  }).optional(),
});

export function AddCustomerForm(
  { onSuccess, createCustomer, customer, updateCustomer }: {
    onSuccess: () => void;
    createCustomer?: (formData: FormData, diveCenterId: string) => Promise<any>;
    customer: Customer | null;
    updateCustomer?: (id: string, formData: FormData) => Promise<void>;
  },
) {
  const { currentCenter } = useDiveCenter()
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: customer?.fullName ?? "",
      email: customer?.email ?? "",
      certificationLevel: customer?.certificationLevel ?? "",
      phoneNumber: customer?.phoneNumber ?? "",
      room: customer?.roomNumber ?? "",
      numberOfNights: customer?.numberOfNights ?? 0,
      roomCost: customer?.roomCost ?? 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    setTimeout(async () => {
      try {
        console.log(values);
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });

        if (updateCustomer) {
          if (!customer) {
            toast({
              title: "Error",
              description: "Customer not found.",
            });
            return;
          }
          await updateCustomer(customer.id, formData);
          toast({
            title: "Customer updated successfully",
            description: `${values.fullName} has been updated.`,
          });
          form.reset();
          onSuccess();
        } else if (createCustomer) {
          if (!currentCenter?.id) {
            toast({
              title: "Error",
              description: "Dive center not found.",
            });
            return;
          }
          const res = await createCustomer(formData, currentCenter.id);
          console.log('customer added res', res);
          if (res?.success) {
            toast({
              title: "Customer added successfully",
              description: `${values.fullName} has been added to your customer database.`,
            });
            form.reset();
            onSuccess();
          } else {
            console.error('Failed to create customer:', res?.error);
            toast({
              title: "Error",
              description: "Failed to create customer. Please try again.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast({
          title: "Error",
          description: "Failed to save customer. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 1000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="john@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="certificationLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certification Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select certification level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="openWater">Open Water</SelectItem>
                    <SelectItem value="advancedOpenWater">
                      Advanced Open Water
                    </SelectItem>
                    <SelectItem value="rescue">Rescue Diver</SelectItem>
                    <SelectItem value="diveMaster">Divemaster</SelectItem>
                    <SelectItem value="instructor">Instructor</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="room"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 101" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="numberOfNights"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Nights</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roomCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Cost</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onSuccess}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? createCustomer ? "Adding..." : "Updating"
              : createCustomer
                ? "Add Customer"
                : "Update Customer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
