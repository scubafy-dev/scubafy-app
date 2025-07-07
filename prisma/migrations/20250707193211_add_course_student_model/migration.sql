/*
  Warnings:

  - You are about to drop the `_CourseStudents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CourseStudents" DROP CONSTRAINT "_CourseStudents_A_fkey";

-- DropForeignKey
ALTER TABLE "_CourseStudents" DROP CONSTRAINT "_CourseStudents_B_fkey";

-- DropTable
DROP TABLE "_CourseStudents";

-- CreateTable
CREATE TABLE "course_students" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "customerId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "course_students_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "course_students" ADD CONSTRAINT "course_students_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_students" ADD CONSTRAINT "course_students_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
