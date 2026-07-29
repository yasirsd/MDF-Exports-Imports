import { motion } from "motion/react";
import { ACCENT_CLASSES } from "./productAtmospheres";
import { useInViewMotion } from "./useInViewMotion";
import { cn } from "@/lib/utils";

/**
 * Numbered 01–N timeline nodes — Harvest / Journey pattern.
 * items: { title, note }[]
 */
export function ProductTimeline({ items, accent = "brand-orange", className }) {
  const { container, item } = useInViewMotion();
  const a = ACCENT_CLASSES[accent] || ACCENT_CLASSES["brand-orange"];

  return (
    <motion.ol
      className={cn("relative flex flex-col gap-0", className)}
      {...container}
    >
      {items.map((step, i) => {
        const n = String(i + 1).padStart(2, "0");
        const isLast = i === items.length - 1;
        return (
          <motion.li key={step.title || n} className="relative flex gap-4 pb-8 last:pb-0" {...item}>
            {!isLast ? (
              <span
                className="absolute left-[0.95rem] top-9 bottom-0 w-px bg-white/10"
                aria-hidden="true"
              />
            ) : null}
            <span
              className={cn(
                "relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[0.65rem] font-bold",
                a.border,
                a.bg,
                a.text
              )}
            >
              {n}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-base font-extrabold tracking-tight text-white sm:text-lg">
                {step.title}
              </p>
              {step.note ? (
                <p className="mt-1.5 text-sm leading-relaxed text-white/55">{step.note}</p>
              ) : null}
            </div>
          </motion.li>
        );
      })}
    </motion.ol>
  );
}
