import DashboardClient from "@/app/client";
import { useAuth } from "@/lib/use-auth";
import DiveTripsPage from "./dive-trips/client";


export default async function DashboardPage() {
  const session = await useAuth("/");
  return (
    <div>
      <DashboardClient />
    </div>
  );
}
