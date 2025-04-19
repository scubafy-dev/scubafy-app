"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Image, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"

interface DiveReport {
  id: string
  tripName: string
  date: string
  depth?: string
  weatherConditions: string
  tripSummary: string
  incidents: string
  mediaFiles: File[]
  staffName?: string
}

export default function ReportsPage() {
  const [reports, setReports] = useState<DiveReport[]>([
    {
      id: "1",
      tripName: "Great Barrier Reef Exploration",
      date: "2023-08-15",
      depth: "18",
      weatherConditions: "sunny",
      tripSummary: "Fantastic visibility, spotted several sea turtles and a reef shark. All divers completed the trip safely.",
      incidents: "",
      mediaFiles: [],
      staffName: "Alex Thompson"
    },
    {
      id: "2",
      tripName: "Blue Hole Adventure",
      date: "2023-09-22",
      depth: "30",
      weatherConditions: "cloudy",
      tripSummary: "Deep dive to explore the Blue Hole. Amazing geological formations and diverse marine life.",
      incidents: "One diver had minor equipment issue, resolved quickly with backup regulator.",
      mediaFiles: [],
      staffName: "Maria Rodriguez"
    },
    {
      id: "3",
      tripName: "Wreck Dive - SS Yongala",
      date: "2023-10-05",
      depth: "28",
      weatherConditions: "rainy",
      tripSummary: "Historical wreck exploration. Despite the rain, underwater visibility was reasonable.",
      incidents: "",
      mediaFiles: [],
      staffName: "James Wilson"
    },
    {
      id: "4",
      tripName: "Night Dive at Coral Cove",
      date: "2023-11-12",
      depth: "15",
      weatherConditions: "clear",
      tripSummary: "Memorable night dive featuring bioluminescent organisms and nocturnal predators hunting.",
      incidents: "Slight current made navigation challenging for beginner divers.",
      mediaFiles: [],
      staffName: "Sarah Li"
    }
  ])
  const [formData, setFormData] = useState({
    tripName: "",
    date: "",
    depth: "",
    weatherConditions: "",
    tripSummary: "",
    incidents: ""
  })
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [selectedReport, setSelectedReport] = useState<DiveReport | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newReport: DiveReport = {
      id: Date.now().toString(),
      ...formData,
      mediaFiles,
      staffName: "You" // Simulating current user
    }
    setReports([newReport, ...reports])
    setFormData({
      tripName: "",
      date: "",
      depth: "",
      weatherConditions: "",
      tripSummary: "",
      incidents: ""
    })
    setMediaFiles([])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files)
      setMediaFiles([...mediaFiles, ...fileArray])
    }
  }

  const removeFile = (index: number) => {
    const newFiles = [...mediaFiles]
    newFiles.splice(index, 1)
    setMediaFiles(newFiles)
  }

  const openReportDetails = (report: DiveReport) => {
    setSelectedReport(report)
    setDialogOpen(true)
  }

  const getWeatherLabel = (condition: string) => {
    const labels: Record<string, { label: string, className: string }> = {
      sunny: { label: "Sunny", className: "bg-yellow-500" },
      cloudy: { label: "Cloudy", className: "bg-slate-400" },
      rainy: { label: "Rainy", className: "bg-blue-400" },
      stormy: { label: "Stormy", className: "bg-purple-500" },
      windy: { label: "Windy", className: "bg-emerald-500" },
      clear: { label: "Clear", className: "bg-sky-400" }
    }
    
    return labels[condition] || { label: condition, className: "bg-gray-500" }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Dive Reports" text="Submit and view dive trip reports." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Submit New Report</CardTitle>
            <CardDescription>Fill out the form below to submit a new dive report. All fields are optional.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tripName">Trip Name</Label>
                <Input
                  id="tripName"
                  value={formData.tripName}
                  onChange={(e) => setFormData({ ...formData, tripName: e.target.value })}
                  placeholder="Enter trip name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="depth">Max Depth (meters)</Label>
                  <Input
                    id="depth"
                    type="number"
                    value={formData.depth}
                    onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
                    placeholder="Enter max depth"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weatherConditions">Weather Conditions</Label>
                <Select
                  value={formData.weatherConditions}
                  onValueChange={(value) => setFormData({ ...formData, weatherConditions: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select weather conditions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunny">Sunny</SelectItem>
                    <SelectItem value="cloudy">Cloudy</SelectItem>
                    <SelectItem value="rainy">Rainy</SelectItem>
                    <SelectItem value="stormy">Stormy</SelectItem>
                    <SelectItem value="windy">Windy</SelectItem>
                    <SelectItem value="clear">Clear</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tripSummary">Trip Summary</Label>
                <Textarea
                  id="tripSummary"
                  value={formData.tripSummary}
                  onChange={(e) => setFormData({ ...formData, tripSummary: e.target.value })}
                  placeholder="Enter a summary of the trip"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="incidents">Incidents or Issues</Label>
                <Textarea
                  id="incidents"
                  value={formData.incidents}
                  onChange={(e) => setFormData({ ...formData, incidents: e.target.value })}
                  placeholder="Describe any incidents or issues during the trip"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="media">Upload Pictures & Videos</Label>
                <Input
                  id="media"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                  multiple
                  className="cursor-pointer"
                />
                {mediaFiles.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <p className="text-sm font-medium">Uploaded files:</p>
                    <ul className="text-sm space-y-1">
                      {mediaFiles.map((file, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <span className="truncate">{file.name}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeFile(index)}
                            className="h-6 px-2 text-xs"
                          >
                            Remove
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full">Submit Report</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>View all submitted dive reports. Click on a report to see details.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trip Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Depth (m)</TableHead>
                    <TableHead>Staff</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        No reports submitted yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    reports.map((report) => (
                      <TableRow 
                        key={report.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => openReportDetails(report)}
                      >
                        <TableCell className="font-medium">{report.tripName || "-"}</TableCell>
                        <TableCell>{report.date || "-"}</TableCell>
                        <TableCell>{report.depth || "-"}</TableCell>
                        <TableCell>{report.staffName || "Unknown"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report details dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedReport.tripName}</DialogTitle>
                <div className="text-sm text-muted-foreground mt-1">
                  Reported by {selectedReport.staffName} on {selectedReport.date}
                </div>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge className={cn(getWeatherLabel(selectedReport.weatherConditions).className)}>
                    {getWeatherLabel(selectedReport.weatherConditions).label}
                  </Badge>
                  <Badge variant="outline">Depth: {selectedReport.depth || "N/A"} meters</Badge>
                </div>

                <div className="space-y-1">
                  <h4 className="font-medium">Trip Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedReport.tripSummary || "No summary provided"}
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-medium">Incidents or Issues</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedReport.incidents || "No incidents reported"}
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-medium flex items-center gap-1">
                    <Image className="h-4 w-4" />
                    Media Files
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedReport.mediaFiles.length > 0 
                      ? `${selectedReport.mediaFiles.length} files attached` 
                      : "No media files attached"}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
} 