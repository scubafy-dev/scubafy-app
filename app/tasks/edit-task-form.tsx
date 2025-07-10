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
import { Loader2 } from "lucide-react";

import { updateTask, TaskWithAssignments } from "@/lib/task";
import { getAllStaff } from "@/lib/staffs";
import { Staff } from "@/app/generated/prisma";
import { useRouter } from "next/navigation";
import { useDiveCenter } from "@/lib/dive-center-context";
import { useToast } from "@/hooks/use-toast";

interface EditTaskFormProps {
    task: TaskWithAssignments;
    onSuccess: () => void;
}

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Task title must be at least 2 characters.",
    }),
    description: z.string().min(10, {
        message: "Task description must be at least 10 characters.",
    }),
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

export function EditTaskForm({ task, onSuccess }: EditTaskFormProps) {
    const {toast} =useToast()
    const { currentCenter, isAllCenters, getCenterSpecificData } =
    useDiveCenter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
    const [isStaffLoading, setIsStaffLoading] = useState(true);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: task.title,
            description: task.description || "",
            assignedTo: Array.isArray(task.assignments) ? task.assignments.map(a => a.staff.id) : [],
            dueDate: task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate),
            priority: task.priority,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
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
                await updateTask(task.id, formData);
            } catch (error) {
                console.error("Error updating task:", error);
                setIsSubmitting(false);
                return;
            }
            setIsSubmitting(false);
            form.reset();
            router.refresh();
            onSuccess();
        }, 1000);
    }

    useEffect(() => {
        // Fetch staff members from the server or context
        const fetchStaffMembers = async () => {
            setIsStaffLoading(true);
            try {
                if (currentCenter?.id) {
                    const staff = await getAllStaff(currentCenter?.id);
                    setStaffMembers(staff as Staff[]);
                }else {
                    toast({
                      title: "Error",
                      description: "Dive center Id required",
                      variant: "destructive",
                    });
                  }
            } catch (error) {
                console.error("Error fetching staff members:", error);
            } finally {
                setIsStaffLoading(false);
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
                    defaultValue={task.title}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Task Title</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter task title"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    defaultValue={task.description || ""}
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
                                            disabled={isStaffLoading}
                                        >
                                            {isStaffLoading ? (
                                                <span className="flex items-center">
                                                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                                    Loading staff...
                                                </span>
                                            ) : field.value?.length ? (
                                                staffMembers
                                                    .filter((staff) => field.value.includes(staff.id))
                                                    .map((staff) => staff.fullName)
                                                    .join(", ")
                                            ) : (
                                                "Select staff members"
                                            )}
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
                                                <input
                                                    type="checkbox"
                                                    checked={field.value?.includes(staff.id) || false}
                                                    tabIndex={-1}
                                                    className="mr-2"
                                                    readOnly
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
                                                !field.value &&
                                                "text-muted-foreground",
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
                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date <
                                            new Date(
                                                new Date().setHours(
                                                    0,
                                                    0,
                                                    0,
                                                    0,
                                                ),
                                            )}
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
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select priority level" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">
                                        Medium
                                    </SelectItem>
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
                    {isSubmitting ? "Updating..." : "Update Task"}
                </Button>
            </form>
        </Form>
    );
}
