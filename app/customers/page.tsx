import { useState } from "react";
import CustomersClient from "./client";
import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  updateCustomer,
} from "@/lib/customers";

export default async function CustomersPage() {
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
