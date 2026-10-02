import {
  badRequest,
  created,
  notFound,
  ok,
  readJson,
  serverError,
} from "@/lib/http";
import { createTask, listTasks, userExists } from "@/lib/services/tasks";
import { createTaskSchema, taskQuerySchema, validate } from "@/lib/validation";

export async function GET(req: Request) {
  const searchParams = Object.fromEntries(
    new URL(req.url).searchParams.entries()
  );

  const parsedQuery = validate(taskQuerySchema, searchParams);
  if (!parsedQuery.ok)
    return badRequest("Invalid query parameters", {
      issues: parsedQuery.issues,
    });

  try {
    const tasks = await listTasks(parsedQuery.data);
    return ok(tasks);
  } catch {
    return serverError();
  }
}

export async function POST(req: Request) {
  const body = await readJson(req);
  if (body === null) return badRequest("Request body must be valid JSON");

  const parsed = validate(createTaskSchema, body);
  if (!parsed.ok)
    return badRequest("Validation failed", { issues: parsed.issues });

  try {
    if (!(await userExists(parsed.data.userId))) return notFound("User");
    const task = await createTask(parsed.data);
    return created(task);
  } catch {
    return serverError();
  }
}
