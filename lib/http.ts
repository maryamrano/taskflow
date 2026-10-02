import { NextResponse } from "next/server";

/**
 * Consistent JSON envelopes for every endpoint.
 *
 * Success: { success: true, data: ... }
 * Failure: { success: false, error: { code, message, details? } }
 */

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function created<T>(data: T) {
  return ok(data, 201);
}

export function fail(
  code: string,
  message: string,
  status: number,
  details?: unknown
) {
  return NextResponse.json(
    {
      success: false,
      error: { code, message, ...(details ? { details } : {}) },
    },
    { status }
  );
}

export const badRequest = (message: string, details?: unknown) =>
  fail("BAD_REQUEST", message, 400, details);

export const notFound = (resource = "Resource") =>
  fail("NOT_FOUND", `${resource} not found`, 404);

export const conflict = (message: string) =>
  fail("CONFLICT", message, 409);

export const serverError = () =>
  fail("INTERNAL_ERROR", "Something went wrong", 500);

/** Safely parse a JSON request body. Returns null when the body is not valid JSON. */
export async function readJson(req: Request): Promise<unknown | null> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}
