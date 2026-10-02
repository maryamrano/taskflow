import { Prisma } from "@prisma/client";
import {
  badRequest,
  notFound,
  ok,
  readJson,
  serverError,
} from "@/lib/http";
import { deleteTask, getTask, updateTask } from "@/lib/services/tasks";
import { updateTaskSchema, validate } from "@/lib/validation";

type RouteParams = { params: Promise<{ id: string }> };

function isRecordNotFound(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  );
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const task = await getTask(id);
    if (!task) return notFound("Task");
    return ok(task);
  } catch {
    return serverError();
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  const { id } = await params;

  const body = await readJson(req);
  if (body === null) return badRequest("Request body must be valid JSON");

  const parsed = validate(updateTaskSchema, body);
  if (!parsed.ok)
    return badRequest("Validation failed", { issues: parsed.issues });

  try {
    const task = await updateTask(id, parsed.data);
    return ok(task);
  } catch (error) {
    if (isRecordNotFound(error)) return notFound("Task");
    return serverError();
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    await deleteTask(id);
    return ok({ deleted: true, id });
  } catch (error) {
    if (isRecordNotFound(error)) return notFound("Task");
    return serverError();
  }
}
