import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="eyebrow text-gold-400">{eyebrow}</p>
        <h1 className="mt-2 font-display text-[clamp(1.9rem,4vw,2.7rem)] tracking-tight text-cream-100">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-cream-500">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}
