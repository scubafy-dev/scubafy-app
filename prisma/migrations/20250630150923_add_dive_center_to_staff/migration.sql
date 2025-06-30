-- AlterTable
ALTER TABLE "staff" ADD COLUMN     "diveCenterId" TEXT;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_diveCenterId_fkey" FOREIGN KEY ("diveCenterId") REFERENCES "dive_center"("id") ON DELETE CASCADE ON UPDATE CASCADE;
