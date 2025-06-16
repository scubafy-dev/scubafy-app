/*
  Warnings:

  - Added the required column `diveCenterId` to the `dive_trips` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `dive_trips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dive_trips" ADD COLUMN     "diveCenterId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "dive_trips" ADD CONSTRAINT "dive_trips_diveCenterId_fkey" FOREIGN KEY ("diveCenterId") REFERENCES "dive_center"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dive_trips" ADD CONSTRAINT "dive_trips_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
