"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useDiveCenter } from "@/lib/dive-center-context"

interface RecentBookingsProps {
  className?: string
}

// Mock data for each dive center
const diveCenterBookings = {
  dauin: [
    {
      id: "BD-1234",
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
      id: "BD-1235",
      customer: {
        name: "Sarah Johnson",
        email: "sarah@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      diveTrip: "Muck Diving Adventure",
      date: "2025-03-29",
      amount: "$150.00",
      status: "pending",
    },
    {
      id: "BD-1236",
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
      id: "BD-1237",
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
  ],
  malapascua: [
    {
      id: "BM-1234",
      customer: {
        name: "David Wilson",
        email: "david@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      diveTrip: "Thresher Shark Dive",
      date: "2025-04-02",
      amount: "$185.00",
      status: "confirmed",
    },
    {
      id: "BM-1235",
      customer: {
        name: "Jessica Lee",
        email: "jessica@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      diveTrip: "Reef Conservation Dive",
      date: "2025-04-03",
      amount: "$120.00",
      status: "pending",
    },
    {
      id: "BM-1236",
      customer: {
        name: "Robert Garcia",
        email: "robert@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      diveTrip: "Thresher Shark Dive",
      date: "2025-04-04",
      amount: "$185.00",
      status: "confirmed",
    },
  ],
  siquijor: [
    {
      id: "BS-1234",
      customer: {
        name: "Jennifer Martinez",
        email: "jennifer@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      diveTrip: "Wall Dive Adventure",
      date: "2025-04-05",
      amount: "$140.00",
      status: "confirmed",
    },
    {
      id: "BS-1235",
      customer: {
        name: "Daniel Thompson",
        email: "daniel@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      diveTrip: "Beginner Reef Tour",
      date: "2025-04-06",
      amount: "$110.00",
      status: "pending",
    },
    {
      id: "BS-1236",
      customer: {
        name: "Lisa Rodriguez",
        email: "lisa@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      diveTrip: "Cave Exploration",
      date: "2025-04-07",
      amount: "$160.00",
      status: "confirmed",
    },
  ],
  sipalay: [
    {
      id: "BSP-1234",
      customer: {
        name: "Thomas White",
        email: "thomas@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      diveTrip: "Shipwreck Dive",
      date: "2025-04-10",
      amount: "$170.00",
      status: "confirmed",
    },
    {
      id: "BSP-1235",
      customer: {
        name: "Michelle Clark",
        email: "michelle@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      diveTrip: "Coral Garden Tour",
      date: "2025-04-11",
      amount: "$115.00",
      status: "pending",
    },
  ],
};

// Aggregated data for "All Centers" view - showing top bookings from each center
const allCentersBookings = [
  {
    id: "BD-1234",
    customer: {
      name: "John Smith",
      email: "john@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    diveTrip: "Coral Reef Exploration",
    date: "2025-03-28",
    amount: "$120.00",
    status: "confirmed",
    center: "Sea Explorers Dauin",
  },
  {
    id: "BM-1234",
    customer: {
      name: "David Wilson",
      email: "david@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    diveTrip: "Thresher Shark Dive",
    date: "2025-04-02",
    amount: "$185.00",
    status: "confirmed",
    center: "Sea Explorers Malapascua",
  },
  {
    id: "BS-1234",
    customer: {
      name: "Jennifer Martinez",
      email: "jennifer@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    diveTrip: "Wall Dive Adventure",
    date: "2025-04-05",
    amount: "$140.00",
    status: "confirmed",
    center: "Sea Explorers Siquijor",
  },
  {
    id: "BSP-1234",
    customer: {
      name: "Thomas White",
      email: "thomas@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    diveTrip: "Shipwreck Dive",
    date: "2025-04-10",
    amount: "$170.00",
    status: "confirmed",
    center: "Sea Explorers Sipalay",
  },
  {
    id: "BD-1235",
    customer: {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    diveTrip: "Muck Diving Adventure",
    date: "2025-03-29",
    amount: "$150.00",
    status: "pending",
    center: "Sea Explorers Dauin",
  },
];

export function RecentBookings({ className }: RecentBookingsProps) {
  const { currentCenter, isAllCenters } = useDiveCenter();
  
  // Select bookings based on current center or show aggregated data
  const bookings = isAllCenters 
    ? allCentersBookings 
    : currentCenter ? diveCenterBookings[currentCenter.id as keyof typeof diveCenterBookings] : diveCenterBookings.dauin;

  return (
    <Card className={cn("col-span-1", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>
              {isAllCenters 
                ? "Recent bookings across all dive centers." 
                : `You have ${bookings.length} bookings this month.`}
            </CardDescription>
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
                {isAllCenters && <TableHead className="text-xs">Center</TableHead>}
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
                  {isAllCenters && (
                    <TableCell className="text-xs py-2">
                      {(booking as any).center}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

