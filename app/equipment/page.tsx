import { useAuth } from "@/lib/use-auth";
import EquipmentPage from "./client";
import { getAllEquipments } from "@/lib/equipment";

export default async function NewDiveTripPage() {
  const session = await useAuth("/equipment");
  const equipments = await getAllEquipments();

  return (
    <div>
      <EquipmentPage
        equipments={equipments}
      />
    </div>
  );
}
