"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Braces, CheckCircle2, Circle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function PreviewCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 48, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.45, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="animate-float-slow relative mx-auto mt-16 w-full max-w-3xl"
    >
      <div className="glass overflow-hidden rounded-2xl shadow-[0_60px_140px_-30px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-2 border-b border-ink-700 px-5 py-3.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ink-600" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-600" />
          <span className="h-2.5 w-2.5 rounded-full bg-gold-500" />
          <span className="ml-3 text-xs text-cream-600">taskflow — dashboard</span>
        </div>
        <div className="grid grid-cols-3 gap-3 p-5">
          {[
            { title: "To do", icon: <Circle size={13} className="text-cream-500" />, items: ["Design review brief", "API rate limits"] },
            { title: "In progress", icon: <Loader size={13} className="text-gold-400" />, items: ["Finish Project 2 API"] },
            { title: "Done", icon: <CheckCircle2 size={13} className="text-emerald-400" />, items: ["Spec sign-off", "DB migration"] },
          ].map((col) => (
            <div key={col.title} className="rounded-xl bg-ink-850/80 p-3">
              <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-cream-500">
                {col.icon} {col.title}
              </div>
              <div className="space-y-2">
                {col.items.map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-ink-700 bg-ink-900 px-3 py-2.5 text-[12.5px] text-cream-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mesh-blob left-1/2 top-1/2 -z-10 h-72 w-[130%] -translate-x-1/2 -translate-y-1/2 bg-gold-500/15" />
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-40">
      {/* Ambient meshes */}
      <div className="mesh-blob animate-drift -top-40 left-[8%] h-[480px] w-[480px] bg-gold-500/12" />
      <div className="mesh-blob right-[4%] top-24 h-[380px] w-[380px] bg-indigo-500/12" />
      <div className="mesh-blob left-[38%] top-[560px] h-[300px] w-[420px] bg-emerald-500/8" />
      <div className="bg-blueprint absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
          <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-ink-600 bg-ink-900/70 px-4 py-1.5 text-cream-300">
            <Braces size={13} className="text-gold-400" />
            API-first task management
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="mx-auto mt-7 max-w-4xl font-display text-[clamp(2.9rem,7vw,5.4rem)] leading-[1.04] tracking-tight text-cream-100"
        >
          The command center for{" "}
          <em className="text-gold-gradient not-italic font-display italic">
            focused
          </em>{" "}
          teams.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-cream-500"
        >
          TaskFlow pairs a rigorously validated REST API with a premium
          dashboard — so your team&apos;s work is always structured,
          searchable, and one request away.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link href="/dashboard">
            <Button size="lg">
              Open live dashboard <ArrowRight size={17} />
            </Button>
          </Link>
          <Link href="#api">
            <Button size="lg" variant="secondary">
              Explore the API
            </Button>
          </Link>
        </motion.div>

        <PreviewCard />
      </div>
    </section>
  );
}
