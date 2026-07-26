import { RoughSketch } from "@/components/shared/RoughSketch";
import { getStoryDoodle } from "@/components/sections/story/storyDoodleOps";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/**
 * Hand-drawn story accent.
 * `tone`: "accent" = bright orange (hero doodles), "ghost" = soft cream (Ismail-style ambient).
 */
export function StoryDoodle({
  id = "sprout",
  className,
  seed = 11,
  boil = false,
  strokeWidth = 1.75,
  tone = "accent",
}) {
  const reduced = usePrefersReducedMotion();
  const doodle = getStoryDoodle(id);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none",
        tone === "ghost" ? "text-white/55" : "text-brand-orange-bright",
        className
      )}
    >
      <RoughSketch
        ops={doodle.ops}
        viewBox={doodle.viewBox}
        strokeWidth={strokeWidth}
        roughness={1.15}
        bowing={1.05}
        seed={seed}
        trigger="inview"
        draw
        drawDuration={1000}
        boil={boil && !reduced}
        reduced={reduced}
        className="h-full w-full overflow-visible drop-shadow-[0_0_12px_rgba(255,122,26,0.25)]"
      />
    </div>
  );
}
