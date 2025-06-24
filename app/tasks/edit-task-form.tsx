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

import { createTask, TaskWithAssignee, updateTask } from "@/lib/task";
import { getAllStaff } from "@/lib/staffs";
import { Staff } from "@/app/generated/prisma";
import { useRouter } from "next/navigation";

interface EditTaskFormProps {
    task: TaskWithAssignee;
    onSuccess: () => void;
}

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Task title must be at least 2 characters.",
    }),
    description: z.string().min(10, {
        message: "Task description must be at least 10 characters.",
    }),
    assignedTo: z.string({
        required_error: "Please select a staff member.",
    }),
    dueDate: z.date({
        required_error: "Please select a due date.",
    }),
    priority: z.enum(["low", "medium", "high"], {
        required_error: "Please select a priority level.",
    }),
});

export function EditTaskForm({ task, onSuccess }: EditTaskFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [staffMembers, setStaffMembers] = useState<Staff[]>([]);

    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: task.title,
            description: task.description || "",
            assignedTo: task.assignedTo.id,
            dueDate: task.dueDate,
            priority: task.priority,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(async () => {
            try {
                const formData = new FormData();
                Object.entries(values).forEach(([key, value]) => {
                    formData.append(key, value.toString());
                });
                await updateTask(task.id, formData);
            } catch (error) {
                console.error("Error creating task:", error);
                setIsSubmitting(false);
                return;
            }
            console.log(values);
            setIsSubmitting(false);
            form.reset();
            router.refresh();
            onSuccess();
        }, 1000);
    }

    useEffect(() => {
        // Fetch staff members from the server or context
        const fetchStaffMembers = async () => {
            try {
                const staff = await getAllStaff();
                setStaffMembers(staff as Staff[]);
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
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select staff member" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent
                                    defaultValue={task.assignedTo.id}
                                >
                                    {staffMembers.map((staff) => (
                                        <SelectItem
                                            key={staff.id}
                                            value={staff.id}
                                        >
                                            {staff.fullName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
