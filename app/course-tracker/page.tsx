import React from "react";
import CourseTrackerClient from "./client";
import { getAllCourses } from "@/lib/course";
import { useAuth } from "@/lib/use-auth";

export default async function CourseTrackerPage() {
  const session = await useAuth("/course-tracker");
  const courses = await getAllCourses();

  return (
    <div>
      <CourseTrackerClient courses={courses} />
    </div>
  );
}
