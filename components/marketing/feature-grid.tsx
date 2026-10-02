"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Braces,
  Layers,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Braces,
    title: "API-first by design",
    desc: "Every pixel in the dashboard is powered by the same documented REST API you can call yourself. No hidden endpoints, no magic.",
    span: "md:col-span-2",
  },
  {
    icon: ShieldCheck,
    title: "Validation at the gate",
    desc: "Zod schemas reject bad input with field-level errors before it ever touches the database.",
    span: "",
  },
  {
    icon: Zap,
    title: "Optimistic everything",
    desc: "Moves, edits and deletes apply instantly in the UI, then reconcile with the server. It feels local because it is.",
    span: "",
  },
  {
    icon: BarChart3,
    title: "Live analytics",
    desc: "Completion rates, status distribution and throughput — rendered from your real data, not a demo fixture.",
    span: "md:col-span-2",
  },
  {
    icon: Layers,
    title: "Layered architecture",
    desc: "Thin route handlers, framework-agnostic services, one Prisma client. Easy to read, easy to extend, easy to test.",
    span: "",
  },
  {
    icon: Sparkles,
    title: "Midnight-grade polish",
    desc: "A considered dark aesthetic with gold accents, serif display type and motion that respects your attention.",
    span: "",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="eyebrow text-gold-400">Why TaskFlow</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.2rem)] leading-tight tracking-tight text-cream-100">
            Engineered like infrastructure,
            <br />
            finished like <em className="italic text-gold-gradient">jewelry.</em>
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-cream-500">
            Most task tools bolt an API on as an afterthought. TaskFlow was
            built the other way around — the API came first, and the interface
            is its most demanding client.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                delay: (i % 3) * 0.1,
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`group rounded-2xl border border-ink-700 bg-ink-900/70 p-7 transition-colors duration-300 hover:border-gold-500/40 hover:bg-ink-850 ${f.span}`}
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-ink-800 text-gold-400 transition-colors duration-300 group-hover:bg-gold-400/15">
                <f.icon size={20} strokeWidth={1.8} />
              </div>
              <h3 className="text-[17px] font-semibold tracking-tight text-cream-100">
                {f.title}
              </h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-cream-500">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
