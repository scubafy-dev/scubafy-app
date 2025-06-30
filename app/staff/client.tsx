"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { StaffDirectory } from "@/components/staff-directory";
import { AddStaffDialog } from "@/components/add-staff-dialog";
import { useDiveCenter } from "@/lib/dive-center-context";
import { allStaff, staffByCenter } from "@/lib/mock-data/staff";
import { Staff } from "@app/generated/prisma";
import { createStaff, getAllStaff, StaffWithPermissions } from "@/lib/staffs";

export default function StaffClient(
    {updateStaff, deleteStaff }: {
        updateStaff: (id: string, formData: FormData) => Promise<void>;
        deleteStaff: (id: string) => Promise<void>;
    },
) {
    const [showAddStaffDialog, setShowAddStaffDialog] = useState(false);
    const { currentCenter, isAllCenters } = useDiveCenter();

    const [isStaffListLoading, setIsStaffListLoading] = useState(false)
    const [customers, setCustomers] = useState([])
    const [staffList,setStaffList]=useState<any>([])

    const fetchStaffs = useCallback(async () => {
        try {
            setIsStaffListLoading(true);
            const staffsData = await getAllStaff(currentCenter?.id);
            console.log("Fetched staffsData:", staffsData);
            setStaffList(staffsData as any);
        } catch (error) {
            console.error("Failed to load customersData:", error);
            setStaffList([]);
        } finally {
            setIsStaffListLoading(false);
        }
    }, [currentCenter?.id]);

    useEffect(() => {
        // Always set loading to true when currentCenter changes
        setIsStaffListLoading(true);

        if (currentCenter?.id) {
            fetchStaffs();
        } else {
            // If no center, just set empty state and stop loading
            setStaffList([]);
            setIsStaffListLoading(false);
        }
    }, [currentCenter]);

    const handleStaffCreated = useCallback(async () => {
        // Refresh the customer list after successful creation
        await fetchStaffs();
        // setIsAddCustomerOpen(false);
    }, [fetchStaffs]);

    // Get staff based on selected dive center
    // const staff = isAllCenters
    //     ? allStaff
    //     : currentCenter
    //     ? staffByCenter[currentCenter.id as keyof typeof staffByCenter]
    //     : [];

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
            <StaffDirectory onSuccess={handleStaffCreated} staffs={staffList} updateStaff={updateStaff} deleteStaff={deleteStaff} />
            <AddStaffDialog
                open={showAddStaffDialog}
                onOpenChange={setShowAddStaffDialog}
                createStaff={async (formData: FormData, diveCenterId: string) => {
                    if (!currentCenter?.id) {
                        // Ensure the return type is Promise<void>
                        throw new Error("No dive center selected");
                    }
                    await createStaff(formData, diveCenterId);
                }}
                onSuccess={handleStaffCreated}
            />
        </DashboardShell>
    );
}
