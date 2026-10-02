"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ApiTask } from "@/lib/types";

function lastFourteenDays(tasks: ApiTask[]) {
  const days: { label: string; created: number }[] = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      created: tasks.filter((t) => t.createdAt.slice(0, 10) === key).length,
    });
  }
  return days;
}

const DONUT_COLORS = ["#98948a", "#d4a853", "#34d399"];

function DarkTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-ink-600 bg-ink-900 px-3.5 py-2.5 shadow-xl">
      {label && (
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-cream-500">
          {label}
        </p>
      )}
      {payload.map((p: any, i: number) => (
        <p key={i} className="font-mono text-[13px] text-cream-100">
          {p.name ? `${p.name}: ` : ""}
          <span className="text-gold-300">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export function OverviewCharts({ tasks }: { tasks: ApiTask[] }) {
  const areaData = useMemo(() => lastFourteenDays(tasks), [tasks]);

  const donutData = useMemo(
    () => [
      { name: "To do", value: tasks.filter((t) => t.status === "TODO").length },
      { name: "In progress", value: tasks.filter((t) => t.status === "IN_PROGRESS").length },
      { name: "Done", value: tasks.filter((t) => t.status === "DONE").length },
    ],
    [tasks]
  );

  const total = donutData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Throughput</CardTitle>
          <CardDescription>Tasks created per day · last 14 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
                <defs>
                  <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4a853" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#d4a853" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#26262f" strokeDasharray="3 6" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#6f6c65", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  interval={2}
                />
                <YAxis
                  tick={{ fill: "#6f6c65", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<DarkTooltip />} cursor={{ stroke: "#383842" }} />
                <Area
                  type="monotone"
                  dataKey="created"
                  stroke="#d4a853"
                  strokeWidth={2.2}
                  fill="url(#goldFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status mix</CardTitle>
          <CardDescription>Where your work sits right now</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={88}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {donutData.map((_, i) => (
                    <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<DarkTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-3xl text-cream-100">{total}</span>
              <span className="text-[11px] uppercase tracking-[0.16em] text-cream-500">
                tasks
              </span>
            </div>
          </div>
          <div className="mt-2 space-y-2">
            {donutData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2.5 text-cream-300">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
                  />
                  {d.name}
                </span>
                <span className="font-mono text-cream-500">{d.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
