import { useEffect, useRef } from "react";
import { useMotionValue, useTransform } from "motion/react";
import { useDocumentScroll } from "@/hooks/useDocumentScroll";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Element-scoped scroll progress (0–1) from Lenis/document scroll.
 * No GSAP / ScrollTrigger — safe for product routes.
 *
 * 0 ≈ frame entering from below the viewport; 1 ≈ frame leaving above.
 */
export function useProductImageParallax(
  frameRef,
  { enabled, from = "10%", to = "-10%", overscan = 0.14 } = {}
) {
  const reduced = usePrefersReducedMotion();
  const active = enabled !== false && !reduced;
  const { scrollY } = useDocumentScroll();
  const progress = useMotionValue(0.5);

  useEffect(() => {
    if (!active) {
      progress.set(0.5);
      return undefined;
    }

    const update = () => {
      const el = frameRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Travel distance: enter bottom → exit top
      const span = vh + rect.height;
      if (span <= 0) return;
      const p = (vh - rect.top) / span;
      progress.set(Math.min(1, Math.max(0, p)));
    };

    const unsub = scrollY.on("change", update);
    update();

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    if (ro && frameRef.current) ro.observe(frameRef.current);
    window.addEventListener("resize", update, { passive: true });

    return () => {
      unsub();
      ro?.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [frameRef, active, scrollY, progress]);

  const y = useTransform(progress, [0, 1], [from, to]);
  const inset = `${Math.round(overscan * 100)}%`;

  return { active, y, overscan, inset };
}

/**
 * Convenience: ref + parallax values for a product image frame.
 */
export function useProductFrameParallax(options) {
  const frameRef = useRef(null);
  const parallax = useProductImageParallax(frameRef, options);
  return { frameRef, ...parallax };
}
