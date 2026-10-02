import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-gold-200 via-gold-400 to-gold-600 font-display text-[19px] leading-none text-ink-950 shadow-[0_6px_20px_-4px_rgba(212,168,83,0.5)]">
        T
      </span>
      <span className="font-display text-[22px] tracking-tight text-cream-100">
        TaskFlow
      </span>
    </span>
  );
}
