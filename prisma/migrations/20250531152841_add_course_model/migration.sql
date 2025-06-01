-- CreateEnum
CREATE TYPE "CourseCertificationLevel" AS ENUM ('openWater', 'advancedOpenWater', 'rescueDiver', 'diveMaster', 'instructor', 'specialtyCourse');

-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('upcoming', 'active', 'completed');

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "certificationLevel" "CourseCertificationLevel" NOT NULL,
    "status" "CourseStatus" NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "instructorName" TEXT,
    "instructorContact" TEXT,
    "location" TEXT,
    "cost" DOUBLE PRECISION,
    "specialNeeds" TEXT,
    "studentsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);
