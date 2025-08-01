"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { createTask } from "@/lib/task";
import { getAllStaff } from "@/lib/staffs";
import { Staff } from "@/app/generated/prisma";
import { useRouter } from "next/navigation";
import { useDiveCenter } from "@/lib/dive-center-context";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Task title must be at least 2 characters.",
  }),
  description: z.string(),
  assignedTo: z.array(z.string()).min(1, {
    message: "Please select at least one staff member.",
  }),
  dueDate: z.date({
    required_error: "Please select a due date.",
  }),
  priority: z.enum(["low", "medium", "high"], {
    required_error: "Please select a priority level.",
  }),
});

interface AddTaskFormProps {
  onSuccess: () => void;
}

export function AddTaskForm({ onSuccess }: AddTaskFormProps) {
  const { currentCenter, isAllCenters, getCenterSpecificData } =
    useDiveCenter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(async () => {
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((v) => formData.append(key, v));
          } else {
            formData.append(key, value.toString());
          }
        });
        if (!currentCenter?.id) {
          toast({
            title: "Error",
            description: "Dive center not found.",
          });
          return;
        }
        const res = await createTask(formData, currentCenter.id);
        if (res?.success) {
          toast({
            title: "Task added successfully"
          });
          form.reset();
          onSuccess();
          router.refresh()
        } else {
          console.error('Failed to create task:', res);
          toast({
            title: "Error",
            description: "Failed to create task. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error creating task:", error);
        setIsSubmitting(false);
        return;
      }
      console.log(values);
      setIsSubmitting(false);
      form.reset();
      router.refresh(); // Refresh the page to show the new task
      onSuccess();
    }, 1000);
  }

  // Sample staff data - in a real app, this would come from an API
  // const staffMembers = [
  //   { id: "S-1001", name: "John Smith" },
  //   { id: "S-1002", name: "Sarah Johnson" },
  //   { id: "S-1003", name: "Michael Brown" },
  //   { id: "S-1004", name: "Emily Davis" },
  //   { id: "S-1005", name: "David Wilson" },
  // ];

  useEffect(() => {
    // Fetch staff members from the server or context
    const fetchStaffMembers = async () => {
      try {
        if (currentCenter?.id) {
          const staff = await getAllStaff(currentCenter.id);
          setStaffMembers(staff as Staff[]);
        } else {
          toast({
            title: "Error",
            description: "Dive center Id required",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching staff members:", error);
      }
    };
    fetchStaffMembers();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field} />
              </FormControl>
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
                  placeholder="Enter task description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assignedTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign To</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value?.length && "text-muted-foreground"
                      )}
                    >
                      {field.value?.length
                        ? staffMembers
                          .filter((staff) => field.value.includes(staff.id))
                          .map((staff) => staff.fullName)
                          .join(", ")
                        : "Select staff members"}
                      <span className="ml-2">▼</span>
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <div className="max-h-60 overflow-y-auto">
                    {staffMembers.map((staff) => (
                      <div
                        key={staff.id}
                        className="flex items-center w-full px-3 py-2 hover:bg-accent cursor-pointer"
                        onClick={() => {
                          const selected = field.value || [];
                          if (selected.includes(staff.id)) {
                            field.onChange(selected.filter((id) => id !== staff.id));
                          } else {
                            field.onChange([...selected, staff.id]);
                          }
                        }}
                      >
                        <Checkbox
                          checked={field.value?.includes(staff.id) || false}
                          tabIndex={-1}
                          className="mr-2"
                          onCheckedChange={() => {
                            const selected = field.value || [];
                            if (selected.includes(staff.id)) {
                              field.onChange(selected.filter((id) => id !== staff.id));
                            } else {
                              field.onChange([...selected, staff.id]);
                            }
                          }}
                        />
                        <span>{staff.fullName}</span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? (
                          format(field.value, "PPP")
                        )
                        : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))}
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
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Set the priority level for this task
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          onClick={() => {
            form.handleSubmit(onSubmit);
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Task"}
        </Button>
      </form>
    </Form>
  );
}
