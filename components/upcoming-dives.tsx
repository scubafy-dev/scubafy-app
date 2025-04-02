"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Clock, MapPin } from "lucide-react"
import Link from "next/link"

interface UpcomingDivesProps {
  className?: string
}

export function UpcomingDives({ className }: UpcomingDivesProps) {
  const dives = [
    {
      id: "D-1001",
      title: "Coral Reef Exploration",
      date: "March 28, 2025",
      time: "9:00 AM - 1:00 PM",
      location: "Blue Lagoon Reef",
      participants: 8,
      maxParticipants: 12,
      difficulty: "Beginner",
    },
    {
      id: "D-1002",
      title: "Wreck Dive Adventure",
      date: "March 29, 2025",
      time: "8:00 AM - 12:00 PM",
      location: "Shipwreck Point",
      participants: 6,
      maxParticipants: 8,
      difficulty: "Advanced",
    },
    {
      id: "D-1003",
      title: "Night Dive Experience",
      date: "March 30, 2025",
      time: "7:00 PM - 9:00 PM",
      location: "Coral Gardens",
      participants: 4,
      maxParticipants: 6,
      difficulty: "Intermediate",
    },
  ]

  return (
    <Card className={cn("col-span-1", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Upcoming Dives</CardTitle>
            <CardDescription>You have 3 upcoming dive trips scheduled.</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="h-7 text-xs px-2" asChild>
            <Link href="/calendar">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dives.map((dive, index) => (
            <div key={dive.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm">{dive.title}</h3>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-xs font-medium ${
                    dive.difficulty === "Beginner"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-400"
                      : dive.difficulty === "Intermediate"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-400"
                        : "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400"
                  }`}
                >
                  {dive.difficulty}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  {dive.date}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  {dive.time}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="mr-1 h-3 w-3" />
                  {dive.location}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Users className="mr-1 h-3 w-3" />
                  {dive.participants}/{dive.maxParticipants} divers
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                  <Link href={`/dive-trips/${dive.id}`}>View Details</Link>
                </Button>
              </div>
              {index < dives.length - 1 && <div className="border-t my-2" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

