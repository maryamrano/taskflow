export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface TaskUser {
  id: string;
  name: string;
  email: string;
}

export interface ApiTask {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: TaskUser;
}

export interface ApiErrorShape {
  code: string;
  message: string;
  details?: unknown;
}

export const TASK_STATUSES: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];
export const PRIORITIES: Priority[] = ["LOW", "MEDIUM", "HIGH"];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  DONE: "Done",
};
