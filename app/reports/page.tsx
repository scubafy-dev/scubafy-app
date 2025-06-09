import ReportsClient from "./client";
import { useAuth } from "@/lib/use-auth";

export default async function ReportsPage() {
  const session = await useAuth("/reports");

  return (
    <div>
      <ReportsClient />
    </div>
  );
}
