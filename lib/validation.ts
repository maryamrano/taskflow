import { z } from "zod";

/** Every input that enters the API is validated here before touching the database. */

export const taskStatusSchema = z.enum(["TODO", "IN_PROGRESS", "DONE"]);
export const prioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be at most 80 characters"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .max(160),
});

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(140, "Title must be at most 140 characters"),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be at most 2000 characters")
    .optional(),
  status: taskStatusSchema.optional(),
  priority: prioritySchema.optional(),
  userId: z.string().min(1, "userId is required"),
});

export const updateTaskSchema = createTaskSchema
  .partial()
  .omit({ userId: true });

export const taskQuerySchema = z.object({
  status: taskStatusSchema.optional(),
  userId: z.string().optional(),
  q: z.string().trim().max(140).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQuery = z.infer<typeof taskQuerySchema>;

export type ValidationIssue = { path: string; message: string };

/** Validate unknown input against a Zod schema. Never throws. */
export function validate<T>(
  schema: z.ZodSchema<T>,
  input: unknown
): { ok: true; data: T } | { ok: false; issues: ValidationIssue[] } {
  const result = schema.safeParse(input);
  if (result.success) return { ok: true, data: result.data };
  return {
    ok: false,
    issues: result.error.issues.map((issue) => ({
      path: issue.path.join(".") || "(root)",
      message: issue.message,
    })),
  };
}
