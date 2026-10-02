import { ok } from "@/lib/http";

export async function GET() {
  return ok({
    status: "ok",
    service: "taskflow-api",
    version: "1.0.0",
    time: new Date().toISOString(),
  });
}
