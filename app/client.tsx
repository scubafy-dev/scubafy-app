"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { UpcomingDives } from "@/components/upcoming-dives";
import { RecentStaff } from "@/components/recent-staff";
import { useDiveCenter } from "@/lib/dive-center-context";
import Link from "next/link";
import { useEffect, useState } from "react";

interface DashboardStats {
  upcomingDives: number;
  totalBookings: number;
  activeDivers: number;
  newDivers: number;
  revenue: number;
  bookingsChange: number;
  revenueChange: number;
}

export default function DashboardClient() {
    const { currentCenter, isAllCenters } = useDiveCenter();
    const [stats, setStats] = useState<DashboardStats>({
      upcomingDives: 0,
      totalBookings: 0,
      activeDivers: 0,
      newDivers: 0,
      revenue: 0,
      bookingsChange: 0,
      revenueChange: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                
                if (!isAllCenters && currentCenter) {
                    params.append("diveCenterId", currentCenter.id);
                } else {
                    params.append("isAllCenters", "true");
                }

                const response = await fetch(`/api/dashboard-stats?${params.toString()}`);
                
                if (!response.ok) {
                    throw new Error("Failed to fetch dashboard stats");
                }

                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [currentCenter, isAllCenters]);

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
                            {loading ? "..." : stats.totalBookings}
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
                            {loading ? "..." : stats.activeDivers}
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
                            {loading ? "..." : stats.upcomingDives}
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
                            {loading ? "..." : `$${stats.revenue.toLocaleString()}`}
                        </div>
                        <p className="dashboard-card-subtitle">
                            +{stats.revenueChange}% from last month
                        </p>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <UpcomingDives />
                    <RecentStaff />
                </div>

            </div>
        </DashboardShell>
    );
}
