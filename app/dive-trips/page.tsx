"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Plus, Car, Anchor, Ship } from "lucide-react"
import { DiveTripsTable } from "@/components/dive-trips-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AddTripForm } from "@/components/add-trip-form"
import { VehicleManagement } from "@/components/vehicle-management"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DiveTripsPage() {
  const [isAddTripOpen, setIsAddTripOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("trips")
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false)

  return (
    <DashboardShell>
      <Tabs defaultValue="trips" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="trips">Trips</TabsTrigger>
            <TabsTrigger value="vehicles" className="flex items-center gap-1">
              <span>Vehicles</span>
              <div className="flex -space-x-1">
                <Anchor className="h-3 w-3" />
                <Car className="h-3 w-3" />
                <Ship className="h-3 w-3" />
              </div>
            </TabsTrigger>
          </TabsList>
          
          {activeTab === "trips" && (
            <Button onClick={() => setIsAddTripOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Trip
            </Button>
          )}
        </div>
        
        <TabsContent value="trips">
          <DiveTripsTable />
        </TabsContent>
        
        <TabsContent value="vehicles">
          <VehicleManagement />
        </TabsContent>
      </Tabs>

      <Dialog open={isAddTripOpen} onOpenChange={setIsAddTripOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Dive Trip</DialogTitle>
          </DialogHeader>
          <AddTripForm onSuccess={() => setIsAddTripOpen(false)} />
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}

