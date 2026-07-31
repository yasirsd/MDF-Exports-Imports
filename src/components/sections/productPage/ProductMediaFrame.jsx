import { motion } from "motion/react";
import { LazyImage } from "@/components/shared/LazyImage";
import { useProductFrameParallax } from "./useProductImageParallax";
import { cn } from "@/lib/utils";

/**
 * Mid-page product still — rounded depth frame with subtle scroll parallax.
 */
export function ProductMediaFrame({
  src,
  srcSet,
  sizes = "(min-width:1024px) 42vw, 90vw",
  lqip,
  alt,
  fallbackLabel,
  caption,
  aspect = "aspect-[4/5]",
  className,
  imgClassName,
  parallax = true,
}) {
  const { frameRef, active, y, inset } = useProductFrameParallax({
    enabled: parallax,
    from: "12%",
    to: "-12%",
    overscan: 0.16,
  });

  return (
    <div className={cn("relative mx-auto w-full max-w-md lg:max-w-none", className)}>
      <div
        className="absolute -inset-4 rounded-[1.75rem] opacity-50 blur-2xl"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,122,26,0.22), rgba(239,35,60,0.1), transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-2 translate-x-1.5 translate-y-2 rounded-[1.35rem] bg-black/45 blur-[1px] sm:translate-x-2 sm:translate-y-2.5"
        aria-hidden="true"
      />
      <figure
        ref={frameRef}
        className={cn(
          "relative overflow-hidden rounded-[1.5rem] border border-white/18 bg-black/40",
          aspect,
          "shadow-[0_16px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.14)]"
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 z-[2] ring-1 ring-inset ring-white/20"
          aria-hidden="true"
        />
        {active ? (
          <motion.div
            className="absolute will-change-transform"
            style={{ top: `-${inset}`, bottom: `-${inset}`, left: 0, right: 0, y }}
          >
            <LazyImage
              src={src}
              srcSet={srcSet}
              sizes={sizes}
              lqip={lqip}
              alt={alt}
              fallbackLabel={fallbackLabel}
              className="absolute inset-0 h-full w-full"
              imgClassName={cn("object-cover object-center", imgClassName)}
            />
          </motion.div>
        ) : (
          <LazyImage
            src={src}
            srcSet={srcSet}
            sizes={sizes}
            lqip={lqip}
            alt={alt}
            fallbackLabel={fallbackLabel}
            className="absolute inset-0 h-full w-full"
            imgClassName={cn("object-cover object-center", imgClassName)}
          />
        )}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {caption ? (
          <figcaption className="absolute bottom-4 left-4 right-4 z-[3]">
            {caption.kicker ? (
              <p className="text-[0.55rem] font-bold uppercase tracking-[0.16em] text-white/50">
                {caption.kicker}
              </p>
            ) : null}
            {caption.title ? (
              <p className="mt-1 text-base font-extrabold text-white sm:text-lg">{caption.title}</p>
            ) : null}
          </figcaption>
        ) : null}
      </figure>
    </div>
  );
}
