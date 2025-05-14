-- CreateEnum
CREATE TYPE "Status" AS ENUM ('upcoming', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('beginner', 'intermediate', 'advanced');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('boat', 'speedboat', 'catamaran');

-- CreateTable
CREATE TABLE "dive_trips" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "booked" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "status" "Status" NOT NULL,
    "diveMaster" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "center" TEXT,
    "instructor" TEXT NOT NULL,

    CONSTRAINT "dive_trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "VehicleType" NOT NULL,
    "capacity" INTEGER NOT NULL,
    "diveTripId" TEXT NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "certification" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "diveTripId" TEXT NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_diveTripId_key" ON "vehicles"("diveTripId");

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_diveTripId_fkey" FOREIGN KEY ("diveTripId") REFERENCES "dive_trips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_diveTripId_fkey" FOREIGN KEY ("diveTripId") REFERENCES "dive_trips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
