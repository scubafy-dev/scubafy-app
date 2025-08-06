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
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useDiveCenter } from "@/lib/dive-center-context";
import { useEffect, useState } from "react";

interface UpcomingDivesProps {
  className?: string;
}

interface DiveTrip {
  id: string;
  title: string;
  date: string;
  location: string;
  status: string;
  diveCenter?: {
    id: string;
    name: string;
  };
  participantCount: number;
  participants: Array<{
    id: string;
    name: string;
  }>;
}

export function UpcomingDives({ className }: UpcomingDivesProps) {
  const { currentCenter, isAllCenters } = useDiveCenter();
  const [dives, setDives] = useState<DiveTrip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiveTrips = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        if (!isAllCenters && currentCenter) {
          params.append("diveCenterId", currentCenter.id);
        } else {
          params.append("isAllCenters", "true");
        }

        const response = await fetch(`/api/dive-trips?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch dive trips");
        }

        const data = await response.json();
        
        // Filter for upcoming dives (today and future) and limit to 5
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const upcomingDives = data
          .filter((dive: DiveTrip) => {
            const diveDate = new Date(dive.date);
            return diveDate >= today;
          })
          .slice(0, 5);

        setDives(upcomingDives);
      } catch (error) {
        console.error("Error fetching dive trips:", error);
        setDives([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDiveTrips();
  }, [currentCenter, isAllCenters]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Card className={cn("col-span-1", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Upcoming Dives</CardTitle>
            <CardDescription>
              {isAllCenters
                ? "Upcoming dives across all centers."
                : `You have ${dives.length} upcoming dive trips scheduled.`}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs px-2"
            asChild
          >
            <Link href="/dive-trips">View All</Link>
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
        ) : dives.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No upcoming dives scheduled.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {dives.map((dive, index) => (
              <div key={dive.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm">{dive.title}</h3>
                  <div className="flex items-center gap-1">
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-xs font-medium capitalize ${
                        dive.status === "completed" 
                          ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400"
                          : dive.status === "in_progress"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-400"
                          : dive.status === "upcoming"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-400"
                          : dive.status === "cancelled"
                          ? "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400"
                      }`}
                    >
                      {dive.status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    {formatDate(dive.date)}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {formatTime(dive.date)}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="mr-1 h-3 w-3" />
                    {dive.location}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="mr-1 h-3 w-3" />
                    {dive.participantCount} participants
                  </div>
                  {isAllCenters && dive.diveCenter && (
                    <div className="flex items-center text-muted-foreground col-span-2 mt-1">
                      <span className="text-xs font-medium">
                        {dive.diveCenter.name}
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
                    <Link href={`/dive-trips/${dive.id}`}>View Details</Link>
                  </Button>
                </div>
                {index < dives.length - 1 && <div className="border-t my-2" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
