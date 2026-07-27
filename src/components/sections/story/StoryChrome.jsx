import { cn } from "@/lib/utils";

/** Chapter pill — cream outline like Ismail, orange active accent. */
export function ChapterPill({ children, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/25 bg-white/[0.03] px-3.5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/75 sm:text-xs",
        className
      )}
    >
      {children}
    </span>
  );
}

/** Right-edge chapter rail — keyboard-reachable on all breakpoints. */
export function ChapterRail({ chapters, active, onSelect }) {
  return (
    <nav
      aria-label="Story chapters"
      className="absolute right-2 top-1/2 z-30 flex -translate-y-1/2 flex-col items-end gap-2 sm:right-3 sm:gap-3 xl:right-5"
    >
      {chapters.map((c, i) => {
        const isActive = i === active;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect?.(i)}
            aria-current={isActive ? "true" : undefined}
            aria-label={`Chapter ${c.step}: ${c.rail}`}
            className="group flex min-h-9 min-w-9 items-center justify-end gap-2.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange-bright"
          >
            <span
              className={cn(
                "max-w-[7.5rem] truncate whitespace-nowrap rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] transition-all duration-300 ease-premium",
                isActive
                  ? "bg-black/70 text-brand-orange-bright opacity-100"
                  : "hidden text-white/35 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 lg:inline"
              )}
            >
              {c.step} {c.rail}
            </span>
            <span
              className={cn(
                "block rounded-full transition-all duration-300 ease-premium",
                isActive
                  ? "h-[2px] w-7 bg-brand-orange-bright shadow-[0_0_10px_rgba(255,122,26,0.7)]"
                  : "h-2 w-2 bg-white/35 group-hover:bg-white/70 group-focus-visible:bg-white/70"
              )}
            />
          </button>
        );
      })}
    </nav>
  );
}

/** Bottom-center scroll hint. */
export function ScrollHint({ step, total, progress = 0 }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-5 z-30 flex justify-center sm:bottom-7">
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/70 px-4 py-2">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white/45">
          Scroll / keys
        </span>
        <span className="relative h-px w-12 overflow-hidden rounded-full bg-white/15 sm:w-16">
          <span
            className="absolute inset-y-0 left-0 rounded-full bg-brand-orange-bright transition-[width] duration-300 ease-premium"
            style={{ width: `${Math.max(8, progress * 100)}%` }}
          />
        </span>
        <span className="text-[0.65rem] font-semibold tabular-nums tracking-[0.14em] text-white/65">
          {step} / {String(total).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

/** Bottom-left compact counter. */
export function ChapterCounter({ step, total, className }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute bottom-5 left-5 z-30 text-sm font-semibold tabular-nums tracking-wide text-white/45 sm:bottom-7 sm:left-8",
        className
      )}
    >
      <span className="text-brand-orange-bright">{step}</span>
      <span className="mx-1.5 text-white/20">/</span>
      <span>{String(total).padStart(2, "0")}</span>
    </div>
  );
}
