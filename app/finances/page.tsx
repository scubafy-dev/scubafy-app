import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import { FinancialOverview } from "@/components/financial-overview";
import { useAuth } from "@/lib/use-auth";
import { getUserRole } from "@/lib/auth";

export default async function FinancesPage() {
  const session = await useAuth("/finances");
  const userRole = await getUserRole(session?.user?.email || "");

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Finances"
        text="Track your dive center's financial performance."
      />
      {userRole === "manager"
        ? <FinancialOverview />
        : <p>You do not have permission to view this page.</p>}
    </DashboardShell>
  );
}
