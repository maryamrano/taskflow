import Link from "next/link";
import { Logo } from "./logo";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Live dashboard", href: "/dashboard" },
      { label: "Task board", href: "/tasks" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "API overview", href: "#api" },
      { label: "Health check", href: "/api/health" },
      { label: "Users endpoint", href: "/api/users" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-700/70">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-500">
              An API-first task management platform. Built as DecodeLabs Full
              Stack Project 2 — backend API development, finished like a
              product.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="eyebrow text-cream-500">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-cream-300 transition-colors hover:text-gold-300"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-ink-700/70 pt-7 sm:flex-row sm:items-center">
          <p className="text-[13px] text-cream-600">
            © 2026 TaskFlow. Crafted with rigor.
          </p>
          <p className="font-mono text-[12px] text-cream-600">
            GET /api/health → 200 OK
          </p>
        </div>
      </div>
    </footer>
  );
}
