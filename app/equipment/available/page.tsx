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
import { useEffect, useState } from "react"
import type { Equipment } from "@/types/equipment"

export default function AvailableEquipmentPage() {
  const router = useRouter()
  const [availableEquipment, setAvailableEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/equipment/available")
      .then(res => res.json())
      .then(data => {
        setAvailableEquipment(data)
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <svg className="animate-spin h-8 w-8 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      <span className="text-muted-foreground text-sm">Loading available equipment...</span>
    </div>
  )

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
                  <TableHead>Available</TableHead>
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
                    <TableCell>{item.lastService ? new Date(item.lastService).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>{item.nextService ? new Date(item.nextService).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>{item.availableQuantity ?? "-"}</TableCell>
                    <TableCell>
                      {item.usageCount !== undefined && item.usageLimit !== undefined ? (
                        <div className="flex items-center gap-1">
                          <span className={item.usageCount >= item.usageLimit * 0.8 ? "text-orange-500 font-medium" : ""}>
                            {item.usageCount}/{item.usageLimit}
                          </span>
                          <Progress 
                            value={(item.usageCount / item.usageLimit) * 100} 
                            className={`h-1 w-16 ml-2 ${item.usageCount >= item.usageLimit * 0.8 ? "text-orange-400" : ""}`}
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