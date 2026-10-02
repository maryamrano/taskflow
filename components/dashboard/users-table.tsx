"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Users as UsersIcon } from "lucide-react";
import { useTaskFlow } from "@/context/taskflow-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState, Skeleton } from "@/components/ui/skeleton";
import { UserDialog } from "./user-dialog";

function avatarColor(name: string) {
  const palette = ["#d4a853", "#7aa7f0", "#34d399", "#f08a8a", "#c4a5f0"];
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % 997;
  return palette[hash % palette.length];
}

export function UsersTable() {
  const { users, tasks, loading, deleteUser } = useTaskFlow();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const taskCountFor = (userId: string) =>
    tasks.filter((t) => t.userId === userId).length;

  const remove = async (id: string) => {
    if (busyId) return;
    if (confirmingId !== id) {
      setConfirmingId(id);
      window.setTimeout(
        () => setConfirmingId((c) => (c === id ? null : c)),
        3200
      );
      return;
    }
    setBusyId(id);
    try {
      await deleteUser(id);
      setConfirmingId(null);
    } catch {
      // Provider already rolled the optimistic change back; just inform.
      setNotice("Couldn't delete the user. Please try again.");
      window.setTimeout(() => setNotice(null), 4000);
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-[68px] w-full" />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <>
        <EmptyState
          icon={<UsersIcon size={22} />}
          title="No users yet"
          description="Add your first teammate — every task in TaskFlow is owned by someone."
          action={
            <Button onClick={() => setDialogOpen(true)}>
              <Plus size={15} /> Add user
            </Button>
          }
        />
        <UserDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
      </>
    );
  }

  return (
    <>
      {notice && (
        <p className="mb-3 rounded-md bg-red-500/10 px-3 py-2 text-[12.5px] text-red-300">
          {notice}
        </p>
      )}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-ink-700 px-6 py-4">
          <p className="text-sm text-cream-500">
            <span className="font-mono text-cream-100">{users.length}</span>{" "}
            {users.length === 1 ? "member" : "members"}
          </p>
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus size={15} /> Add user
          </Button>
        </div>
        <ul className="divide-y divide-ink-700/70">
          {users.map((u, i) => (
            <motion.li
              key={u.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-ink-850/60"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
                style={{
                  background: `${avatarColor(u.name)}22`,
                  color: avatarColor(u.name),
                }}
              >
                {u.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14.5px] font-medium text-cream-100">
                  {u.name}
                </p>
                <p className="truncate font-mono text-[12px] text-cream-500">
                  {u.email}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[15px] text-cream-100">
                  {taskCountFor(u.id)}
                </p>
                <p className="text-[11px] uppercase tracking-[0.12em] text-cream-600">
                  tasks
                </p>
              </div>
              <button
                onClick={() => remove(u.id)}
                aria-label={`Delete ${u.name}`}
                title="Delete user (their tasks go too)"
                className={`shrink-0 rounded-md p-1.5 cursor-pointer ${
                  confirmingId === u.id
                    ? "bg-red-500/20 px-2 text-[11px] font-semibold text-red-300"
                    : "text-cream-600 hover:bg-ink-700 hover:text-red-300"
                }`}
              >
                {confirmingId === u.id ? "Confirm?" : <Trash2 size={14} />}
              </button>
            </motion.li>
          ))}
        </ul>
      </Card>
      <UserDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
}
