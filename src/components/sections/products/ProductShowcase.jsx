import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ProductBackground } from "@/components/sections/products/ProductBackground";
import { ProductFeatured } from "@/components/sections/products/ProductFeatured";
import { ProductSelectorCard } from "@/components/sections/products/ProductSelectorCard";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { products } from "@/lib/constants";
import { cn } from "@/lib/utils";

const AUTOPLAY_DELAY_MS = 5500;
const SWIPE_THRESHOLD_PX = 40;

const UNDERLINE_SPRING = {
  type: "spring",
  stiffness: 320,
  damping: 16,
  mass: 0.75,
};

/** Slower width spring so the bar stretches while it travels. */
const UNDERLINE_WIDTH_SPRING = {
  type: "spring",
  stiffness: 200,
  damping: 14,
  mass: 0.85,
};

function isInteractiveTarget(target) {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest("button, a, input, textarea, select, [role='tab'], [role='button']")
  );
}

/**
 * Full-bleed catalogue showcase with soft edge dissolve into the page.
 * Below lg: cinematic photo backdrop + overlay copy.
 * lg+: left copy / right photo.
 * Embla lives in a dedicated viewport so snaps work; Autoplay hover/focus
 * is wired to the visible stage via rootNode. All four text panels stay mounted for SEO.
 */
