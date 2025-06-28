"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import {
  Anchor,
  Calendar,
  Car,
  ChevronDown,
  ChevronRight,
  Edit,
  MapPin,
  MoreHorizontal,
  Plus,
  Ship,
  Trash,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddTripForm } from "@/components/add-trip-form";
import { VehicleManagement } from "@/components/vehicle-management";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useDiveCenter } from "@/lib/dive-center-context";
import { allDiveTrips, diveTripsByCenter } from "@/lib/mock-data/dive-trips";
import { FullDiveTrip } from "@/lib/dive-trips";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { ActionMode } from "@/types/all";
import {
  createDiveTrip,
  deleteDiveTrip,
  getAllDiveTrips,
  updateDiveTrip,
} from "@/lib/dive-trips";

export default function DiveTripsPage() {
  const [isAddTripOpen, setIsAddTripOpen] = useState(false);
  const [isDeleteTripAlertOpen, setIsDeleteTripAlertOpen] = useState(false);
  const [isEditTripOpen, setIsEditTripOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<FullDiveTrip | null>(null);
  const [activeTab, setActiveTab] = useState("trips");
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [diveTrips, setDiveTrips] = useState<FullDiveTrip[]>([]);

  const { currentCenter, isAllCenters, getCenterSpecificData } =
    useDiveCenter();
  const router = useRouter();

  // const diveTrips = getAllDiveTrips(currentCenter?.id ?? null);

  useEffect(() => {
    const fetchDiveTrips = async () => {
      try {
        const trips = await getAllDiveTrips(currentCenter?.id ?? null);
        setDiveTrips(trips);
      } catch (error) {
        console.error("Failed to load dive trips:", error);
      }
    };

    fetchDiveTrips();
  }, [currentCenter]);

  // useEffect(() => {
  //   const fetchDiveTrips = async () => {
  //     try {
  //       const trips = await getAllDiveTrips(currentCenter?.id ?? null);
  //       setDiveTrips(trips);
  //     } catch (error) {
  //       console.error("Failed to load dive trips:", error);
  //     }
  //   };

  //   fetchDiveTrips();
  // });

  const toggleRowExpansion = (tripId: string) => {
    setExpandedRows((prev) =>
      prev.includes(tripId)
        ? prev.filter((id) => id !== tripId)
        : [...prev, tripId]
    );
  };

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
              <Plus className="mr-2 h-4 w-4" /> Add Trip
            </Button>
          )}
        </div>

        <TabsContent value="trips">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Dive Trips</h1>
              <p className="text-muted-foreground text-sm">
                {isAllCenters
                  ? "Manage dive trips across all centers"
                  : `Manage dive trips for ${currentCenter?.name}`}
              </p>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8"></TableHead>
                      <TableHead>Trip Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Dive Master</TableHead>
                      <TableHead className="text-center">Capacity</TableHead>
                      <TableHead className="text-center">Booked</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      {isAllCenters && <TableHead>Center</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {diveTrips.map((trip) => (
                      <>
                        <TableRow
                          key={trip.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => toggleRowExpansion(trip.id)}
                        >
                          <TableCell>
                            <div className="flex items-center justify-center">
                              {expandedRows.includes(trip.id)
                                ? <ChevronDown className="h-4 w-4" />
                                : <ChevronRight className="h-4 w-4" />}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{trip.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {trip.difficulty}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                <span>{trip?.date && trip?.date.toDateString()}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{trip.location}</TableCell>
                          <TableCell>{trip.diveMaster}</TableCell>
                          <TableCell className="text-center">
                            {trip.capacity}
                          </TableCell>
                          <TableCell className="text-center">
                            {trip.booked}
                          </TableCell>
                          <TableCell>${trip.price}</TableCell>
                          <TableCell>
                            <Badge
                              variant={trip.status === "completed"
                                ? "outline"
                                : "default"}
                              className={trip.status === "upcoming"
                                ? "bg-blue-500"
                                : trip.status === "in_progress"
                                  ? "bg-amber-500"
                                  : trip.status === "completed"
                                    ? "bg-green-500"
                                    : "bg-red-500"}
                            >
                              {trip.status}
                            </Badge>
                          </TableCell>
                          {isAllCenters && <TableCell>{trip.center}</TableCell>}
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                >
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedTrip(trip);
                                    setIsEditTripOpen(true);
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" /> Edit Trip
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => {
                                    setSelectedTrip(trip);
                                    setIsDeleteTripAlertOpen(true);
                                  }}
                                >
                                  <Trash className="mr-2 h-4 w-4" /> Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                        {expandedRows.includes(trip.id) && (
                          <TableRow key={`${trip.id}#`} className="bg-muted/30">
                            <TableCell
                              colSpan={isAllCenters ? 10 : 9}
                              className="p-4"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-semibold mb-2">
                                    Description
                                  </h4>
                                  <p className="text-sm text-muted-foreground mb-4">
                                    {trip.description}
                                  </p>

                                  <h4 className="text-sm font-semibold mb-2">
                                    Duration
                                  </h4>
                                  <p className="text-sm text-muted-foreground mb-4">
                                    {trip.duration}
                                  </p>

                                  <h4 className="text-sm font-semibold mb-2">
                                    Staff
                                  </h4>
                                  <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <span className="font-medium mr-2">
                                        Dive Master:
                                      </span>
                                      {trip.diveMaster}
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <span className="font-medium mr-2">
                                        Instructor:
                                      </span>
                                      {trip.instructor}
                                    </div>
                                  </div>

                                  <h4 className="text-sm font-semibold mb-2">
                                    Vehicle Details
                                  </h4>
                                  <div className="text-sm text-muted-foreground mb-4">
                                    {trip.vehicle &&
                                      (
                                        <>
                                          <div className="flex items-center mb-1">
                                            {trip.vehicle.type === "boat" && (
                                              <Ship className="h-4 w-4 mr-2" />
                                            )}
                                            {trip.vehicle.type ===
                                              "speedboat" &&
                                              <Ship className="h-4 w-4 mr-2" />}
                                            {trip.vehicle.type ===
                                              "catamaran" &&
                                              (
                                                <Anchor className="h-4 w-4 mr-2" />
                                              )}
                                            {trip.vehicle.name}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            Vehicle Capacity:{" "}
                                            {trip.vehicle.capacity} persons
                                          </div>
                                        </>
                                      )}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-sm font-semibold mb-2 flex items-center">
                                    <MapPin className="h-4 w-4 mr-1" />{" "}
                                    Location Details
                                  </h4>
                                  <p className="text-sm text-muted-foreground mb-4">
                                    {trip.location}
                                  </p>

                                  <h4 className="text-sm font-semibold mb-2 flex items-center">
                                    <Users className="h-4 w-4 mr-1" />{" "}
                                    Participants ({trip.participants.length})
                                  </h4>
                                  <div className="text-sm text-muted-foreground mb-4">
                                    <div className="grid grid-cols-1 gap-2">
                                      {trip.participants.map((
                                        participant,
                                        index,
                                      ) => (
                                        <div
                                          key={index}
                                          className="flex flex-col p-2 border rounded-md"
                                        >
                                          <div className="font-medium">
                                            {participant.name}
                                          </div>
                                          <div className="text-xs space-y-1">
                                            <div>
                                              Certification:{" "}
                                              {participant.certification}
                                            </div>
                                            <div>
                                              Level: {participant.level}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
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
          <AddTripForm
            onSuccess={() => setIsAddTripOpen(false)}
            mode={ActionMode.create}
            trip={selectedTrip}
            actionCreate={createDiveTrip}
            actionUpdate={updateDiveTrip}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditTripOpen} onOpenChange={setIsEditTripOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Dive Trip</DialogTitle>
          </DialogHeader>
          <AddTripForm
            onSuccess={() => setIsEditTripOpen(false)}
            mode={ActionMode.update}
            trip={selectedTrip}
            actionCreate={createDiveTrip}
            actionUpdate={updateDiveTrip}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteTripAlertOpen}
        onOpenChange={setIsDeleteTripAlertOpen}
      >
        <AlertDialogPortal>
          <AlertDialogOverlay />
          <AlertDialogContent>
            <AlertDialogTitle>
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will remove this trip related data from our servers.
            </AlertDialogDescription>
            <div
              style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}
            >
              <AlertDialogCancel>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  if (selectedTrip) {
                    await deleteDiveTrip(selectedTrip.id);
                    toast({
                      title: "Trip deleted successfully.",
                      description: `Center: ${selectedTrip.center ?? "N/A"
                        }   \nTrip: ${selectedTrip.title}`,
                    });
                    router.refresh();
                  }
                }}
              >
                Yes, delete this trip
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
    </DashboardShell>
  );
}
