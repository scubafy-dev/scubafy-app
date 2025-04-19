"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function AvailableEquipmentPage() {
  const router = useRouter()

  // This would normally be fetched from your database/API
  const availableEquipment = [
    {
      id: "EQ-1001",
      type: "Scuba Tank",
      sku: "TANK-80-001",
      make: "ScubaPro",
      model: "S80",
      serialNumber: "ST-12345",
      size: "80 cu ft",
      location: "Main Storage Room A3",
      lastInspection: "2025-01-15",
      nextInspection: "2025-07-15",
      trackUsage: true,
      usageCount: 56,
      usageLimit: 100,
    },
    {
      id: "EQ-1004",
      type: "BCD",
      sku: "BCD-MED-001",
      make: "Aqua Lung",
      model: "Wave",
      serialNumber: "BCD-5001",
      size: "Medium",
      location: "Main Storage Room B2",
      lastInspection: "2025-02-10",
      nextInspection: "2025-08-10",
      trackUsage: false,
    },
    {
      id: "EQ-1006",
      type: "Regulator",
      sku: "REG-PRO-001",
      make: "Mares",
      model: "Prestige",
      serialNumber: "REG-3001",
      size: "N/A",
      location: "Main Storage Room C1",
      lastInspection: "2025-03-01",
      nextInspection: "2025-09-01",
      trackUsage: true,
      usageCount: 23,
      usageLimit: 75,
    },
  ]

  return (
    <DashboardShell>
      <DashboardHeader heading="Available Equipment" text="View all equipment ready for use.">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </DashboardHeader>

      <Card>
        <CardHeader>
          <CardTitle>Available Equipment Details</CardTitle>
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
                  <TableHead>Location</TableHead>
                  <TableHead>Last Inspection</TableHead>
                  <TableHead>Next Inspection</TableHead>
                  <TableHead>Usage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableEquipment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.make} {item.model}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.lastInspection}</TableCell>
                    <TableCell>{item.nextInspection}</TableCell>
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