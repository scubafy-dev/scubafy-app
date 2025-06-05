import EquipmentPage from "./client";
import { getAllEquipments } from "@/lib/equipment";

export default async function NewDiveTripPage() {
  const equipments = await getAllEquipments();

  return (
    <div>
      <EquipmentPage
        equipments={equipments}
      />
    </div>
  );
}
