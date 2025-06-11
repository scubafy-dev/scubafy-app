-- AlterTable
ALTER TABLE "equipment" ADD COLUMN     "rentFrom" TIMESTAMP(3),
ADD COLUMN     "rentPrice" DOUBLE PRECISION DEFAULT 0.0,
ADD COLUMN     "rentTo" TIMESTAMP(3);
