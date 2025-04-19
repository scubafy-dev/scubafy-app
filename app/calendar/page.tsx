"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { DiveCalendar } from "@/components/dive-calendar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AddEventForm } from "@/components/add-event-form"

export default function CalendarPage() {
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)

  return (
    <DashboardShell>
      <DashboardHeader heading="Calendar">
        <Button onClick={() => setIsAddEventOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </DashboardHeader>
      <DiveCalendar />

      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Calendar Event</DialogTitle>
          </DialogHeader>
          <AddEventForm onSuccess={() => setIsAddEventOpen(false)} />
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}

