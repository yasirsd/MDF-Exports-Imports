import { motion, useSpring } from "motion/react";
import { useDocumentScroll } from "@/hooks/useDocumentScroll";

/** Slim gradient progress bar fixed to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useDocumentScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 36,
    // Larger restDelta = fewer spring ticks near idle (same visual bar).
    restDelta: 0.01,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-brand-red via-brand-gold to-brand-red"
    />
  );
}
