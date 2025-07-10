import { DashboardShell } from "@/components/dashboard-shell";
import { VehicleManagement } from "@/components/vehicle-management";
import { useAuth } from "@/lib/use-auth";

export default async function VehiclesPage() {
  const session = await useAuth("/vehicles");
  // You can add role checks here if needed
  return (
    <DashboardShell>
      <VehicleManagement />
    </DashboardShell>
  );
} 