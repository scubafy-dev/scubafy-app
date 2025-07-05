import { useAuth } from "@/lib/use-auth";
import EquipmentPage from "./client";

export default async function NewDiveTripPage() {
  const session = await useAuth("/equipment");

  return (
    <div>
      <EquipmentPage/>
    </div>
  );
}
