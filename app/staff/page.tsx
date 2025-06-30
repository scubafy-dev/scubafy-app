import { useAuth } from "@/lib/use-auth";
import StaffClient from "./client";
import {
  StaffWithPermissions,
  updateStaff,
  deleteStaff,
} from "@/lib/staffs";

export default async function StaffPage() {
  const session = await useAuth("/staff");

  return (
    <div>
      <StaffClient
        updateStaff={updateStaff}
        deleteStaff={deleteStaff}
      />
    </div>
  );
}
