import { useAuth } from "@/lib/use-auth";
import DiveTripsPage from "./client";

export default async function NewDiveTripPage() {
    const session = await useAuth("/dive-trips");

    return (
        <div>
            <DiveTripsPage />
        </div>
    );
}
