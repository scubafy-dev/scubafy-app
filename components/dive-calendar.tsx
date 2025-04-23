"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useDiveCenter } from "@/lib/dive-center-context"

// Mock data for each dive center
const diveCenterEvents = {
  dauin: [
    {
      id: 1,
      title: "Coral Reef Exploration",
      date: new Date(2025, 2, 5),
      type: "dive-trip",
    },
    {
      id: 2,
      title: "Night Dive",
      date: new Date(2025, 2, 12),
      type: "dive-trip",
    },
    {
      id: 3,
      title: "Equipment Maintenance",
      date: new Date(2025, 2, 15),
      type: "maintenance",
    },
  ],
  malapascua: [
    {
      id: 4,
      title: "Thresher Shark Dive",
      date: new Date(2025, 2, 8),
      type: "dive-trip",
    },
    {
      id: 5,
      title: "Staff Meeting",
      date: new Date(2025, 2, 20),
      type: "meeting",
    },
  ],
  siquijor: [
    {
      id: 6,
      title: "Wall Dive Adventure",
      date: new Date(2025, 2, 18),
      type: "dive-trip",
    },
    {
      id: 7,
      title: "Deep Dive Certification",
      date: new Date(2025, 2, 28),
      type: "training",
    },
  ],
  sipalay: [
    {
      id: 8,
      title: "Shipwreck Dive",
      date: new Date(2025, 2, 22),
      type: "dive-trip",
    },
  ],
};

// All events for "All Centers" view
const allEvents = [
  ...diveCenterEvents.dauin.map(event => ({ ...event, center: "Sea Explorers Dauin" })),
  ...diveCenterEvents.malapascua.map(event => ({ ...event, center: "Sea Explorers Malapascua" })),
  ...diveCenterEvents.siquijor.map(event => ({ ...event, center: "Sea Explorers Siquijor" })),
  ...diveCenterEvents.sipalay.map(event => ({ ...event, center: "Sea Explorers Sipalay" })),
];

export function DiveCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { currentCenter, isAllCenters } = useDiveCenter();

  // Select events based on current center or show all events
  const diveEvents = isAllCenters
    ? allEvents
    : currentCenter
    ? diveCenterEvents[currentCenter.id as keyof typeof diveCenterEvents]
    : [];

  // Calendar navigation functions
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  // Get month and year for display
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const currentMonthName = monthNames[currentDate.getMonth()]
  const currentYear = currentDate.getFullYear()

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    const daysInMonth = lastDayOfMonth.getDate()
    const startingDayOfWeek = firstDayOfMonth.getDay() // 0 = Sunday, 1 = Monday, etc.

    const days = []

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  const calendarDays = generateCalendarDays()

  // Check if a day has events
  const getEventsForDay = (day: number | null) => {
    if (!day) return []

    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return diveEvents.filter(
      (event) =>
        event.date.getDate() === day &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    )
  }

  // Day of week labels
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Dive Schedule</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="font-medium">
              {currentMonthName} {currentYear}
            </div>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {/* Weekday headers */}
          {weekdays.map((day, index) => (
            <div key={index} className="text-center font-medium p-2 text-sm">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`min-h-[100px] p-2 border rounded-md ${day ? "bg-card" : "bg-muted/20"} ${
                day &&
                new Date().getDate() === day &&
                new Date().getMonth() === currentDate.getMonth() &&
                new Date().getFullYear() === currentDate.getFullYear()
                  ? "ring-2 ring-primary"
                  : ""
              }`}
            >
              {day && (
                <>
                  <div className="font-medium text-sm">{day}</div>
                  <div className="mt-1 space-y-1">
                    {getEventsForDay(day).map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded truncate ${
                          event.type === "dive-trip"
                            ? "bg-primary/10 text-primary"
                            : event.type === "maintenance"
                              ? "bg-amber-500/10 text-amber-500"
                              : event.type === "meeting"
                                ? "bg-blue-500/10 text-blue-500"
                                : "bg-secondary/10 text-secondary"
                        }`}
                      >
                        {event.title}
                        {isAllCenters && (
                          <span className="block text-[10px] opacity-75">
                            {(event as any).center}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

