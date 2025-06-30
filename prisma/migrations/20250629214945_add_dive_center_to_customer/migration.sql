/*
  Warnings:

  - Added the required column `diveCenterId` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FleetVehicleType" AS ENUM ('boat', 'speedboat', 'liveaboard', 'car', 'custom');

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "diveCenterId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "fleet_vehicles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FleetVehicleType" NOT NULL,
    "size" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "description" TEXT,
    "registrationNumber" TEXT,
    "insuranceInfo" TEXT,
    "imageUrl" TEXT,
    "diveCenterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fleet_vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_crew_assignments" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "role" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicle_crew_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_crew_assignments_vehicleId_staffId_key" ON "vehicle_crew_assignments"("vehicleId", "staffId");

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_diveCenterId_fkey" FOREIGN KEY ("diveCenterId") REFERENCES "dive_center"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fleet_vehicles" ADD CONSTRAINT "fleet_vehicles_diveCenterId_fkey" FOREIGN KEY ("diveCenterId") REFERENCES "dive_center"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_crew_assignments" ADD CONSTRAINT "vehicle_crew_assignments_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "fleet_vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_crew_assignments" ADD CONSTRAINT "vehicle_crew_assignments_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;
