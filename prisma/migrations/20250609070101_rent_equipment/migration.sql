-- AlterTable
ALTER TABLE "equipment" ADD COLUMN     "rentedToId" TEXT;

-- AddForeignKey
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_rentedToId_fkey" FOREIGN KEY ("rentedToId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
