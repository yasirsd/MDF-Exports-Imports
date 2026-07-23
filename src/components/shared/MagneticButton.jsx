import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { Button } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/**
 * Button whose wrapper is gently attracted toward the pointer while hovered.
 * Wraps a standard <Button> so it works with `asChild` anchors and all
 * variants. Falls back to a static wrapper under reduced motion.
 */
export function MagneticButton({ children, strength = 0.3, wrapperClassName, ...buttonProps }) {
  const ref = useRef(null);
  const prefersReduced = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18 });
  const sy = useSpring(y, { stiffness: 250, damping: 18 });

  const handleMove = (e) => {
    const el = ref.current;
    if (!el || prefersReduced) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={prefersReduced ? undefined : { x: sx, y: sy }}
      className={cn("inline-flex", wrapperClassName)}
    >
      <Button {...buttonProps}>{children}</Button>
    </motion.span>
  );
}
