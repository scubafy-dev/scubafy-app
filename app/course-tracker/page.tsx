import React from "react";
import CourseTrackerClient from "./client";
import { getAllCourses } from "@/lib/course";

// Types for the course tracker

export default async function CourseTrackerPage() {
  const courses = await getAllCourses();

  return (
    <div>
      <CourseTrackerClient courses={courses} />
    </div>
  );
}
