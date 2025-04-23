"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AddReportForm } from "@/components/add-report-form"
import { useDiveCenter } from "@/lib/dive-center-context"
import { reportsByCenter, allCentersReports } from "@/lib/mock-data/reports"

export default function ReportsPage() {
  const [isAddReportOpen, setIsAddReportOpen] = useState(false)
  const { currentCenter, isAllCenters, getCenterSpecificData } = useDiveCenter()

  // Get reports based on selected dive center
  const reports = getCenterSpecificData(reportsByCenter, allCentersReports) || []

  return (
    <DashboardShell>
      <DashboardHeader heading="Dive Reports" text="View and manage dive reports across your centers.">
        <Button onClick={() => setIsAddReportOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Report
        </Button>
      </DashboardHeader>

      <Card>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trip Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Details</TableHead>
                  {isAllCenters && <TableHead>Center</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(reports) && reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="font-medium">{report.tripName}</div>
                    </TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>{report.location}</TableCell>
                    <TableCell>{report.staffName}</TableCell>
                    <TableCell>{report.participants}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {report.maxDepth}m max depth
                          </Badge>
                          <Badge variant="outline">
                            {report.diveDuration}min
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {report.visibility}m visibility
                          </Badge>
                          <Badge variant="outline">
                            {report.waterTemp}°C
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    {isAllCenters && (
                      <TableCell>
                        <span className="text-sm font-medium">
                          {report.center}
                        </span>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {(!Array.isArray(reports) || reports.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={isAllCenters ? 7 : 6} className="text-center py-6">
                      No reports found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddReportOpen} onOpenChange={setIsAddReportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Report</DialogTitle>
          </DialogHeader>
          <AddReportForm onSuccess={() => setIsAddReportOpen(false)} />
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
} 