"use client";
import DashboardClient from "@/app/client";
import { RequirePermission } from "@/components/RequirePermission";
import { StaffAutoRedirect } from "@/components/StaffAutoRedirect";
import DiveTripsPage from "./dive-trips/client";

export default function DashboardPage() {
  return (
    <>
      <StaffAutoRedirect />
      <RequirePermission permission="overview">
        <div>
          <DashboardClient />
          {/* <DiveTripsPage></DiveTripsPage> */}
        </div>
      </RequirePermission>
    </>
  );
}