export function ProductShowcase({ onViewSpecs }) {
  const baseId = useId();
  const reduced = usePrefersReducedMotion();
  const stageRef = useRef(null);
  const tabListRef = useRef(null);
  const swipeRef = useRef({ x: 0, y: 0, tracking: false });
  const [underline, setUnderline] = useState({ left: 0, width: 0, ready: false });
  const prevUnderlineRef = useRef({ left: 0, width: 0 });

  const syncUnderline = useCallback(() => {
    const list = tabListRef.current;
    if (!list) return;
    const active = list.querySelector('[role="tab"][aria-selected="true"]');
    if (!active) return;

    const listBox = list.getBoundingClientRect();
    const box = active.getBoundingClientRect();
    const width = box.width * 0.72;
    const left = box.left - listBox.left + (box.width - width) / 2;
    const next = { left, width, ready: true };

    const prev = prevUnderlineRef.current;
    const travel = Math.abs(left - prev.left);
    prevUnderlineRef.current = { left, width };

    if (prev.width > 0 && travel > 4) {
      setUnderline({ left, width: width + travel * 0.65, ready: true });
      requestAnimationFrame(() => setUnderline(next));
    } else {
      setUnderline(next);
    }
  }, []);

  const plugins = useMemo(
    () =>
      reduced
        ? []
        : [
            Autoplay({
              delay: AUTOPLAY_DELAY_MS,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
              stopOnFocusIn: true,
              rootNode: () => stageRef.current,
            }),
          ],
    [reduced]
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", watchDrag: false },
    plugins
  );
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return undefined;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  const resetAutoplay = useCallback(() => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (autoplay && typeof autoplay.reset === "function") {
      autoplay.reset();
    }
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    resetAutoplay();
  }, [emblaApi, resetAutoplay]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    resetAutoplay();
  }, [emblaApi, resetAutoplay]);

  const scrollToIndex = useCallback(
    (index) => {
      if (emblaApi) {
        emblaApi.scrollTo(index);
        resetAutoplay();
      } else {
        setSelected(index);
      }
    },
    [emblaApi, resetAutoplay]
  );

  const selectById = useCallback(
    (id) => {
      const index = products.findIndex((p) => p.id === id);
      if (index >= 0) scrollToIndex(index);
    },
    [scrollToIndex]
  );

  const onTabListKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        scrollToIndex((selected + 1) % products.length);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        scrollToIndex((selected - 1 + products.length) % products.length);
      } else if (e.key === "Home") {
        e.preventDefault();
        scrollToIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        scrollToIndex(products.length - 1);
      }
    },
    [selected, scrollToIndex]
  );

  // Touch swipe on the visible stage (Embla root is hidden / non-interactive)
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduced) return undefined;

    const onStart = (e) => {
      if (e.touches.length !== 1) return;
      if (isInteractiveTarget(e.target)) {
        swipeRef.current.tracking = false;
        return;
      }
      swipeRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        tracking: true,
      };
    };

    const onEnd = (e) => {
      if (!swipeRef.current.tracking || e.changedTouches.length !== 1) {
        swipeRef.current.tracking = false;
        return;
      }
      const dx = e.changedTouches[0].clientX - swipeRef.current.x;
      const dy = e.changedTouches[0].clientY - swipeRef.current.y;
      swipeRef.current.tracking = false;
      if (Math.abs(dx) < SWIPE_THRESHOLD_PX || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) scrollNext();
      else scrollPrev();
    };

    const onCancel = () => {
      swipeRef.current.tracking = false;
    };

    stage.addEventListener("touchstart", onStart, { passive: true });
    stage.addEventListener("touchend", onEnd, { passive: true });
    stage.addEventListener("touchcancel", onCancel, { passive: true });
    return () => {
      stage.removeEventListener("touchstart", onStart);
      stage.removeEventListener("touchend", onEnd);
      stage.removeEventListener("touchcancel", onCancel);
    };
  }, [reduced, scrollNext, scrollPrev]);

  useEffect(() => {
    const product = products[selected];
    if (!product) return;
    const el = document.getElementById(`${baseId}-tab-${product.id}`);
    if (el && document.activeElement?.getAttribute("role") === "tab") {
      el.focus();
    }
  }, [selected, baseId]);

  useLayoutEffect(() => {
    syncUnderline();
  }, [selected, syncUnderline]);

  useEffect(() => {
    const list = tabListRef.current;
    if (!list || typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(() => syncUnderline());
    ro.observe(list);
    window.addEventListener("resize", syncUnderline);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", syncUnderline);
    };
  }, [syncUnderline]);

  const activeProduct = products[selected];
  const pad = "px-[clamp(1.25rem,4vw,2.5rem)]";
  const stageH = "h-[min(100svh,40rem)] lg:h-[min(88svh,52rem)]";

  return (
    <div
      ref={stageRef}
      className={cn("group/showcase relative overflow-hidden bg-background", stageH)}
    >
      <div
        ref={emblaRef}
        className="pointer-events-none absolute left-0 top-0 h-px w-px overflow-hidden opacity-0"
        aria-hidden="true"
      >
        <div className="flex">
          {products.map((product) => (
            <div key={product.id} className="min-w-0 flex-[0_0_100%]" />
          ))}
        </div>
      </div>

      <ProductBackground products={products} activeIndex={selected} reduced={reduced} />

      {/* Mobile: full-edge feathers. lg+: photo-side top feather so white copy stays readable */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-14 bg-gradient-to-b from-background via-background/55 to-transparent sm:h-16 lg:inset-x-auto lg:right-0 lg:h-32 lg:w-[min(72%,44rem)] lg:via-background/65"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-16 bg-gradient-to-t from-background via-background/70 to-transparent sm:h-20 lg:h-28 lg:via-background/75"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-6 bg-gradient-to-r from-background via-background/45 to-transparent sm:w-8 lg:w-14 lg:via-background/50"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-[2] w-6 bg-gradient-to-l from-background via-background/45 to-transparent sm:w-10 lg:w-28 lg:via-background/70"
        aria-hidden="true"
      />

      <div
        className={cn(
          "absolute inset-0 z-[3] mx-auto flex w-full max-w-7xl flex-col justify-end gap-5 overflow-hidden py-8 sm:gap-6 sm:py-10 lg:justify-between lg:gap-10 lg:overflow-hidden lg:py-16 3xl:max-w-[88rem]",
          pad
        )}
      >
        <div className="relative min-h-0 max-w-[34rem] shrink-0 lg:min-h-0 lg:flex-1 lg:overflow-visible lg:pt-2">
          {products.map((product, index) => {
            const tabId = `${baseId}-tab-${product.id}`;
            const panelId = `${baseId}-panel-${product.id}`;
            return (
              <ProductFeatured
                key={product.id}
                product={product}
                active={index === selected}
                id={panelId}
                labelledBy={tabId}
                onViewSpecs={onViewSpecs}
              />
            );
          })}
        </div>

        <div className="flex shrink-0 flex-col gap-5 pb-1 sm:gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:pb-4">
          {/* Glass tray — frosted over the stage photo so the filmstrip reads as chrome */}
          <div
            className={cn(
              "glass flex min-w-0 flex-col gap-2.5 rounded-2xl p-3 shadow-soft sm:gap-3 sm:p-3.5 lg:rounded-3xl lg:p-4",
              // Stage is always dark imagery — light frosted glass (not theme solid fill)
              "!border-white/20 !bg-white/[0.12] backdrop-blur-xl saturate-150"
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="inline-flex items-center gap-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-orange-bright lg:hidden">
                <span className="h-px w-6 bg-brand-orange-bright/80" aria-hidden="true" />
                Choose product
              </p>
              <p className="hidden items-center gap-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-orange-bright lg:inline-flex">
                <span className="h-px w-6 bg-brand-orange-bright/80" aria-hidden="true" />
                Products
              </p>
              {/* Mobile: counter only — arrows/progress live at lg+ */}
              <p
                className="font-mono text-[0.75rem] font-medium tabular-nums tracking-[0.08em] text-white/55 lg:hidden"
                aria-live="polite"
              >
                <span className="sr-only">Showing product </span>
                <span className="text-white">{String(selected + 1).padStart(2, "0")}</span>
                <span className="text-white/30"> — </span>
                <span>{String(products.length).padStart(2, "0")}</span>
                {activeProduct ? (
                  <span className="sr-only">: {activeProduct.name}</span>
                ) : null}
              </p>
            </div>
            <div
              ref={tabListRef}
              role="tablist"
              aria-label="Export catalogue"
              onKeyDown={onTabListKeyDown}
              className="relative z-[4] -mx-1 flex items-end gap-2.5 overflow-x-auto px-1 pb-3.5 no-scrollbar sm:gap-3.5 lg:gap-4"
            >
              {products.map((product, index) => {
                const tabId = `${baseId}-tab-${product.id}`;
                const panelId = `${baseId}-panel-${product.id}`;
                return (
                  <ProductSelectorCard
                    key={product.id}
                    product={product}
                    selected={index === selected}
                    onSelect={selectById}
                    id={tabId}
                    controls={panelId}
                    tabIndex={index === selected ? 0 : -1}
                  />
                );
              })}

              {underline.ready ? (
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-0 h-[3px] rounded-full bg-brand-orange-bright shadow-[0_0_14px_rgba(255,122,26,0.55)]"
                  initial={false}
                  animate={{
                    x: underline.left,
                    width: underline.width,
                  }}
                  transition={{
                    x: UNDERLINE_SPRING,
                    width: UNDERLINE_WIDTH_SPRING,
                  }}
                  style={{ left: 0 }}
                />
              ) : null}
            </div>
          </div>

          {/* Desktop chrome: arrows + progress + counter (mobile uses tabs + swipe) */}
          <div className="hidden flex-wrap items-center gap-5 lg:flex lg:justify-end">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={scrollPrev}
                aria-label="Previous product"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-black/20 text-white/85 backdrop-blur-sm transition-[border-color,background-color,color] duration-300 ease-premium hover:border-white/60 hover:bg-white/10 hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                aria-label="Next product"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-black/20 text-white/85 backdrop-blur-sm transition-[border-color,background-color,color] duration-300 ease-premium hover:border-white/60 hover:bg-white/10 hover:text-white"
              >
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
            </div>

            {!reduced ? (
              <div className="h-px w-40 overflow-hidden bg-white/20" aria-hidden="true">
                <div
                  key={selected}
                  className="product-showcase-progress h-full w-full origin-left bg-white"
                />
              </div>
            ) : null}

            <p
              className="font-mono text-[0.8rem] font-medium tabular-nums tracking-[0.08em] text-white/55"
              aria-live="polite"
            >
              <span className="sr-only">Showing product </span>
              <span className="text-white">{String(selected + 1).padStart(2, "0")}</span>
              <span className="text-white/30"> — </span>
              <span>{String(products.length).padStart(2, "0")}</span>
              {activeProduct ? (
                <span className="sr-only">: {activeProduct.name}</span>
              ) : null}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
