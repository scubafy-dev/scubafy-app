"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TasksTable } from "@/components/tasks-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AddTaskForm } from "@/components/add-task-form"

export default function TasksPage() {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)

  return (
    <DashboardShell>
      <DashboardHeader heading="Tasks" text="Assign and manage tasks for your staff.">
        <Button onClick={() => setIsAddTaskOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Task
        </Button>
      </DashboardHeader>
      <TasksTable />

      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <AddTaskForm onSuccess={() => setIsAddTaskOpen(false)} />
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
} 