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

export default function InUseEquipmentPage() {
  const router = useRouter()

  // This would normally be fetched from your database/API
  const inUseEquipment = [
    {
      id: "EQ-1002",
      type: "Scuba Tank",
      sku: "TANK-80-002",
      make: "ScubaPro",
      model: "S80",
      serialNumber: "ST-12346",
      size: "80 cu ft",
      location: "Main Storage Room A3",
      inUseBy: "Staff - Mark Wilson",
      inUseSince: "2025-03-15",
      expectedReturn: "2025-03-25",
      trackUsage: true,
      usageCount: 78,
      usageLimit: 100,
    },
  ]

  return (
    <DashboardShell>
      <DashboardHeader heading="In-Use Equipment" text="Equipment currently being used for operations.">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </DashboardHeader>

      <Card>
        <CardHeader>
          <CardTitle>In-Use Equipment Details</CardTitle>
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
                  <TableHead>In Use By</TableHead>
                  <TableHead>Since</TableHead>
                  <TableHead>Expected Return</TableHead>
                  <TableHead>Usage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inUseEquipment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.make} {item.model}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback>MW</AvatarFallback>
                        </Avatar>
                        {item.inUseBy}
                      </div>
                    </TableCell>
                    <TableCell>{item.inUseSince}</TableCell>
                    <TableCell>{item.expectedReturn}</TableCell>
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