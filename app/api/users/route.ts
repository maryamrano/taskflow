import { Prisma } from "@prisma/client";
import {
  badRequest,
  conflict,
  created,
  ok,
  readJson,
  serverError,
} from "@/lib/http";
import { createUser, listUsers } from "@/lib/services/users";
import { createUserSchema, validate } from "@/lib/validation";

export async function GET() {
  try {
    const users = await listUsers();
    return ok(users);
  } catch {
    return serverError();
  }
}

export async function POST(req: Request) {
  const body = await readJson(req);
  if (body === null) return badRequest("Request body must be valid JSON");

  const parsed = validate(createUserSchema, body);
  if (!parsed.ok)
    return badRequest("Validation failed", { issues: parsed.issues });

  try {
    const user = await createUser(parsed.data);
    return created(user);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return conflict("Email already in use");
    }
    return serverError();
  }
}
