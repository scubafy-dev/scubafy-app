import DiveTripsPage from "./client";
import {
    createDiveTrip,
    deleteDiveTrip,
    FullDiveTrip,
    getAllDiveTrips,
    updateDiveTrip,
} from "@/lib/dive-trips";

export default async function NewDiveTripPage() {
    const diveTrips: FullDiveTrip[] = await getAllDiveTrips();

    return (
        <div>
            <DiveTripsPage
                actionCreate={createDiveTrip}
                actionDelete={deleteDiveTrip}
                actionUpdate={updateDiveTrip}
                diveTrips={diveTrips}
            />
        </div>
    );
}
