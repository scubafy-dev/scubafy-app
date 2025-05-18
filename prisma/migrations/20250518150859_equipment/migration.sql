-- CreateEnum
CREATE TYPE "EquipmentType" AS ENUM ('BCD', 'Regulator', 'Wetsuit', 'DiveComputer', 'Fins');

-- CreateEnum
CREATE TYPE "EquipmentStatus" AS ENUM ('available', 'in_use', 'rented', 'maintenance');

-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('excellent', 'good', 'fair', 'poor');

-- CreateTable
CREATE TABLE "equipment" (
    "id" TEXT NOT NULL,
    "type" "EquipmentType" NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "purchaseDate" TIMESTAMP(3),
    "lastService" TIMESTAMP(3),
    "nextService" TIMESTAMP(3),
    "usageCount" INTEGER,
    "usageLimit" INTEGER,
    "status" "EquipmentStatus" NOT NULL DEFAULT 'available',
    "condition" "Condition" NOT NULL,
    "notes" TEXT,

    CONSTRAINT "equipment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "equipment_serialNumber_key" ON "equipment"("serialNumber");
