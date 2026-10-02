import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-xl border border-ink-600 bg-ink-850 px-3.5 text-sm text-cream-100",
        "placeholder:text-cream-600 transition-colors",
        "focus:border-gold-500/60 focus:outline-none focus:ring-2 focus:ring-gold-400/20",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-ink-600 bg-ink-850 px-3.5 py-2.5 text-sm text-cream-100",
        "placeholder:text-cream-600 transition-colors min-h-[96px] resize-y",
        "focus:border-gold-500/60 focus:outline-none focus:ring-2 focus:ring-gold-400/20",
        className
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-xl border border-ink-600 bg-ink-850 px-3 text-sm text-cream-100",
        "focus:border-gold-500/60 focus:outline-none focus:ring-2 focus:ring-gold-400/20",
        className
      )}
      {...props}
    />
  );
}

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-cream-500",
        className
      )}
      {...props}
    />
  );
}
