-- CreateEnum
CREATE TYPE "Role" AS ENUM ('manager', 'staff');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'manager';
