"use server"

import prisma from "@/prisma/prisma";
import type { CourseCertificationLevel, CourseStatus } from "@/app/generated/prisma";

export async function addCourse(formData: FormData) {

  const title = formData.get("title") as string;
  let certificationLevelStr = formData.get("level") as string | null;
  if(certificationLevelStr === ""){
    certificationLevelStr = null;
  }
  const certificationLevel = certificationLevelStr as CourseCertificationLevel | null;

  let statusStr = formData.get("status") as string | null;
  if(statusStr === ""){
    statusStr = null;
  } 
  const status = statusStr as CourseStatus | null;

  const startDateStr = formData.get("startDate") as string | null;
  const endDateStr = formData.get("endDate") as string | null;

  const instructorName = (formData.get("instructor") as string) || null;
  const instructorContact = (formData.get("instructorContact") as string) || null;
  const location = (formData.get("location") as string) || null;

  const costStr = formData.get("cost") as string | null;
  const cost = costStr ? parseFloat(costStr) : null;

  const specialNeeds = (formData.get("specialNeeds") as string) || null;

  const studentsCountStr = formData.get("studentsCount") as string | null;
  const studentsCount = studentsCountStr ? parseInt(studentsCountStr, 10) : 0;

  await prisma.course.create({
    data: {
      title,
      certificationLevel,
      status,
      startDate: startDateStr ? new Date(startDateStr) : null,
      endDate: endDateStr ? new Date(endDateStr) : null,
      instructorName,
      instructorContact,
      location,
      cost,
      specialNeeds,
      studentsCount,
    },
  });
}

export async function updateCourse(id: string, formData: FormData) {

  const data: Partial<{
    title: string;
    certificationLevel: CourseCertificationLevel;
    status: CourseStatus;
    startDate: Date | null;
    endDate: Date | null;
    instructorName: string | null;
    instructorContact: string | null;
    location: string | null;
    cost: number | null;
    specialNeeds: string | null;
    studentsCount: number;
  }> = {};

  if (formData.get("title")) data.title = formData.get("title") as string;
  if (formData.get("level")) data.certificationLevel = formData.get("level") as CourseCertificationLevel;
  if (formData.get("status")) data.status = formData.get("status") as CourseStatus;

  const startDateStr = formData.get("startDate") as string | null;
  if (startDateStr) data.startDate = new Date(startDateStr);

  const endDateStr = formData.get("endDate") as string | null;
  if (endDateStr) data.endDate = new Date(endDateStr);

  if (formData.get("instructorName")) data.instructorName = formData.get("instructorName") as string;
  if (formData.get("instructorContact")) data.instructorContact = formData.get("instructorContact") as string;
  if (formData.get("location")) data.location = formData.get("location") as string;

  const costStr = formData.get("cost") as string | null;
  if (costStr) data.cost = parseFloat(costStr);

  if (formData.get("specialNeeds")) data.specialNeeds = formData.get("specialNeeds") as string;

  const studentsCountStr = formData.get("studentsCount") as string | null;
  if (studentsCountStr) data.studentsCount = parseInt(studentsCountStr, 10);

  await prisma.course.update({
    where: { id },
    data,
  });
}

export async function deleteCourse(id: string) {
  await prisma.course.delete({
    where: { id },
  });
}

export async function getCourseById(id: string) {
  return prisma.course.findUnique({
    where: { id },
  });
}

export async function getAllCourses() {
  return prisma.course.findMany({
    orderBy: { startDate: "desc" },
  });
}
