import { db } from "@/lib/db";
import type { CreateUserInput } from "@/lib/validation";

/** Business logic for users. Route handlers stay thin and HTTP-only. */

export async function listUsers() {
  return db.user.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getUser(id: string) {
  return db.user.findUnique({
    where: { id },
    include: { tasks: { orderBy: { createdAt: "desc" } } },
  });
}

export async function createUser(input: CreateUserInput) {
  return db.user.create({ data: input });
}

export async function deleteUser(id: string) {
  // The user's tasks are removed automatically by the onDelete: Cascade
  // relation in the Prisma schema.
  return db.user.delete({ where: { id } });
}
