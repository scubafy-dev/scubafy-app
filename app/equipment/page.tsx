import EquipmentPage from "./client";
import {
  createEquipment,
  deleteEquipment,
  Equipment,
  getAllEquipments,
  updateEquipment,
} from "@/lib/equipment";

export default async function NewDiveTripPage() {
  const equipments = await getAllEquipments();

  return (
    <div>
      <EquipmentPage
        actionCreate={createEquipment}
        actionDelete={deleteEquipment}
        actionUpdate={updateEquipment}
        equipments={equipments}
      />
    </div>
  );
}
