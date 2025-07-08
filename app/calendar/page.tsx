"use client"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { DiveCalendar, DiveEvent } from "@/components/dive-calendar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AddEventForm } from "@/components/add-event-form"
import { useDiveCenter } from "@/lib/dive-center-context"

export default function CalendarPage() {
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [diveTrips, setDiveTrips] = useState<DiveEvent[]>([])
  const [loading, setLoading] = useState(true)
  const { currentCenter, isAllCenters } = useDiveCenter()

  // Fetch dive trips and courses from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        
        const params = new URLSearchParams()
        if (!isAllCenters && currentCenter) {
          params.append("diveCenterId", currentCenter.id)
        }
        params.append("isAllCenters", isAllCenters.toString())

        // Fetch both dive trips and courses
        const [tripsResponse, coursesResponse] = await Promise.all([
          fetch(`/api/dive-trips?${params.toString()}`),
          fetch(`/api/courses?${params.toString()}`)
        ])
        
        if (!tripsResponse.ok) {
          throw new Error("Failed to fetch dive trips")
        }
        
        if (!coursesResponse.ok) {
          throw new Error("Failed to fetch courses")
        }

        const tripsData = await tripsResponse.json()
        const coursesData = await coursesResponse.json()
        
        // Transform dive trips data
        const tripEvents: DiveEvent[] = tripsData.map((trip: any) => ({
          id: trip.id,
          title: trip.title,
          date: new Date(trip.date),
          type: trip.type || "dive-trip",
          location: trip.location,
          status: trip.status,
        }))

        // Transform courses data
        const courseEvents: DiveEvent[] = coursesData.map((course: any) => ({
          id: course.id,
          title: course.title,
          startDate: new Date(course.startDate),
          endDate: new Date(course.endDate),
          type: "course",
          location: course.location,
          status: course.status,
          certificationLevel: course.certificationLevel,
        }))

        // Combine both types of events
        setDiveTrips([...tripEvents, ...courseEvents])
      } catch (error) {
        console.error("Error fetching events:", error)
        // Fallback to empty array on error
        setDiveTrips([])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [currentCenter, isAllCenters])

  return (
    <DashboardShell>
      <DashboardHeader heading="Calendar">
        <Button onClick={() => setIsAddEventOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </DashboardHeader>
      
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading Events...</div>
        </div>
      ) : (
        <DiveCalendar events={diveTrips} />
      )}

      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Calendar Event</DialogTitle>
          </DialogHeader>
          <AddEventForm onSuccess={() => setIsAddEventOpen(false)} />
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}

