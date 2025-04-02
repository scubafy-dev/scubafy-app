"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

export function DiveCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())

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

  // Sample dive events data
  const diveEvents = [
    {
      id: 1,
      title: "Coral Reef Exploration",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5),
      type: "dive-trip",
    },
    {
      id: 2,
      title: "Night Dive",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 12),
      type: "dive-trip",
    },
    {
      id: 3,
      title: "Equipment Maintenance",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      type: "maintenance",
    },
    {
      id: 4,
      title: "Staff Meeting",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20),
      type: "meeting",
    },
    {
      id: 5,
      title: "Wreck Dive Adventure",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 22),
      type: "dive-trip",
    },
    {
      id: 6,
      title: "Deep Dive Certification",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 28),
      type: "training",
    },
  ]

  // Check if a day has events
  const getEventsForDay = (day) => {
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
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Event
          </Button>
        </div>
        <CardDescription>View and manage your dive center schedule.</CardDescription>
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

