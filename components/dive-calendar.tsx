"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Define the event type
export type DiveEvent = {
  id: number
  title: string
  date?: Date // For single-day events like dive trips
  startDate?: Date // For multi-day events like courses
  endDate?: Date // For multi-day events like courses
  type: string
  location?: string
  status?: string
  certificationLevel?: string
}

export function DiveCalendar({ events }: { events: DiveEvent[] }) {
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

  // Check if a day has events
  const getEventsForDay = (day: number | null) => {
    if (!day) return []
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)

    return events.filter((event) => {
      // For single-day events (dive trips)
      if (event.date) {
        return (
          event.date.getDate() === day &&
          event.date.getMonth() === date.getMonth() &&
          event.date.getFullYear() === date.getFullYear()
        )
      }

      // For multi-day events (courses)
      if (event.startDate && event.endDate) {
        const eventStart = new Date(event.startDate)
        const eventEnd = new Date(event.endDate)
        const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)

        return currentDay >= eventStart && currentDay <= eventEnd
      }

      return false
    })
  }

  // Day of week labels
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Schedule Events</CardTitle>
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
              className={`min-h-[100px] p-2 border rounded-md ${day ? "bg-card" : "bg-muted/20"} ${day &&
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
                        className={`text-xs p-1 rounded truncate ${event.type === "dive-trip"
                            ? "bg-blue-700/20 text-blue-800 border border-blue-300"
                            : event.type === "course"
                              ? "bg-purple-500/10 text-purple-600 border border-purple-200"
                              : event.type === "maintenance"
                                ? "bg-amber-500/10 text-amber-500"
                                : event.type === "meeting"
                                  ? "bg-blue-500/10 text-blue-500"
                                  : "bg-secondary/30 text-secondary"
                          }`}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-1 py-0 h-3 ${event.type === "course"
                                ? "border-purple-300 text-purple-600"
                                : "border-black text-black"
                              }`}
                          >
                            {event.type === "course" ? "COURSE" : "TRIP"}
                          </Badge>
                        </div>
                        {event.title}
                        {event.location && (
                          <span className="block text-[10px] opacity-75">
                            {event.location}
                          </span>
                        )}
                        {event.certificationLevel && (
                          <span className="block text-[10px] opacity-75">
                            {event.certificationLevel}
                          </span>
                        )}
                        {event.status && (
                          <Badge
                            variant="secondary"
                            className={`text-[8px] px-1 py-0 h-4 mt-1 ${event.type === "dive-trip"
                                ? "bg-blue-100 text-blue-700 border border-blue-200"
                                : event.type === "course"
                                  ? "bg-green-400 text-black border border-green-400"
                                  : "bg-black text-white"
                              }`}
                          >
                            {event.status}
                          </Badge>
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

