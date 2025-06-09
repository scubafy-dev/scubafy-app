import { useState } from "react";
import CustomersClient from "./client";
import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  updateCustomer,
} from "@/lib/customers";
import { useAuth } from "@/lib/use-auth";

export default async function CustomersPage() {
  const session = await useAuth("/customers");
  const customers = await getAllCustomers();

  return (
    <div>
      <CustomersClient
        customers={customers}
        createCustomer={createCustomer}
        deleteCustomer={deleteCustomer}
        updateCustomer={updateCustomer}
      />
    </div>
  );
}
