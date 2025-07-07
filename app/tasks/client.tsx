"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AddTaskForm } from "@/components/add-task-form";
import { useDiveCenter } from "@/lib/dive-center-context";
import { TaskStatus } from "@app/generated/prisma";
import { TaskWithAssignments } from "@/lib/task";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Calendar,
    Edit,
    Mail,
    MoreHorizontal,
    Phone,
    Trash,
} from "lucide-react";
import { EditTaskForm } from "./edit-task-form";
import { getAllTasks, deleteTask } from "@/lib/task";
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
import { useToast } from "@/components/ui/use-toast";

export default function TasksClient() {
    const [tasks, setTasks] = useState<TaskWithAssignments[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    const { currentCenter, isAllCenters, getCenterSpecificData } =
        useDiveCenter();
    // console.log('center info task',currentCenter,isAllCenters,getCenterSpecificData)    
    const [selectedTask, setSelectedTask] = useState<TaskWithAssignments | null>(
        null,
    );
    const [isUpdateTaskOpen, setIsUpdateTaskOpen] = useState(false);
    const [isDeleteTaskAlertOpen, setIsDeleteTaskAlertOpen] = useState(false);
    const { toast } = useToast();

    const fetchTaskList = useCallback(async () => {
        try {
            setIsLoading(true);
            const fetchedTasks = await getAllTasks(currentCenter?.id);
            setTasks(fetchedTasks);
        } catch (error) {
            console.error("Failed to load customersData:", error);
            setTasks([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentCenter?.id]);

    useEffect(() => {
        // Always set loading to true when currentCenter changes
        setIsLoading(true);

        if (currentCenter?.id) {
            fetchTaskList();
        } else {
            // If no center, just set empty state and stop loading
            setTasks([]);
            setIsLoading(false);
        }
    }, [currentCenter, fetchTaskList]);

    const handleTaskCreated = useCallback(async () => {
        // Refresh the customer list after successful creation
        await fetchTaskList();
        setIsAddTaskOpen(false);
    }, [fetchTaskList]);

    const handleSuccess = () => {
        setIsAddTaskOpen(false);
        setIsUpdateTaskOpen(false);
        fetchTaskList();
    };

    const handleDelete = async () => {
        if (!selectedTask) return;
        try {
            await deleteTask(selectedTask.id);
            toast({
                title: "Task Deleted",
                description: "The task has been successfully deleted.",
            });
            fetchTaskList();
        } catch (error) {
            console.error("Failed to delete task:", error);
            toast({
                title: "Error",
                description: "Failed to delete the task.",
                variant: "destructive",
            });
        } finally {
            setIsDeleteTaskAlertOpen(false);
        }
    };

    // Function to get badge color based on priority
    const getPriorityColor = (priority: TaskWithAssignments["priority"]) => {
        switch (priority) {
            case "high":
                return "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400";
            case "medium":
                return "bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-400";
            default:
                return "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400";
        }
    };

    // Function to get badge color based on status
    const getStatusColor = (status: TaskStatus) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400";
            case "in_progress":
                return "bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-400";
            default:
                return "bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-400";
        }
    };

    return (
        <DashboardShell>
            <DashboardHeader
                heading="Tasks"
                text="Manage and track tasks across your dive center."
            >
                <Button onClick={() => setIsAddTaskOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Task
                </Button>
            </DashboardHeader>

            <Card>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Task</TableHead>
                                    <TableHead>Assigned To</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Category</TableHead>
                                    {isAllCenters && (
                                        <TableHead>Center</TableHead>
                                    )}
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center">
                                            Loading tasks...
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tasks.map((task: TaskWithAssignments) => (
                                        <TableRow key={task.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">
                                                        {task.title}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {task.description}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {task.assignments && task.assignments.length > 0
                                                    ? task.assignments.map(a => a.staff.fullName).join(", ")
                                                    : <span className="text-muted-foreground">Unassigned</span>}
                                            </TableCell>
                                            <TableCell>
                                                {task.dueDate.toDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={getPriorityColor(
                                                        task.priority,
                                                    )}
                                                >
                                                    {task.priority}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={getStatusColor(
                                                        task.status,
                                                    )}
                                                >
                                                    {task.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {task.category}
                                                </Badge>
                                            </TableCell>
                                            {isAllCenters && (
                                                <TableCell>
                                                    <span className="text-sm font-medium">
                                                        {(task as any).center}
                                                    </span>
                                                </TableCell>
                                            )}
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <span className="sr-only">
                                                                Open menu
                                                            </span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>
                                                            Actions
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedTask(
                                                                    task,
                                                                );
                                                                setIsUpdateTaskOpen(
                                                                    true,
                                                                );
                                                            }}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            {" "}
                                                            Edit Task
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() => {
                                                                setSelectedTask(
                                                                    task,
                                                                );
                                                                setIsDeleteTaskAlertOpen(
                                                                    true,
                                                                );
                                                            }}
                                                        >
                                                            <Trash className="mr-2 h-4 w-4" />
                                                            {" "}
                                                            Remove Task
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            
            {/* Adding New Task */}
            <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                    </DialogHeader>
                    <AddTaskForm onSuccess={handleTaskCreated} />
                </DialogContent>
            </Dialog>

            {selectedTask && (
                <Dialog
                    open={isUpdateTaskOpen}
                    onOpenChange={setIsUpdateTaskOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Update Task</DialogTitle>
                        </DialogHeader>
                        <EditTaskForm
                            task={selectedTask}
                            onSuccess={handleSuccess}
                        />
                    </DialogContent>
                </Dialog>
            )}

            <AlertDialog
                open={isDeleteTaskAlertOpen}
                onOpenChange={setIsDeleteTaskAlertOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the task.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardShell>
    );
}
