-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "diveCenterId" TEXT;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_diveCenterId_fkey" FOREIGN KEY ("diveCenterId") REFERENCES "dive_center"("id") ON DELETE CASCADE ON UPDATE CASCADE;
