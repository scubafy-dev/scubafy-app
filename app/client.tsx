"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { UpcomingDives } from "@/components/upcoming-dives";
import { RecentlyAddedCustomers } from "@/components/recently-added-customers";
import { useDiveCenter } from "@/lib/dive-center-context";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
  userDiveCenters: Array<{
    id: string;
    name: string;
  }>;
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
      userDiveCenters: [],
    });
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
                console.log("Dashboard stats received:", data);
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
                            ? `Overview of your ${stats.userDiveCenters.length} dive center${stats.userDiveCenters.length !== 1 ? 's' : ''} operations.`
                            : `Overview of ${currentCenter?.name} operations.`}
                    </p>
                    {stats.userDiveCenters.length > 0 && (
                        <p className="text-muted-foreground text-xs mt-1">
                            {isAllCenters 
                                ? `Showing data from: ${stats.userDiveCenters.map(center => center.name).join(', ')}`
                                : `Showing data specific to ${currentCenter?.name}`
                            }
                        </p>
                    )}
                </div>

                {stats.userDiveCenters.length === 0 ? (
                    <div className="col-span-full">
                        <div className="text-center py-8">
                            <h3 className="text-lg font-semibold mb-2">No Dive Centers Found</h3>
                            <p className="text-muted-foreground mb-4">
                                You don't have any dive centers yet. Create your first dive center to get started.
                            </p>
                            <Button onClick={() => setIsDialogOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Your First Dive Center
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
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
                             <RecentlyAddedCustomers />
                         </div>
                    </>
                )}
            </div>
        </DashboardShell>
    );
}
