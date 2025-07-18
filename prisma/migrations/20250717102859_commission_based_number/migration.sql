/*
  Warnings:

  - The `commissionBased` column on the `staff` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "staff" DROP COLUMN "commissionBased",
ADD COLUMN     "commissionBased" DOUBLE PRECISION;
