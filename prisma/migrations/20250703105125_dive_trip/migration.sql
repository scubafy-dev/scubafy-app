/*
  Warnings:

  - You are about to drop the `vehicles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fleetVehicleId` to the `dive_trips` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_diveTripId_fkey";

-- AlterTable
ALTER TABLE "dive_trips" ADD COLUMN     "fleetVehicleId" TEXT NOT NULL;

-- DropTable
DROP TABLE "vehicles";

-- AddForeignKey
ALTER TABLE "dive_trips" ADD CONSTRAINT "dive_trips_fleetVehicleId_fkey" FOREIGN KEY ("fleetVehicleId") REFERENCES "fleet_vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
