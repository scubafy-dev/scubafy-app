-- AlterTable
ALTER TABLE "dive_center" ADD COLUMN     "contact" TEXT,
ADD COLUMN     "email" TEXT;

-- AlterTable
ALTER TABLE "dive_trips" ADD COLUMN     "diveType" TEXT;
