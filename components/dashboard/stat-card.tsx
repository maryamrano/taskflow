"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  index = 0,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sub?: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-cream-500">
            {label}
          </p>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-800 text-gold-400">
            <Icon size={17} strokeWidth={1.9} />
          </span>
        </div>
        <p className="mt-3 font-display text-[2.1rem] leading-none tracking-tight text-cream-100">
          {value}
        </p>
        {sub && <p className="mt-2 text-[12.5px] text-cream-500">{sub}</p>}
      </Card>
    </motion.div>
  );
}
