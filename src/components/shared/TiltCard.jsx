import { useEffect, useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/**
 * 3D tilt-on-hover card driven by pointer position.
 *
 * Critical details for the effect to actually render:
 * - `transformPerspective` must be set on the SAME element as rotateX/Y (Motion)
 * - Ancestors must not leave a lingering CSS `transform` (flattens 3D)
 * - Coarse-pointer / reduced-motion fall back to a static wrapper
 */
export function TiltCard({
  children,
  className,
  max = 10,
  perspective = 900,
  glare = true,
  ...props
}) {
  const ref = useRef(null);
  const prefersReduced = usePrefersReducedMotion();
  const [canTilt, setCanTilt] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    // Fine pointer + real hover = mouse/trackpoint desktop
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanTilt(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), {
    stiffness: 260,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), {
    stiffness: 260,
    damping: 22,
  });

  const glareX = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);
  const glareBg = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, rgba(255,255,255,0.22), transparent 45%)`;

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  if (prefersReduced || !canTilt) {
    return (
      <div className={cn("relative", className)} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{
        rotateX,
        rotateY,
        // Required — invalid `[transform-perspective:…]` class was a no-op before
        transformPerspective: perspective,
        transformStyle: "preserve-3d",
      }}
      className={cn("relative will-change-transform", className)}
      {...props}
    >
      {children}
      {glare ? (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
          style={{ background: glareBg }}
        />
      ) : null}
    </motion.div>
  );
}
