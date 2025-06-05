"use client";

import { useState } from "react";
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
import { TaskWithAssignee } from "@/lib/task";
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

export default function TasksClient({ tasks }: { tasks: TaskWithAssignee[] }) {
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    const { currentCenter, isAllCenters, getCenterSpecificData } =
        useDiveCenter();
    const [selectedTask, setSelectedTask] = useState<TaskWithAssignee | null>(
        null,
    );
    const [isUpdateTaskOpen, setIsUpdateTaskOpen] = useState(false);

    // Get tasks based on selected dive center
    // const tasks = getCenterSpecificData(tasksByCenter, allCentersTasks);

    // Function to get badge color based on priority
    const getPriorityColor = (priority: TaskWithAssignee["priority"]) => {
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
                                {tasks.map((task) => (
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
                                            {task.assignedTo.fullName}
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
                                                    <DropdownMenuItem className="text-destructive">
                                                        <Trash className="mr-2 h-4 w-4" />
                                                        {" "}
                                                        Remove Task
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                    </DialogHeader>
                    <AddTaskForm onSuccess={() => setIsAddTaskOpen(false)} />
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
                            onSuccess={() => setIsUpdateTaskOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            )}
        </DashboardShell>
    );
}
