import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-ink-700/50",
        className
      )}
    />
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-600 bg-ink-900/40 px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-800 text-gold-400">
        {icon}
      </div>
      <h3 className="font-display text-xl text-cream-100">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-cream-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
