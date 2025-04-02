"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface QuickActionsProps {
  className?: string
}

export function QuickActions({ className }: QuickActionsProps) {
  const [activeTab, setActiveTab] = useState("upcoming")

  const upcomingDives = [
    {
      id: "D-1001",
      title: "Coral Reef Exploration",
      date: "Today",
      time: "9:00 AM",
      participants: 8,
      maxParticipants: 12,
      status: "confirmed",
    },
    {
      id: "D-1002",
      title: "Wreck Dive Adventure",
      date: "Tomorrow",
      time: "8:00 AM",
      participants: 6,
      maxParticipants: 8,
      status: "pending",
    },
  ]

  const equipmentAlerts = [
    {
      id: "EQ-1003",
      type: "Tank",
      code: "ST-12347",
      issue: "needs inspection",
      priority: "high",
    },
    {
      id: "EQ-2104",
      type: "BCD",
      code: "BCD-5002",
      issue: "strap damaged",
      priority: "medium",
    },
  ]

  const rentalReturns = [
    {
      id: "R-1001",
      customer: "John Smith",
      equipment: "Full Gear Set",
      dueDate: "Today",
      status: "on-time",
    },
    {
      id: "R-1002",
      customer: "Sarah Johnson",
      equipment: "Wetsuit",
      dueDate: "Tomorrow",
      status: "on-time",
    },
  ]

  return (
    <Card className={cn("col-span-1", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Important items that need your attention</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming Dives</TabsTrigger>
            <TabsTrigger value="equipment">Equipment Alerts</TabsTrigger>
            <TabsTrigger value="rentals">Rental Returns</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-3 mt-3">
            {upcomingDives.map((dive) => (
              <div
                key={dive.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-2 border rounded-lg"
              >
                <div className="mb-2 sm:mb-0">
                  <h3 className="font-medium text-sm">{dive.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {dive.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {dive.time}
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-1 h-3 w-3" />
                      {dive.participants}/{dive.maxParticipants}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-xs font-medium ${
                      dive.status === "confirmed"
                        ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-400"
                    }`}
                  >
                    {dive.status}
                  </span>
                  <Button size="sm" className="h-7 text-xs px-2">
                    Check In
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                <Link href="/dive-trips">View All Trips</Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="equipment" className="space-y-3 mt-3">
            {equipmentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-2 border rounded-lg">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full ${
                      alert.priority === "high"
                        ? "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-400"
                    }`}
                  >
                    <AlertTriangle className="h-3 w-3" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">
                      {alert.type} {alert.code}
                    </h3>
                    <p className="text-xs text-muted-foreground">{alert.issue}</p>
                  </div>
                </div>
                <Button size="sm" className="h-7 text-xs px-2">
                  Report
                </Button>
              </div>
            ))}
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                <Link href="/equipment">View All Equipment</Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="rentals" className="space-y-3 mt-3">
            {rentalReturns.map((rental) => (
              <div key={rental.id} className="flex items-center justify-between p-2 border rounded-lg">
                <div>
                  <h3 className="font-medium text-sm">{rental.customer}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
                    <div>{rental.equipment}</div>
                    <div>Due: {rental.dueDate}</div>
                  </div>
                </div>
                <Button size="sm" className="h-7 text-xs px-2">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Return
                </Button>
              </div>
            ))}
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                <Link href="/equipment">View All Rentals</Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

