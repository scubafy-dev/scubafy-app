"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { StaffMember } from "./staff-directory";
import { StaffWithPermissions } from "@/lib/staffs";
import { useRouter } from "next/navigation";
import { createStaff } from "@/lib/staffs";

// Define the permissions available in the system
const accessOptions = [
  { id: "dive-trips", label: "Dive Trips" },
  { id: "customers", label: "Customers" },
  { id: "equipment", label: "Equipment" },
  { id: "staff", label: "Staff" },
  { id: "tasks", label: "Tasks" },
  { id: "reports", label: "Reports" },
  { id: "course-tracker", label: "Course Tracker" },
  { id: "calendar", label: "Calendar" },
  { id: "finances", label: "Finances" },
];

// Define the staff schema
const staffSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  role: z.string().min(1, "Please enter a role."),
  salary: z.string().optional(),
  age: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  bio: z.string().optional(),
  access: z.array(z.string()).min(
    1,
    "Please select at least one access permission.",
  ),
  status: z.enum(["active", "inactive", "freelance"]),
});

type StaffFormValues = z.infer<typeof staffSchema>;

interface AddStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff?: StaffWithPermissions | null;
  createStaff?: (formData: FormData) => Promise<void>;
  updateStaff?: (id: string, formData: FormData) => Promise<void>;
}

export function AddStaffDialog(
  { open, onOpenChange, staff, createStaff, updateStaff }: AddStaffDialogProps,
) {
  const router = useRouter();

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: staff?.fullName || "",
      email: staff?.email || "",
      phone: staff?.phoneNumber || "",
      role: staff?.roleTitle || "",
      salary: staff?.salary ? String(staff.salary) : "",
      age: staff?.age ? String(staff.age) : "",
      gender: staff?.gender || "",
      address: staff?.address || "",
      emergencyContact: staff?.emergencyContact || "",
      bio: staff?.bio || "",
      access: staff?.permissions || [],
      status: staff?.status || "active",
    },
  });

  function onSubmit(values: StaffFormValues) {
    // Convert the form values to match StaffMember type
    // const staffData = {
    //   ...values,
    //   // Ensure compatibility with StaffMember type which still has specialties and certification
    //   specialties: values.access,
    //   certification: values.role, // Use role as certification for backward compatibility
    // };

    const formData = new FormData();

    Object.entries(values).forEach(([key, val]) => {
      if (val == null) return;

      if (Array.isArray(val)) {
        // for permissions, tags, whatever array field you have...
        val.forEach((item) => {
          formData.append(key, item);
        });
      } else {
        formData.append(key, String(val));
      }
    });

    if (createStaff) {
      createStaff(formData);
    } else if (updateStaff && staff) {
      updateStaff(staff.id, formData);
    }

    // Reset form and close dialog
    form.reset();
    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {createStaff ? "Add" : "Update"} Staff Member
          </DialogTitle>
          <DialogDescription>
            {createStaff ? "Add a new" : "Update"}
            staff member to your dive center team.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter staff member's full name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
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
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="25" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="non-binary">Non-binary</SelectItem>
                          <SelectItem value="prefer-not-to-say">
                            Prefer not to say
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Dive Instructor, Manager, etc."
                          {...field}
                        />
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">On Leave</SelectItem>
                          <SelectItem value="freelance">Freelance</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary (monthly in USD)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 2000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Information</h3>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact</FormLabel>
                    <FormControl>
                      <Input placeholder="Name and phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio/Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional information about this staff member"
                        className="resize-none min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">System Access</h3>
              <FormField
                control={form.control}
                name="access"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">
                        Access Permissions
                      </FormLabel>
                      <FormDescription>
                        Select which areas this staff member can access
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {accessOptions.map((option) => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="access"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked
                                        ? [...field.value, option.id]
                                        : field.value?.filter(
                                          (value) => value !== option.id,
                                        );
                                      field.onChange(updatedValue);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                {createStaff ? "Add" : "Update"} Staff Member
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
