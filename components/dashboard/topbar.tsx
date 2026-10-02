"use client";

import { useState } from "react";
import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskDialog } from "./task-dialog";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-ink-700/70 bg-ink-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-5 sm:px-8 lg:px-10">
          <button
            onClick={onMenu}
            aria-label="Open menu"
            className="rounded-lg p-2 text-cream-300 hover:bg-ink-800 lg:hidden cursor-pointer"
          >
            <Menu size={20} />
          </button>
          <div className="hidden items-center gap-2 lg:flex">
            <span className="font-mono text-[12px] text-cream-600">
              taskflow / console
            </span>
          </div>
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus size={15} /> New task
          </Button>
        </div>
      </header>
      <TaskDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
}
