import { useAuth } from "@/lib/use-auth";
import RoleSelectionClient from "./client";

export default async function RoleSelectionPage() {
    const session = await useAuth("/staff");

    return <RoleSelectionClient />;
}
