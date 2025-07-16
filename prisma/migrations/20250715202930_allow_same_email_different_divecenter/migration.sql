/*
  Warnings:

  - A unique constraint covering the columns `[email,diveCenterId]` on the table `staff` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "staff_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "staff_email_diveCenterId_key" ON "staff"("email", "diveCenterId");
