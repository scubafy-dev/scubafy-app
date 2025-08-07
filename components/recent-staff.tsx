"use client";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useDiveCenter } from "@/lib/dive-center-context";
import { useEffect, useState } from "react";

interface RecentStaffProps {
  className?: string;
}

interface Staff {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  roleTitle: string | null;
  status: string;
  createdAt: string;
  diveCenter?: {
    id: string;
    name: string;
  };
}

export function RecentStaff({ className }: RecentStaffProps) {
  const { currentCenter, isAllCenters } = useDiveCenter();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentStaff = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        if (!isAllCenters && currentCenter) {
          params.append("diveCenterId", currentCenter.id);
        } else {
          params.append("isAllCenters", "true");
        }

        const response = await fetch(`/api/recent-staff?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch recent staff");
        }

        const data = await response.json();
        setStaff(data);
      } catch (error) {
        console.error("Error fetching recent staff:", error);
        setStaff([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentStaff();
  }, [currentCenter, isAllCenters]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400";
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400";
      case "freelance":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400";
    }
  };

  return (
    <Card className={cn("col-span-1", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Staff</CardTitle>
            <CardDescription>
              {isAllCenters
                ? "Recently added staff across all centers."
                : `Recently added staff to ${currentCenter?.name}.`}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs px-2"
            asChild
          >
            <Link href="/staff">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="grid grid-cols-2 gap-1">
                  <div className="h-3 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : staff.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent staff found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {staff.map((member, index) => (
              <div key={member.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm">{member.fullName}</h3>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-xs font-medium capitalize ${getStatusColor(
                      member.status
                    )}`}
                  >
                    {member.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="mr-1 h-3 w-3" />
                    {member.email}
                  </div>
                  {member.phoneNumber && (
                    <div className="flex items-center text-muted-foreground">
                      <Phone className="mr-1 h-3 w-3" />
                      {member.phoneNumber}
                    </div>
                  )}
                  {member.roleTitle && (
                    <div className="flex items-center text-muted-foreground">
                      <Users className="mr-1 h-3 w-3" />
                      {member.roleTitle}
                    </div>
                  )}
                  <div className="flex items-center text-muted-foreground">
                    <span className="text-xs">
                      Added {formatDate(member.createdAt)}
                    </span>
                  </div>
                  {isAllCenters && member.diveCenter && (
                    <div className="flex items-center text-muted-foreground col-span-2 mt-1">
                      <span className="text-xs font-medium">
                        {member.diveCenter.name}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    asChild
                  >
                    <Link href={`/staff/${member.id}`}>View Details</Link>
                  </Button>
                </div>
                {index < staff.length - 1 && <div className="border-t my-2" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 