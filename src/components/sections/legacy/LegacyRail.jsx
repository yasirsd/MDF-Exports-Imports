import { cn } from "@/lib/utils";

/** Node column width — spine is centered on this column (no magic left offsets). */
const NODE = "w-7"; // 1.75rem / 28px

/**
 * Premium story spine — glass panel, track locked through node centers.
 */
export function LegacyRail({
  milestones,
  progress = 0,
  activeIndex = 0,
  onSelect,
  className,
}) {
  const n = Math.max(milestones.length - 1, 1);
  const fill = Math.min(1, Math.max(0, progress));

  return (
    <nav
      aria-label="Company legacy timeline"
      className={cn(
        "pointer-events-auto flex h-[min(72svh,38rem)] w-[5.75rem] flex-col rounded-2xl border border-white/10 bg-black/40 px-3 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:w-[6.5rem] lg:w-[8.75rem] lg:px-3.5 lg:py-5",
        className
      )}
    >
      <p className="mb-5 text-[0.55rem] font-bold uppercase leading-none tracking-[0.22em] text-brand-orange-bright">
        Legacy
      </p>

      <div className="relative min-h-0 flex-1">
        {/* Track column — same width as nodes, line dead-centered */}
        <div
          className={cn(
            "pointer-events-none absolute bottom-[0.875rem] top-[0.875rem] left-0",
            NODE
          )}
          aria-hidden="true"
        >
          <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 rounded-full bg-white/12" />
          <div
            className="absolute top-0 left-1/2 w-0.5 origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-brand-orange-bright via-[#ff9a40] to-brand-orange-bright/55 shadow-[0_0_12px_rgba(255,122,26,0.45)]"
            style={{ height: `${fill * 100}%` }}
          />
        </div>

        <ol className="relative z-[1] flex h-full flex-col justify-between">
          {milestones.map((m, i) => {
            const threshold = i / n;
            const completed = fill >= threshold - 0.001;
            const active = i === activeIndex;

            return (
              <li key={m.id} className="flex">
                <button
                  type="button"
                  onClick={() => onSelect?.(i)}
                  aria-current={active ? "step" : undefined}
                  aria-label={`Go to ${m.year}: ${m.title}`}
                  className="group grid w-full grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange-bright focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
                >
                  {/* Dot — no scale transform (keeps spine alignment locked) */}
                  <span
                    className={cn(
                      "relative mx-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-[border-color,background-color,box-shadow] duration-500 ease-premium",
                      active
                        ? "border-brand-orange-bright bg-brand-orange-bright shadow-[0_0_0_4px_rgba(255,122,26,0.22),0_0_18px_rgba(255,122,26,0.55)]"
                        : completed
                          ? "border-brand-orange-bright/85 bg-brand-orange-bright/35"
                          : "border-white/25 bg-[#12100e] group-hover:border-white/45"
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full transition-colors duration-500",
                        active || completed ? "bg-[#1a0e06]" : "bg-white/35"
                      )}
                    />
                  </span>

                  <span
                    className={cn(
                      "truncate text-left text-[0.62rem] font-bold uppercase leading-none tracking-[0.1em] transition-colors duration-500 sm:text-[0.65rem]",
                      active
                        ? "text-brand-orange-bright"
                        : completed
                          ? "text-white/75"
                          : "text-white/35 hover:text-white/55"
                    )}
                  >
                    {m.year}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
