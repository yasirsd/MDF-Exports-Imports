import { RoughSketch } from "@/components/shared/RoughSketch";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/**
 * A hand-drawn annotation (circle / underline / arrow) that draws itself in
 * when scrolled into view. Overlays a `relative` parent to emphasise the
 * element it wraps. Decorative only. Uses `preserve="none"` so the sketch
 * stretches to the wrapped content while `non-scaling-stroke` keeps the line
 * weight constant.
 */
const PRESETS = {
  circle: {
    viewBox: "0 0 120 100",
    preserve: "none",
    position: "-inset-x-4 -inset-y-3",
    ops: [{ t: "e", x: 60, y: 50, w: 108, h: 86 }],
  },
  underline: {
    viewBox: "0 0 120 16",
    preserve: "none",
    position: "-bottom-3 left-0 right-0 h-3",
    ops: [{ t: "p", d: "M4 9 q 26 -7 54 -3 t 58 -2" }],
  },
  arrow: {
    viewBox: "0 0 120 60",
    preserve: "none",
    position: "inset-0",
    ops: [
      { t: "p", d: "M6 12 C 44 8, 86 20, 108 44" },
      { t: "p", d: "M108 44 L92 40 M108 44 L102 28" },
    ],
  },
};

export function SketchAnnotation({
  variant = "underline",
  className,
  seed = 7,
  strokeWidth = 2.4,
}) {
  const reduced = usePrefersReducedMotion();
  const preset = PRESETS[variant] ?? PRESETS.underline;

  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute z-0", preset.position, className)}
    >
      <RoughSketch
        ops={preset.ops}
        viewBox={preset.viewBox}
        preserve={preset.preserve}
        strokeWidth={strokeWidth}
        roughness={1.6}
        bowing={2}
        seed={seed}
        trigger="inview"
        draw
        drawDuration={700}
        stagger={140}
        boil={false}
        reduced={reduced}
        className="h-full w-full overflow-visible"
      />
    </span>
  );
}
