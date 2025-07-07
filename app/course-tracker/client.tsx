"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ChevronDown,
    ChevronUp,
    Edit,
    FileText,
    Filter,
    Plus,
    Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import { addCourse, getAllCourses, deleteCourse } from "@/lib/course"; // import server action
import { getAllEquipments } from "@/lib/equipment";
import { getAllCustomers } from "@/lib/customers";
import {
    CertificationLevel,
    Course,
    CourseStatus,
} from "@app/generated/prisma";

import { useRouter } from "next/navigation";

import { EditCourseDialog } from "./EditCourseDialog";
import { se } from "date-fns/locale";
import { useDiveCenter } from "@/lib/dive-center-context";
import { useToast } from "@/hooks/use-toast";

// Types for the course tracker
interface Student {
    id: string;
    name: string;
    email: string;
    phone: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    medicalInfo: string;
}

interface Dive {
    id: string;
    date: string;
    time: string;
    site: string;
    maxDepth: string;
    timeAtDepth: string;
    conditions: string;
}

// Add types for students and customers
interface StudentEntry { customerId?: string; name: string; email: string; }
interface CustomerEntry { id: string; fullName: string; email: string; }

// Patch Course type to allow students
// eslint-disable-next-line
type PatchedCourse = Course & { students?: StudentEntry[] };

export type CourseWithRelations = PatchedCourse & {
    diveCenter?: any;
};

