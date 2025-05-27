-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'other');

-- CreateEnum
CREATE TYPE "StaffStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('diveTrips', 'equipment', 'tasks', 'courseTracker', 'finances', 'customers', 'staff', 'reports', 'calendar');

-- CreateTable
CREATE TABLE "staff_permissions" (
    "staffId" TEXT NOT NULL,
    "permission" "Permission" NOT NULL,

    CONSTRAINT "staff_permissions_pkey" PRIMARY KEY ("staffId","permission")
);

-- CreateTable
CREATE TABLE "staff" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "age" INTEGER,
    "gender" "Gender",
    "roleTitle" TEXT,
    "status" "StaffStatus" NOT NULL DEFAULT 'active',
    "address" TEXT,
    "emergencyContact" TEXT,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "staff_email_key" ON "staff"("email");

-- AddForeignKey
ALTER TABLE "staff_permissions" ADD CONSTRAINT "staff_permissions_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;
