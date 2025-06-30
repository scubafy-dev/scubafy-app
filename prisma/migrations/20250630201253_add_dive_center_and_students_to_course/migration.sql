/*
  Warnings:

  - Added the required column `diveCenterId` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "diveCenterId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_CourseStudents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CourseStudents_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CourseStudents_B_index" ON "_CourseStudents"("B");

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_diveCenterId_fkey" FOREIGN KEY ("diveCenterId") REFERENCES "dive_center"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseStudents" ADD CONSTRAINT "_CourseStudents_A_fkey" FOREIGN KEY ("A") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseStudents" ADD CONSTRAINT "_CourseStudents_B_fkey" FOREIGN KEY ("B") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
