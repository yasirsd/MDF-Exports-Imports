import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LazyImage } from "@/components/shared/LazyImage";
import { PRODUCT_ATMOSPHERES } from "@/components/sections/products/productAtmospheres";
import { easePremium } from "@/lib/motion";
import { unsplash, unsplashLQ, unsplashSrcSet } from "@/lib/images";
import { cn } from "@/lib/utils";

const BG_WIDTH = 1600;
const BG_QUALITY = 84;
const KEN_BURNS_MS = 5500;

function bgSrc(imageId) {
  return unsplash(imageId, BG_WIDTH, BG_QUALITY);
}

/**
 * Product stage background.
 * Below lg: full-bleed photo + bottom scrim for overlay copy.
 * lg+: right-anchored photo pane with left copy column.
 * Absolutely positioned — never affects section height.
 *
 * Crossfade is driven by AnimatePresence on a single keyed child. When
 * `activeIndex` changes, the old child runs `exit` (fade to 0) while the new
 * child runs `initial → animate` (fade to 1); both overlap for `duration`
 * seconds giving a clean crossfade. Motion cleans up the outgoing node
 * automatically — no manual `previousIndex` bookkeeping, no closure-staleness
 * risk on `onAnimationComplete`.
 */
export function ProductBackground({ products, activeIndex, reduced = false, className }) {
  const prefetchedRef = useRef(new Set());

  const active = products[activeIndex];

  useEffect(() => {
    if (reduced || !active?.image || typeof window === "undefined") return undefined;

    const nextIndex = (activeIndex + 1) % products.length;
    const next = products[nextIndex];
    if (!next?.image) return undefined;

    const url = bgSrc(next.image);
    if (prefetchedRef.current.has(url)) return undefined;

    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      const img = new Image();
      img.decoding = "async";
      try {
        img.fetchPriority = "low";
      } catch {
        /* older browsers */
      }
      img.src = url;
      prefetchedRef.current.add(url);
    };

    const idle =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(run, { timeout: 1200 })
        : window.setTimeout(run, 400);

    return () => {
      cancelled = true;
      if (typeof window.cancelIdleCallback === "function" && typeof idle === "number") {
        window.cancelIdleCallback(idle);
      } else {
        window.clearTimeout(idle);
      }
    };
  }, [active?.image, activeIndex, products, reduced]);

  const duration = reduced ? 0 : 0.85;
  // Mobile: full-bleed. lg+: right-anchored pane. Mask swaps via CSS media query.
  const photoPane = cn(
    "product-photo-bleed absolute overflow-hidden inset-0",
    "lg:inset-y-[8%] lg:right-[5%] lg:left-auto lg:w-[50%]"
  );

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <div className="product-stage-bleed absolute inset-0 bg-[#0a0806]">
        {/* Desktop: dark wash from the left copy column into the photo */}
        <div className="absolute inset-0 hidden bg-gradient-to-r from-[#0a0806] via-[#0a0806]/90 to-transparent lg:block" />
        {/* Mobile: subtle top-to-bottom darkening so overlay type holds */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0806]/55 via-transparent to-[#0a0806]/30 lg:hidden" />

        <AnimatePresence initial={false}>
          {active ? (
            <motion.div
              key={active.id}
              className={photoPane}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration, ease: easePremium }}
            >
              <div
                className={cn("absolute inset-0 origin-center", !reduced && "product-ken-burns")}
                style={reduced ? undefined : { animationDuration: `${KEN_BURNS_MS}ms` }}
              >
                <LazyImage
                  src={bgSrc(active.image)}
                  srcSet={unsplashSrcSet(active.image, [720, 960, 1280, 1600, 1920], BG_QUALITY)}
                  sizes="(min-width:1024px) 50vw, 100vw"
                  lqip={unsplashLQ(active.image)}
                  alt=""
                  fallbackLabel={active.name}
                  eager
                  className="absolute inset-0 h-full w-full"
                  imgClassName="h-full w-full object-cover object-center"
                />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Mobile: stronger bottom scrim behind overlay panels */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/90 via-black/55 via-45% to-transparent to-75% lg:hidden"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-28 bg-gradient-to-b from-black/60 to-transparent lg:hidden"
          aria-hidden="true"
        />

        {/* Desktop: soft seam into the copy column */}
        <div
          className="pointer-events-none absolute inset-y-0 left-[38%] z-[1] hidden w-[16%] bg-gradient-to-r from-[#0a0806] via-[#0a0806]/75 to-transparent lg:block"
          aria-hidden="true"
        />

        {products.map((product, index) => {
          const atmosphere = PRODUCT_ATMOSPHERES[product.id];
          if (!atmosphere) return null;
          return (
            <motion.div
              key={`atm-${product.id}`}
              className="pointer-events-none absolute inset-0 z-[1]"
              initial={false}
              animate={{ opacity: index === activeIndex ? 1 : 0 }}
              transition={{ duration, ease: easePremium }}
              style={{ background: atmosphere.glow }}
            />
          );
        })}
      </div>
    </div>
  );
}
