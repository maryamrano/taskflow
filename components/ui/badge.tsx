import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { Priority, TaskStatus } from "@/lib/types";

const statusStyles: Record<TaskStatus, string> = {
  TODO: "bg-ink-700/60 text-cream-300 border-ink-600",
  IN_PROGRESS: "bg-gold-400/10 text-gold-300 border-gold-500/30",
  DONE: "bg-emerald-400/10 text-emerald-300 border-emerald-500/30",
};

const priorityStyles: Record<Priority, string> = {
  LOW: "bg-ink-700/60 text-cream-500 border-ink-600",
  MEDIUM: "bg-sky-400/10 text-sky-300 border-sky-500/30",
  HIGH: "bg-red-400/10 text-red-300 border-red-500/30",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status?: TaskStatus;
  priority?: Priority;
}

export function Badge({ status, priority, className, ...props }: BadgeProps) {
  const label = status
    ? { TODO: "To do", IN_PROGRESS: "In progress", DONE: "Done" }[status]
    : priority;
  const style = status ? statusStyles[status] : priority ? priorityStyles[priority] : "";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5",
        "text-[11px] font-semibold tracking-wide uppercase",
        style,
        className
      )}
      {...props}
    >
      {label}
    </span>
  );
}
