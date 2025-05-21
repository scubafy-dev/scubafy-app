-- CreateEnum
CREATE TYPE "CertificationLevel" AS ENUM ('openWater', 'advancedOpenWater', 'rescue', 'diveMaster', 'instructor');

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "certificationLevel" "CertificationLevel",
    "roomNumber" TEXT,
    "numberOfNights" INTEGER DEFAULT 0,
    "roomCost" DOUBLE PRECISION DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");
