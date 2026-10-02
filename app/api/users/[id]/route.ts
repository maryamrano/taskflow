import { Prisma } from "@prisma/client";
import { notFound, ok, serverError } from "@/lib/http";
import { deleteUser, getUser } from "@/lib/services/users";

function isRecordNotFound(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  );
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const user = await getUser(id);
    if (!user) return notFound("User");
    return ok(user);
  } catch {
    return serverError();
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await deleteUser(id);
    return ok({ deleted: true, id });
  } catch (error) {
    if (isRecordNotFound(error)) return notFound("User");
    return serverError();
  }
}
