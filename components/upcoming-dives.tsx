"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import { useDiveCenter } from "@/lib/dive-center-context"

interface UpcomingDivesProps {
  className?: string
}

// Mock data for each dive center
const diveCenterDives = {
  dauin: [
    {
      id: "D-1001",
      title: "Coral Reef Exploration",
      date: "March 28, 2025",
      time: "9:00 AM - 1:00 PM",
      location: "Dauin Marine Sanctuary",
      participants: 8,
      maxParticipants: 12,
      difficulty: "Beginner",
    },
    {
      id: "D-1002",
      title: "Muck Diving Adventure",
      date: "March 29, 2025",
      time: "8:00 AM - 12:00 PM",
      location: "Car Cemetery",
      participants: 6,
      maxParticipants: 8,
      difficulty: "Advanced",
    },
    {
      id: "D-1003",
      title: "Night Dive Experience",
      date: "March 30, 2025",
      time: "7:00 PM - 9:00 PM",
      location: "Sahara Beach",
      participants: 4,
      maxParticipants: 6,
      difficulty: "Intermediate",
    },
  ],
  malapascua: [
    {
      id: "M-1001",
      title: "Thresher Shark Dive",
      date: "April 2, 2025",
      time: "5:00 AM - 8:00 AM",
      location: "Monad Shoal",
      participants: 7,
      maxParticipants: 10,
      difficulty: "Advanced",
    },
    {
      id: "M-1002",
      title: "Reef Conservation Dive",
      date: "April 3, 2025",
      time: "10:00 AM - 2:00 PM",
      location: "Lighthouse Reef",
      participants: 5,
      maxParticipants: 8,
      difficulty: "Intermediate",
    },
  ],
  siquijor: [
    {
      id: "S-1001",
      title: "Wall Dive Adventure",
      date: "April 5, 2025",
      time: "9:30 AM - 1:30 PM",
      location: "Tubod Marine Sanctuary",
      participants: 6,
      maxParticipants: 8,
      difficulty: "Intermediate",
    },
    {
      id: "S-1002",
      title: "Beginner Reef Tour",
      date: "April 6, 2025",
      time: "8:30 AM - 11:30 AM",
      location: "Paliton Beach",
      participants: 4,
      maxParticipants: 6,
      difficulty: "Beginner",
    },
    {
      id: "S-1003",
      title: "Cave Exploration",
      date: "April 7, 2025",
      time: "1:00 PM - 4:00 PM",
      location: "Cantabon Cave",
      participants: 3,
      maxParticipants: 6,
      difficulty: "Advanced",
    },
  ],
  sipalay: [
    {
      id: "SP-1001",
      title: "Shipwreck Dive",
      date: "April 10, 2025",
      time: "8:00 AM - 12:00 PM",
      location: "Campomanes Bay",
      participants: 5,
      maxParticipants: 8,
      difficulty: "Advanced",
    },
    {
      id: "SP-1002",
      title: "Coral Garden Tour",
      date: "April 11, 2025",
      time: "9:00 AM - 1:00 PM",
      location: "Sugar Beach",
      participants: 6,
      maxParticipants: 10,
      difficulty: "Beginner",
    },
  ],
};

// All dives for "All Centers" view
const allDives = [
  {
    id: "D-1001",
    title: "Coral Reef Exploration",
    date: "March 28, 2025",
    time: "9:00 AM - 1:00 PM",
    location: "Dauin Marine Sanctuary",
    center: "Sea Explorers Dauin",
    participants: 8,
    maxParticipants: 12,
    difficulty: "Beginner",
  },
  {
    id: "M-1001",
    title: "Thresher Shark Dive",
    date: "April 2, 2025",
    time: "5:00 AM - 8:00 AM",
    location: "Monad Shoal",
    center: "Sea Explorers Malapascua",
    participants: 7,
    maxParticipants: 10,
    difficulty: "Advanced",
  },
  {
    id: "S-1001",
    title: "Wall Dive Adventure",
    date: "April 5, 2025",
    time: "9:30 AM - 1:30 PM",
    location: "Tubod Marine Sanctuary",
    center: "Sea Explorers Siquijor",
    participants: 6,
    maxParticipants: 8,
    difficulty: "Intermediate",
  },
  {
    id: "SP-1001",
    title: "Shipwreck Dive",
    date: "April 10, 2025",
    time: "8:00 AM - 12:00 PM",
    location: "Campomanes Bay",
    center: "Sea Explorers Sipalay",
    participants: 5,
    maxParticipants: 8,
    difficulty: "Advanced",
  },
];

export function UpcomingDives({ className }: UpcomingDivesProps) {
  const { currentCenter, isAllCenters } = useDiveCenter();
  
  // Select dives based on the current center or show all dives
  const dives = isAllCenters 
    ? allDives 
    : currentCenter ? diveCenterDives[currentCenter.id as keyof typeof diveCenterDives] : [];

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
                {isAllCenters && (
                  <div className="flex items-center text-muted-foreground col-span-2 mt-1">
                    <span className="text-xs font-medium">{(dive as any).center}</span>
                  </div>
                )}
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

