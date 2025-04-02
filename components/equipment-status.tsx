"use client"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

interface EquipmentStatusProps {
  className?: string
}

export function EquipmentStatus({ className }: EquipmentStatusProps) {
  const equipment = [
    {
      type: "Scuba Tanks",
      available: 18,
      total: 25,
      needsMaintenance: 2,
    },
    {
      type: "BCDs",
      available: 12,
      total: 15,
      needsMaintenance: 1,
    },
    {
      type: "Regulators",
      available: 14,
      total: 15,
      needsMaintenance: 0,
    },
    {
      type: "Wetsuits",
      available: 10,
      total: 20,
      needsMaintenance: 3,
    },
  ]

  const alerts = [
    {
      id: "EQ-1003",
      type: "Tank",
      code: "EQ-1003",
      issue: "needs inspection",
      priority: "high",
    },
    {
      id: "EQ-2104",
      type: "BCD",
      code: "#BC-2104",
      issue: "strap damaged",
      priority: "medium",
    },
  ]

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Equipment Alerts</h2>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/equipment">View All</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <Card key={alert.id} className="overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-bold">
                    {alert.type} {alert.code} {alert.issue}
                  </h3>
                </div>
              </div>
              <Button size="sm">Report</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

