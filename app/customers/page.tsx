import { useState } from "react";
import CustomersClient from "./client";
import {
  deleteCustomer,
  updateCustomer,
} from "@/lib/customers";
import { useAuth } from "@/lib/use-auth";

export default async function CustomersPage() {
  const session = await useAuth("/customers");

  return (
    <div>
      <CustomersClient
        deleteCustomer={deleteCustomer}
        updateCustomer={updateCustomer}
      />
    </div>
  );
}
