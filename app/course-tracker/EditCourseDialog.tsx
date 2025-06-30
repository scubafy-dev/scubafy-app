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

export function EditCourseDialog(
    { selectedCourse, setIsEditCourseOpen,onSuccess }: {
        selectedCourse: Course;
        setIsEditCourseOpen: React.Dispatch<React.SetStateAction<boolean>>;
        onSuccess:any;
    },
) {
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

    async function handleUpdateCourse(formData: FormData) {
        await updateCourse(selectedCourse.id, formData);
        toast({
            title: "Course updated successfully",
        });
        onSuccess()
        router.refresh();
        setIsEditCourseOpen(false);
    }

    return (
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle>Edit Course Informations</DialogTitle>
                <DialogDescription>
                    Create a new diving course. You can add students and dives
                    after creating the course.
                </DialogDescription>
            </DialogHeader>

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

            <DialogFooter>
                <Button
                    variant="outline"
                    onClick={() => setIsEditCourseOpen(false)}
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
                        handleUpdateCourse(formData);
                    }}
                >
                    Update Course
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}
