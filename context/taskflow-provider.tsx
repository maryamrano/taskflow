"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, ApiError, type CreateTaskInput, type UpdateTaskInput } from "@/lib/api";
import type { ApiTask, ApiUser } from "@/lib/types";

interface DashboardStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  completion: number;
}

interface TaskFlowContextValue {
  tasks: ApiTask[];
  users: ApiUser[];
  loading: boolean;
  error: string | null;
  stats: DashboardStats;
  refresh: () => Promise<void>;
  createTask: (input: CreateTaskInput) => Promise<ApiTask>;
  updateTask: (id: string, patch: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  createUser: (input: { name: string; email: string }) => Promise<ApiUser>;
  clearError: () => void;
}

const TaskFlowContext = createContext<TaskFlowContextValue | null>(null);

/**
 * Central state for the whole application. The REST API is the source of
 * truth; this provider mirrors it locally and applies optimistic updates
 * so every page reacts instantly, then reconciles with the server.
 */
export function TaskFlowProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedTasks, fetchedUsers] = await Promise.all([
        api.listTasks(),
        api.listUsers(),
      ]);
      setTasks(fetchedTasks);
      setUsers(fetchedUsers);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not reach the TaskFlow API. Is the server running?"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createTask = useCallback(async (input: CreateTaskInput) => {
    const task = await api.createTask(input);
    setTasks((prev) => [task, ...prev]);
    return task;
  }, []);

  const updateTask = useCallback(async (id: string, patch: UpdateTaskInput) => {
    // Optimistic: apply locally first, reconcile with server response.
    let previous: ApiTask[] = [];
    setTasks((prev) => {
      previous = prev;
      return prev.map((t) =>
        t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t
      );
    });
    try {
      const updated = await api.updateTask(id, patch);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setTasks(previous); // roll back
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    let previous: ApiTask[] = [];
    setTasks((prev) => {
      previous = prev;
      return prev.filter((t) => t.id !== id);
    });
    try {
      await api.deleteTask(id);
    } catch (err) {
      setTasks(previous); // roll back
      throw err;
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    let prevUsers: ApiUser[] = [];
    let prevTasks: ApiTask[] = [];
    setUsers((prev) => {
      prevUsers = prev;
      return prev.filter((u) => u.id !== id);
    });
    // The database cascades the delete to the user's tasks; mirror that locally.
    setTasks((prev) => {
      prevTasks = prev;
      return prev.filter((t) => t.userId !== id);
    });
    try {
      await api.deleteUser(id);
    } catch (err) {
      setUsers(prevUsers); // roll back
      setTasks(prevTasks);
      throw err;
    }
  }, []);

  const createUser = useCallback(async (input: { name: string; email: string }) => {
    const user = await api.createUser(input);
    setUsers((prev) => [user, ...prev]);
    return user;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const stats = useMemo<DashboardStats>(() => {
    const todo = tasks.filter((t) => t.status === "TODO").length;
    const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const done = tasks.filter((t) => t.status === "DONE").length;
    const total = tasks.length;
    return {
      total,
      todo,
      inProgress,
      done,
      completion: total === 0 ? 0 : Math.round((done / total) * 100),
    };
  }, [tasks]);

  const value = useMemo(
    () => ({
      tasks,
      users,
      loading,
      error,
      stats,
      refresh,
      createTask,
      updateTask,
      deleteTask,
      deleteUser,
      createUser,
      clearError,
    }),
    [tasks, users, loading, error, stats, refresh, createTask, updateTask, deleteTask, deleteUser, createUser, clearError]
  );

  return (
    <TaskFlowContext.Provider value={value}>
      {children}
    </TaskFlowContext.Provider>
  );
}

export function useTaskFlow() {
  const ctx = useContext(TaskFlowContext);
  if (!ctx) throw new Error("useTaskFlow must be used inside TaskFlowProvider");
  return ctx;
}
