import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import type {
  CreateTaskInput,
  TaskQuery,
  UpdateTaskInput,
} from "@/lib/validation";

/** Business logic for tasks. Route handlers stay thin and HTTP-only. */

export async function listTasks(query: TaskQuery) {
  const where: Prisma.TaskWhereInput = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.userId ? { userId: query.userId } : {}),
    ...(query.q ? { title: { contains: query.q, mode: "insensitive" }
 } : {}),
  };

  return db.task.findMany({
    where,
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTask(id: string) {
  return db.task.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}

export async function createTask(input: CreateTaskInput) {
  return db.task.create({
    data: {
      title: input.title,
      description: input.description,
      status: input.status ?? "TODO",
      priority: input.priority ?? "MEDIUM",
      userId: input.userId,
    },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}

export async function updateTask(id: string, input: UpdateTaskInput) {
  return db.task.update({
    where: { id },
    data: input,
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}

export async function deleteTask(id: string) {
  return db.task.delete({ where: { id } });
}

export async function userExists(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  return user !== null;
}
