"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { StaffDirectory, StaffMember } from "@/components/staff-directory"
import { AddStaffDialog } from "@/components/add-staff-dialog"

export default function StaffPage() {
  const [showAddStaffDialog, setShowAddStaffDialog] = useState(false)
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])

  const handleAddStaffMember = (staffData: Omit<StaffMember, "id" | "avatar">) => {
    // Generate a new staff ID
    const newId = `S-${Math.floor(1000 + Math.random() * 9000)}`

    // Create new staff member with generated ID and default avatar
    const newStaffMember: StaffMember = {
      ...staffData,
      id: newId,
      avatar: "/placeholder.svg?height=40&width=40",
    }

    // Add the new staff member to the list
    setStaffMembers((prevStaff) => [...prevStaff, newStaffMember])
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Staff" text="Manage your dive center staff and instructors.">
        <Button onClick={() => setShowAddStaffDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Staff Member
        </Button>
      </DashboardHeader>
      <StaffDirectory externalStaff={staffMembers} />
      <AddStaffDialog 
        open={showAddStaffDialog} 
        onOpenChange={setShowAddStaffDialog} 
        onAddStaff={handleAddStaffMember}
      />
    </DashboardShell>
  )
}

