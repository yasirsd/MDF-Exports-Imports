import { cn } from "@/lib/utils";

/** ChapterPill DNA. Cream outline with optional accent override. */
export function ProductPill({ children, className, accent }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/25 bg-white/[0.03] px-3.5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/75 sm:text-xs",
        accent,
        className
      )}
    >
      {children}
    </span>
  );
}
