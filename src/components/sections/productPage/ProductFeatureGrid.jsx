import { motion } from "motion/react";
import { ACCENT_CLASSES } from "./productAtmospheres";
import { useInViewMotion } from "./useInViewMotion";
import { cn } from "@/lib/utils";

/**
 * Accent-border metric / feature cards — faux-glass, not GlassCard grids.
 * items: { label, value, note? }[]
 */
export function ProductFeatureGrid({
  items,
  accent = "brand-orange",
  columns = 2,
  className,
}) {
  const { container, item } = useInViewMotion();
  const a = ACCENT_CLASSES[accent] || ACCENT_CLASSES["brand-orange"];
  const col =
    columns === 3
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : columns === 4
        ? "grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2";

  return (
    <motion.ul className={cn("grid gap-3", col, className)} {...container}>
      {items.map((f) => (
        <motion.li
          key={f.label}
          className={cn(
            "rounded-xl border px-4 py-4 sm:px-5 sm:py-5",
            a.border,
            a.bg
          )}
          {...item}
        >
          <p
            className={cn(
              "text-[0.55rem] font-bold uppercase tracking-[0.14em]",
              a.text
            )}
          >
            {f.label}
          </p>
          <p className="mt-2 text-base font-extrabold tracking-tight text-white sm:text-lg">
            {f.value}
          </p>
          {f.note ? (
            <p className="mt-1.5 text-sm leading-relaxed text-white/50">{f.note}</p>
          ) : null}
        </motion.li>
      ))}
    </motion.ul>
  );
}
