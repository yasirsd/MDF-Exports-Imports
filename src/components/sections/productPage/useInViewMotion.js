import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Light motion helpers for product stages.
 * When reduced-motion is on, returns static (no stagger / opacity fade).
 */
export function useInViewMotion() {
  const prefersReduced = usePrefersReducedMotion();

  const container = prefersReduced
    ? {}
    : {
        initial: "hidden",
        whileInView: "show",
        viewport: { once: true, amount: 0.2 },
        variants: {
          hidden: {},
          show: { transition: { staggerChildren: 0.08 } },
        },
      };

  const item = prefersReduced
    ? {}
    : {
        variants: {
          hidden: { opacity: 0, y: 16 },
          show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
          },
        },
      };

  return { container, item, prefersReduced };
}
