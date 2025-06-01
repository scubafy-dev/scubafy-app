"use client";

import React from "react";

export function AddCourseDialog(
    { onClose, onSubmit }: {
        onClose: () => void;
        onSubmit: (formData: FormData) => Promise<void>;
    },
) {
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        await onSubmit(formData);
    }

    return (
        <dialog
            open
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
        >
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-md w-[500px]"
            >
                <h2 className="text-xl mb-4">Add New Course</h2>

                <input
                    name="title"
                    placeholder="Course Title"
                    required
                    className="mb-2 w-full"
                />
                {/* Certification level select */}
                <select
                    name="certificationLevel"
                    required
                    className="mb-2 w-full"
                >
                    <option value="">Select Certification Level</option>
                    <option value="openWater">Open Water</option>
                    <option value="advancedOpenWater">
                        Advanced Open Water
                    </option>
                    <option value="rescueDiver">Rescue Diver</option>
                    <option value="diveMaster">Dive Master</option>
                    <option value="instructor">Instructor</option>
                    <option value="specialtyCourse">Specialty Course</option>
                </select>
                {/* Status select */}
                <select name="status" required className="mb-2 w-full">
                    <option value="">Select Status</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                </select>

                <input name="startDate" type="date" className="mb-2 w-full" />
                <input name="endDate" type="date" className="mb-2 w-full" />

                <input
                    name="instructorName"
                    placeholder="Instructor Name"
                    className="mb-2 w-full"
                />
                <input
                    name="instructorContact"
                    placeholder="Instructor Contact"
                    className="mb-2 w-full"
                />
                <input
                    name="location"
                    placeholder="Location"
                    className="mb-2 w-full"
                />
                <input
                    name="cost"
                    type="number"
                    placeholder="Cost"
                    className="mb-2 w-full"
                />
                <textarea
                    name="specialNeeds"
                    placeholder="Special Needs / Concerns"
                    className="mb-2 w-full"
                />

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-outline"
                    >
                        Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                        Create Course
                    </button>
                </div>
            </form>
        </dialog>
    );
}
