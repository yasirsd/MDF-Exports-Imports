import { memo } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { LazyImage } from "@/components/shared/LazyImage";
import { TiltCard } from "@/components/shared/TiltCard";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { unsplash, unsplashLQ, unsplashSrcSet } from "@/lib/images";
import { cn } from "@/lib/utils";

/**
 * Catalogue index card with working 3D tilt.
 *
 * Enter animation uses opacity only (no translateY) so the wrapper does not
 * leave a CSS transform that flattens the child's 3D rendering context.
 */
export const ProductCard = memo(function ProductCard({
  product,
  onOpen,
  eager = false,
  index = 0,
  className,
}) {
  const reduced = usePrefersReducedMotion();

  return (
    // Opacity-only enter — NEVER animate `y`/`x` here or 3D tilt dies
    <motion.div
      layout={false}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index, 6) * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn("h-full [perspective:1000px]", className)}
    >
      <TiltCard
        className="group/tilt h-full rounded-[1.5rem]"
        max={9}
        perspective={1000}
        glare
      >
        <article className="relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-border bg-surface shadow-soft transition-[box-shadow,border-color] duration-500 ease-premium group-hover/tilt:border-brand-orange-bright/30 group-hover/tilt:shadow-[0_24px_55px_rgba(20,14,10,0.16)]">
          <button
            type="button"
            onClick={() => onOpen?.(product)}
            className="flex h-full w-full flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange-bright focus-visible:ring-offset-2"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <LazyImage
                src={unsplash(product.image, 900, 88)}
                srcSet={unsplashSrcSet(product.image, [384, 480, 640, 768, 960], 88)}
                sizes="(min-width:1280px) 22vw, (min-width:1024px) 28vw, (min-width:640px) 45vw, 90vw"
                lqip={unsplashLQ(product.image)}
                alt={`${product.name} — export quality`}
                fallbackLabel={product.name}
                eager={eager}
                className="h-full w-full"
                imgClassName={cn(
                  "transition-transform duration-700 ease-premium",
                  !reduced && "group-hover/tilt:scale-[1.05]"
                )}
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
                aria-hidden="true"
              />
              <div className="absolute left-3 top-3">
                <span className="inline-flex rounded-full border border-white/25 bg-black/40 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-md">
                  {product.category}
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                <h3 className="text-lg font-extrabold text-white drop-shadow-sm sm:text-xl">
                  {product.name}
                </h3>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-orange-bright text-[#1a0e06] shadow-soft transition-transform duration-500 ease-premium group-hover/tilt:scale-105">
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">View {product.name} specs</span>
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-4 sm:p-5">
              <p className="text-sm leading-relaxed text-muted-foreground">{product.blurb}</p>
              <p className="mt-3 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-brand-orange-bright">
                View specs
              </p>
            </div>
          </button>
        </article>
      </TiltCard>
    </motion.div>
  );
});
