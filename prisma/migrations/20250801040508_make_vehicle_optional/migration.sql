-- DropForeignKey
ALTER TABLE "dive_trips" DROP CONSTRAINT "dive_trips_fleetVehicleId_fkey";

-- AlterTable
ALTER TABLE "dive_trips" ALTER COLUMN "fleetVehicleId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "user_subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "amount_paid" DOUBLE PRECISION NOT NULL,
    "customer_email" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "hosted_invoice_url" TEXT,
    "period_end" BIGINT NOT NULL,
    "period_start" BIGINT NOT NULL,
    "status" TEXT NOT NULL,
    "planType" TEXT NOT NULL,
    "billingCycle" TEXT NOT NULL,
    "maxDiveCenters" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_subscriptions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "dive_trips" ADD CONSTRAINT "dive_trips_fleetVehicleId_fkey" FOREIGN KEY ("fleetVehicleId") REFERENCES "fleet_vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
