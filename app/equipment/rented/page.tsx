"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function RentedEquipmentPage() {
  const router = useRouter()

  // This would normally be fetched from your database/API
  const rentedEquipment = [
    {
      id: "EQ-1005",
      type: "BCD",
      sku: "BCD-LRG-001",
      make: "Aqua Lung",
      model: "Wave",
      serialNumber: "BCD-5002",
      size: "Large",
      location: "Main Storage Room B2",
      rentedTo: "John Smith",
      rentedToEmail: "john@example.com",
      rentedSince: "2025-03-15",
      rentedUntil: "2025-03-28",
      rentalRate: "$20.00",
      rentalTimeframe: "per dive",
      condition: "good"
    },
    {
      id: "EQ-1008",
      type: "Wetsuit",
      sku: "WS-LRG-001",
      make: "O'Neill",
      model: "Reactor",
      serialNumber: "WS-2002",
      size: "Large",
      location: "Gear Room A1",
      rentedTo: "Sarah Johnson",
      rentedToEmail: "sarah@example.com",
      rentedSince: "2025-03-20",
      rentedUntil: "2025-03-30",
      rentalRate: "$18.00",
      rentalTimeframe: "per dive",
      condition: "fair"
    }
  ]

  return (
    <DashboardShell>
      <DashboardHeader heading="Rented Equipment" text="View all equipment currently rented out to customers.">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </DashboardHeader>

      <Card>
        <CardHeader>
          <CardTitle>Rented Equipment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Make/Model</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Rented To</TableHead>
                  <TableHead>Since</TableHead>
                  <TableHead>Until</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Condition</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentedEquipment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>
                      <div className="font-medium">{item.make}</div>
                      <div className="text-xs text-muted-foreground">{item.model}</div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{item.serialNumber}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback>{item.rentedTo.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{item.rentedTo}</div>
                          <div className="text-xs text-muted-foreground">{item.rentedToEmail}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{item.rentedSince}</TableCell>
                    <TableCell>{item.rentedUntil}</TableCell>
                    <TableCell>{item.rentalRate}/{item.rentalTimeframe}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "capitalize",
                          item.condition === "excellent" && "border-green-500 text-green-500",
                          item.condition === "good" && "border-blue-500 text-blue-500",
                          item.condition === "fair" && "border-yellow-500 text-yellow-500",
                          item.condition === "poor" && "border-red-500 text-red-500"
                        )}
                      >
                        {item.condition}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  )
} 