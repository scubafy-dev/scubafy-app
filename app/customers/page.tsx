"use client";

import { useState } from "react";
import CustomersClient from "./client";

export default function CustomersPage() {
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  return (
    <div>
      <CustomersClient />
    </div>
  );
}
