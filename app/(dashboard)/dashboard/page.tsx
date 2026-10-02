"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Gauge,
  Loader,
  RefreshCw,
} from "lucide-react";
import { useTaskFlow } from "@/context/taskflow-provider";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { OverviewCharts } from "@/components/dashboard/overview-charts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function OverviewPage() {
  const { tasks, loading, error, stats, refresh } = useTaskFlow();
  const recent = tasks.slice(0, 5);

  if (loading) {
    return (
      <div>
        <PageHeader eyebrow="Console" title="Overview" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[132px]" />
          ))}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <Skeleton className="h-[340px]" />
          <Skeleton className="h-[340px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader eyebrow="Console" title="Overview" />
        <Card className="border-red-900/50">
          <CardContent className="flex flex-col items-center py-14 text-center">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-950/60 text-red-300">
              <AlertTriangle size={22} />
            </span>
            <h3 className="font-display text-xl text-cream-100">
              Couldn&apos;t load the dashboard
            </h3>
            <p className="mt-1.5 max-w-sm text-sm text-cream-500">{error}</p>
            <Button variant="secondary" className="mt-5" onClick={() => refresh()}>
              <RefreshCw size={15} /> Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Console"
        title="Overview"
        description="The pulse of your team — live from the TaskFlow API."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ClipboardList} label="Total tasks" value={stats.total} index={0} sub={`${stats.todo} waiting to start`} />
        <StatCard icon={Loader} label="In progress" value={stats.inProgress} index={1} sub="Actively being worked on" />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.done} index={2} sub="Shipped and done" />
        <StatCard icon={Gauge} label="Completion" value={`${stats.completion}%`} index={3} sub="Of all tasks ever created" />
      </div>

      <div className="mt-4">
        {tasks.length === 0 ? (
          <EmptyState
            icon={<ClipboardList size={22} />}
            title="A blank canvas"
            description="No tasks yet. Create your first task from the top bar and watch this dashboard come alive."
            action={
              <Link href="/tasks">
                <Button>Go to task board</Button>
              </Link>
            }
          />
        ) : (
          <OverviewCharts tasks={tasks} />
        )}
      </div>

      {recent.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent activity</CardTitle>
              <Link href="/tasks" className="text-[13px] font-medium text-gold-300 hover:text-gold-200">
                View board →
              </Link>
            </div>
          </CardHeader>
          <CardContent className="!pt-2">
            <ul className="divide-y divide-ink-700/70">
              {recent.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[14px] text-cream-100">{t.title}</p>
                    <p className="text-[12px] text-cream-600">
                      {t.user?.name ?? "Unassigned"}
                    </p>
                  </div>
                  <Badge status={t.status} />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
