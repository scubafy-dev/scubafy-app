/*
  Warnings:

  - Added the required column `diveCenterId` to the `equipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "equipment" ADD COLUMN     "diveCenterId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_diveCenterId_fkey" FOREIGN KEY ("diveCenterId") REFERENCES "dive_center"("id") ON DELETE CASCADE ON UPDATE CASCADE;
