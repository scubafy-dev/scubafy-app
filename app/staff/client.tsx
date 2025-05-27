"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { StaffDirectory } from "@/components/staff-directory";
import { AddStaffDialog } from "@/components/add-staff-dialog";
import { useDiveCenter } from "@/lib/dive-center-context";
import { allStaff, staffByCenter } from "@/lib/mock-data/staff";

export default function StaffClient() {
    const [showAddStaffDialog, setShowAddStaffDialog] = useState(false);
    const { currentCenter, isAllCenters } = useDiveCenter();

    // Get staff based on selected dive center
    const staff = isAllCenters
        ? allStaff
        : currentCenter
        ? staffByCenter[currentCenter.id as keyof typeof staffByCenter]
        : [];

    return (
        <DashboardShell>
            <DashboardHeader
                heading="Staff"
                text="Manage your dive center staff and instructors."
            >
                <Button onClick={() => setShowAddStaffDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Staff Member
                </Button>
            </DashboardHeader>
            <StaffDirectory staff={staff} />
            <AddStaffDialog
                open={showAddStaffDialog}
                onOpenChange={setShowAddStaffDialog}
            />
        </DashboardShell>
    );
}
