// lib/tasks.ts
"use server"
import prisma from "@/prisma/prisma";
import { Priority, TaskStatus, TaskCategory } from "@app/generated/prisma";
export interface TaskWithAssignee {
  id: string;
  title: string;
  description: string | null;
  assignedToId: string;
  dueDate: Date;
  priority: Priority;
  status: TaskStatus;
  category: TaskCategory;
  createdAt: Date;
  updatedAt: Date;
  assignedTo: {
    id: string;
    fullName: string;
    email: string;
  };
}


export async function createTask(formData: FormData, diveCenterId: string) {
  console.log('task payload',formData)
  // 1) Ensure required fields
  const requiredDefaults: Record<string, string> = {
    title: "Untitled Task",
    assignedTo: "",    // will throw if still empty
    dueDate: new Date().toISOString(),
    category: TaskCategory.maintenance,
  };
  for (const [key, def] of Object.entries(requiredDefaults)) {
    if (!formData.get(key)) {
      formData.append(key, def);
    }
  }

  if (!formData.get("assignedTo")) {
    throw new Error("Missing assignee");
  }

  if (!diveCenterId) {
    throw new Error("Missing dive center ID");
  }

  // 2) Default priority and status if missing
  if (!formData.get("priority")) {
    formData.append("priority", Priority.medium);
  }
  if (!formData.get("status")) {
    formData.append("status", TaskStatus.pending);
  }

  // 3) Extract & cast values
  const title = (formData.get("title") as string).trim();
  const description = (formData.get("description") as string) || null;

  const assignedToId = formData.get("assignedTo") as string;
  if (!assignedToId) {
    throw new Error("AssignedToId is required");
  }

  const dueDateStr = formData.get("dueDate") as string;
  const dueDate = new Date(dueDateStr);

  const priorityValue = formData.get("priority") as Priority;
  const priority = Object.values(Priority).includes(priorityValue)
    ? (priorityValue as Priority)
    : Priority.medium;

  const statusValue = formData.get("status") as TaskStatus;
  const status = Object.values(TaskStatus).includes(statusValue)
    ? (statusValue as TaskStatus)
    : TaskStatus.pending;

  const categoryValue = formData.get("category") as TaskCategory;
  const category = Object.values(TaskCategory).includes(categoryValue)
    ? (categoryValue as TaskCategory)
    : TaskCategory.maintenance;

  // 4) Create in DB
  const task = await prisma.task.create({
    data: {
      title,
      description,
      assignedToId,
      dueDate,
      priority,
      status,
      category,
      diveCenterId,
    },
    include: {
      assignedTo: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });

  return { success: true, data: task };
}

export async function updateTask(id: string, formData: FormData) {
  if (!id) {
    throw new Error("Missing task id");
  }

  // 1) Build up scalar fields to update
  const data: Record<string, any> = {};

  if (formData.get("title")) {
    data.title = formData.get("title") as string;
  }
  if (formData.get("description") !== null) {
    data.description = (formData.get("description") as string) || null;
  }
  if (formData.get("assignedTo")) {
    data.assignedToId = formData.get("assignedTo") as string;
  }
  if (formData.get("dueDate")) {
    const dueDateStr = formData.get("dueDate") as string;
    data.dueDate = new Date(dueDateStr);
  }
  if (formData.get("priority")) {
    const p = formData.get("priority") as Priority;
    if (Object.values(Priority).includes(p)) {
      data.priority = p;
    }
  }
  if (formData.get("status")) {
    const s = formData.get("status") as TaskStatus;
    if (Object.values(TaskStatus).includes(s)) {
      data.status = s;
    }
  }
  if (formData.get("category")) {
    const c = formData.get("category") as TaskCategory;
    if (Object.values(TaskCategory).includes(c)) {
      data.category = c;
    }
  }

  // 2) Perform update
  const updated = await prisma.task.update({
    where: { id },
    data,
    include: {
      assignedTo: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });

  return updated;
}

export async function deleteTask(id: string) {
  if (!id) {
    throw new Error("Missing task id");
  }

  await prisma.task.delete({
    where: { id },
  });
}

export async function getTaskById(id: string) {
  if (!id) {
    throw new Error("Missing task id");
  }

  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      assignedTo: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });

  return task;
}

export async function getAllTasks(diveCenterId?: string) {
  const whereClause = diveCenterId ? { diveCenterId } : {};
  const tasks = await prisma.task.findMany({
    where: whereClause,
    orderBy: { dueDate: "asc" },
    include: {
      assignedTo: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });

  return tasks as TaskWithAssignee[];
}
