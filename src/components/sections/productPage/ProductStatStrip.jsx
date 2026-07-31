import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useInViewMotion } from "./useInViewMotion";
import { cn } from "@/lib/utils";

/**
 * Compact CountUp strip for product stages (temp, days, TSS, etc.).
 * @param {{ value: number, suffix?: string, prefix?: string, label: string, decimals?: number }[]} stats
 */
export function ProductStatStrip({ stats = [], className, accentClass = "text-gradient-gold" }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const reduced = usePrefersReducedMotion();
  const { item } = useInViewMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!stats.length) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
        stats.length === 3 && "lg:grid-cols-3",
        className
      )}
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          {...item}
          className="rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-4 text-center sm:px-5 sm:py-5"
        >
          <p className={cn("text-3xl font-extrabold tracking-tight sm:text-4xl", accentClass)}>
            {inView ? (
              reduced ? (
                <>
                  {stat.prefix}
                  {stat.value}
                  {stat.suffix}
                </>
              ) : (
                <CountUp
                  end={stat.value}
                  duration={2}
                  decimals={stat.decimals ?? 0}
                  prefix={stat.prefix ?? ""}
                  suffix={stat.suffix ?? ""}
                />
              )
            ) : (
              <span>
                {stat.prefix}0{stat.suffix}
              </span>
            )}
          </p>
          <p className="mt-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/45">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
