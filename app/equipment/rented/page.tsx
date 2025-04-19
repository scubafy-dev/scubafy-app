"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

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
      location: "Rental Checkout",
      rentedTo: "John Smith",
      rentedSince: "2025-03-20",
      rentedUntil: "2025-03-28",
      rentalAmount: "$60.00",
      trackUsage: true,
      usageCount: 45,
      usageLimit: 50,
    },
    {
      id: "EQ-1008",
      type: "Wetsuit",
      sku: "WS-LRG-001",
      make: "O'Neill",
      model: "Reactor",
      serialNumber: "WS-2002",
      size: "Large",
      location: "Rental Checkout",
      rentedTo: "Sarah Johnson",
      rentedSince: "2025-03-25",
      rentedUntil: "2025-03-30",
      rentalAmount: "$54.00",
      trackUsage: true,
      usageCount: 86,
      usageLimit: 90,
    },
  ]

  return (
    <DashboardShell>
      <DashboardHeader heading="Rented Equipment" text="Equipment currently rented to customers.">
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
                  <TableHead>Size</TableHead>
                  <TableHead>Rented To</TableHead>
                  <TableHead>Since</TableHead>
                  <TableHead>Until</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Usage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentedEquipment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.make} {item.model}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback>{item.rentedTo.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        {item.rentedTo}
                      </div>
                    </TableCell>
                    <TableCell>{item.rentedSince}</TableCell>
                    <TableCell>{item.rentedUntil}</TableCell>
                    <TableCell>{item.rentalAmount}</TableCell>
                    <TableCell>
                      {item.trackUsage ? (
                        <div className="flex items-center gap-1">
                          <span className={item.usageCount && item.usageLimit && item.usageCount >= item.usageLimit * 0.8 ? "text-orange-500 font-medium" : ""}>
                            {item.usageCount}/{item.usageLimit}
                          </span>
                          <Progress 
                            value={(item.usageCount && item.usageLimit) ? (item.usageCount / item.usageLimit) * 100 : 0} 
                            className={`h-1 w-16 ml-2 ${
                              (item.usageCount && item.usageLimit && item.usageCount >= item.usageLimit * 0.8) ? "text-orange-400" : ""
                            }`}
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not tracked</span>
                      )}
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