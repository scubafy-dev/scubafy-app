import EquipmentPage from "./client";
import {
  createEquipment,
  deleteDiveTrip,
  Equipment,
  getAllEquipments,
  updateDiveTrip,
} from "@/lib/equipment";

export default async function NewDiveTripPage() {
  const equipments = await getAllEquipments();

  return (
    <div>
      <EquipmentPage
        actionCreate={createEquipment}
        // actionDelete={deleteDiveTrip}
        // actionUpdate={updateDiveTrip}
        equipments={equipments}
      />
    </div>
  );
}
