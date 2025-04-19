"use client"

import { format } from "date-fns"
import { Calendar, Clock, User, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"

interface TaskDetailsDialogProps {
  task: {
    id: string
    title: string
    description: string
    assignedTo: {
      name: string
      avatar: string
    }
    dueDate: string
    urgency: string
    completed: boolean
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onToggleComplete: (taskId: string, e?: React.MouseEvent) => void
}

export function TaskDetailsDialog({
  task,
  open,
  onOpenChange,
  onToggleComplete,
}: TaskDetailsDialogProps) {
  if (!task) return null

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

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "low":
        return <AlertTriangle className="h-4 w-4 text-green-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const handleToggleComplete = () => {
    onToggleComplete(task.id)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{task.title}</span>
            <Badge className={getUrgencyColor(task.urgency)}>
              {getUrgencyIcon(task.urgency)}
              <span className="ml-1">
                {task.urgency.charAt(0).toUpperCase() + task.urgency.slice(1)}
              </span>
            </Badge>
          </DialogTitle>
          <DialogDescription>
            <Badge className={getUrgencyColor(task.urgency)}>
              {task.urgency.charAt(0).toUpperCase() + task.urgency.slice(1)} Priority
            </Badge>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Description</h3>
            <p className="text-sm text-muted-foreground">{task.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Assigned To</h3>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={task.assignedTo.avatar} alt={task.assignedTo.name} />
                  <AvatarFallback>{task.assignedTo.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{task.assignedTo.name}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Due Date</h3>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {format(new Date(task.dueDate), "MMMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Status</h3>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={task.completed}
                onCheckedChange={handleToggleComplete}
                aria-label="Mark task as complete"
              />
              <span className="text-sm">
                {task.completed ? "Completed" : "In Progress"}
              </span>
              {task.completed ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-amber-500" />
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button variant="default">Edit Task</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 