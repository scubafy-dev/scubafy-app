/*
  Warnings:

  - A unique constraint covering the columns `[staffCode]` on the table `staff` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "equipment" ADD COLUMN     "availableQuantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "itemValue" DOUBLE PRECISION,
ADD COLUMN     "minQuantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "rentalRate" DOUBLE PRECISION,
ADD COLUMN     "rentalTimeframe" TEXT,
ADD COLUMN     "rentedQuantity" INTEGER DEFAULT 1;

-- AlterTable
ALTER TABLE "staff" ADD COLUMN     "staffCode" TEXT;

-- CreateTable
CREATE TABLE "equipment_rentals" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "rentPrice" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "rentFrom" TIMESTAMP(3) NOT NULL,
    "rentTo" TIMESTAMP(3),
    "returnedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipment_rentals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "staff_staffCode_key" ON "staff"("staffCode");

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_rentals" ADD CONSTRAINT "equipment_rentals_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_rentals" ADD CONSTRAINT "equipment_rentals_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
