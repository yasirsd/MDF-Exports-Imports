import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { ProductBackground } from "@/components/sections/products/ProductBackground";
import { ProductFeatured } from "@/components/sections/products/ProductFeatured";
import { ProductSelectorCard } from "@/components/sections/products/ProductSelectorCard";
import { EnquireActions } from "@/components/shared/EnquireActions";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { brandHello } from "@/lib/config";
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
 * Catalogue showcase.
 *
 * Below lg: vertical stack — photo card (aspect-ratio) → copy in normal flow
 *   → thumbnail row in normal flow. No overlays, no fixed-height stage. This
 *   fixes the mobile overlap issues where the featured card, tab tray and
 *   floating chat widget all fought for the same fixed 40rem stage.
 * lg+: full-bleed cinematic stage with overlay copy on the left, photo on the
 *   right, glass thumbnail tray at bottom (unchanged).
 *
 * State machine + interval autoplay only — no carousel library. Visuals live
 * in ProductBackground (image crossfade) and ProductFeatured (copy stack); all
 * four text panels stay mounted for SEO. Autoplay pauses on hover/focus in the
 * stage subtree.
 */
export function ProductShowcase({ onViewSpecs }) {
  const baseId = useId();
  const reduced = usePrefersReducedMotion();
  const stageRef = useRef(null);
  const tabListRef = useRef(null);
  const swipeRef = useRef({ x: 0, y: 0, tracking: false });
  const [underline, setUnderline] = useState({ left: 0, width: 0, ready: false });
  const prevUnderlineRef = useRef({ left: 0, width: 0 });
  // Only move DOM focus to the newly-selected tab when the change came from
  // user-initiated keyboard nav — not autoplay (which would silently steal
  // focus every 5.5s from whatever the user had focused).
  const focusOnSelectionRef = useRef(false);

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

  const [selected, setSelected] = useState(0);

  // Autoplay: plain interval, paused while hover or focus is inside the stage.
  // Replaces embla-carousel-autoplay — Embla was only used as a state machine
  // over a 1px×1px viewport, which surfaced initial-snap-index glitches under
  // loop mode. `scheduleTickRef` exposes the effect's tick scheduler so user
  // interactions can rearm the timer without waiting for the next re-render.
  const scheduleTickRef = useRef(null);

  useEffect(() => {
    if (reduced) return undefined;
    const stage = stageRef.current;
    if (!stage) return undefined;

    let timer = 0;
    let paused = false;
    let disposed = false;

    const stop = () => {
      if (timer) {
        clearTimeout(timer);
        timer = 0;
      }
    };
    const scheduleTick = () => {
      stop();
      if (disposed || paused) return;
      timer = window.setTimeout(() => {
        timer = 0;
        if (disposed || paused) return;
        setSelected((prev) => (prev + 1) % products.length);
        scheduleTick();
      }, AUTOPLAY_DELAY_MS);
    };

    scheduleTickRef.current = scheduleTick;

    const onEnter = () => { paused = true; stop(); };
    const onLeave = () => { paused = false; scheduleTick(); };
    const onFocusIn = () => { paused = true; stop(); };
    const onFocusOut = (e) => {
      if (!stage.contains(e.relatedTarget)) {
        paused = false;
        scheduleTick();
      }
    };

    stage.addEventListener("mouseenter", onEnter);
    stage.addEventListener("mouseleave", onLeave);
    stage.addEventListener("focusin", onFocusIn);
    stage.addEventListener("focusout", onFocusOut);
    scheduleTick();

    return () => {
      disposed = true;
      stop();
      scheduleTickRef.current = null;
      stage.removeEventListener("mouseenter", onEnter);
      stage.removeEventListener("mouseleave", onLeave);
      stage.removeEventListener("focusin", onFocusIn);
      stage.removeEventListener("focusout", onFocusOut);
    };
  }, [reduced]);

  const scrollToIndex = useCallback((index) => {
    const total = products.length;
    const next = ((index % total) + total) % total;
    setSelected((prev) => (next === prev ? prev : next));
    // Reset autoplay so the next tick is a full delay from now.
    scheduleTickRef.current?.();
  }, []);

  const scrollPrev = useCallback(() => {
    scrollToIndex((selected - 1 + products.length) % products.length);
  }, [selected, scrollToIndex]);

  const scrollNext = useCallback(() => {
    scrollToIndex((selected + 1) % products.length);
  }, [selected, scrollToIndex]);

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
        focusOnSelectionRef.current = true;
        scrollToIndex((selected + 1) % products.length);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        focusOnSelectionRef.current = true;
        scrollToIndex((selected - 1 + products.length) % products.length);
      } else if (e.key === "Home") {
        e.preventDefault();
        focusOnSelectionRef.current = true;
        scrollToIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        focusOnSelectionRef.current = true;
        scrollToIndex(products.length - 1);
      }
    },
    [selected, scrollToIndex]
  );

  // Touch swipe on the visible stage — advances / rewinds the carousel.
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
    if (!focusOnSelectionRef.current) return;
    focusOnSelectionRef.current = false;
    const product = products[selected];
    if (!product) return;
    document.getElementById(`${baseId}-tab-${product.id}`)?.focus();
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
  const stageHDesktop = "lg:h-[min(88svh,52rem)]";
  const mobileEnquireMessage = activeProduct
    ? brandHello(`I'd like to enquire about ${activeProduct.name} for import.`)
    : "";

  return (
    <div ref={stageRef} className="group/showcase relative bg-background">
      {/* ─── MOBILE (below lg): vertical stack ─────────────────────────── */}
      <div className="lg:hidden">
        {/* Photo card */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0a0806]">
          <ProductBackground
            products={products}
            activeIndex={selected}
            reduced={reduced}
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-14 bg-gradient-to-b from-background/95 via-background/40 to-transparent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-16 bg-gradient-to-t from-[#0a0806] via-[#0a0806]/60 to-transparent"
            aria-hidden="true"
          />
          {/* Product name overlay at the bottom of the photo */}
          {activeProduct ? (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] px-5 pb-5"
              aria-hidden="true"
            >
              <p className="inline-flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-white/75">
                <span className="h-px w-5 bg-brand-orange-bright/80" />
                Featured export
                <span className="text-white/30">·</span>
                <span className="tracking-[0.14em] text-brand-orange-bright/90">
                  {activeProduct.category}
                </span>
              </p>
              <h3 className="mt-2 text-[clamp(1.75rem,7vw,2.15rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
                {activeProduct.name}
              </h3>
            </div>
          ) : null}
        </div>

        {/* Copy in normal flow (single active product; others hidden but SEO-mounted below) */}
        <div className={cn("bg-background pb-6 pt-5", pad)}>
          {activeProduct ? (
            <>
              <p
                className="text-[0.95rem] leading-[1.55] text-muted-foreground"
                id={`${baseId}-mobile-copy`}
                aria-live="polite"
              >
                {activeProduct.blurb || activeProduct.copy}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <MagneticButton
                  type="button"
                  variant="primary"
                  size="md"
                  className="h-10 px-5 text-sm"
                  onClick={() => onViewSpecs?.(activeProduct)}
                >
                  View specs
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </MagneticButton>
                <EnquireActions
                  label="Enquire"
                  size="md"
                  tone="dark"
                  whatsappVariant="glass"
                  whatsappMessage={mobileEnquireMessage}
                  emailSubject={`Export Enquiry — ${activeProduct.name}`}
                  emailBody={mobileEnquireMessage}
                  whatsappClassName="h-10 border border-border !bg-surface-2 px-5 text-sm text-foreground hover:!bg-surface"
                />
              </div>
            </>
          ) : null}

          {/* SEO-only: keep all product copy in the DOM even when their photo panel isn't active */}
          <div className="sr-only">
            {products.map((product) => (
              <div key={`seo-${product.id}`}>
                <h3>{product.name}</h3>
                <p>{product.copy || product.blurb}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Thumbnail row in normal flow */}
        <div className={cn("bg-background pb-6", pad)}>
          <div className="mb-2.5 flex items-center justify-between gap-3">
            <p className="inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-brand-orange-bright">
              <span className="h-px w-5 bg-brand-orange-bright/80" aria-hidden="true" />
              Choose product
            </p>
            <p
              className="font-mono text-[0.75rem] font-medium tabular-nums tracking-[0.08em] text-muted-foreground"
              aria-live="polite"
            >
              <span className="sr-only">Showing product </span>
              <span className="text-foreground">{String(selected + 1).padStart(2, "0")}</span>
              <span className="text-muted-foreground/50"> — </span>
              <span>{String(products.length).padStart(2, "0")}</span>
              {activeProduct ? <span className="sr-only">: {activeProduct.name}</span> : null}
            </p>
          </div>
          <div
            role="tablist"
            aria-label="Export catalogue"
            onKeyDown={onTabListKeyDown}
            className="-mx-1 flex items-end gap-2.5 overflow-x-auto px-1 pb-2 no-scrollbar sm:gap-3.5"
          >
            {products.map((product, index) => {
              const tabId = `${baseId}-mtab-${product.id}`;
              const panelId = `${baseId}-mpanel-${product.id}`;
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
          </div>
        </div>
      </div>

      {/* ─── DESKTOP (lg+): cinematic overlay stage ─────────────────────── */}
      <div
        className={cn(
          "relative hidden overflow-hidden lg:block",
          stageHDesktop
        )}
      >
        <ProductBackground products={products} activeIndex={selected} reduced={reduced} />

        {/* Photo-side top feather so white copy stays readable */}
        <div
          className="pointer-events-none absolute inset-x-auto right-0 top-0 z-[2] h-32 w-[min(72%,44rem)] bg-gradient-to-b from-background via-background/65 to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-28 bg-gradient-to-t from-background via-background/75 to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-14 bg-gradient-to-r from-background via-background/50 to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-[2] w-28 bg-gradient-to-l from-background via-background/70 to-transparent"
          aria-hidden="true"
        />

        <div
          className={cn(
            "absolute inset-0 z-[3] mx-auto flex w-full max-w-7xl flex-col justify-between gap-10 overflow-hidden py-16 3xl:max-w-[88rem]",
            pad
          )}
        >
          <div className="relative flex-1 overflow-visible pt-2">
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

          <div className="flex shrink-0 flex-row items-end justify-between gap-10 pb-4">
            {/* Glass tray — frosted over the stage photo so the filmstrip reads as chrome */}
            <div
              className={cn(
                "glass flex min-w-0 flex-col gap-3 rounded-3xl p-4 shadow-soft",
                "!border-white/20 !bg-white/[0.12] backdrop-blur-xl saturate-150"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="inline-flex items-center gap-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-orange-bright">
                  <span className="h-px w-6 bg-brand-orange-bright/80" aria-hidden="true" />
                  Products
                </p>
              </div>
              <div
                ref={tabListRef}
                role="tablist"
                aria-label="Export catalogue (desktop)"
                onKeyDown={onTabListKeyDown}
                className="relative z-[4] -mx-1 flex items-end gap-4 overflow-x-auto px-1 pb-3.5 no-scrollbar"
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
                    animate={{ x: underline.left, width: underline.width }}
                    transition={{ x: UNDERLINE_SPRING, width: UNDERLINE_WIDTH_SPRING }}
                    style={{ left: 0 }}
                  />
                ) : null}
              </div>
            </div>

            {/* Arrows + progress + counter */}
            <div className="flex flex-wrap items-center justify-end gap-5">
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
    </div>
  );
}
