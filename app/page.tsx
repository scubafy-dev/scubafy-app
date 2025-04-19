import { DashboardShell } from "@/components/dashboard-shell"
import { RecentBookings } from "@/components/recent-bookings"
import { UpcomingDives } from "@/components/upcoming-dives"
import { QuickActions } from "@/components/quick-actions"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Overview of your dive center operations.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/customers" className="dashboard-card hover:bg-accent transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h3 className="dashboard-card-title">Total Bookings</h3>
            </div>
            <div className="dashboard-card-value">128</div>
            <p className="dashboard-card-subtitle">+14% from last month</p>
          </Link>
          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="dashboard-card-title">Active Divers</h3>
            </div>
            <div className="dashboard-card-value">42</div>
            <p className="dashboard-card-subtitle">+8 new this week</p>
          </div>
          <Link href="/dive-trips" className="dashboard-card hover:bg-accent transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h3 className="dashboard-card-title">Upcoming Dives</h3>
            </div>
            <div className="dashboard-card-value">12</div>
            <p className="dashboard-card-subtitle">Next 7 days</p>
          </Link>
          <Link href="/finances" className="dashboard-card hover:bg-accent transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h3 className="dashboard-card-title">Revenue</h3>
            </div>
            <div className="dashboard-card-value">$12,234</div>
            <p className="dashboard-card-subtitle">+19% from last month</p>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <UpcomingDives />
          <QuickActions />
        </div>

        <RecentBookings />
      </div>
    </DashboardShell>
  )
}

