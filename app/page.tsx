import DashboardClient from "@/app/client";
import { useAuth } from "@/lib/use-auth";

export default async function DashboardPage() {
  const session = await useAuth("/");
  return (
    <div>
      <DashboardClient />
    </div>
  );
}
