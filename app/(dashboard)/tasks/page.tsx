"use client";

import { useMemo, useState } from "react";
import { ClipboardList, Plus, Search } from "lucide-react";
import { useTaskFlow } from "@/context/taskflow-provider";
import { useDebounce } from "@/hooks/use-debounce";
import { PageHeader } from "@/components/dashboard/page-header";
import { TaskBoard } from "@/components/dashboard/task-board";
import { TaskDialog } from "@/components/dashboard/task-dialog";
import { Button } from "@/components/ui/button";
import { EmptyState, Skeleton } from "@/components/ui/skeleton";
import { Input, Select } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  PRIORITIES,
  TASK_STATUSES,
  STATUS_LABELS,
  type ApiTask,
  type Priority,
  type TaskStatus,
} from "@/lib/types";

export default function TasksPage() {
  const { tasks, loading } = useTaskFlow();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("ALL");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "ALL">("ALL");
  const [editing, setEditing] = useState<ApiTask | null>(null);
  const [creating, setCreating] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return tasks.filter((t) => {
      if (statusFilter !== "ALL" && t.status !== statusFilter) return false;
      if (priorityFilter !== "ALL" && t.priority !== priorityFilter) return false;
      if (
        q &&
        !t.title.toLowerCase().includes(q) &&
        !(t.description ?? "").toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [tasks, debouncedQuery, statusFilter, priorityFilter]);

  const filtering =
    query.trim() !== "" || statusFilter !== "ALL" || priorityFilter !== "ALL";

  return (
    <div>
      <PageHeader
        eyebrow="Console"
        title="Task board"
        description="Every card below is a live API resource. Move, edit, delete — the server stays in sync."
        action={
          <Button onClick={() => setCreating(true)}>
            <Plus size={15} /> New task
          </Button>
        }
      />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[380px]" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={22} />}
          title="No tasks yet"
          description="Create your first task and it will appear here, validated by the API before it saves."
          action={
            <Button onClick={() => setCreating(true)}>
              <Plus size={15} /> Create task
            </Button>
          }
        />
      ) : (
        <>
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-600"
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks…"
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {(["ALL", ...TASK_STATUSES] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors cursor-pointer",
                    statusFilter === s
                      ? "border-gold-500/60 bg-gold-400/12 text-gold-300"
                      : "border-ink-600 bg-ink-900 text-cream-500 hover:text-cream-100"
                  )}
                >
                  {s === "ALL" ? "All" : STATUS_LABELS[s]}
                </button>
              ))}
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as Priority | "ALL")}
                className="w-auto"
                aria-label="Filter by priority"
              >
                <option value="ALL" className="bg-ink-900">Any priority</option>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p} className="bg-ink-900">
                    {p.charAt(0) + p.slice(1).toLowerCase()} priority
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={<Search size={22} />}
              title="No matches"
              description="Nothing fits these filters. Try a different search or clear them."
              action={
                <Button
                  variant="secondary"
                  onClick={() => {
                    setQuery("");
                    setStatusFilter("ALL");
                    setPriorityFilter("ALL");
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          ) : (
            <TaskBoard
              tasks={filtered}
              onEdit={(t) => setEditing(t)}
            />
          )}
          {filtering && filtered.length > 0 && (
            <p className="mt-4 text-center font-mono text-[12px] text-cream-600">
              showing {filtered.length} of {tasks.length} tasks
            </p>
          )}
        </>
      )}

      <TaskDialog
        open={creating}
        onClose={() => setCreating(false)}
      />
      <TaskDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        task={editing}
      />
    </div>
  );
}
