import React from "react";
import CourseTrackerClient from "./client";
import { useAuth } from "@/lib/use-auth";

export default async function CourseTrackerPage() {
  const session = await useAuth("/course-tracker");

  return (
    <div>
      <CourseTrackerClient/>
    </div>
  );
}
