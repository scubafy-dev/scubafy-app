"use client";

import { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  Edit,
  Mail,
  MoreHorizontal,
  Phone,
  Trash,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Staff } from "@/app/generated/prisma";
import { StaffWithPermissions } from "@/lib/staffs";
import { AddStaffDialog } from "./add-staff-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Define the permissions available in the system
const accessOptions = [
  { id: "dive-trips", label: "Dive Trips" },
  { id: "customers", label: "Customers" },
  { id: "equipment", label: "Equipment" },
  { id: "staff", label: "Staff" },
  { id: "tasks", label: "Tasks" },
  { id: "reports", label: "Reports" },
  { id: "course-tracker", label: "Course Tracker" },
  { id: "calendar", label: "Calendar" },
  { id: "finances", label: "Finances" },
];

// Define staff member type
export type StaffMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  age?: string;
  gender?: string;
  address?: string;
  emergencyContact?: string;
  bio?: string;
  certification?: string; // Keep for backward compatibility
  specialties: string[]; // Used for access permissions
  status: "active" | "on-leave";
  avatar: string;
};

// Initial staff data
const initialStaff: StaffMember[] = [
  {
    id: "S-1001",
    name: "Michael Rodriguez",
    email: "michael@scubafy.com",
    phone: "+1 (555) 123-4567",
    role: "Dive Instructor",
    age: "32",
    gender: "male",
    specialties: ["dive-trips", "customers", "calendar"],
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

// Helper function to get access label from ID
function getAccessLabel(accessId: string): string {
  const option = accessOptions.find((opt) => opt.id === accessId);
  return option ? option.label : accessId;
}

// Main component
export function StaffDirectory(
  { staffs, updateStaff, deleteStaff, isLoading, onEdit, onSuccess }: {
    staffs: StaffWithPermissions[];
    updateStaff: (id: string, formData: FormData) => Promise<void>;
    deleteStaff: (id: string) => Promise<void>;
    isLoading?: boolean;
    onEdit?: (staff: StaffWithPermissions) => void;
    onSuccess?: () => void;
  },
) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<
    StaffWithPermissions | null
  >(null);
  const [showAddStaffDialog, setShowAddStaffDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<StaffWithPermissions | null>(null);

  console.log('selectedStaff', selectedStaff)
  // const filteredStaff = staff.filter((member) => {
  //   const matchesSearch =
  //     member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     member.role.toLowerCase().includes(searchTerm.toLowerCase());
  //   return matchesSearch;
  // });
  const filteredStaff = staffs;

  return (
    <Card>
      <CardContent>
        {/* <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search staff by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-[300px]"
            />
          </div>
        </div> */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Age/Gender</TableHead>
                <TableHead>Access Permissions</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">Loading staff...</TableCell>
                </TableRow>
              ) : (
                staffs.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="max-w-[200px]">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={"/placeholder.svg?height=40&width=40"}
                            alt={member.fullName}
                          />
                          <AvatarFallback>
                            {member.fullName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{member.fullName}</span>
                          <span className="text-xs text-muted-foreground">
                            {member.id}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-sm">
                          <Mail className="mr-1 h-3 w-3" />
                          <span>{member.email}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="mr-1 h-3 w-3" />
                          <span>{member.phoneNumber}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.roleTitle}</TableCell>
                    <TableCell>
                      {member.age && member.gender
                        ? (
                          <span>
                            {member.age} /{" "}
                            {member.gender.charAt(0).toUpperCase() +
                              member.gender.slice(1)}
                          </span>
                        )
                        : (
                          <span className="text-muted-foreground">
                            Not specified
                          </span>
                        )}
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <div className="flex flex-wrap gap-1">
                        {member.permissions.map((accessId, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {getAccessLabel(accessId)}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{member.salary}</TableCell>
                    <TableCell>
                      <Badge
                        variant={member.status === "active"
                          ? "default"
                          : "outline"}
                        className={member.status === "inactive"
                          ? "border-amber-500 text-amber-500"
                          : ""}
                      >
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
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
                              if (onEdit) onEdit(member);
                              setSelectedStaff(member);
                              setShowAddStaffDialog(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit Profile
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" /> View Schedule
                          </DropdownMenuItem> */}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setStaffToDelete(member);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash className="mr-2 h-4 w-4" /> Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <AddStaffDialog
          key={selectedStaff?.id || "new"}
          open={showAddStaffDialog}
          staff={selectedStaff}
          onOpenChange={setShowAddStaffDialog}
          updateStaff={updateStaff}
          onSuccess={onSuccess}
        />
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove this staff member from your dive center.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  if (staffToDelete) {
                    await deleteStaff(staffToDelete.id);
                    setDeleteDialogOpen(false);
                    setStaffToDelete(null);
                    if (onSuccess) onSuccess();
                  }
                }}
              >
                Yes, remove staff
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
