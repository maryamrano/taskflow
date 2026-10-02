"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Cta() {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="mesh-blob animate-drift left-1/2 top-1/2 h-[460px] w-[720px] -translate-x-1/2 -translate-y-1/2 bg-gold-500/12" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-display text-[clamp(2.2rem,5.5vw,3.8rem)] leading-[1.08] tracking-tight text-cream-100">
            Stop managing tasks.
            <br />
            Start <em className="italic text-gold-gradient">commanding</em> them.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-cream-500">
            The dashboard is live, the API is validated, and your first task is
            one click away. No signup theater — just the work.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/dashboard">
              <Button size="lg">
                Launch the dashboard <ArrowRight size={17} />
              </Button>
            </Link>
            <Link href="#api">
              <Button size="lg" variant="secondary">
                Read the API docs
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
