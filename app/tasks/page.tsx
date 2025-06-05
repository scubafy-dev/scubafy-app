import TasksClient from "./client";
import { getAllTasks } from "@/lib/task";

export default async function TasksPage() {
  const tasks = await getAllTasks();
  return <TasksClient tasks={tasks} />;
}
