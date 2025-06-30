"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import {
    ChevronDown,
    ChevronUp,
    Edit,
    MoreHorizontal,
    Plus,
    Search,
    Trash,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useDiveCenter } from "@/lib/dive-center-context";
import {
    allEquipment,
    equipmentByCenter,
    EquipmentItem,
} from "@/lib/mock-data/equipment";
import { EquipmentForm } from "@/components/forms/equipment-form";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { EquipmentStats } from "@/components/equipment-stats";
import { AddEquipmentDialog } from "@/components/add-equipment-dialog";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { EquipmentDetails } from "../components/equipment-details";
import {
    Equipment,
    EquipmentFormType,
    makeEquipmentAvailable,
} from "@/lib/equipment";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ActionMode } from "@/types/all";
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
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { deleteEquipment } from "@/lib/equipment";
import { RentEquipmentDialog } from "@/components/rent-equipment-dialog";
import { Fragment } from "react";
import { EquipmentStatus } from "../generated/prisma";

const equipmentSchema = z.object({
    id: z.string(),
    type: z.string(),
    brand: z.string(),
    model: z.string(),
    serialNumber: z.string(),
    purchaseDate: z.string(),
    lastService: z.string(),
    nextService: z.string(),
    status: z.enum(["available", "in-use", "maintenance", "rented"]),
    condition: z.enum(["excellent", "good", "fair", "poor"]),
    notes: z.string(),
    rentedTo: z.string().optional(),
    rentedToEmail: z.string().optional(),
    rentedSince: z.string().optional(),
    rentedUntil: z.string().optional(),
    rentalRate: z.string().optional(),
    rentalTimeframe: z.string().optional(),
    center: z.string().optional(),
    trackUsage: z.boolean().optional(),
    usageCount: z.number().optional(),
    usageLimit: z.number().optional(),
});

type EquipmentFormValues = z.infer<typeof equipmentSchema>;

