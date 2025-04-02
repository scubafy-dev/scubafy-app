"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { EquipmentInventory } from "@/components/equipment-inventory"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AddEquipmentForm } from "@/components/add-equipment-form"

export default function EquipmentPage() {
  const [isAddEquipmentOpen, setIsAddEquipmentOpen] = useState(false)

  return (
    <DashboardShell>
      <DashboardHeader heading="Equipment" text="Manage your dive equipment inventory.">
        <Button onClick={() => setIsAddEquipmentOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Equipment
        </Button>
      </DashboardHeader>
      <EquipmentInventory />

      <Dialog open={isAddEquipmentOpen} onOpenChange={setIsAddEquipmentOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Equipment</DialogTitle>
          </DialogHeader>
          <AddEquipmentForm onSuccess={() => setIsAddEquipmentOpen(false)} />
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}

