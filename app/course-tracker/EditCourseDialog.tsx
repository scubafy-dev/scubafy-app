"use client";

import React from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Course,
    CourseCertificationLevel,
    CourseStatus,
} from "@app/generated/prisma";
import { updateCourse } from "@/lib/course";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getAllEquipments } from "@/lib/equipment";
import { getAllCustomers } from "@/lib/customers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Add types for students and customers
interface StudentEntry { customerId?: string; name: string; email: string; }
interface CustomerEntry { id: string; fullName: string; email: string; }

export function EditCourseDialog(
    { selectedCourse, setIsEditCourseOpen, onSuccess, selectedEquipment, materials }: {
        selectedCourse: Course;
        setIsEditCourseOpen: React.Dispatch<React.SetStateAction<boolean>>;
        onSuccess: any;
        selectedEquipment: any;
        materials: any;
    },
) {
    console.log('edit course',selectedCourse,selectedEquipment,materials)
    const {toast}=useToast()
    const router = useRouter();
    const [level, setLevel] = React.useState<CourseCertificationLevel>(
        selectedCourse.certificationLevel || "openWater",
    );
    const [status, setStatus] = React.useState<CourseStatus>(
        selectedCourse.status || "upcoming",
    );

    const formatDate = (date: Date | null) => {
        if (!date) return "";
        return date.toISOString().split("T")[0];
    };

    const [equipmentOptions, setEquipmentOptions] = React.useState<any[]>([]);
    const [editMaterials, setEditMaterials] = React.useState<string[]>(materials && materials.length > 0 ? materials : [""]);
    const [editSelectedEquipment, setEditSelectedEquipment] = React.useState<string[]>(selectedEquipment || []);

    const [customerOptions, setCustomerOptions] = React.useState<CustomerEntry[]>([]);
    const [selectedCustomerIds, setSelectedCustomerIds] = React.useState<string[]>([]);
    const [manualStudents, setManualStudents] = React.useState<StudentEntry[]>([{ name: "", email: "" }]);
    const [existingStudents, setExistingStudents] = React.useState<StudentEntry[]>([]);
    const [isUpdating, setIsUpdating] = React.useState(false);

    // Add state for expenses
    function getExpenseField(expenses: any, key: string) {
      if (expenses && typeof expenses === 'object' && !Array.isArray(expenses)) {
        return expenses[key] != null ? String(expenses[key]) : '';
      }
      return '';
    }
    const [editExpenses, setEditExpenses] = React.useState({
      instructorFee: getExpenseField(selectedCourse.expenses, 'instructorFee'),
      assistantFee: getExpenseField(selectedCourse.expenses, 'assistantFee'),
      denrFee: getExpenseField(selectedCourse.expenses, 'denrFee'),
      tankFee: getExpenseField(selectedCourse.expenses, 'tankFee'),
      courseMaterials: getExpenseField(selectedCourse.expenses, 'courseMaterials'),
      courseCertificationFee: getExpenseField(selectedCourse.expenses, 'courseCertificationFee'),
    });
    // Reset expenses when course changes
    React.useEffect(() => {
      setEditExpenses({
        instructorFee: getExpenseField(selectedCourse.expenses, 'instructorFee'),
        assistantFee: getExpenseField(selectedCourse.expenses, 'assistantFee'),
        denrFee: getExpenseField(selectedCourse.expenses, 'denrFee'),
        tankFee: getExpenseField(selectedCourse.expenses, 'tankFee'),
        courseMaterials: getExpenseField(selectedCourse.expenses, 'courseMaterials'),
        courseCertificationFee: getExpenseField(selectedCourse.expenses, 'courseCertificationFee'),
      });
    }, [selectedCourse]);

    React.useEffect(() => {
        async function fetchEquipment() {
            const eq = await getAllEquipments(selectedCourse.diveCenterId);
            setEquipmentOptions(eq);
        }
        fetchEquipment();
    }, [selectedCourse.diveCenterId]);

    // Sync local edit state with props when course or modal changes
    React.useEffect(() => {
        setEditMaterials(materials && materials.length > 0 ? materials : [""]);
        setEditSelectedEquipment(selectedEquipment || []);
    }, [selectedCourse, materials, selectedEquipment]);

    React.useEffect(() => {
        setLevel(selectedCourse.certificationLevel || "openWater");
        setStatus(selectedCourse.status || "upcoming");
    }, [selectedCourse]);

    // Fetch customers on mount
    React.useEffect(() => {
        async function fetchCustomers() {
            if (selectedCourse.diveCenterId) {
                const customers = await getAllCustomers(selectedCourse.diveCenterId);
                setCustomerOptions(customers);
            }
        }
        fetchCustomers();
    }, [selectedCourse.diveCenterId]);

    // Pre-fill students on open
    React.useEffect(() => {
        const dbStudents = (selectedCourse as any).students || [];
        setExistingStudents(dbStudents.filter((s: StudentEntry) => s.customerId));
        setSelectedCustomerIds(dbStudents.filter((s: StudentEntry) => s.customerId).map((s: StudentEntry) => s.customerId!));
        setManualStudents(dbStudents.filter((s: StudentEntry) => !s.customerId).map((s: StudentEntry) => ({ name: s.name, email: s.email })) || [{ name: "", email: "" }]);
    }, [selectedCourse]);

    // Reset all fields to selectedCourse values when modal opens or selectedCourse changes
    React.useEffect(() => {
        setLevel(selectedCourse.certificationLevel || "openWater");
        setStatus(selectedCourse.status || "upcoming");
        setEditMaterials(materials && materials.length > 0 ? materials : [""]);
        setEditSelectedEquipment(selectedEquipment || []);
        const dbStudents = (selectedCourse as any).students || [];
        setExistingStudents(dbStudents.filter((s: StudentEntry) => s.customerId));
        setSelectedCustomerIds(dbStudents.filter((s: StudentEntry) => s.customerId).map((s: StudentEntry) => s.customerId!));
        setManualStudents(dbStudents.filter((s: StudentEntry) => !s.customerId).map((s: StudentEntry) => ({ name: s.name, email: s.email })) || [{ name: "", email: "" }]);
    }, [selectedCourse, materials, selectedEquipment]);

    // Handlers for materials
    const handleMaterialChange = (idx: number, value: string) => {
        setEditMaterials((prev) => prev.map((m, i) => (i === idx ? value : m)));
    };
    const addMaterialField = () => setEditMaterials((prev) => [...prev, ""]);
    const removeMaterialField = (idx: number) => setEditMaterials((prev) => prev.filter((_, i) => i !== idx));

    // Handler for equipment
    const handleEquipmentSelect = (id: string, checked: boolean) => {
        setEditSelectedEquipment((prev) =>
            checked ? [...prev, id] : prev.filter((eid) => eid !== id)
        );
    };

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

    // Handler to remove existing student
    const removeExistingStudent = (customerId: string) => {
        setExistingStudents((prev) => prev.filter((s) => s.customerId !== customerId));
        setSelectedCustomerIds((prev) => prev.filter((cid) => cid !== customerId));
    };

    // On update, build students array
    function buildStudentsArray() {
        const selectedCustomers = customerOptions.filter((c) => selectedCustomerIds.includes(c.id));
        const customerStudents = selectedCustomers.map((c) => ({ customerId: c.id, name: c.fullName, email: c.email }));
        const manual = manualStudents.filter((s) => s.name.trim() && s.email.trim());
        return [...customerStudents, ...manual];
    }

    async function handleUpdateCourse(formData: FormData) {
        setIsUpdating(true);
        formData.append("materials", JSON.stringify(editMaterials.filter((m) => m.trim() !== "")));
        formData.append("equipmentIds", JSON.stringify(editSelectedEquipment));
        formData.append("students", JSON.stringify(buildStudentsArray()));
        formData.append("expenses", JSON.stringify(editExpenses));
        await updateCourse(selectedCourse.id, formData);
        toast({
            title: "Course updated successfully",
        });
        onSuccess();
        router.refresh();
        setIsUpdating(false);
        setIsEditCourseOpen(false);
    }

    return (
        <DialogContent className="sm:max-w-[600px] max-h-[500px] overflow-y-scroll">
            <DialogHeader>
                <DialogTitle>Edit Course Informations</DialogTitle>
                <DialogDescription>
                    Update course details, students, and expenses.
                </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="details" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="expenses">Expenses</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Course Title</Label>
                                <Input
                                    id="title"
                                    defaultValue={selectedCourse.title || ""}
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
                                        defaultValue={selectedCourse
                                            .certificationLevel || "openWater"}
                                        onValueChange={(value) =>
                                            setLevel(
                                                value as CourseCertificationLevel,
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
                                        defaultValue={selectedCourse.status ||
                                            "upcoming"}
                                        onValueChange={(value) =>
                                            setStatus(
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
                                    <Input
                                        id="startDate"
                                        defaultValue={formatDate(
                                            selectedCourse.startDate,
                                        )}
                                        type="date"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">End Date</Label>
                                    <Input
                                        id="endDate"
                                        defaultValue={formatDate(
                                            selectedCourse.endDate,
                                        )}
                                        type="date"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="instructor">
                                        Instructor Name
                                    </Label>
                                    <Input
                                        id="instructor"
                                        defaultValue={selectedCourse.instructorName ||
                                            ""}
                                        placeholder="Enter instructor name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="instructorContact">
                                        Instructor Contact
                                    </Label>
                                    <Input
                                        id="instructorContact"
                                        defaultValue={selectedCourse
                                            .instructorContact || ""}
                                        placeholder="Email or phone"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        defaultValue={selectedCourse.location || ""}
                                        placeholder="Dive center or site"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cost">Cost ($)</Label>
                                    <Input
                                        id="cost"
                                        type="number"
                                        defaultValue={selectedCourse.cost?.toString() ||
                                            "0"}
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
                                    defaultValue={selectedCourse.specialNeeds || ""}
                                    placeholder="Note any special needs or concerns"
                                />
                            </div>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="expenses">
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Instructor Fee</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="$"
                                    value={editExpenses.instructorFee}
                                    onChange={e => setEditExpenses(exp => ({ ...exp, instructorFee: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Assistant Fee</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="$"
                                    value={editExpenses.assistantFee}
                                    onChange={e => setEditExpenses(exp => ({ ...exp, assistantFee: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>DENR Fee</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="$"
                                    value={editExpenses.denrFee}
                                    onChange={e => setEditExpenses(exp => ({ ...exp, denrFee: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Tank Fee</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="$"
                                    value={editExpenses.tankFee}
                                    onChange={e => setEditExpenses(exp => ({ ...exp, tankFee: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Course Materials</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="$"
                                    value={editExpenses.courseMaterials}
                                    onChange={e => setEditExpenses(exp => ({ ...exp, courseMaterials: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Course Certification Fee</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="$"
                                    value={editExpenses.courseCertificationFee}
                                    onChange={e => setEditExpenses(exp => ({ ...exp, courseCertificationFee: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="space-y-2">
                <Label>Course Materials</Label>
                {editMaterials.map((mat, idx) => (
                    <div key={idx} className="flex gap-2 mb-1">
                        <Input
                            value={mat}
                            onChange={(e) => handleMaterialChange(idx, e.target.value)}
                            placeholder="Material name"
                        />
                        <Button type="button" variant="outline" size="icon" onClick={() => removeMaterialField(idx)} disabled={editMaterials.length === 1}>
                            -
                        </Button>
                        {idx === editMaterials.length - 1 && (
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
                            <input
                                type="checkbox"
                                id={`edit-equipment-${eq.id}`}
                                checked={editSelectedEquipment.includes(eq.id)}
                                onChange={(e) => handleEquipmentSelect(eq.id, e.target.checked)}
                            />
                            <label htmlFor={`edit-equipment-${eq.id}`} className="text-sm">
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
                            <input
                                type="checkbox"
                                id={`edit-student-customer-${c.id}`}
                                checked={selectedCustomerIds.includes(c.id)}
                                onChange={(e) => handleCustomerSelect(c.id, e.target.checked)}
                            />
                            <label htmlFor={`edit-student-customer-${c.id}`} className="text-sm">
                                {c.fullName} ({c.email})
                            </label>
                        </div>
                    ))}
                </div>
                <div className="mt-2 mb-1">Existing students from DB:</div>
                <ul className="text-sm space-y-1">
                    {existingStudents.length > 0 ? (
                        existingStudents.map((s, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                                {s.name} ({s.email})
                                {/* <Button type="button" variant="outline" size="icon" onClick={() => removeExistingStudent(s.customerId!)}>-</Button> */}
                            </li>
                        ))
                    ) : (
                        <li>No existing students</li>
                    )}
                </ul>
                <div className="mt-2 mb-1">Added students:</div>
                {manualStudents.length === 0 ? (
                    <div className="flex gap-2 mb-1">
                        <Input
                            value=""
                            onChange={() => {}}
                            placeholder="Name"
                            disabled
                        />
                        <Input
                            value=""
                            onChange={() => {}}
                            placeholder="Email"
                            disabled
                        />
                        <Button type="button" variant="outline" size="icon" onClick={addManualStudent}>+</Button>
                    </div>
                ) : (
                    manualStudents.map((s, idx) => (
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
                            <Button type="button" variant="outline" size="icon" onClick={() => removeManualStudent(idx)} disabled={manualStudents.length === 1}>-</Button>
                            {idx === manualStudents.length - 1 && (
                                <Button type="button" variant="outline" size="icon" onClick={addManualStudent}>+</Button>
                            )}
                        </div>
                    ))
                )}
            </div>

            <DialogFooter>
                <Button
                    variant="outline"
                    onClick={() => setIsEditCourseOpen(false)}
                    disabled={isUpdating}
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
                            JSON.stringify(editMaterials.filter((m) => m.trim() !== "")),
                        );
                        formData.append(
                            "equipmentIds",
                            JSON.stringify(editSelectedEquipment),
                        );
                        formData.append(
                            "students",
                            JSON.stringify(buildStudentsArray()),
                        );
                        formData.append(
                            "expenses",
                            JSON.stringify(editExpenses),
                        );
                        handleUpdateCourse(formData);
                    }}
                    disabled={isUpdating}
                >
                    {isUpdating ? "Updating..." : "Update Course"}
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}
