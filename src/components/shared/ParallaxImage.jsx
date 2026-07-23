import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { LazyImage } from "@/components/shared/LazyImage";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/**
 * Image that drifts vertically as it scrolls through the viewport.
 * @param {{ strength?: number }} props strength in px of parallax travel
 */
export function ParallaxImage({
  src,
  srcSet,
  sizes,
  lqip,
  alt,
  fallbackLabel,
  className,
  imgClassName,
  strength = 60,
  eager = false,
}) {
  const ref = useRef(null);
  const prefersReduced = usePrefersReducedMotion();
  // Reduce transform distance on small screens to keep motion subtle and
  // GPU-light on mobile, per the responsive motion strategy.
  const isSmall =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches;
  const effectiveStrength = isSmall ? Math.round(strength * 0.45) : strength;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [-effectiveStrength, effectiveStrength]
  );

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div style={prefersReduced ? undefined : { y }} className="h-[112%] w-full">
        <LazyImage
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          lqip={lqip}
          alt={alt}
          eager={eager}
          fallbackLabel={fallbackLabel}
          className="h-full w-full"
          imgClassName={cn("scale-110", imgClassName)}
        />
      </motion.div>
    </div>
  );
}
