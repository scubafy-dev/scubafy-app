"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function MaintenanceEquipmentPage() {
  const router = useRouter()

  // This would normally be fetched from your database/API
  const maintenanceEquipment = [
    {
      id: "EQ-1003",
      type: "Scuba Tank",
      sku: "TANK-63-001",
      make: "Faber",
      model: "F63",
      serialNumber: "ST-12347",
      size: "63 cu ft",
      location: "Maintenance Room",
      issue: "Visual inspection needed",
      maintenanceSince: "2025-03-10",
      expectedCompletion: "2025-03-28",
      assignedTo: "Tech - David Lee",
      condition: "fair",
      trackUsage: true,
      usageCount: 105,
      usageLimit: 100,
    },
    {
      id: "EQ-1007",
      type: "Wetsuit",
      sku: "WS-MED-001",
      make: "O'Neill",
      model: "Reactor",
      serialNumber: "WS-2001",
      size: "Medium",
      location: "Maintenance Room",
      issue: "Tear repair needed",
      maintenanceSince: "2025-03-15",
      expectedCompletion: "2025-03-26",
      assignedTo: "Tech - Sarah Wang",
      condition: "poor",
      trackUsage: true,
      usageCount: 98,
      usageLimit: 90,
    },
  ]

  return (
    <DashboardShell>
      <DashboardHeader heading="Equipment in Maintenance" text="Equipment currently under repair or inspection.">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </DashboardHeader>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Equipment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Make/Model</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Since</TableHead>
                  <TableHead>Expected Completion</TableHead>
                  <TableHead>Assigned To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceEquipment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.make} {item.model}</TableCell>
                    <TableCell>{item.issue}</TableCell>
                    <TableCell>
                      <Badge variant={item.condition === 'poor' ? 'destructive' : 'outline'}>
                        {item.condition}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.trackUsage ? (
                        <div className="text-amber-500 font-medium">
                          {item.usageCount}/{item.usageLimit}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not tracked</span>
                      )}
                    </TableCell>
                    <TableCell>{item.maintenanceSince}</TableCell>
                    <TableCell>{item.expectedCompletion}</TableCell>
                    <TableCell>{item.assignedTo}</TableCell>
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