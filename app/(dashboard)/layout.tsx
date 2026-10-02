"use client";

import { useState, type ReactNode } from "react";
import { TaskFlowProvider } from "@/context/taskflow-provider";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <TaskFlowProvider>
      <div className="min-h-screen bg-ink-950 text-cream-100">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="lg:pl-[264px]">
          <Topbar onMenu={() => setMobileOpen(true)} />
          <main className="mx-auto max-w-[1240px] px-5 py-8 sm:px-8 lg:px-10">
            {children}
          </main>
        </div>
      </div>
    </TaskFlowProvider>
  );
}
