import SettingsClient from "./client";
import { useAuth } from "@/lib/use-auth";

export default async function ReportsPage() {
  const session = await useAuth("/settings");

  return (
    <div>
      <SettingsClient />
    </div>
  );
}
