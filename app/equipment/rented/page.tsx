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
import { useEffect, useState } from "react"
import type { Equipment } from "@/types/equipment"

export default function RentedEquipmentPage() {
  const router = useRouter()
  const [rentedEquipment, setRentedEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/equipment/rented")
      .then(res => res.json())
      .then(data => {
        setRentedEquipment(data)
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <svg className="animate-spin h-8 w-8 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      <span className="text-muted-foreground text-sm">Loading rented equipment...</span>
    </div>
  )

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
                {rentedEquipment?.map((item) => (
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
                          <AvatarFallback>
                            {item.equipmentRentals?.[0]?.customer?.fullName
                              ? item.equipmentRentals[0].customer.fullName.split(' ').map((n: string) => n[0]).join('')
                              : "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{(item.equipmentRentals?.[0]?.customer?.fullName) ?? "Unknown"}</div>
                          <div className="text-xs text-muted-foreground">{(item.equipmentRentals?.[0]?.customer?.email) ?? ""}</div>
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