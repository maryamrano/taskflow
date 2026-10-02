"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import { useTaskFlow } from "@/context/taskflow-provider";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import {
  PRIORITIES,
  STATUS_LABELS,
  TASK_STATUSES,
  type ApiTask,
  type Priority,
  type TaskStatus,
} from "@/lib/types";

function extractIssues(err: unknown): string[] {
  if (err instanceof ApiError) {
    const details = err.details as
      | { issues?: { path: string; message: string }[] }
      | undefined;
    if (details?.issues?.length) {
      return details.issues.map((i) => `${i.path}: ${i.message}`);
    }
    return [err.message];
  }
  return ["Something went wrong. Please try again."];
}

export function TaskDialog({
  open,
  onClose,
  task,
}: {
  open: boolean;
  onClose: () => void;
  task?: ApiTask | null;
}) {
  const { users, createTask, updateTask } = useTaskFlow();
  const editing = !!task;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [userId, setUserId] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(task?.title ?? "");
      setDescription(task?.description ?? "");
      setStatus(task?.status ?? "TODO");
      setPriority(task?.priority ?? "MEDIUM");
      setUserId(task?.userId ?? users[0]?.id ?? "");
      setErrors([]);
    }
  }, [open, task, users]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSaving(true);
    try {
      if (editing && task) {
        await updateTask(task.id, {
          title: title.trim(),
          description: description.trim() || undefined,
          status,
          priority,
        });
      } else {
        await createTask({
          title: title.trim(),
          description: description.trim() || undefined,
          status,
          priority,
          userId,
        });
      }
      onClose();
    } catch (err) {
      setErrors(extractIssues(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={editing ? "Edit task" : "New task"}
      description={
        editing
          ? "Update the details below. Changes save instantly."
          : "Create a task — it validates against the API before saving."
      }
      wide
    >
      <form onSubmit={submit} className="space-y-4">
        {errors.length > 0 && (
          <div className="rounded-xl border border-red-900/60 bg-red-950/40 px-4 py-3">
            {errors.map((msg, i) => (
              <p key={i} className="text-[13px] text-red-300">
                {msg}
              </p>
            ))}
          </div>
        )}

        <div>
          <Label htmlFor="task-title">Title</Label>
          <Input
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Finish Project 2 API"
            required
            minLength={3}
          />
        </div>

        <div>
          <Label htmlFor="task-desc">Description</Label>
          <Textarea
            id="task-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional context, acceptance criteria…"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="task-status">Status</Label>
            <Select
              id="task-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            >
              {TASK_STATUSES.map((s) => (
                <option key={s} value={s} className="bg-ink-900">
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="task-priority">Priority</Label>
            <Select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p} className="bg-ink-900">
                  {p.charAt(0) + p.slice(1).toLowerCase()}
                </option>
              ))}
            </Select>
          </div>
          {!editing && (
            <div>
              <Label htmlFor="task-user">Assignee</Label>
              <Select
                id="task-user"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              >
                <option value="" className="bg-ink-900" disabled>
                  Select…
                </option>
                {users.map((u) => (
                  <option key={u.id} value={u.id} className="bg-ink-900">
                    {u.name}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2.5 pt-1">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving || (!editing && users.length === 0)}>
            {saving ? "Saving…" : editing ? "Save changes" : "Create task"}
          </Button>
        </div>

        {!editing && users.length === 0 && (
          <p className="text-[12.5px] text-cream-500">
            Add a user first — every task needs an owner.
          </p>
        )}
      </form>
    </Dialog>
  );
}