export default function CourseTrackerClient() {
    const { toast } = useToast()
    const { currentCenter } =
        useDiveCenter();
    const [activeTab, setActiveTab] = useState("all");
    const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
    const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<CourseWithRelations | null>(null);
    const [courseDetailsOpen, setCourseDetailsOpen] = useState(false);
    const [expandedCourseId, setExpandedCourseId] = useState<string | null>(
        null,
    );
    const [level, setLevel] = useState<CertificationLevel>("openWater");
    const [status, setStatus] = useState<CourseStatus>("upcoming");

    const router = useRouter();

    const [isCourseListLoading, setIsCourseListLoading] = useState(false)
    const [courseList, setCourseList] = useState<CourseWithRelations[]>([])

    // Add state for delete dialog and loading
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Add state for materials and equipment
    const [materials, setMaterials] = useState<string[]>([""]);
    const [equipmentOptions, setEquipmentOptions] = useState<any[]>([]);
    const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);

    // Add state for equipment details in course details dialog
    const [courseEquipmentDetails, setCourseEquipmentDetails] = useState<any[]>([]);

    // Add state for students
    const [customerOptions, setCustomerOptions] = useState<CustomerEntry[]>([]);
    const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
    const [manualStudents, setManualStudents] = useState<StudentEntry[]>([{ name: "", email: "" }]);

    const fetchCourses = useCallback(async () => {
        try {
            setIsCourseListLoading(true);
            const coursesData = await getAllCourses(currentCenter?.id);
            console.log("Fetched coursesData:", coursesData);
            setCourseList(coursesData as any);
        } catch (error) {
            console.error("Failed to load customersData:", error);
            setCourseList([]);
        } finally {
            setIsCourseListLoading(false);
        }
    }, [currentCenter?.id]);

    useEffect(() => {
        // Always set loading to true when currentCenter changes
        setIsCourseListLoading(true);

        if (currentCenter?.id) {
            fetchCourses();
        } else {
            // If no center, just set empty state and stop loading
            setCourseList([]);
            setIsCourseListLoading(false);
        }
    }, [currentCenter]);

    // onSuccess a call
    const handleCourseCreated = useCallback(async () => {
        // Refresh the customer list after successful creation
        await fetchCourses();
        setIsCourseListLoading(false);
    }, [fetchCourses]);

    // Delete handler
    const handleDeleteCourse = useCallback(async () => {
        if (!courseToDelete) return;
        setIsDeleting(true);
        try {
            await deleteCourse(courseToDelete.id);
            toast({ title: "Course deleted successfully" });
            setIsDeleteDialogOpen(false);
            setCourseToDelete(null);
            await fetchCourses();
        } catch (error) {
            toast({ title: "Failed to delete course", description: String(error), variant: "destructive" });
        } finally {
            setIsDeleting(false);
        }
    }, [courseToDelete, fetchCourses, toast]);

    // Fetch equipment list on mount
    useEffect(() => {
        async function fetchEquipment() {
            if (currentCenter?.id) {
                const eq = await getAllEquipments(currentCenter.id);
                setEquipmentOptions(eq);
            }
        }
        fetchEquipment();
    }, [currentCenter]);

    // Fetch equipment details when selectedCourse or dialog open changes
    useEffect(() => {
        async function fetchEquipmentDetails() {
            if (selectedCourse?.equipmentIds?.length) {
                const allEquipment = await getAllEquipments(currentCenter?.id);
                const filtered = allEquipment.filter((eq: any) => selectedCourse.equipmentIds.includes(eq.id));
                setCourseEquipmentDetails(filtered);
            } else {
                setCourseEquipmentDetails([]);
            }
        }
        if (selectedCourse && courseDetailsOpen) {
            fetchEquipmentDetails();
        }
    }, [selectedCourse, courseDetailsOpen, currentCenter]);

    // Fetch customers on mount
    useEffect(() => {
        async function fetchCustomers() {
            if (currentCenter?.id) {
                const customers = await getAllCustomers(currentCenter.id);
                setCustomerOptions(customers);
            }
        }
        fetchCustomers();
    }, [currentCenter]);

    // Handlers for manual students
    const handleManualStudentChange = (idx: number, field: "name" | "email", value: string) => {
        setManualStudents((prev) => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
    };
    const addManualStudent = () => setManualStudents((prev) => [...prev, { name: "", email: "" }]);
    const removeManualStudent = (idx: number) => setManualStudents((prev) => prev.filter((_, i) => i !== idx));

    // Handler for customer selection
    const handleCustomerSelect = (id: string, checked: boolean) => {
        setSelectedCustomerIds((prev) =>
            checked ? [...prev, id] : prev.filter((cid) => cid !== id)
        );
    };

    // On Add/Edit submit, build students array
    function buildStudentsArray() {
        const selectedCustomers = customerOptions.filter((c) => selectedCustomerIds.includes(c.id));
        const customerStudents = selectedCustomers.map((c) => ({ customerId: c.id, name: c.fullName, email: c.email }));
        const manual = manualStudents.filter((s) => s.name.trim() && s.email.trim());
        return [...customerStudents, ...manual];
    }

    console.log('equipments',courseList)

    // Add/remove material fields
    const handleMaterialChange = (idx: number, value: string) => {
        setMaterials((prev) => prev.map((m, i) => (i === idx ? value : m)));
    };
    const addMaterialField = () => setMaterials((prev) => [...prev, ""]);
    const removeMaterialField = (idx: number) => setMaterials((prev) => prev.filter((_, i) => i !== idx));

    // Equipment select handler
    const handleEquipmentSelect = (id: string) => {
        setSelectedEquipment((prev) =>
            prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
        );
    };

    const toggleCourseExpansion = (courseId: string) => {
        setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
    };

    const viewCourseDetails = (course: Course) => {
        setSelectedCourse(course);
        setCourseDetailsOpen(true);
    };

    const filteredCourses: CourseWithRelations[] = activeTab === "all"
        ? courseList
        : courseList.filter((course) => course.status === activeTab);

    const getLevelBadgeColor = (level: string) => {
        switch (level) {
            case "Open Water":
                return "bg-blue-500";
            case "Advanced Open Water":
                return "bg-indigo-500";
            case "Rescue Diver":
                return "bg-amber-500";
            case "Dive Master":
                return "bg-emerald-500";
            case "Instructor":
                return "bg-rose-500";
            default:
                return "bg-slate-500";
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-500";
            case "completed":
                return "bg-blue-500";
            case "upcoming":
                return "bg-amber-500";
            default:
                return "bg-slate-500";
        }
    };

    async function handleAddCourse(formData: FormData) {
        if (!currentCenter?.id) {
            throw new Error("No center selected");
        }
        formData.append("materials", JSON.stringify(materials.filter((m) => m.trim() !== "")));
        formData.append("equipmentIds", JSON.stringify(selectedEquipment));
        formData.append("students", JSON.stringify(buildStudentsArray()));
        const res = await addCourse(formData, currentCenter.id);
        if (res?.success) {
            toast({
                title: "Course added successfully",
            });
            handleCourseCreated();
            router.refresh();
            setIsAddCourseOpen(false);
        } else {
            router.refresh();
            setIsAddCourseOpen(false);
        }
    }

    return (
        <DashboardShell>
            <DashboardHeader
                heading="Course Tracker"
                text="Track and manage all scuba diving courses and student progress."
            >
                <Button onClick={() => {
                    setIsAddCourseOpen(true);
                    // Reset all Add Course form fields and selections
                    setLevel("openWater");
                    setStatus("upcoming");
                    setMaterials([""]);
                    setSelectedEquipment([]);
                    setSelectedCustomerIds([]);
                    setManualStudents([{ name: "", email: "" }]);
                    // Optionally reset other fields if you add state for them
                    setTimeout(() => {
                        const ids = [
                            "title", "startDate", "endDate", "instructor", "instructorContact", "location", "cost", "specialNeeds"
                        ];
                        ids.forEach(id => {
                            const el = document.getElementById(id);
                            if (el) {
                                if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
                                    el.value = "";
                                }
                            }
                        });
                    }, 0);
                }}>
                    <Plus className="mr-2 h-4 w-4" /> Add Course
                </Button>
            </DashboardHeader>

            <Tabs
                defaultValue="all"
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-4"
            >
                <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="all">All Courses</TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>
                    {/* Future feature */}
                    {/* <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search courses..."
                                className="pl-8 w-[200px] md:w-[260px]"
                            />
                        </div>
                        <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div> */}
                </div>

                <TabsContent value="all" className="space-y-4">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Course Title</TableHead>
                                    <TableHead>Level</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Dates
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Instructor
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Students
                                    </TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    isCourseListLoading ?
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center">
                                                Loading courses...
                                            </TableCell>
                                        </TableRow>
                                        :
                                        <>
                                            {filteredCourses.map((course: any) => (
                                                <React.Fragment key={course.id}>
                                                    <TableRow
                                                        className="cursor-pointer hover:bg-muted/50"
                                                        onClick={() =>
                                                            toggleCourseExpansion(
                                                                course.id,
                                                            )}
                                                    >
                                                        <TableCell
                                                            className="font-medium"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                viewCourseDetails(course);
                                                            }}
                                                        >
                                                            {course.title}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                className={getLevelBadgeColor(
                                                                    course
                                                                        .certificationLevel ||
                                                                    "",
                                                                )}
                                                            >
                                                                {course
                                                                    .certificationLevel ||
                                                                    "N/A"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell">
                                                            {course.startDate
                                                                ?.toDateString()} -{" "}
                                                            {course.endDate
                                                                ?.toDateString() || ""}
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell">
                                                            {course.instructorName}
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell">
                                                            {course.studentsCount}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                className={getStatusBadgeColor(
                                                                    course.status || "",
                                                                )}
                                                            >
                                                                {course.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {expandedCourseId === course.id
                                                                ? (
                                                                    <ChevronUp className="h-4 w-4 mx-auto" />
                                                                )
                                                                : (
                                                                    <ChevronDown className="h-4 w-4 mx-auto" />
                                                                )}
                                                        </TableCell>
                                                    </TableRow>
                                                    {expandedCourseId === course.id && (
                                                        <TableRow className="bg-muted/30">
                                                            <TableCell
                                                                colSpan={7}
                                                                className="p-4"
                                                            >
                                                                <div className="space-y-4">
                                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                        <div>
                                                                            <h4 className="text-sm font-semibold mb-1">
                                                                                Location
                                                                            </h4>
                                                                            <p className="text-sm">
                                                                                {course
                                                                                    .location}
                                                                            </p>
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="text-sm font-semibold mb-1">
                                                                                Cost
                                                                            </h4>
                                                                            <p className="text-sm">
                                                                                ${course
                                                                                    .cost}
                                                                            </p>
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="text-sm font-semibold mb-1">
                                                                                Instructor
                                                                                Contact
                                                                            </h4>
                                                                            <p className="text-sm">
                                                                                {course
                                                                                    .instructorContact}
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    {/* In the expanded row, show students details */}
                                                                    <div>
                                                                        <h4 className="text-sm font-semibold mb-1">Students</h4>
                                                                        <ul className="text-sm space-y-1">
                                                                            {course.students && course.students.length > 0 ? (
                                                                                course.students.map((student: StudentEntry, idx: number) => (
                                                                                    <li key={idx}>
                                                                                        {student.name} ({student.email})
                                                                                    </li>
                                                                                ))
                                                                            ) : (
                                                                                <li>No students</li>
                                                                            )}
                                                                        </ul>
                                                                    </div>

                                                                    {
                                                                        /* {course.dives.length >
                                                                            0 && (
                                                                        <div>
                                                                            <h4 className="text-sm font-semibold mb-1">
                                                                                Dives
                                                                            </h4>
                                                                            <ul className="text-sm space-y-1">
                                                                                {course
                                                                                    .dives
                                                                                    .map(
                                                                                        (
                                                                                            dive,
                                                                                        ) => (
                                                                                            <li
                                                                                                key={dive
                                                                                                    .id}
                                                                                            >
                                                                                                {dive
                                                                                                    .date}
                                                                                                {" "}
                                                                                                -
                                                                                                {" "}
                                                                                                {dive
                                                                                                    .site}
                                                                                                {" "}
                                                                                                ({dive
                                                                                                    .maxDepth}m)
                                                                                            </li>
                                                                                        ),
                                                                                    )}
                                                                            </ul>
                                                                        </div>
                                                                    )} */
                                                                    }

                                                                    <div className="flex justify-end">
                                                                        <div className="flex-1">
                                                                            <h4 className="text-sm font-semibold mb-1">
                                                                                Update
                                                                                Status
                                                                            </h4>
                                                                            <Select
                                                                                defaultValue={course
                                                                                    .status ??
                                                                                    "upcoming"}
                                                                                onValueChange={(
                                                                                    value,
                                                                                ) => {
                                                                                }}
                                                                            >
                                                                                <SelectTrigger className="w-[180px]">
                                                                                    <SelectValue placeholder="Select status" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectItem value="upcoming">
                                                                                        Upcoming
                                                                                    </SelectItem>
                                                                                    <SelectItem value="active">
                                                                                        Active
                                                                                    </SelectItem>
                                                                                    <SelectItem value="completed">
                                                                                        Completed
                                                                                    </SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </div>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="mr-2"
                                                                            onClick={(
                                                                                e,
                                                                            ) => {
                                                                                e.stopPropagation();
                                                                                viewCourseDetails(
                                                                                    course,
                                                                                );
                                                                            }}
                                                                        >
                                                                            <FileText className="mr-2 h-4 w-4" />
                                                                            View Full
                                                                            Details
                                                                        </Button>
                                                                        <Button
                                                                            size="sm"
                                                                            onClick={(
                                                                                e,
                                                                            ) => {
                                                                                e.stopPropagation();
                                                                                setIsEditCourseOpen(
                                                                                    true,
                                                                                );
                                                                                setSelectedCourse(
                                                                                    course,
                                                                                );
                                                                                setMaterials(course.materials && course.materials.length > 0 ? course.materials : [""]);
                                                                                setSelectedEquipment(course.equipmentIds || []);
                                                                                setSelectedCustomerIds(course.students?.map((s: any) => s.customerId).filter(Boolean) || []);
                                                                                setManualStudents(course.students?.filter((s: any) => !s.customerId).map((s: any) => ({ name: s.name, email: s.email })) || [{ name: "", email: "" }]);
                                                                            }}
                                                                        >
                                                                            <Edit className="mr-2 h-4 w-4" />
                                                                            Edit Course
                                                                        </Button>
                                                                        <Button
                                                                            variant="destructive"
                                                                            size="sm"
                                                                            onClick={(
                                                                                e,
                                                                            ) => {
                                                                                e.stopPropagation();
                                                                                setCourseToDelete(
                                                                                    course,
                                                                                );
                                                                                setIsDeleteDialogOpen(
                                                                                    true,
                                                                                );
                                                                            }}
                                                                            className="ml-2"
                                                                        >
                                                                            Remove
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </>
                                }
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="active" className="space-y-4">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Course Title</TableHead>
                                    <TableHead>Level</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Dates
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Instructor
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Students
                                    </TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCourses.map((course) => (
                                    <React.Fragment key={course.id}>
                                        <TableRow
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() =>
                                                toggleCourseExpansion(
                                                    course.id,
                                                )}
                                        >
                                            <TableCell
                                                className="font-medium"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    viewCourseDetails(course);
                                                }}
                                            >
                                                {course.title}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={getLevelBadgeColor(
                                                        course
                                                            .certificationLevel ||
                                                        "",
                                                    )}
                                                >
                                                    {course
                                                        .certificationLevel ||
                                                        "N/A"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {course.startDate
                                                    ?.toDateString()}{"  "}-
                                                {" "}
                                                {course.endDate?.toDateString()}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {course.instructorName}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {course.studentsCount}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={getStatusBadgeColor(
                                                        course.status || "",
                                                    )}
                                                >
                                                    {course.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {expandedCourseId === course.id
                                                    ? (
                                                        <ChevronUp className="h-4 w-4 mx-auto" />
                                                    )
                                                    : (
                                                        <ChevronDown className="h-4 w-4 mx-auto" />
                                                    )}
                                            </TableCell>
                                        </TableRow>
                                        {expandedCourseId === course.id && (
                                            <TableRow className="bg-muted/30">
                                                <TableCell
                                                    colSpan={7}
                                                    className="p-4"
                                                >
                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div>
                                                                <h4 className="text-sm font-semibold mb-1">
                                                                    Location
                                                                </h4>
                                                                <p className="text-sm">
                                                                    {course
                                                                        .location}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-semibold mb-1">
                                                                    Cost
                                                                </h4>
                                                                <p className="text-sm">
                                                                    ${course
                                                                        .cost}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-semibold mb-1">
                                                                    Instructor
                                                                    Contact
                                                                </h4>
                                                                <p className="text-sm">
                                                                    {course
                                                                        .instructorContact}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h4 className="text-sm font-semibold mb-1">
                                                                Students
                                                            </h4>
                                                            <ul className="text-sm space-y-1">
                                                                {
                                                                    /* {course.students
                                                                    .map(
                                                                        (
                                                                            student,
                                                                        ) => (
                                                                            <li
                                                                                key={student
                                                                                    .id}
                                                                            >
                                                                                {student
                                                                                    .name}
                                                                                {" "}
                                                                                ({student
                                                                                    .email})
                                                                            </li>
                                                                        ),
                                                                    )} */
                                                                }
                                                            </ul>
                                                        </div>

                                                        {
                                                            /* {course.dives.length >
                                                                0 && (
                                                            <div>
                                                                <h4 className="text-sm font-semibold mb-1">
                                                                    Dives
                                                                </h4>
                                                                <ul className="text-sm space-y-1">
                                                                    {course
                                                                        .dives
                                                                        .map(
                                                                            (
                                                                                dive,
                                                                            ) => (
                                                                                <li
                                                                                    key={dive
                                                                                        .id}
                                                                                >
                                                                                    {dive
                                                                                        .date}
                                                                                    {" "}
                                                                                    -
                                                                                    {" "}
                                                                                    {dive
                                                                                        .site}
                                                                                    {" "}
                                                                                    ({dive
                                                                                        .maxDepth}m)
                                                                                </li>
                                                                            ),
                                                                        )}
                                                                </ul>
                                                            </div>
                                                        )} */
                                                        }

                                                        <div className="flex justify-end">
                                                            <div className="flex-1">
                                                                <h4 className="text-sm font-semibold mb-1">
                                                                    Update
                                                                    Status
                                                                </h4>
                                                                <Select
                                                                    defaultValue={course
                                                                        .status ||
                                                                        ""}
                                                                    onValueChange={(
                                                                        value,
                                                                    ) => {
                                                                    }}
                                                                >
                                                                    <SelectTrigger className="w-[180px]">
                                                                        <SelectValue placeholder="Select status" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="upcoming">
                                                                            Upcoming
                                                                        </SelectItem>
                                                                        <SelectItem value="active">
                                                                            Active
                                                                        </SelectItem>
                                                                        <SelectItem value="completed">
                                                                            Completed
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="mr-2"
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    viewCourseDetails(
                                                                        course,
                                                                    );
                                                                }}
                                                            >
                                                                <FileText className="mr-2 h-4 w-4" />
                                                                View Full Details
                                                            </Button>
                                                            {/* <Button
                                                                size="sm"
                                                                onClick={(e) =>
                                                                    e.stopPropagation()}
                                                            >
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit Course
                                                            </Button> */}
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    setCourseToDelete(
                                                                        course,
                                                                    );
                                                                    setIsDeleteDialogOpen(
                                                                        true,
                                                                    );
                                                                }}
                                                                className="ml-2"
                                                            >
                                                                Remove
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="upcoming" className="space-y-4">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Course Title</TableHead>
                                    <TableHead>Level</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Dates
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Instructor
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Students
                                    </TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCourses.map((course) => (
                                    <React.Fragment key={course.id}>
                                        <TableRow
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() =>
                                                toggleCourseExpansion(
                                                    course.id,
                                                )}
                                        >
                                            <TableCell
                                                className="font-medium"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    viewCourseDetails(course);
                                                }}
                                            >
                                                {course.title}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={getLevelBadgeColor(
                                                        course
                                                            .certificationLevel ||
                                                        "",
                                                    )}
                                                >
                                                    {course.certificationLevel}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {course.startDate
                                                    ?.toDateString()} -{" "}
                                                {course.endDate?.toDateString()}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {course.instructorName}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {course.studentsCount}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={getStatusBadgeColor(
                                                        course.status || "",
                                                    )}
                                                >
                                                    {course.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {expandedCourseId === course.id
                                                    ? (
                                                        <ChevronUp className="h-4 w-4 mx-auto" />
                                                    )
                                                    : (
                                                        <ChevronDown className="h-4 w-4 mx-auto" />
                                                    )}
                                            </TableCell>
                                        </TableRow>
                                        {expandedCourseId === course.id && (
                                            <TableRow className="bg-muted/30">
                                                <TableCell
                                                    colSpan={7}
                                                    className="p-4"
                                                >
                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div>
                                                                <h4 className="text-sm font-semibold mb-1">
                                                                    Location
                                                                </h4>
                                                                <p className="text-sm">
                                                                    {course
                                                                        .location}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-semibold mb-1">
                                                                    Cost
                                                                </h4>
                                                                <p className="text-sm">
                                                                    ${course
                                                                        .cost}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-semibold mb-1">
                                                                    Instructor
                                                                    Contact
                                                                </h4>
                                                                <p className="text-sm">
                                                                    {course
                                                                        .instructorContact}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h4 className="text-sm font-semibold mb-1">
                                                                Students
                                                            </h4>
                                                            <ul className="text-sm space-y-1">
                                                                {
                                                                    /* {course.students
                                                                    .map(
                                                                        (
                                                                            student,
                                                                        ) => (
                                                                            <li
                                                                                key={student
                                                                                    .id}
                                                                            >
                                                                                {student
                                                                                    .name}
                                                                                {" "}
                                                                                ({student
                                                                                    .email})
                                                                            </li>
                                                                        ),
                                                                    )} */
                                                                }
                                                            </ul>
                                                        </div>
                                                        {
                                                            /*
                                                        {course.dives.length >
                                                                0 && (
                                                            <div>
                                                                <h4 className="text-sm font-semibold mb-1">
                                                                    Dives
                                                                </h4>
                                                                <ul className="text-sm space-y-1">
                                                                    {course
                                                                        .dives
                                                                        .map(
                                                                            (
                                                                                dive,
                                                                            ) => (
                                                                                <li
                                                                                    key={dive
                                                                                        .id}
                                                                                >
                                                                                    {dive
                                                                                        .date}
                                                                                    {" "}
                                                                                    -
                                                                                    {" "}
                                                                                    {dive
                                                                                        .site}
                                                                                    {" "}
                                                                                    ({dive
                                                                                        .maxDepth}m)
                                                                                </li>
                                                                            ),
                                                                        )}
                                                                </ul>
                                                            </div>
                                                        )} */
                                                        }

                                                        <div className="flex justify-end">
                                                            <div className="flex-1">
                                                                <h4 className="text-sm font-semibold mb-1">
                                                                    Update
                                                                    Status
                                                                </h4>
                                                                <Select
                                                                    defaultValue={course
                                                                        .status ||
                                                                        ""}
                                                                    onValueChange={(
                                                                        value,
                                                                    ) => {
                                                                    }}
                                                                >
                                                                    <SelectTrigger className="w-[180px]">
                                                                        <SelectValue placeholder="Select status" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="upcoming">
                                                                            Upcoming
                                                                        </SelectItem>
                                                                        <SelectItem value="active">
                                                                            Active
                                                                        </SelectItem>
                                                                        <SelectItem value="completed">
                                                                            Completed
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="mr-2"
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    viewCourseDetails(
                                                                        course,
                                                                    );
                                                                }}
                                                            >
                                                                <FileText className="mr-2 h-4 w-4" />
                                                                View Full
                                                                Details
                                                            </Button>
                                                            {/* <Button
                                                                size="sm"
                                                                onClick={(e) =>
                                                                    e.stopPropagation()}
                                                            >
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit Course
                                                            </Button> */}
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    setCourseToDelete(
                                                                        course,
                                                                    );
                                                                    setIsDeleteDialogOpen(
                                                                        true,
                                                                    );
                                                                }}
                                                                className="ml-2"
                                                            >
                                                                Remove
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="completed" className="space-y-4">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Course Title</TableHead>
                                    <TableHead>Level</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Dates
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Instructor
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Students
                                    </TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCourses.map((course) => (
                                    <React.Fragment key={course.id}>
                                        <TableRow
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() =>
                                                toggleCourseExpansion(
                                                    course.id,
                                                )}
                                        >
                                            <TableCell
                                                className="font-medium"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    viewCourseDetails(course);
                                                }}
                                            >
                                                {course.title}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={getLevelBadgeColor(
                                                        course
                                                            .certificationLevel ||
                                                        "",
                                                    )}
                                                >
                                                    {course.certificationLevel}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {course.startDate
                                                    ?.toDateString()} -{" "}
                                                {course.endDate?.toDateString()}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {course.instructorName}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {course.studentsCount}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={getStatusBadgeColor(
                                                        course.status || "",
                                                    )}
                                                >
                                                    {course.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {expandedCourseId === course.id
                                                    ? (
                                                        <ChevronUp className="h-4 w-4 mx-auto" />
                                                    )
                                                    : (
                                                        <ChevronDown className="h-4 w-4 mx-auto" />
                                                    )}
                                            </TableCell>
                                        </TableRow>
                                        {expandedCourseId === course.id && (
                                            <TableRow className="bg-muted/30">
                                                <TableCell
                                                    colSpan={7}
                                                    className="p-4"
                                                >
                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div>
                                                                <h4 className="text-sm font-semibold mb-1">
                                                                    Location
                                                                </h4>
                                                                <p className="text-sm">
                                                                    {course
                                                                        .location}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-semibold mb-1">
                                                                    Cost
                                                                </h4>
                                                                <p className="text-sm">
                                                                    ${course
                                                                        .cost}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-semibold mb-1">
                                                                    Instructor
                                                                    Contact
                                                                </h4>
                                                                <p className="text-sm">
                                                                    {course
                                                                        .instructorContact}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h4 className="text-sm font-semibold mb-1">
                                                                Students
                                                            </h4>
                                                            <ul className="text-sm space-y-1">
                                                                {
                                                                    /* {course.students
                                                                    .map(
                                                                        (
                                                                            student,
                                                                        ) => (
                                                                            <li
                                                                                key={student
                                                                                    .id}
                                                                            >
                                                                                {student
                                                                                    .name}
                                                                                {" "}
                                                                                ({student
                                                                                    .email})
                                                                            </li>
                                                                        ),
                                                                    )} */
                                                                }
                                                            </ul>
                                                        </div>

                                    

                                                        <div className="flex justify-end">
                                                            <div className="flex-1">
                                                                <h4 className="text-sm font-semibold mb-1">
                                                                    Update
                                                                    Status
                                                                </h4>
                                                                <Select
                                                                    defaultValue={course
                                                                        .status ||
                                                                        ""}
                                                                    onValueChange={(
                                                                        value,
                                                                    ) => {
                                                                    }}
                                                                >
                                                                    <SelectTrigger className="w-[180px]">
                                                                        <SelectValue placeholder="Select status" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="upcoming">
                                                                            Upcoming
                                                                        </SelectItem>
                                                                        <SelectItem value="active">
                                                                            Active
                                                                        </SelectItem>
                                                                        <SelectItem value="completed">
                                                                            Completed
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="mr-2"
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    viewCourseDetails(
                                                                        course,
                                                                    );
                                                                }}
                                                            >
                                                                <FileText className="mr-2 h-4 w-4" />
                                                                View Full
                                                                Details
                                                            </Button>
                                                            {/* <Button
                                                                size="sm"
                                                                onClick={(e) =>
                                                                    e.stopPropagation()}
                                                            >
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit Course
                                                            </Button> */}
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    setCourseToDelete(
                                                                        course,
                                                                    );
                                                                    setIsDeleteDialogOpen(
                                                                        true,
                                                                    );
                                                                }}
                                                                className="ml-2"
                                                            >
                                                                Remove
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Course Details Dialog */}
            <Dialog
                open={courseDetailsOpen}
                onOpenChange={setCourseDetailsOpen}
            >
                <DialogContent className="sm:max-w-[900px]">
                    {selectedCourse && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <DialogTitle className="text-xl">
                                            {selectedCourse?.title}
                                        </DialogTitle>
                                        <DialogDescription>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge
                                                    className={getLevelBadgeColor(
                                                        selectedCourse
                                                            ?.certificationLevel ||
                                                        "",
                                                    )}
                                                >
                                                    {selectedCourse
                                                        ?.certificationLevel}
                                                </Badge>
                                                <Badge
                                                    className={getStatusBadgeColor(
                                                        selectedCourse
                                                            ?.status ||
                                                        "active",
                                                    )}
                                                >
                                                    {selectedCourse?.status}
                                                </Badge>
                                                <span className="text-sm">
                                                    {selectedCourse?.startDate
                                                        ?.toDateString()} -{" "}
                                                    {selectedCourse?.endDate
                                                        ?.toDateString()}
                                                </span>
                                            </div>
                                        </DialogDescription>
                                    </div>
                                    <Button size="sm" onClick={() => {
                                        setIsEditCourseOpen(true);
                                        setSelectedCourse(selectedCourse);
                                        setMaterials(selectedCourse?.materials && selectedCourse.materials.length > 0 ? selectedCourse.materials : [""]);
                                        setSelectedEquipment(selectedCourse?.equipmentIds || []);
                                        setSelectedCustomerIds(selectedCourse.students?.map((s: any) => s.customerId).filter(Boolean) || []);
                                        setManualStudents(selectedCourse.students?.filter((s: any) => !s.customerId).map((s: any) => ({ name: s.name, email: s.email })) || [{ name: "", email: "" }]);
                                    }}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Button>
                                </div>
                            </DialogHeader>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium mb-2">
                                            Course Details
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    Instructor:
                                                </span>
                                                <span>
                                                    {selectedCourse
                                                        ?.instructorName}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    Contact:
                                                </span>
                                                <span>
                                                    {selectedCourse
                                                        ?.instructorContact}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    Location:
                                                </span>
                                                <span>
                                                    {selectedCourse?.location}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    Cost:
                                                </span>
                                                <span>
                                                    ${selectedCourse?.cost}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Temporarily invisible course materials */}
                                    <div className="md:col-span-2">
                                        <h3 className="text-sm font-medium mb-2">Materials & Equipment</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="text-xs font-medium text-muted-foreground mb-1">Course Materials</h4>
                                                <ul className="text-sm space-y-1">
                                                    {selectedCourse?.materials?.map((mat: string, idx: number) => (
                                                        <li key={idx}>{mat}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-medium text-muted-foreground mb-1">Required Equipment</h4>
                                                <ul className="text-sm space-y-1">
                                                    {courseEquipmentDetails.map((eq) => (
                                                        <li key={eq.id}>{eq.type} {eq.model}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium">
                                        Students
                                    </h3>
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>
                                                        Contact
                                                    </TableHead>
                                                    <TableHead className="hidden md:table-cell">
                                                        Emergency Contact
                                                    </TableHead>
                                                    <TableHead className="hidden md:table-cell">
                                                        Medical Info
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {selectedCourse?.students && selectedCourse.students.length > 0 ? (
                                                    selectedCourse.students.map((student: StudentEntry, idx: number) => (
                                                        <TableRow key={idx}>
                                                            <TableCell className="font-medium">{student.name}</TableCell>
                                                            <TableCell>{student.email}</TableCell>
                                                            <TableCell className="hidden md:table-cell">{student.email}</TableCell>
                                                            <TableCell className="hidden md:table-cell">{student.email}</TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="text-center">No students</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>

                                {selectedCourse?.specialNeeds && (
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium">
                                            Special Needs/Concerns
                                        </h3>
                                        <p className="text-sm">
                                            {selectedCourse?.specialNeeds}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Add Course Dialog */}
            <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[500px] overflow-y-scroll">
                    <DialogHeader>
                        <DialogTitle>Add New Course</DialogTitle>
                        <DialogDescription>
                            Create a new diving course. You can add students and
                            dives after creating the course.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Course Title</Label>
                                <Input
                                    id="title"
                                    placeholder="Enter course title"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="level">
                                        Certification Level
                                    </Label>
                                    <Select
                                        value={level}
                                        onValueChange={(value) => setLevel(
                                            value as CertificationLevel,
                                        )}
                                    >
                                        <SelectTrigger id="level">
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="openWater">
                                                Open Water
                                            </SelectItem>
                                            <SelectItem value="advancedOpenWater">
                                                Advanced Open Water
                                            </SelectItem>
                                            <SelectItem value="rescueDiver">
                                                Rescue Diver
                                            </SelectItem>
                                            <SelectItem value="diveMaster">
                                                Dive Master
                                            </SelectItem>
                                            <SelectItem value="instructor">
                                                Instructor
                                            </SelectItem>
                                            <SelectItem value="specialtyCourse">
                                                Specialty Course
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={status}
                                        onValueChange={(value) => setStatus(
                                            value as CourseStatus,
                                        )}
                                    >
                                        <SelectTrigger id="status">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="upcoming">
                                                Upcoming
                                            </SelectItem>
                                            <SelectItem value="active">
                                                Active
                                            </SelectItem>
                                            <SelectItem value="completed">
                                                Completed
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">
                                        Start Date
                                    </Label>
                                    <Input id="startDate" type="date" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">End Date</Label>
                                    <Input id="endDate" type="date" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="instructor">
                                        Instructor Name
                                    </Label>
                                    <Input
                                        id="instructor"
                                        placeholder="Enter instructor name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="instructorContact">
                                        Instructor Contact
                                    </Label>
                                    <Input
                                        id="instructorContact"
                                        placeholder="Email or phone"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        placeholder="Dive center or site"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cost">Price of course ($)</Label>
                                    <Input
                                        id="cost"
                                        type="number"
                                        placeholder="Total course cost"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="specialNeeds">
                                    Special Needs/Concerns
                                </Label>
                                <Textarea
                                    id="specialNeeds"
                                    placeholder="Note any special needs or concerns"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Course Materials</Label>
                                {materials.map((mat, idx) => (
                                    <div key={idx} className="flex gap-2 mb-1">
                                        <Input
                                            value={mat}
                                            onChange={(e) => handleMaterialChange(idx, e.target.value)}
                                            placeholder="Material name"
                                        />
                                        <Button type="button" variant="outline" size="icon" onClick={() => removeMaterialField(idx)} disabled={materials.length === 1}>
                                            -
                                        </Button>
                                        {idx === materials.length - 1 && (
                                            <Button type="button" variant="outline" size="icon" onClick={addMaterialField}>
                                                +
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2">
                                <Label>Required Equipment</Label>
                                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto border rounded p-2">
                                    {equipmentOptions.map((eq) => (
                                        <div key={eq.id} className="flex items-center gap-2">
                                            <Checkbox
                                                id={`equipment-${eq.id}`}
                                                checked={selectedEquipment.includes(eq.id)}
                                                onCheckedChange={(checked) => {
                                                    setSelectedEquipment((prev) =>
                                                        checked
                                                            ? [...prev, eq.id]
                                                            : prev.filter((eid) => eid !== eq.id)
                                                    );
                                                }}
                                            />
                                            <label htmlFor={`equipment-${eq.id}`} className="text-sm">
                                                {eq.type} {eq.model}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Students</Label>
                                <div className="mb-2">Select from customers:</div>
                                <div className="flex flex-col gap-1 max-h-32 overflow-y-auto border rounded p-2">
                                    {customerOptions.map((c) => (
                                        <div key={c.id} className="flex items-center gap-2">
                                            <Checkbox
                                                id={`student-customer-${c.id}`}
                                                checked={selectedCustomerIds.includes(c.id)}
                                                onCheckedChange={(checked) => handleCustomerSelect(c.id, Boolean(checked))}
                                            />
                                            <label htmlFor={`student-customer-${c.id}`} className="text-sm">
                                                {c.fullName} ({c.email})
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-2 mb-1">Add manual students:</div>
                                {manualStudents.map((s, idx) => (
                                    <div key={idx} className="flex gap-2 mb-1">
                                        <Input
                                            value={s.name}
                                            onChange={(e) => handleManualStudentChange(idx, "name", e.target.value)}
                                            placeholder="Name"
                                        />
                                        <Input
                                            value={s.email}
                                            onChange={(e) => handleManualStudentChange(idx, "email", e.target.value)}
                                            placeholder="Email"
                                        />
                                        <Button type="button" variant="outline" size="icon" onClick={() => removeManualStudent(idx)} disabled={manualStudents.length === 1}>
                                            -
                                        </Button>
                                        {idx === manualStudents.length - 1 && (
                                            <Button type="button" variant="outline" size="icon" onClick={addManualStudent}>
                                                +
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsAddCourseOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                const formData = new FormData();
                                formData.append(
                                    "title",
                                    (document.getElementById(
                                        "title",
                                    ) as HTMLInputElement)?.value || "",
                                );
                                formData.append(
                                    "level",
                                    level,
                                );
                                formData.append(
                                    "status",
                                    status,
                                );
                                formData.append(
                                    "startDate",
                                    (document.getElementById(
                                        "startDate",
                                    ) as HTMLInputElement)?.value || "",
                                );
                                formData.append(
                                    "endDate",
                                    (document.getElementById(
                                        "endDate",
                                    ) as HTMLInputElement)?.value || "",
                                );
                                formData.append(
                                    "instructor",
                                    (document.getElementById(
                                        "instructor",
                                    ) as HTMLInputElement)?.value || "",
                                );
                                formData.append(
                                    "instructorContact",
                                    (document.getElementById(
                                        "instructorContact",
                                    ) as HTMLInputElement)?.value || "",
                                );
                                formData.append(
                                    "location",
                                    (document.getElementById(
                                        "location",
                                    ) as HTMLInputElement)?.value || "",
                                );
                                formData.append(
                                    "cost",
                                    (document.getElementById(
                                        "cost",
                                    ) as HTMLInputElement)?.value || "0",
                                );
                                formData.append(
                                    "specialNeeds",
                                    (document.getElementById(
                                        "specialNeeds",
                                    ) as HTMLTextAreaElement)?.value || "",
                                );
                                formData.append(
                                    "materials",
                                    JSON.stringify(materials.filter((m) => m.trim() !== "")),
                                );
                                formData.append(
                                    "equipmentIds",
                                    JSON.stringify(selectedEquipment),
                                );
                                formData.append(
                                    "students",
                                    JSON.stringify(buildStudentsArray()),
                                );
                                handleAddCourse(formData);
                            }}
                        >
                            Create Course
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Course Dialog */}
            {selectedCourse &&
                (
                    <Dialog
                        open={isEditCourseOpen}
                        onOpenChange={setIsEditCourseOpen}
                    >
                        <EditCourseDialog
                            selectedCourse={selectedCourse}
                            selectedEquipment={selectedEquipment}
                            materials={materials}
                            setIsEditCourseOpen={setIsEditCourseOpen}
                            onSuccess={handleCourseCreated}
                        />
                    </Dialog>
                )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove the course "{courseToDelete?.title}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteCourse} disabled={isDeleting}>
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardShell>
    );
}
