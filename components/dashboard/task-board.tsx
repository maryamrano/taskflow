"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Circle, Loader, CheckCircle2 } from "lucide-react";
import { TaskCard } from "./task-card";
import { STATUS_LABELS, TASK_STATUSES, type ApiTask, type TaskStatus } from "@/lib/types";

const columnMeta: Record<TaskStatus, { icon: React.ReactNode; accent: string }> = {
  TODO: { icon: <Circle size={14} className="text-cream-500" />, accent: "border-ink-700" },
  IN_PROGRESS: { icon: <Loader size={14} className="text-gold-400" />, accent: "border-gold-500/30" },
  DONE: { icon: <CheckCircle2 size={14} className="text-emerald-400" />, accent: "border-emerald-500/25" },
};

export function TaskBoard({
  tasks,
  onEdit,
}: {
  tasks: ApiTask[];
  onEdit: (task: ApiTask) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {TASK_STATUSES.map((status) => {
        const columnTasks = tasks.filter((t) => t.status === status);
        const meta = columnMeta[status];
        return (
          <div
            key={status}
            className={`flex flex-col rounded-2xl border bg-ink-900/40 p-3 ${meta.accent}`}
          >
            <div className="mb-3 flex items-center justify-between px-1.5 pt-1">
              <span className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-cream-300">
                {meta.icon} {STATUS_LABELS[status]}
              </span>
              <span className="rounded-full bg-ink-800 px-2 py-0.5 font-mono text-[11px] text-cream-500">
                {columnTasks.length}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-2.5">
              <AnimatePresence initial={false}>
                {columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onEdit={onEdit} />
                ))}
              </AnimatePresence>
              {columnTasks.length === 0 && (
                <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-ink-700 px-4 py-10 text-center text-[12.5px] text-cream-600">
                  Nothing here yet.
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
