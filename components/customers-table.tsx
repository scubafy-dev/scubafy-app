"use client"

import * as React from "react"
import type { Row } from "@tanstack/react-table"
import {
  ChevronDown,
  ArrowUpDown,
  MoreHorizontal
} from "lucide-react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, ClockIcon, PhoneIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDiveCenter } from "@/lib/dive-center-context"
import { customersByCenter, allCustomers, Customer, Equipment, Dive } from "@/lib/mock-data/customers"

export function CustomersTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const { currentCenter, isAllCenters } = useDiveCenter()

  // Filter customers based on the selected dive center
  const customers = React.useMemo(() => {
    if (isAllCenters) {
      return allCustomers
    }
    return currentCenter ? customersByCenter[currentCenter.id] || [] : []
  }, [currentCenter, isAllCenters])

  // Get total payment for a customer
  const calculateTotal = (customer: Customer): number => {
    const accommodationTotal = customer.roomCost || 0
    const courseTotal = customer.courseCost || 0
    const divesTotal = customer.upcomingDives.reduce((sum, dive) => sum + dive.cost, 0)
    const equipmentTotal = customer.rentedEquipment.reduce((sum, eq) => sum + eq.cost, 0)
    
    return accommodationTotal + courseTotal + divesTotal + equipmentTotal
  }

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: "Customer",
      cell: ({ row }: { row: Row<Customer> }) => {
        const customer = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={customer.avatar} alt={customer.name} />
              <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium leading-none">{customer.name}</p>
              <p className="text-sm text-muted-foreground">{customer.email}</p>
            </div>
          </div>
        )
      },
    },
    ...(isAllCenters
      ? [
          {
            accessorKey: "center",
            header: "Center",
            cell: ({ row }: { row: Row<Customer> }) => {
              return <div>{row.getValue("center")}</div>
            },
          },
        ]
      : []),
    {
      accessorKey: "certificationLevel",
      header: "Certification",
      cell: ({ row }: { row: Row<Customer> }) => {
        const level = row.getValue("certificationLevel") as string
        return (
          <Badge
            variant={
              level === "Instructor" || level === "Divemaster"
                ? "default"
                : level === "Rescue Diver"
                ? "outline"
                : "secondary"
            }
          >
            {level}
          </Badge>
        )
      },
    },
    {
      accessorKey: "currentCourse",
      header: "Current Course",
      cell: ({ row }: { row: Row<Customer> }) => {
        const course = row.getValue("currentCourse") as string
        return course ? (
          <div>
            <Badge variant="outline">{course}</Badge>
          </div>
        ) : (
          <div className="text-muted-foreground">-</div>
        )
      },
    },
    {
      accessorKey: "lastDive",
      header: "Last Dive",
      cell: ({ row }: { row: Row<Customer> }) => {
        return <div>{row.getValue("lastDive")}</div>
      },
    },
    {
      id: "total",
      header: "Total Due",
      cell: ({ row }: { row: Row<Customer> }) => {
        const total = calculateTotal(row.original)
        return <div>${total.toFixed(2)}</div>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: Row<Customer> }) => {
        const customer = row.original

        return (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                    setSelectedCustomer(customer)
                    setDialogOpen(true)
                  }}
                >
                  View Customer Profile
                </DropdownMenuItem>
                <DropdownMenuItem>Edit Customer</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Copy ID</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Dialog>
        )
      },
    },
  ]

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
  })

  return (
    <div className="w-full">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedCustomer && (
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedCustomer.avatar} alt={selectedCustomer.name} />
                  <AvatarFallback>{selectedCustomer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {selectedCustomer.name}
              </DialogTitle>
              <DialogDescription>
                Customer ID: {selectedCustomer.id}
                {isAllCenters && selectedCustomer.center && (
                  <span className="ml-2">• Center: {selectedCustomer.center}</span>
                )}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="accommodation" className="text-xs sm:text-sm">
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
                          {selectedCustomer.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Certification Level
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedCustomer.certificationLevel}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Last Dive</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedCustomer.lastDive}
                        </p>
                      </div>
                    </div>
                    {selectedCustomer.currentCourse && (
                      <div>
                        <p className="text-sm font-medium">
                          Current Course
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedCustomer.currentCourse}
                          {selectedCustomer.courseStartDate &&
                            ` (${selectedCustomer.courseStartDate} to ${selectedCustomer.courseEndDate})`}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="accommodation">
                <Card>
                  <CardContent className="pt-4">
                    {selectedCustomer.room ? (
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium">Room</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedCustomer.room}
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
                    ) : (
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
                    {selectedCustomer.currentCourse ? (
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium">Course</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedCustomer.currentCourse}
                          </p>
                        </div>
                        {selectedCustomer.courseStartDate && (
                          <>
                            <div>
                              <p className="text-sm font-medium">
                                Start Date
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {selectedCustomer.courseStartDate}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                End Date
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {selectedCustomer.courseEndDate}
                              </p>
                            </div>
                          </>
                        )}
                        {selectedCustomer.courseCost && (
                          <div>
                            <p className="text-sm font-medium">
                              Course Cost
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ${selectedCustomer.courseCost?.toFixed(2)}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No courses booked
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="dives">
                <Card>
                  <CardContent className="pt-4">
                    {selectedCustomer.upcomingDives &&
                    selectedCustomer.upcomingDives.length > 0 ? (
                      <div className="space-y-4">
                        {selectedCustomer.upcomingDives.map(
                          (dive, index) => (
                            <div
                              key={index}
                              className="border rounded-md p-3"
                            >
                              <div className="flex justify-between">
                                <p className="text-sm font-medium">
                                  {dive.site}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  ${dive.cost?.toFixed(2)}
                                </p>
                              </div>
                              <div className="flex justify-between mt-1">
                                <p className="text-sm text-muted-foreground">
                                  {dive.date}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {dive.type}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
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
                    {selectedCustomer.rentedEquipment &&
                    selectedCustomer.rentedEquipment.length > 0 ? (
                      <div className="space-y-4">
                        {selectedCustomer.rentedEquipment.map(
                          (equipment, index) => (
                            <div
                              key={index}
                              className="border rounded-md p-3"
                            >
                              <div className="flex justify-between">
                                <p className="text-sm font-medium">
                                  {equipment.item}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  ${equipment.cost?.toFixed(2)}
                                </p>
                              </div>
                              <div className="flex justify-between mt-1">
                                <p className="text-sm text-muted-foreground">
                                  Due: {equipment.dueDate}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Condition: {equipment.condition}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
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
                      {selectedCustomer.roomCost && selectedCustomer.roomCost > 0 && (
                        <div className="flex justify-between">
                          <p className="text-sm">Accommodation</p>
                          <p className="text-sm font-medium">
                            ${selectedCustomer.roomCost?.toFixed(2)}
                          </p>
                        </div>
                      )}
                      {selectedCustomer.courseCost && selectedCustomer.courseCost > 0 && (
                        <div className="flex justify-between">
                          <p className="text-sm">Course Fee</p>
                          <p className="text-sm font-medium">
                            ${selectedCustomer.courseCost?.toFixed(2)}
                          </p>
                        </div>
                      )}
                      {selectedCustomer.upcomingDives.length > 0 && (
                        <div className="flex justify-between">
                          <p className="text-sm">Dive Fees</p>
                          <p className="text-sm font-medium">
                            $
                            {selectedCustomer.upcomingDives
                              .reduce((acc, dive) => acc + dive.cost, 0)
                              .toFixed(2)}
                          </p>
                        </div>
                      )}
                      {selectedCustomer.rentedEquipment.length > 0 && (
                        <div className="flex justify-between">
                          <p className="text-sm">Equipment Rental</p>
                          <p className="text-sm font-medium">
                            $
                            {selectedCustomer.rentedEquipment
                              .reduce((acc, eq) => acc + eq.cost, 0)
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
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
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
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: Row<Customer>) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    setSelectedCustomer(row.original)
                    setDialogOpen(true)
                  }}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell: any) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
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
      <div className="flex items-center justify-end space-x-2 py-4">
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
      </div>
    </div>
  )
}

