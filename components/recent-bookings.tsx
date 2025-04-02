"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface RecentBookingsProps {
  className?: string
}

export function RecentBookings({ className }: RecentBookingsProps) {
  const bookings = [
    {
      id: "B-1234",
      customer: {
        name: "John Smith",
        email: "john@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      diveTrip: "Coral Reef Exploration",
      date: "2025-03-28",
      amount: "$120.00",
      status: "confirmed",
    },
    {
      id: "B-1235",
      customer: {
        name: "Sarah Johnson",
        email: "sarah@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      diveTrip: "Wreck Dive Adventure",
      date: "2025-03-29",
      amount: "$150.00",
      status: "pending",
    },
    {
      id: "B-1236",
      customer: {
        name: "Michael Brown",
        email: "michael@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      diveTrip: "Night Dive Experience",
      date: "2025-03-30",
      amount: "$135.00",
      status: "confirmed",
    },
    {
      id: "B-1237",
      customer: {
        name: "Emily Davis",
        email: "emily@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      diveTrip: "Deep Dive Certification",
      date: "2025-04-01",
      amount: "$200.00",
      status: "confirmed",
    },
    {
      id: "B-1238",
      customer: {
        name: "David Wilson",
        email: "david@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      diveTrip: "Coral Reef Exploration",
      date: "2025-04-02",
      amount: "$120.00",
      status: "pending",
    },
  ]

  return (
    <Card className={cn("col-span-1", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>You have {bookings.length} bookings this month.</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="h-7 text-xs px-2" asChild>
            <Link href="/dive-trips">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Booking ID</TableHead>
                <TableHead className="text-xs">Customer</TableHead>
                <TableHead className="text-xs">Dive Trip</TableHead>
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">Amount</TableHead>
                <TableHead className="text-xs">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium text-xs py-2">{booking.id}</TableCell>
                  <TableCell className="py-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={booking.customer.avatar} alt={booking.customer.name} />
                        <AvatarFallback>{booking.customer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">{booking.customer.name}</span>
                        <span className="text-[10px] text-muted-foreground">{booking.customer.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs py-2">{booking.diveTrip}</TableCell>
                  <TableCell className="text-xs py-2">{booking.date}</TableCell>
                  <TableCell className="text-xs py-2">{booking.amount}</TableCell>
                  <TableCell className="py-2">
                    <Badge
                      variant={booking.status === "confirmed" ? "default" : "outline"}
                      className="text-[10px] px-1.5 py-0.5"
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

