import { useLayoutEffect, useRef } from "react";
import { useMotionValue } from "motion/react";

/**
 * Element-scoped scroll progress (0–1) via ScrollTrigger → MotionValue.
 * Matches Motion useScroll({ target, offset }) without Motion measuring scroll.
 *
 * @param {React.RefObject<HTMLElement|null>} targetRef
 * @param {{ start?: string, end?: string, enabled?: boolean }} [options]
 *   GSAP start/end strings, e.g. start: "top top", end: "bottom top"
 */
export function useScrollTriggerProgress(
  targetRef,
  { start = "top top", end = "bottom top", enabled = true } = {}
) {
  const progress = useMotionValue(0);
  const stRef = useRef(null);

  useLayoutEffect(() => {
    if (!enabled) {
      progress.set(0);
      return undefined;
    }

    const el = targetRef.current;
    if (!el) return undefined;

    let cancelled = false;

    const setup = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap").then((m) => ({ gsap: m.gsap || m.default })),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !targetRef.current) return;

      gsap.registerPlugin(ScrollTrigger);

      // Kill any prior instance from Strict Mode remount races.
      stRef.current?.kill();
      stRef.current = ScrollTrigger.create({
        trigger: targetRef.current,
        start,
        end,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progress.set(self.progress);
        },
        onRefresh: (self) => {
          progress.set(self.progress);
        },
      });
      progress.set(stRef.current.progress);
      // Do NOT call ScrollTrigger.refresh() here — SmoothScrollProvider owns that.
    };

    setup();

    return () => {
      cancelled = true;
      stRef.current?.kill();
      stRef.current = null;
    };
  }, [targetRef, start, end, enabled, progress]);

  return progress;
}
