"use client";

import { useState } from "react";
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
import { Customer } from "@/lib/customers";

export default function CustomersClient(
    { customers, createCustomer, deleteCustomer, updateCustomer }: {
        customers: Customer[];
        createCustomer: (formData: FormData) => Promise<void>;
        deleteCustomer: (id: string) => Promise<void>;
        updateCustomer: (formData: FormData) => Promise<void>;
    },
) {
    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

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
            <CustomersTable customers={customers} />

            <Dialog
                open={isAddCustomerOpen}
                onOpenChange={setIsAddCustomerOpen}
            >
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Add New Customer</DialogTitle>
                    </DialogHeader>
                    <AddCustomerForm
                        onSuccess={() => setIsAddCustomerOpen(false)}
                        createCustomer={createCustomer}
                    />
                </DialogContent>
            </Dialog>
        </DashboardShell>
    );
}
