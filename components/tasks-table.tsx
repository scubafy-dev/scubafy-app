"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, User, Filter, Check } from "lucide-react"
import { format } from "date-fns"
import { TaskDetailsDialog } from "@/components/task-details-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TasksTableProps {
  className?: string
}

export function TasksTable({ className }: TasksTableProps) {
  const [tasks, setTasks] = useState([
    {
      id: "T-1001",
      title: "Check equipment inventory",
      description: "Verify all diving equipment is properly maintained and available",
      assignedTo: {
        name: "John Smith",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      dueDate: "2025-03-25",
      urgency: "high",
      completed: false,
    },
    {
      id: "T-1002",
      title: "Update dive site information",
      description: "Add new dive sites to the website and update existing ones",
      assignedTo: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      dueDate: "2025-03-28",
      urgency: "medium",
      completed: false,
    },
    {
      id: "T-1003",
      title: "Prepare welcome packets",
      description: "Create welcome packets for new divers joining next week",
      assignedTo: {
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      dueDate: "2025-03-30",
      urgency: "low",
      completed: true,
    },
    {
      id: "T-1004",
      title: "Schedule staff training",
      description: "Organize training session for new safety protocols",
      assignedTo: {
        name: "Emily Davis",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      dueDate: "2025-04-02",
      urgency: "high",
      completed: false,
    },
    {
      id: "T-1005",
      title: "Review customer feedback",
      description: "Analyze recent customer surveys and implement improvements",
      assignedTo: {
        name: "David Wilson",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      dueDate: "2025-04-05",
      urgency: "medium",
      completed: false,
    },
  ])

  const [selectedTask, setSelectedTask] = useState<typeof tasks[0] | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState("all")

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400"
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-400"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400"
    }
  }

  const handleRowClick = (task: typeof tasks[0]) => {
    setSelectedTask(task)
    setIsDetailsOpen(true)
  }

  const handleCheckboxClick = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation()
    toggleTaskCompletion(taskId)
  }

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === "all") return true
    if (activeFilter === "ongoing") return !task.completed
    if (activeFilter === "completed") return task.completed
    return true
  })

  const ongoingTasksCount = tasks.filter((task) => !task.completed).length
  const completedTasksCount = tasks.filter((task) => task.completed).length

  return (
    <>
      <Card className={cn("col-span-1", className)}>
        <CardContent>
          <Tabs defaultValue="all" value={activeFilter} onValueChange={setActiveFilter} className="mb-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="flex items-center gap-1">
                <Filter className="h-3 w-3" />
                <span>All Tasks</span>
                <Badge variant="outline" className="ml-1">{tasks.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="ongoing" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Ongoing</span>
                <Badge variant="outline" className="ml-1">{ongoingTasksCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-sm border border-current flex items-center justify-center">
                  <Check className="h-2 w-2" />
                </div>
                <span>Completed</span>
                <Badge variant="outline" className="ml-1">{completedTasksCount}</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Status</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Urgency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No tasks found for this filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.map((task) => (
                    <TableRow 
                      key={task.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(task)}
                    >
                      <TableCell>
                        <div onClick={(e) => handleCheckboxClick(e, task.id)}>
                          <Checkbox
                            checked={task.completed}
                            aria-label="Mark task as complete"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{task.title}</span>
                          <span className="text-xs text-muted-foreground">{task.description}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={task.assignedTo.avatar} alt={task.assignedTo.name} />
                            <AvatarFallback>{task.assignedTo.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{task.assignedTo.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getUrgencyColor(task.urgency)}>
                          {task.urgency.charAt(0).toUpperCase() + task.urgency.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <TaskDetailsDialog
        task={selectedTask}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onToggleComplete={toggleTaskCompletion}
      />
    </>
  )
} 