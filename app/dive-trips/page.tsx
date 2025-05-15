// app/diveTrips/new/page.tsx
import prisma from "@/prisma/prisma";
import { redirect } from "next/navigation";
import DiveTripsPage from "./client";
import {
    createDiveTrip,
    FullDiveTrip,
    getAllDiveTrips,
} from "@/lib/dive-trips";

export const dynamic = "force-dynamic";

export default async function NewDiveTripPage() {
    // ❶ Server Action

    const diveTrips: FullDiveTrip[] = await getAllDiveTrips();

    return (
        <div>
            {/* ❷ Pass the action down to the client form */}
            <DiveTripsPage action={createDiveTrip} diveTrips={diveTrips} />
            {/* <DiveTripForm action={upsertDiveTrip} /> */}
        </div>
    );
}
