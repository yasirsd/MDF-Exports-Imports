import { cn } from "@/lib/utils";

/**
 * Sticky horizontal category rail with counts.
 * Touch-scroll on mobile; tablist semantics for a11y.
 */
export function ProductFilters({
  categories,
  counts,
  active,
  onChange,
  resultLabel,
}) {
  return (
    <div className="sticky top-[4.5rem] z-20 -mx-5 border-y border-border/70 bg-background/90 px-5 py-3 backdrop-blur-md sm:-mx-0 sm:rounded-2xl sm:border sm:px-4">
      <div
        className="touch-scroll flex gap-2 overflow-x-auto pb-1"
        role="tablist"
        aria-label="Filter products by category"
      >
        {categories.map((cat) => {
          const selected = active === cat;
          const count = counts?.[cat] ?? 0;
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="product-catalogue-panel"
              id={`product-tab-${cat.toLowerCase()}`}
              onClick={() => onChange(cat)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-300 ease-premium",
                selected
                  ? "border-brand-orange-bright bg-brand-orange-bright text-[#1a0e06] shadow-[0_8px_24px_rgba(255,122,26,0.28)]"
                  : "border-border bg-surface text-muted-foreground hover:border-brand-orange-bright/40 hover:text-foreground"
              )}
            >
              {cat}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[0.65rem] font-bold tabular-nums",
                  selected ? "bg-black/10 text-[#1a0e06]" : "bg-surface-2 text-muted-foreground"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
      {resultLabel ? (
        <p className="mt-2.5 text-xs font-medium text-muted-foreground">{resultLabel}</p>
      ) : null}
    </div>
  );
}
