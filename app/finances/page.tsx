"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { FinancialOverview } from "@/components/financial-overview"

export default function FinancesPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Finances" text="Track your dive center's financial performance." />
      <FinancialOverview />
    </DashboardShell>
  )
}

