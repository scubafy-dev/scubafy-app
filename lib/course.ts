"use server"

import prisma from "@/prisma/prisma";
import type { CourseCertificationLevel, CourseStatus } from "@/app/generated/prisma";

export async function addCourse(formData: FormData, diveCenterId: string) {

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

  // New: get materials and equipmentIds arrays from formData
  let materials: string[] = [];
  let equipmentIds: string[] = [];
  try {
    materials = JSON.parse(formData.get("materials") as string || "[]");
  } catch {}
  try {
    equipmentIds = JSON.parse(formData.get("equipmentIds") as string || "[]");
  } catch {}

  // Handle students
  let students: Array<{ customerId?: string; name: string; email: string }> = [];
  try {
    students = JSON.parse(formData.get("students") as string || "[]");
  } catch {}

  const created= await prisma.course.create({
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
      diveCenterId,
      materials,
      equipmentIds,
      students: {
        create: students.map((s) => ({
          customerId: s.customerId || undefined,
          name: s.name,
          email: s.email,
        })),
      },
    },
    include: { students: true },
  });

  return { success: true, data: created }; 
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
    materials: string[];
    equipmentIds: string[];
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

  // Handle materials and equipmentIds
  try {
    if (formData.get("materials")) {
      data.materials = JSON.parse(formData.get("materials") as string || "[]");
    }
  } catch {}
  try {
    if (formData.get("equipmentIds")) {
      data.equipmentIds = JSON.parse(formData.get("equipmentIds") as string || "[]");
    }
  } catch {}

  // Handle students
  let students: Array<{ customerId?: string; name: string; email: string }> = [];
  try {
    students = JSON.parse(formData.get("students") as string || "[]");
  } catch {}

  await prisma.course.update({
    where: { id },
    data: {
      ...data,
      students: {
        deleteMany: {}, // Remove all previous students
        create: students.map((s) => ({
          customerId: s.customerId || undefined,
          name: s.name,
          email: s.email,
        })),
      },
    },
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

export async function getAllCourses(diveCenterId?: string) {
  return prisma.course.findMany({
    where: diveCenterId ? { diveCenterId } : {},
    orderBy: { startDate: "desc" },
    include: { students: true, diveCenter: true },
  });
}
