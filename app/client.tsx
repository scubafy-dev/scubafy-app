"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { RecentBookings } from "@/components/recent-bookings";
import { UpcomingDives } from "@/components/upcoming-dives";
import { QuickActions } from "@/components/quick-actions";
import { useDiveCenter } from "@/lib/dive-center-context";
import Link from "next/link";

export default function DashboardClient() {
    const { currentCenter, isAllCenters, allCentersStats } = useDiveCenter();

    // Use either the current center's stats or aggregated stats based on selection
    const stats = isAllCenters
        ? allCentersStats
        : currentCenter?.stats || allCentersStats;

    return (
        <DashboardShell>
            <div className="space-y-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {isAllCenters
                            ? "Overview of all dive centers operations."
                            : `Overview of ${currentCenter?.name} operations.`}
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Link
                        href="/customers"
                        className="dashboard-card hover:bg-accent transition-colors"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="dashboard-card-title">
                                Total Bookings
                            </h3>
                        </div>
                        <div className="dashboard-card-value">
                            {stats.totalBookings}
                        </div>
                        <p className="dashboard-card-subtitle">
                            +{stats.bookingsChange}% from last month
                        </p>
                    </Link>
                    <div className="dashboard-card">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="dashboard-card-title">
                                Active Divers
                            </h3>
                        </div>
                        <div className="dashboard-card-value">
                            {stats.activeDivers}
                        </div>
                        <p className="dashboard-card-subtitle">
                            +{stats.newDivers} new this week
                        </p>
                    </div>
                    <Link
                        href="/dive-trips"
                        className="dashboard-card hover:bg-accent transition-colors"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="dashboard-card-title">
                                Upcoming Dives
                            </h3>
                        </div>
                        <div className="dashboard-card-value">
                            {stats.upcomingDives}
                        </div>
                        <p className="dashboard-card-subtitle">Next 7 days</p>
                    </Link>
                    <Link
                        href="/finances"
                        className="dashboard-card hover:bg-accent transition-colors"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="dashboard-card-title">Revenue</h3>
                        </div>
                        <div className="dashboard-card-value">
                            ${stats.revenue.toLocaleString()}
                        </div>
                        <p className="dashboard-card-subtitle">
                            +{stats.revenueChange}% from last month
                        </p>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <UpcomingDives />
                    <QuickActions />
                </div>

                <RecentBookings />
            </div>
        </DashboardShell>
    );
}
