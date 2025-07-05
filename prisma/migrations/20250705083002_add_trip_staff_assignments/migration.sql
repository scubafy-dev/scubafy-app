-- CreateTable
CREATE TABLE "trip_instructor_assignments" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_instructor_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_dive_master_assignments" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_dive_master_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trip_instructor_assignments_tripId_staffId_key" ON "trip_instructor_assignments"("tripId", "staffId");

-- CreateIndex
CREATE UNIQUE INDEX "trip_dive_master_assignments_tripId_staffId_key" ON "trip_dive_master_assignments"("tripId", "staffId");

-- AddForeignKey
ALTER TABLE "trip_instructor_assignments" ADD CONSTRAINT "trip_instructor_assignments_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "dive_trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_instructor_assignments" ADD CONSTRAINT "trip_instructor_assignments_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_dive_master_assignments" ADD CONSTRAINT "trip_dive_master_assignments_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "dive_trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_dive_master_assignments" ADD CONSTRAINT "trip_dive_master_assignments_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;
