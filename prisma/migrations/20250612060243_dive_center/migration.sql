-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "dive_center" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "dive_center_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "dive_center" ADD CONSTRAINT "dive_center_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
