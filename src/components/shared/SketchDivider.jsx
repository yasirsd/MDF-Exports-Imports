import { RoughSketch } from "@/components/shared/RoughSketch";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/**
 * A connective "shipping lane": a hand-drawn route line with station dots that
 * draws itself across the width on scroll. Used between sections to thread the
 * export journey through the page. Decorative only.
 */
const OPS = [
  { t: "p", d: "M24 34 C 240 6, 440 54, 640 30 S 1000 8, 1176 34" },
  { t: "c", x: 24, y: 34, d: 11, fill: true },
  { t: "c", x: 640, y: 30, d: 9, fill: true },
  { t: "c", x: 1176, y: 34, d: 11, fill: true },
];

export function SketchDivider({ className, seed = 17 }) {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={cn("mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10", className)}
    >
      <div className="relative h-12 w-full text-brand-orange-bright opacity-80 md:h-16">
        <RoughSketch
          ops={OPS}
          viewBox="0 0 1200 60"
          preserve="none"
          strokeWidth={1.8}
          roughness={1.4}
          bowing={1.6}
          seed={seed}
          trigger="inview"
          draw
          drawDuration={1500}
          stagger={180}
          boil={false}
          reduced={reduced}
          className="h-full w-full overflow-visible"
        />
      </div>
    </div>
  );
}
