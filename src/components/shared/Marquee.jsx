import { cn } from "@/lib/utils";

/**
 * Infinite horizontal marquee. Duplicates children for a seamless loop.
 * Pauses on hover and respects reduced motion (via global CSS override).
 */
export function Marquee({ children, className, itemClassName, reverse = false }) {
  return (
    <div className={cn("group relative flex overflow-hidden mask-fade-x", className)}>
      {[0, 1].map((dup) => (
        <div
          key={dup}
          aria-hidden={dup === 1}
          className={cn(
            "flex shrink-0 items-center gap-8 pr-8 animate-marquee group-hover:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]",
            itemClassName
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
