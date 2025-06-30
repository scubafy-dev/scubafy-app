"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CustomersTable } from "@/components/customers-table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AddCustomerForm } from "@/components/add-customer-form";
import { createCustomer, Customer, getAllCustomers } from "@/lib/customers";
import { useDiveCenter } from "@/lib/dive-center-context";

export default function CustomersClient(
    { deleteCustomer, updateCustomer }: {
        deleteCustomer: (id: string) => Promise<void>;
        updateCustomer: (id: string, formData: FormData) => Promise<void>;
    },
) {
    const { currentCenter, isAllCenters, getCenterSpecificData } =
        useDiveCenter();
    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
    const [isCustomersLoading, setIsCustomersLoading] = useState(false)
    const [customers, setCustomers] = useState([])

    const fetchCustomers = useCallback(async () => {
        try {
            setIsCustomersLoading(true);
            const customersData = await getAllCustomers(currentCenter?.id ?? undefined);
            console.log("Fetched customersData:", customersData);
            setCustomers(customersData as any);
        } catch (error) {
            console.error("Failed to load customersData:", error);
            setCustomers([]);
        } finally {
            setIsCustomersLoading(false);
        }
    }, [currentCenter?.id]);

    useEffect(() => {
        // Always set loading to true when currentCenter changes
        setIsCustomersLoading(true);

        if (currentCenter?.id) {
            fetchCustomers();
        } else {
            // If no center, just set empty state and stop loading
            setCustomers([]);
            setIsCustomersLoading(false);
        }
    }, [currentCenter, fetchCustomers]);

    const handleCustomerCreated = useCallback(async () => {
        // Refresh the customer list after successful creation
        await fetchCustomers();
        setIsAddCustomerOpen(false);
    }, [fetchCustomers]);

    const handleCustomerDeleted = useCallback(async () => {
        // Refresh the customer list after successful deletion
        await fetchCustomers();
    }, [fetchCustomers]);

    const handleCustomerUpdated = useCallback(async () => {
        // Refresh the customer list after successful update
        await fetchCustomers();
    }, [fetchCustomers]);

    return (
        <DashboardShell>
            <DashboardHeader
                heading="Customers"
                text="Manage your customer database and diver profiles."
            >
                <Button onClick={() => setIsAddCustomerOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Customer
                </Button>
            </DashboardHeader>
            <CustomersTable
                customers={customers}
                isLoading={isCustomersLoading}
                deleteCustomer={async (id: string) => {
                    await deleteCustomer(id);
                    await handleCustomerDeleted();
                }}
                updateCustomer={async (id: string, formData: FormData) => {
                    await updateCustomer(id, formData);
                    await handleCustomerUpdated();
                }}
            />

            <Dialog
                open={isAddCustomerOpen}
                onOpenChange={setIsAddCustomerOpen}
            >
                <DialogContent className="sm:max-w-[600px] h-[500px] overflow-y-scroll">
                    <DialogHeader>
                        <DialogTitle>Add New Customer</DialogTitle>
                    </DialogHeader>
                    <AddCustomerForm
                        onSuccess={handleCustomerCreated}
                        createCustomer={async (formData: FormData, diveCenterId: string) => {
                            const result = await createCustomer(formData, diveCenterId);
                            return result;
                        }}
                        customer={null}
                    />
                </DialogContent>
            </Dialog>
        </DashboardShell>
    );
}
