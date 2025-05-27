import { useAuth } from "@/lib/use-auth";
import StaffClient from "./client";

export default async function StaffPage() {
  const session = await useAuth("/staff");

  return (
    <div>
      <StaffClient />
    </div>
  );
}
