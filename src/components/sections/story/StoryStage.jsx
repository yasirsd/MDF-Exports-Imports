import { cn } from "@/lib/utils";

/**
 * Consistent chapter stage frame. Clears navbar + bottom chrome,
 * keeps content vertically balanced inside the pinned 100svh panel.
 */
export function StoryStage({ children, className, split = false }) {
  return (
    <div
      className={cn(
        "relative mx-auto flex h-full w-full max-w-[90rem] flex-col justify-center",
        // Tighter on short mobile viewports so chapters fit without inner scroll
        "px-[clamp(1.25rem,4vw,3rem)] pt-[max(5.5rem,12svh)] pb-[max(4.5rem,10svh)]",
        "lg:pt-24 lg:pb-20",
        split && "lg:block lg:px-0 lg:pt-0 lg:pb-0",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Shared editorial title block used across chapters. */
export function StoryCopy({
  pill,
  kicker,
  title,
  copy,
  children,
  className,
}) {
  return (
    <div className={cn("relative z-10 max-w-xl", className)}>
      {pill}
      {kicker ? (
        <p className="mt-5 text-sm font-medium text-white/50">{kicker}</p>
      ) : null}
      <h2 className="mt-3 text-[clamp(2.1rem,4.4vw,3.75rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-white">
        {title}
      </h2>
      {copy ? (
        <p className="mt-5 max-w-md text-[clamp(0.95rem,1.1vw,1.125rem)] leading-relaxed text-white/65">
          {copy}
        </p>
      ) : null}
      {children}
    </div>
  );
}
