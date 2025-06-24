import { useAuth } from "@/lib/use-auth";
import StaffClient from "./client";
import {
  createStaff,
  getAllStaff,
  StaffWithPermissions,
  updateStaff,
  deleteStaff,
} from "@/lib/staffs";

export default async function StaffPage() {
  const session = await useAuth("/staff");
  const staffs = await getAllStaff();

  return (
    <div>
      <StaffClient
        staffs={staffs}
        createStaff={createStaff}
        updateStaff={updateStaff}
        deleteStaff={deleteStaff}
      />
    </div>
  );
}
