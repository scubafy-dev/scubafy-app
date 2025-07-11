"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import type { Equipment } from "@/types/equipment"

export default function MaintenanceEquipmentPage() {
  const router = useRouter()
  const [maintenanceEquipment, setMaintenanceEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/equipment/maintenance")
      .then(res => res.json())
      .then(data => {
        setMaintenanceEquipment(data)
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <svg className="animate-spin h-8 w-8 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      <span className="text-muted-foreground text-sm">Loading maintenance equipment...</span>
    </div>
  )

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