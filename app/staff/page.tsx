import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { StaffDirectory } from "@/components/staff-directory"

export default function StaffPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Staff" text="Manage your dive center staff and instructors.">
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Staff Member
        </Button>
      </DashboardHeader>
      <StaffDirectory />
    </DashboardShell>
  )
}

