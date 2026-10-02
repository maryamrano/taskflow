import type { ApiTask, ApiUser, Priority, TaskStatus } from "./types";

/**
 * Typed client for the TaskFlow REST API (same Next.js project, /api/*).
 * Every response is unwrapped from the { success, data } envelope;
 * failures throw ApiError with the server's code + message.
 */
export class ApiError extends Error {
  code: string;
  status?: number;
  details?: unknown;

  constructor(
    message: string,
    opts: { code: string; status?: number; details?: unknown }
  ) {
    super(message);
    this.name = "ApiError";
    this.code = opts.code;
    this.status = opts.status;
    this.details = opts.details;
  }
}

interface Envelope<T> {
  success?: boolean;
  data?: T;
  error?: { code: string; message: string; details?: unknown };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });

  let json: Envelope<T> | null = null;
  try {
    json = (await res.json()) as Envelope<T>;
  } catch {
    json = null;
  }

  if (!res.ok || !json?.success) {
    const err = json?.error ?? {
      code: "REQUEST_FAILED",
      message: `Request failed with status ${res.status}`,
    };
    throw new ApiError(err.message, {
      code: err.code,
      status: res.status,
      details: err.details,
    });
  }
  return json.data as T;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  userId: string;
}

export type UpdateTaskInput = Partial<
  Pick<CreateTaskInput, "title" | "description" | "status" | "priority">
>;

export const api = {
  health: () =>
    request<{ status: string; service: string; version: string; time: string }>(
      "/api/health"
    ),

  listUsers: () => request<ApiUser[]>("/api/users"),

  getUser: (id: string) =>
    request<ApiUser & { tasks: ApiTask[] }>(`/api/users/${id}`),

  createUser: (input: { name: string; email: string }) =>
    request<ApiUser>("/api/users", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  deleteUser: (id: string) =>
    request<{ deleted: boolean; id: string }>(`/api/users/${id}`, {
      method: "DELETE",
    }),

  listTasks: (query?: { status?: TaskStatus; userId?: string; q?: string }) => {
    const sp = new URLSearchParams();
    if (query?.status) sp.set("status", query.status);
    if (query?.userId) sp.set("userId", query.userId);
    if (query?.q) sp.set("q", query.q);
    const qs = sp.toString();
    return request<ApiTask[]>(`/api/tasks${qs ? `?${qs}` : ""}`);
  },

  getTask: (id: string) => request<ApiTask>(`/api/tasks/${id}`),

  createTask: (input: CreateTaskInput) =>
    request<ApiTask>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  updateTask: (id: string, patch: UpdateTaskInput) =>
    request<ApiTask>(`/api/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    }),

  deleteTask: (id: string) =>
    request<{ deleted: boolean; id: string }>(`/api/tasks/${id}`, {
      method: "DELETE",
    }),
};
