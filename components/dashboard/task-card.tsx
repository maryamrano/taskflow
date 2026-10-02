"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Pencil, Trash2 } from "lucide-react";
import { useTaskFlow } from "@/context/taskflow-provider";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, type ApiTask, type TaskStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "yesterday" : `${days}d ago`;
}

const NEXT_STATUS: Record<TaskStatus, TaskStatus | null> = {
  TODO: "IN_PROGRESS",
  IN_PROGRESS: "DONE",
  DONE: null,
};

export function TaskCard({
  task,
  onEdit,
}: {
  task: ApiTask;
  onEdit: (task: ApiTask) => void;
}) {
  const { updateTask, deleteTask } = useTaskFlow();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const flashNotice = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(null), 4000);
  };

  const initials = task.user
    ? task.user.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const advance = async () => {
    const next = NEXT_STATUS[task.status];
    if (!next || busy) return;
    setBusy(true);
    try {
      await updateTask(task.id, { status: next });
    } catch {
      // Provider already rolled the optimistic change back; just inform.
      flashNotice("Couldn't move the task. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (busy) return;
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3200);
      return;
    }
    setBusy(true);
    try {
      await deleteTask(task.id);
    } catch {
      // Optimistic removal was rolled back; show inline notice, never crash.
      flashNotice(
        "Couldn't delete the task — it may already be gone. Refresh the page if it stays."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-xl border border-ink-700 bg-ink-900 p-4 transition-colors hover:border-ink-600"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-[14px] font-medium leading-snug text-cream-100">
          {task.title}
        </h4>
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onEdit(task)}
            aria-label="Edit task"
            className="rounded-md p-1.5 text-cream-500 hover:bg-ink-700 hover:text-cream-100 cursor-pointer"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={remove}
            aria-label="Delete task"
            className={cn(
              "rounded-md p-1.5 cursor-pointer",
              confirming
                ? "bg-red-500/20 px-2 text-[11px] font-semibold text-red-300"
                : "text-cream-500 hover:bg-ink-700 hover:text-red-300"
            )}
          >
            {confirming ? "Confirm?" : <Trash2 size={14} />}
          </button>
        </div>
      </div>

      {task.description && (
        <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-cream-500">
          {task.description}
        </p>
      )}

      {notice && (
        <p className="mt-2 rounded-md bg-red-500/10 px-2 py-1 text-[11.5px] leading-snug text-red-300">
          {notice}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Badge priority={task.priority} />
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[11.5px] text-cream-600">{timeAgo(task.updatedAt)}</span>
          <span
            title={task.user ? `${task.user.name} (${task.user.email})` : "Unassigned"}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-400/15 text-[10px] font-bold text-gold-300"
          >
            {initials}
          </span>
        </div>
      </div>

      {NEXT_STATUS[task.status] && (
        <button
          onClick={advance}
          disabled={busy}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-ink-600 py-1.5 text-[12px] font-medium text-cream-500 transition-colors hover:border-gold-500/50 hover:text-gold-300 disabled:opacity-40 cursor-pointer"
        >
          <Check size={13} /> Move to {STATUS_LABELS[NEXT_STATUS[task.status]!].toLowerCase()}
        </button>
      )}
    </motion.div>
  );
}
