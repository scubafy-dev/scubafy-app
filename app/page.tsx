"use client";
import DashboardClient from "@/app/client";
import { RequirePermission } from "@/components/RequirePermission";
import { StaffAutoRedirect } from "@/components/StaffAutoRedirect";

export default function DashboardPage() {
  return (
    <>
      <StaffAutoRedirect />
      <RequirePermission permission="overview">
        <div>
          <DashboardClient />
        </div>
      </RequirePermission>
    </>
  );
}
