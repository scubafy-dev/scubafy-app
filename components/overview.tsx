"use client"

import { Users, DollarSign, Anchor, LifeBuoy } from "lucide-react"
import { Card } from "@/components/ui/card"

export function Overview() {
  return (
    <>
      <Card className="dashboard-card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="dashboard-card-title">Assigned Trips</h3>
          <Anchor className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="dashboard-card-value">3</div>
        <p className="dashboard-card-subtitle">Next 7 days</p>
      </Card>
      <Card className="dashboard-card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="dashboard-card-title">Active Divers</h3>
          <Users className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="dashboard-card-value">42</div>
        <p className="dashboard-card-subtitle">+8 new this week</p>
      </Card>
      <Card className="dashboard-card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="dashboard-card-title">Equipment Status</h3>
          <LifeBuoy className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="dashboard-card-value">2</div>
        <p className="dashboard-card-subtitle">Items need attention</p>
      </Card>
      <Card className="dashboard-card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="dashboard-card-title">Revenue</h3>
          <DollarSign className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="dashboard-card-value">$12,234</div>
        <p className="dashboard-card-subtitle">+19% from last month</p>
      </Card>
    </>
  )
}

