import { useAuth } from "@/lib/use-auth";
import TasksClient from "./client";

export default async function TasksPage() {
  const session = await useAuth("/staff");

  return <TasksClient />;
}
