"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DiveTripsTable } from "@/components/dive-trips-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AddTripForm } from "@/components/add-trip-form"

export default function DiveTripsPage() {
  const [isAddTripOpen, setIsAddTripOpen] = useState(false)

  return (
    <DashboardShell>
      <DashboardHeader heading="Dive Trips" text="Manage your dive trips and schedules.">
        <Button onClick={() => setIsAddTripOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Trip
        </Button>
      </DashboardHeader>
      <DiveTripsTable />

      <Dialog open={isAddTripOpen} onOpenChange={setIsAddTripOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Dive Trip</DialogTitle>
          </DialogHeader>
          <AddTripForm onSuccess={() => setIsAddTripOpen(false)} />
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}

