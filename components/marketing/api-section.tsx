"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const endpoints = [
  { method: "GET", path: "/api/health", note: "Service status" },
  { method: "GET", path: "/api/users", note: "List users" },
  { method: "POST", path: "/api/users", note: "Create user · validated" },
  { method: "GET", path: "/api/tasks?status=&q=", note: "Filtered task list" },
  { method: "POST", path: "/api/tasks", note: "Create task · validated" },
  { method: "PATCH", path: "/api/tasks/[id]", note: "Partial update" },
  { method: "DELETE", path: "/api/tasks/[id]", note: "Delete task" },
];

const methodColor: Record<string, string> = {
  GET: "text-emerald-300 bg-emerald-400/10",
  POST: "text-gold-300 bg-gold-400/10",
  PATCH: "text-sky-300 bg-sky-400/10",
  DELETE: "text-red-300 bg-red-400/10",
};

export function ApiSection() {
  return (
    <section id="api" className="relative overflow-hidden py-28">
      <div className="mesh-blob left-[-120px] top-1/3 h-[420px] w-[420px] bg-indigo-500/10" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow text-gold-400">The engine room</p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.2rem)] leading-tight tracking-tight text-cream-100">
              One API. <em className="italic text-gold-gradient">Zero</em> surprises.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-cream-500">
              Consistent envelopes, correct status codes, and validation errors
              that tell you exactly which field failed. Automate against it,
              script against it, build a second client on it — it won&apos;t
              flinch.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {endpoints.map((e) => (
                <span
                  key={`${e.method}-${e.path}`}
                  className="inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-900/70 px-3.5 py-1.5 text-[12.5px]"
                >
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10.5px] font-bold tracking-wide ${methodColor[e.method]}`}
                  >
                    {e.method}
                  </span>
                  <code className="border-0 bg-transparent p-0 text-cream-300">
                    {e.path}
                  </code>
                </span>
              ))}
            </div>
            <Link
              href="/dashboard"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gold-300 transition-colors hover:text-gold-200"
            >
              See it driving the live dashboard <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/90 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]"
          >
            <div className="flex items-center gap-2 border-b border-ink-700 px-5 py-3.5">
              <span className="h-2.5 w-2.5 rounded-full bg-ink-600" />
              <span className="h-2.5 w-2.5 rounded-full bg-ink-600" />
              <span className="h-2.5 w-2.5 rounded-full bg-gold-500" />
              <span className="ml-3 font-mono text-xs text-cream-600">
                POST /api/tasks
              </span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-[12.8px] leading-relaxed">
              <code>
                <span className="text-cream-600">{"// request"}</span>
                {"\n"}
                <span className="text-cream-300">{"{"}</span>
                {"\n"}
                {"  "}
                <span className="text-gold-300">&quot;title&quot;</span>
                <span className="text-cream-500">: </span>
                <span className="text-emerald-300">&quot;Finish Project 2 API&quot;</span>
                <span className="text-cream-500">,</span>
                {"\n"}
                {"  "}
                <span className="text-gold-300">&quot;priority&quot;</span>
                <span className="text-cream-500">: </span>
                <span className="text-emerald-300">&quot;HIGH&quot;</span>
                <span className="text-cream-500">,</span>
                {"\n"}
                {"  "}
                <span className="text-gold-300">&quot;userId&quot;</span>
                <span className="text-cream-500">: </span>
                <span className="text-emerald-300">&quot;cmur5gnag0000…&quot;</span>
                {"\n"}
                <span className="text-cream-300">{"}"}</span>
                {"\n\n"}
                <span className="text-cream-600">{"// 201 Created"}</span>
                {"\n"}
                <span className="text-cream-300">{"{"}</span>
                {"\n"}
                {"  "}
                <span className="text-gold-300">&quot;success&quot;</span>
                <span className="text-cream-500">: </span>
                <span className="text-sky-300">true</span>
                <span className="text-cream-500">,</span>
                {"\n"}
                {"  "}
                <span className="text-gold-300">&quot;data&quot;</span>
                <span className="text-cream-500">: </span>
                <span className="text-cream-300">{"{"}</span>
                {"\n"}
                {"    "}
                <span className="text-gold-300">&quot;id&quot;</span>
                <span className="text-cream-500">: </span>
                <span className="text-emerald-300">&quot;cmur5gncs0002…&quot;</span>
                <span className="text-cream-500">,</span>
                {"\n"}
                {"    "}
                <span className="text-gold-300">&quot;status&quot;</span>
                <span className="text-cream-500">: </span>
                <span className="text-emerald-300">&quot;TODO&quot;</span>
                {"\n"}
                {"  "}
                <span className="text-cream-300">{"}"}</span>
                {"\n"}
                <span className="text-cream-300">{"}"}</span>
              </code>
            </pre>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