export default function EquipmentPage(
    { equipments }: {
        equipments: Equipment[];
    },
) {
    const [isAddEquipmentOpen, setIsAddEquipmentOpen] = useState(false);
    const [isDeleteEquipmentAlertOpen, setIsDeleteEquipmentAlertOpen] =
        useState(false);
    const [isEditEquipmentOpen, setIsEditEquipmentOpen] = useState(false);
    const [isRentEquipmentOpen, setIsRentEquipmentOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState<
        Equipment | null
    >(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { currentCenter, isAllCenters, getCenterSpecificData } =
        useDiveCenter();
    const { toast } = useToast();
    const router = useRouter();

    // Get equipment data based on the selected center
    const [equipment, setEquipment] = useState<EquipmentItem[]>([]);

    // Update equipment when center changes
    useEffect(() => {
        const centerData = getCenterSpecificData(
            equipmentByCenter,
            allEquipment,
        );
        if (centerData) {
            setEquipment(centerData);
        }
    }, [currentCenter, isAllCenters, getCenterSpecificData]);

    // Filter equipment based on search term with null check
    const filteredEquipment =
        equipment?.filter((item) =>
            item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];

    const handleAddEquipment = (data: EquipmentFormValues) => {
        setIsLoading(true);

        // Simulate API request
        setTimeout(() => {
            // Create a new equipment item with ID and center if needed
            const newEquipment: EquipmentItem = {
                ...data,
                id: `EQ${Math.floor(Math.random() * 1000000)}`,
                notes: data.notes || "", // Ensure notes is always a string, not undefined
                ...(isAllCenters && currentCenter
                    ? { center: currentCenter.name }
                    : {}),
            };

            // Update the equipment state with the new item
            setEquipment([newEquipment, ...equipment]);

            // Close the dialog and show success toast
            setIsAddEquipmentOpen(false);
            setIsLoading(false);

            toast({
                title: "Equipment Added",
                description:
                    `${data.brand} ${data.model} has been added to the inventory.`,
            });
        }, 1000);
    };

    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    const toggleExpanded = (id: string) => {
        setExpandedItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    return (
        <DashboardShell>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Equipment Inventory
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            {isAllCenters
                                ? "Manage equipment inventory across all centers"
                                : `Manage equipment inventory for ${currentCenter?.name}`}
                        </p>
                    </div>
                    <Button
                        className="ml-auto"
                        onClick={() => setIsAddEquipmentOpen(true)}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Equipment
                    </Button>
                </div>

                <EquipmentStats equipment={equipments} />

                <div className="flex items-center max-w-sm">
                    <div className="relative w-full">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search equipment..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Brand/Model</TableHead>
                                    <TableHead>Serial Number</TableHead>
                                    <TableHead>Usage</TableHead>
                                    <TableHead>Next Service</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Condition</TableHead>
                                    {isAllCenters && (
                                        <TableHead>Center</TableHead>
                                    )}
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {equipments.length > 0
                                    ? equipments.map((item) => (
                                        <Fragment key={item.id}>
                                            <TableRow
                                                key={item.id}
                                                className="cursor-pointer hover:bg-muted/50"
                                                onClick={() =>
                                                    toggleExpanded(item.id)}
                                            >
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        {expandedItems.has(
                                                                item.id,
                                                            )
                                                            ? (
                                                                <ChevronUp className="h-4 w-4" />
                                                            )
                                                            : (
                                                                <ChevronDown className="h-4 w-4" />
                                                            )}
                                                        <span className="text-sm overflow-hidden text-ellipsis">
                                                            {item.id}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {item.type}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">
                                                        {item.brand}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {item.model}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-mono text-xs">
                                                    {item.serialNumber}
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        // item.trackUsage
                                                        //     ? (
                                                        //         <div className="flex flex-col gap-1">
                                                        //             <div className="flex items-center justify-between text-xs">
                                                        //                 <span
                                                        //                     className={cn(
                                                        //                         "font-medium",
                                                        //                         item.usageCount &&
                                                        //                             item.usageLimit &&
                                                        //                             item.usageCount >=
                                                        //                                 item.usageLimit *
                                                        //                                     0.8
                                                        //                             ? "text-amber-500"
                                                        //                             : "",
                                                        //                     )}
                                                        //                 >
                                                        //                     {item
                                                        //                         .usageCount}/{item
                                                        //                         .usageLimit}
                                                        //                 </span>
                                                        //                 {item
                                                        //                     .usageCount &&
                                                        //                     item.usageLimit &&
                                                        //                     item.usageCount >=
                                                        //                         item.usageLimit &&
                                                        //                     (
                                                        //                         <span className="text-amber-500">
                                                        //                             Maintenance
                                                        //                             needed
                                                        //                         </span>
                                                        //                     )}
                                                        //             </div>
                                                        //             <Progress
                                                        //                 value={item
                                                        //                         .usageCount &&
                                                        //                         item.usageLimit
                                                        //                     ? (item
                                                        //                         .usageCount /
                                                        //                         item.usageLimit) *
                                                        //                         100
                                                        //                     : 0}
                                                        //                 className={cn(
                                                        //                     "h-2",
                                                        //                     item.usageCount &&
                                                        //                         item.usageLimit &&
                                                        //                         item.usageCount >=
                                                        //                             item.usageLimit
                                                        //                         ? "text-amber-500"
                                                        //                         : item
                                                        //                                 .usageCount &&
                                                        //                                 item.usageLimit &&
                                                        //                                 item.usageCount >=
                                                        //                                     item.usageLimit *
                                                        //                                         0.8
                                                        //                         ? "text-orange-400"
                                                        //                         : "text-blue-500",
                                                        //                 )}
                                                        //             />
                                                        //         </div>
                                                        //     )
                                                        //     :


                                                            <span className="text-xs text-muted-foreground">
                                                                Not tracked
                                                            </span>

                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {item.nextService
                                                        ? item.nextService
                                                            .toDateString()
                                                        : ""}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={item
                                                                .status ===
                                                                "available"
                                                            ? "bg-green-500 text-white"
                                                            : item.status ===
                                                                    "in_use"
                                                            ? "bg-blue-500 text-white"
                                                            : item.status ===
                                                                    "maintenance"
                                                            ? "bg-amber-500 text-white"
                                                            : "bg-red-500 text-white"}
                                                    >
                                                        {item.status}
                                                        {
                                                            /* {item.status ===
                                                                "in_use" &&
                                                            item.rentedTo && (
                                                            <span className="ml-1">
                                                                ({item
                                                                    .rentedTo})
                                                            </span>
                                                        )} */
                                                        }
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={item
                                                                .condition ===
                                                                "excellent"
                                                            ? "border-green-500 text-green-500"
                                                            : item.condition ===
                                                                    "good"
                                                            ? "border-blue-500 text-blue-500"
                                                            : item.condition ===
                                                                    "fair"
                                                            ? "border-amber-500 text-amber-500"
                                                            : "border-red-500 text-red-500"}
                                                    >
                                                        {item.condition}
                                                    </Badge>
                                                </TableCell>
                                                {
                                                    /* {isAllCenters && (
                                                    <TableCell>
                                                        {item.center}
                                                    </TableCell>
                                                )} */
                                                }
                                                {
                                                    /* <TableCell className="max-w-[200px] truncate">
                                                    {item.notes}
                                                </TableCell> */
                                                }
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                className="h-8 w-8 p-0"
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    setSelectedEquipment(
                                                                        item,
                                                                    );
                                                                }}
                                                            >
                                                                <span className="sr-only">
                                                                    Open menu
                                                                </span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>
                                                                Actions
                                                            </DropdownMenuLabel>
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setSelectedEquipment(
                                                                        item,
                                                                    );
                                                                    setIsEditEquipmentOpen(
                                                                        true,
                                                                    );
                                                                }}
                                                            >
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                {" "}
                                                                Edit Equipment
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setSelectedEquipment(
                                                                        item,
                                                                    );

                                                                    setIsRentEquipmentOpen(
                                                                        true,
                                                                    );
                                                                }}
                                                            >
                                                                Rent or Return
                                                                Equipment
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-destructive"
                                                                onClick={() => {
                                                                    setSelectedEquipment(
                                                                        item,
                                                                    );
                                                                    setIsDeleteEquipmentAlertOpen(
                                                                        true,
                                                                    );
                                                                }}
                                                            >
                                                                <Trash className="mr-2 h-4 w-4" />
                                                                {" "}
                                                                Remove
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                            {expandedItems.has(item.id) && (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={isAllCenters
                                                            ? 10
                                                            : 9}
                                                        className="p-0"
                                                    >
                                                        <EquipmentDetails
                                                            equipment={item}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </Fragment>
                                    ))
                                    : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={isAllCenters ? 10 : 9}
                                                className="text-center"
                                            >
                                                No equipment found
                                            </TableCell>
                                        </TableRow>
                                    )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Dialog
                    open={isAddEquipmentOpen}
                    onOpenChange={setIsAddEquipmentOpen}
                >
                    <DialogContent className="sm:max-w-[500px] p-0 gap-0">
                        <DialogHeader className="p-4 pb-0">
                            <DialogTitle className="text-xl">
                                Add New Equipment
                            </DialogTitle>
                        </DialogHeader>
                        <AddEquipmentDialog
                            open={isAddEquipmentOpen}
                            onOpenChange={setIsAddEquipmentOpen}
                            mode={ActionMode.create}
                            equipment={null}
                        />
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={isEditEquipmentOpen}
                    onOpenChange={setIsEditEquipmentOpen}
                >
                    <DialogContent className="sm:max-w-[500px] p-0 gap-0">
                        <DialogHeader className="p-4 pb-0">
                            <DialogTitle className="text-xl">
                                Edit Equipment
                            </DialogTitle>
                        </DialogHeader>
                        <AddEquipmentDialog
                            open={isEditEquipmentOpen}
                            onOpenChange={setIsEditEquipmentOpen}
                            mode={ActionMode.update}
                            equipment={selectedEquipment}
                        />
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={isRentEquipmentOpen}
                    onOpenChange={setIsRentEquipmentOpen}
                >
                    <DialogContent className="sm:max-w-[500px] p-0 gap-0">
                        <DialogHeader className="p-4 pb-0">
                            <DialogTitle className="text-xl">
                                Rent this equipmet or make it available
                            </DialogTitle>
                        </DialogHeader>
                        <RentEquipmentDialog
                            open={isRentEquipmentOpen}
                            onOpenChange={setIsRentEquipmentOpen}
                            equipment={selectedEquipment}
                            diveCenterId={currentCenter?.id || ''}
                        />
                    </DialogContent>
                </Dialog>

                <AlertDialog
                    open={isDeleteEquipmentAlertOpen}
                    onOpenChange={setIsDeleteEquipmentAlertOpen}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will remove this equipment related data from our
                                servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={async () => {
                                    if (selectedEquipment) {
                                        await deleteEquipment(selectedEquipment.id);
                                        toast({
                                            title: "Equipment deleted successfully.",
                                            description: `Id: ${
                                                selectedEquipment.id ?? "N/A"
                                            }`,
                                        });
                                        router.refresh();
                                    }
                                }}
                            >
                                Yes, delete this equipment
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </DashboardShell>
    );
}
