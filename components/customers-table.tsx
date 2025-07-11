"use client";

import * as React from "react";
import type { Row } from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, ClockIcon, PhoneIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDiveCenter } from "@/lib/dive-center-context";
import { Customer } from "@/lib/customers";
import { AddCustomerForm } from "./add-customer-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { set } from "date-fns";

export function CustomersTable(
  { customers, deleteCustomer, updateCustomer, isLoading }: {
    customers: Customer[];
    deleteCustomer: (id: string) => Promise<void>;
    updateCustomer: (id: string, formData: FormData) => Promise<void>;
    isLoading?: boolean;
  },
) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] = React.useState<
    VisibilityState
  >({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedCustomer, setSelectedCustomer] = React.useState<
    Customer | null
  >(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const { currentCenter, isAllCenters } = useDiveCenter();

  const router = useRouter();

  // Copy customer ID to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "ID copied to clipboard",
        description: `Customer ID: ${text}`,
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast({
        title: "Failed to copy ID",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  // Filter customers based on the selected dive center
  // const customers = React.useMemo(() => {
  //   if (isAllCenters) {
  //     return allCustomers;
  //   }
  //   return currentCenter ? customersByCenter[currentCenter.id] || [] : [];
  // }, [currentCenter, isAllCenters]);

  // Get total payment for a customer
  const calculateTotal = (customer: Customer): number => {
    const accommodationTotal = customer.roomCost || 0;
    const courseTotal = customer.courseStudents?.reduce(
      (sum, courseStudent) => sum + (courseStudent.course.cost || 0),
      0,
    ) || 0;
    const divesTotal = customer.participants?.reduce(
      (sum, participant) => sum + (participant.diveTrip.price || 0),
      0,
    ) || 0;
    const equipmentTotal = customer.equipmentRentals?.reduce(
      (sum, rental) => sum + (rental.rentPrice * rental.quantity),
      0,
    ) || 0;

    return accommodationTotal + courseTotal + divesTotal + equipmentTotal;
  };

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: "Customer",
      cell: ({ row }: { row: Row<Customer> }) => {
        const customer = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{customer.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium leading-none">{customer.fullName}</p>
              <p className="text-sm text-muted-foreground">{customer.email}</p>
            </div>
          </div>
        );
      },
    },
    ...(isAllCenters
      ? [
        {
          accessorKey: "center",
          header: "Center",
          cell: ({ row }: { row: Row<Customer> }) => {
            return <div>{row.getValue("center")}</div>;
          },
        },
      ]
      : []),
    {
      accessorKey: "certificationLevel",
      header: "Certification",
      cell: ({ row }: { row: Row<Customer> }) => {
        const level = row.getValue("certificationLevel") as string;
        return (
          <Badge
            variant={level === "Instructor" || level === "Divemaster"
              ? "default"
              : level === "Rescue Diver"
              ? "outline"
              : "secondary"}
          >
            {level}
          </Badge>
        );
      },
    },
    {
      accessorKey: "currentCourse",
      header: "Current Course",
      cell: ({ row }: { row: Row<Customer> }) => {
        const customer = row.original;
        const activeCourses = customer.courseStudents?.filter(
          courseStudent => courseStudent.course.status === "active" || courseStudent.course.status === "upcoming"
        ) || [];
        
        if (activeCourses.length > 0) {
          return (
            <div className="space-y-1">
              {activeCourses.map((courseStudent, index) => (
                <Badge key={courseStudent.id} variant="outline" className="text-xs">
                  {courseStudent.course.title}
                </Badge>
              ))}
            </div>
          );
        }
        
        return <div className="text-muted-foreground">-</div>;
      },
    },
    {
      accessorKey: "lastDive",
      header: "Last Dive",
      cell: ({ row }: { row: Row<Customer> }) => {
        const customer = row.original;
        const diveTrips = customer.participants || [];
        
        if (diveTrips.length > 0) {
          // Sort by date to find the most recent dive
          const sortedDives = diveTrips
            .filter(participant => participant.diveTrip.date)
            .sort((a, b) => new Date(b.diveTrip.date!).getTime() - new Date(a.diveTrip.date!).getTime());
          
          if (sortedDives.length > 0) {
            const lastDive = sortedDives[0];
            return (
              <div className="text-sm">
                <div className="font-medium">{lastDive.diveTrip.title}</div>
                <div className="text-muted-foreground text-xs">
                  {lastDive.diveTrip.date?.toLocaleDateString()}
                </div>
              </div>
            );
          }
        }
        
        return <div className="text-muted-foreground">-</div>;
      },
    },
    {
      id: "total",
      header: "Total Due",
      cell: ({ row }: { row: Row<Customer> }) => {
        const total = calculateTotal(row.original);
        return <div>${total.toFixed(2)}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: Row<Customer> }) => {
        const customer = row.original;

        return (
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setDialogOpen(true);
                  }}
                >
                  View Customer Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setUpdateDialogOpen(true);
                  }}
                >
                  Edit Customer
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setDeleteDialogOpen(true);
                  }}
                >
                  Delete Customer
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => copyToClipboard(customer.id)}>Copy ID</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Dialog>
        );
      },
    },
  ];

  const table = useReactTable({
    data: customers,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedCustomer && (
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {selectedCustomer.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {selectedCustomer.fullName}
              </DialogTitle>
              <DialogDescription>
                Customer ID: {selectedCustomer.id}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger
                  value="accommodation"
                  className="text-xs sm:text-sm"
                >
                  Accommodation
                </TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="dives">Dives</TabsTrigger>
                <TabsTrigger value="equipment">Equipment</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedCustomer.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedCustomer.phoneNumber || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Certification Level
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedCustomer.certificationLevel || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Last Dive</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedCustomer.participants && selectedCustomer.participants.length > 0 
                            ? selectedCustomer.participants[0].diveTrip.date?.toLocaleDateString() 
                            : "No dives recorded"}
                        </p>
                      </div>
                    </div>

                    {selectedCustomer.participants && selectedCustomer.participants.length > 0 && (
                      <div>
                        <p className="text-sm font-medium">
                          Upcoming Dives
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedCustomer.participants.length} dive(s) booked
                        </p>
                      </div>
                    )}

                    {selectedCustomer.courseStudents && selectedCustomer.courseStudents.length > 0 && (
                      <div>
                        <p className="text-sm font-medium">
                          Current Courses
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedCustomer.courseStudents.length} course(s) enrolled
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="accommodation">
                <Card>
                  <CardContent className="pt-4">
                    {selectedCustomer.roomNumber
                      ? (
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium">Room</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedCustomer.roomNumber}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              Number of Nights
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {selectedCustomer.numberOfNights}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Room Cost</p>
                            <p className="text-sm text-muted-foreground">
                              ${selectedCustomer.roomCost?.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      )
                      : (
                        <p className="text-sm text-muted-foreground">
                          No accommodation booked
                        </p>
                      )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="courses">
                <Card>
                  <CardContent className="pt-4">
                    {selectedCustomer.courseStudents &&
                        selectedCustomer.courseStudents.length > 0
                      ? (
                        <div className="space-y-4">
                          {selectedCustomer.courseStudents.map(
                            (courseStudent, index) => (
                              <div
                                key={courseStudent.id}
                                className="border rounded-md p-3"
                              >
                                <div className="flex justify-between">
                                  <p className="text-sm font-medium">
                                    {courseStudent.course.title}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    ${courseStudent.course.cost?.toFixed(2) || "0.00"}
                                  </p>
                                </div>
                                <div className="flex justify-between mt-1">
                                  <p className="text-sm text-muted-foreground">
                                    {courseStudent.course.startDate?.toLocaleDateString() || "TBD"} - {courseStudent.course.endDate?.toLocaleDateString() || "TBD"}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {courseStudent.course.location || "Location TBD"}
                                  </p>
                                </div>
                                <div className="mt-1">
                                  <p className="text-xs text-muted-foreground">
                                    Status: {courseStudent.course.status || "Unknown"} • Level: {courseStudent.course.certificationLevel || "Not specified"}
                                  </p>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      )
                      : (
                        <p className="text-sm text-muted-foreground">
                          No upcoming courses
                        </p>
                      )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="dives">
                <Card>
                  <CardContent className="pt-4">
                    {selectedCustomer.participants &&
                        selectedCustomer.participants.length > 0
                      ? (
                        <div className="space-y-4">
                          {selectedCustomer.participants.map(
                            (participant, index) => (
                              <div
                                key={participant.id}
                                className="border rounded-md p-3"
                              >
                                <div className="flex justify-between">
                                  <p className="text-sm font-medium">
                                    {participant.diveTrip.title}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    ${participant.diveTrip.price?.toFixed(2) || "0.00"}
                                  </p>
                                </div>
                                <div className="flex justify-between mt-1">
                                  <p className="text-sm text-muted-foreground">
                                    {participant.diveTrip.date?.toLocaleDateString() || "TBD"}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {participant.diveTrip.location || "Location TBD"}
                                  </p>
                                </div>
                                <div className="mt-1">
                                  <p className="text-xs text-muted-foreground">
                                    Participant: {participant.name} ({participant.certification})
                                  </p>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      )
                      : (
                        <p className="text-sm text-muted-foreground">
                          No upcoming dives
                        </p>
                      )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="equipment">
                <Card>
                  <CardContent className="pt-4">
                    {selectedCustomer.equipmentRentals &&
                        selectedCustomer.equipmentRentals.length > 0
                      ? (
                        <div className="space-y-4">
                          {selectedCustomer.equipmentRentals.map(
                            (rental, index) => (
                              <div
                                key={rental.id}
                                className="border rounded-md p-3"
                              >
                                <div className="flex justify-between">
                                  <p className="text-sm font-medium">
                                    {rental.equipment.brand} {rental.equipment.model}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    ${rental.rentPrice?.toFixed(2) || "0.00"}
                                  </p>
                                </div>
                                <div className="flex justify-between mt-1">
                                  <p className="text-sm text-muted-foreground">
                                    Type: {rental.equipment.type}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Qty: {rental.quantity}
                                  </p>
                                </div>
                                <div className="flex justify-between mt-1">
                                  <p className="text-sm text-muted-foreground">
                                    Condition: {rental.equipment.condition}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Status: {rental.status}
                                  </p>
                                </div>
                                {rental.rentFrom && rental.rentTo && (
                                  <div className="mt-1">
                                    <p className="text-xs text-muted-foreground">
                                      Rented: {rental.rentFrom.toLocaleDateString()} - {rental.rentTo.toLocaleDateString()}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ),
                          )}
                        </div>
                      )
                      : (
                        <p className="text-sm text-muted-foreground">
                          No equipment rented
                        </p>
                      )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="billing">
                <Card>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {selectedCustomer.roomCost &&
                        selectedCustomer.roomCost > 0 && (
                        <div className="flex justify-between">
                          <p className="text-sm">Accommodation</p>
                          <p className="text-sm font-medium">
                            ${selectedCustomer.roomCost?.toFixed(2)}
                          </p>
                        </div>
                      )}
                      {selectedCustomer.courseStudents && selectedCustomer.courseStudents.length > 0 && (
                        <div className="flex justify-between">
                          <p className="text-sm">Course Fees</p>
                          <p className="text-sm font-medium">
                            $
                            {selectedCustomer.courseStudents
                              .reduce((acc, courseStudent) => acc + (courseStudent.course.cost || 0), 0)
                              .toFixed(2)}
                          </p>
                        </div>
                      )}
                      {selectedCustomer.participants && selectedCustomer.participants.length > 0 && (
                        <div className="flex justify-between">
                          <p className="text-sm">Dive Fees</p>
                          <p className="text-sm font-medium">
                            $
                            {selectedCustomer.participants
                              .reduce((acc, participant) => acc + (participant.diveTrip.price || 0), 0)
                              .toFixed(2)}
                          </p>
                        </div>
                      )}
                      {selectedCustomer.equipmentRentals && selectedCustomer.equipmentRentals.length > 0 && (
                        <div className="flex justify-between">
                          <p className="text-sm">Equipment Rental</p>
                          <p className="text-sm font-medium">
                            $
                            {selectedCustomer.equipmentRentals
                              .reduce((acc, rental) => acc + (rental.rentPrice * rental.quantity), 0)
                              .toFixed(2)}
                          </p>
                        </div>
                      )}
                      <div className="pt-2 mt-2 border-t flex justify-between">
                        <p className="text-sm font-medium">Total</p>
                        <p className="text-sm font-medium">
                          ${calculateTotal(selectedCustomer).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
      {/* Search and filter temporarily hidden */}
      {/* <div className="flex items-center py-4">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column: any) => column.getCanHide())
              .map((column: any) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div> */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading customers...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length
              ? (
                table.getRowModel().rows.map((row: Row<Customer>) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => {
                      // setSelectedCustomer(row.original);
                      // setDialogOpen(true);
                    }}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell: any) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )
              : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </div>
      
      {/* <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div> */}

      <Dialog
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Update Customer</DialogTitle>
          </DialogHeader>
          <AddCustomerForm
            onSuccess={() => setUpdateDialogOpen(false)}
            updateCustomer={updateCustomer}
            customer={selectedCustomer}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove this customer related data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (selectedCustomer) {
                  await deleteCustomer(selectedCustomer.id);
                  toast({
                    title: "Customer deleted successfully.",
                    description: `id: ${
                      selectedCustomer.id ?? "N/A"
                    }   \n name: ${selectedCustomer.fullName}`,
                  });
                  setDeleteDialogOpen(false);
                }
              }}
            >
              Yes, delete this customer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
