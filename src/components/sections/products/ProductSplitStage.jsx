import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { LazyImage } from "@/components/shared/LazyImage";
import { EnquireActions } from "@/components/shared/EnquireActions";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { brandHello } from "@/lib/config";
import { products } from "@/lib/constants";
import { unsplash, unsplashLQ, unsplashSrcSet } from "@/lib/images";
import { PRODUCT_ATMOSPHERES } from "@/components/sections/productPage/productAtmospheres";
import { cn } from "@/lib/utils";

/**
 * Split-screen cinema for the export catalogue.
 *
 * Desktop (lg+): sticky-pinned inside a 150svh wrapper — the section holds
 * for 50svh of scroll runway, then releases. Left column is the editorial
 * product-name list (all 5 visible, active = full-size heading, others
 * dimmed/small). Right column is the full-bleed active product photo with
 * atmosphere gradient crossfade.
 *
 * Mobile: normal flow (no pin — a 100svh sticky with 5 stacked names +
 * chips + CTAs would clip). Photo on top, editorial list + CTAs below.
 *
 * No autoplay, no scroll-jacking, no carousel library. User taps a product
 * name → photo, chips and CTAs crossfade to the new active. Same info
 * architecture across breakpoints, rotated 90° for mobile.
 */

/** Product id → atmosphere palette key (from productAtmospheres.js). */
const ATMOSPHERE_KEY = {
  "dry-red-chilli": "guntur",
  "black-pepper": "blackPepper",
  mangoes: "mango",
  "indian-apple": "apple",
  pomegranate: "pomegranate",
};

/** Trim the first segment of a "·"-joined string. Some product fields carry
 *  a lot of detail; the catalogue chip strip only needs the essence. */
function firstPart(s) {
  if (!s) return "";
  const cut = s.indexOf("·");
  return (cut === -1 ? s : s.slice(0, cut)).trim();
}

function specChipsFor(p) {
  if (!p) return [];
  return [
    p.varieties?.length && {
      key: "grade",
      label: p.varieties.slice(0, 2).join(" · "),
    },
    p.pack && { key: "pack", label: firstPart(p.pack) },
    p.season && { key: "season", label: firstPart(p.season) },
    p.markets?.length && {
      key: "markets",
      label: p.markets.slice(0, 3).join(" · "),
    },
  ].filter(Boolean);
}

export function ProductSplitStage({ active, onSelect, onViewSpecs }) {
  const total = products.length;
  const reduced = usePrefersReducedMotion();
  const activeProduct = products[active] || products[0];
  const atm =
    PRODUCT_ATMOSPHERES[ATMOSPHERE_KEY[activeProduct.id]] ||
    PRODUCT_ATMOSPHERES.mango;

  const stepLabel = String(active + 1).padStart(2, "0");
  const totalLabel = String(total).padStart(2, "0");

  const chips = useMemo(() => specChipsFor(activeProduct), [activeProduct]);
  const enquireMessage = brandHello(
    `I'd like to enquire about ${activeProduct.name} for import.`
  );
  const enquireSubject = `Export Enquiry — ${activeProduct.name}`;

  return (
    <div className="relative lg:h-[150svh]">
      <div className="relative bg-[#0a0806] lg:sticky lg:top-0 lg:h-[100svh] lg:overflow-hidden">
        {/* Atmosphere wash — crossfades on active change. */}
        <AnimatePresence initial={false}>
          <motion.div
            key={`atm-${activeProduct.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.8, ease: "easeInOut" }}
            className="pointer-events-none absolute inset-0"
            style={{ background: atm.hero.glow }}
            aria-hidden="true"
          />
        </AnimatePresence>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 3px)",
          }}
          aria-hidden="true"
        />

        {/* Content grid. Mobile: photo top (row 1), list bottom (row 2).
            Desktop: list left (col 1), photo right (col 2). */}
        <div
          className={cn(
            "relative z-[1] grid h-full w-full",
            "grid-cols-[minmax(0,1fr)] grid-rows-[auto_1fr]",
            "lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:grid-rows-1"
          )}
        >
          {/* ── PHOTO — mobile top / desktop right ─────────────────────── */}
          <div className="relative min-h-[52svh] w-full overflow-hidden lg:col-start-2 lg:row-start-1 lg:min-h-0">
            <AnimatePresence initial={false}>
              <motion.div
                key={`photo-${activeProduct.id}`}
                initial={{ opacity: 0, scale: reduced ? 1 : 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: reduced ? 1 : 1.04 }}
                transition={{
                  duration: reduced ? 0 : 0.75,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute inset-0"
              >
                <LazyImage
                  src={unsplash(activeProduct.image, 1600, 88)}
                  srcSet={unsplashSrcSet(
                    activeProduct.image,
                    [480, 768, 1200, 1600],
                    88
                  )}
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  lqip={unsplashLQ(activeProduct.image)}
                  alt={activeProduct.name}
                  fallbackLabel={activeProduct.name}
                  eager
                  className="absolute inset-0 h-full w-full"
                  imgClassName={cn(
                    "object-cover object-center",
                    !reduced && "story-atmosphere-zoom"
                  )}
                />
              </motion.div>
            </AnimatePresence>

            {/* Bottom scrim for legibility of overlay pill + counter. */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 via-black/25 to-transparent"
              aria-hidden="true"
            />
            {/* Left scrim on desktop only, to soften the seam with the list column. */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-[#0a0806] via-[#0a0806]/40 to-transparent lg:block"
              aria-hidden="true"
            />

            {/* Photo overlay: counter + category chip (bottom-left).
                Product name shows here on MOBILE only (list on desktop). */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
              <div>
                <p className="inline-flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-white/85">
                  <span className="h-px w-5 bg-brand-orange-bright" />
                  {stepLabel} · {activeProduct.category}
                </p>
                <h3 className="mt-2 text-[clamp(1.75rem,7vw,2.35rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-white lg:hidden">
                  {activeProduct.name}
                </h3>
              </div>
              <p className="font-mono text-[0.7rem] tabular-nums tracking-[0.14em] text-white/60">
                {stepLabel} / {totalLabel}
              </p>
            </div>
          </div>

          {/* ── LIST + COPY — mobile bottom / desktop left ─────────────── */}
          <div
            className={cn(
              "relative z-[2] flex min-w-0 flex-col justify-between gap-8",
              "px-5 py-8 sm:px-8 sm:py-10",
              "lg:col-start-1 lg:row-start-1 lg:h-full lg:px-12 lg:py-14 xl:px-16"
            )}
          >
            {/* "Products" label — visible on both breakpoints so the block
                immediately reads as a catalogue menu, not loose text. */}
            <div>
              <p className="inline-flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-brand-orange-bright">
                <span className="h-px w-8 bg-brand-orange-bright" />
                {total} Export Products
              </p>
            </div>

            {/* MOBILE — horizontal pill row. Compact, all 5 visible (with
                horizontal scroll on very narrow viewports), active pill
                bright-orange-outlined. Photo above already shows the active
                product name, so we don't repeat the big heading here. */}
            <ul
              role="listbox"
              aria-label="Export catalogue"
              className="-mx-1 flex flex-row items-center gap-2 overflow-x-auto px-1 py-1 no-scrollbar lg:hidden"
            >
              {products.map((p, i) => {
                const isActive = i === active;
                const num = String(i + 1).padStart(2, "0");
                return (
                  <li key={p.id} className="shrink-0">
                    <button
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onClick={() => onSelect?.(i)}
                      className={cn(
                        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[0.8rem] font-medium transition-colors duration-300 ease-premium",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange-bright/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                        isActive
                          ? "border-brand-orange-bright bg-brand-orange-bright/[0.14] text-white shadow-[0_0_18px_rgba(255,122,26,0.25)]"
                          : "border-white/15 bg-white/[0.03] text-white/65 hover:text-white/90"
                      )}
                    >
                      <span
                        className={cn(
                          "font-mono text-[0.62rem] font-semibold tabular-nums tracking-[0.14em]",
                          isActive ? "text-brand-orange-bright" : "text-white/40"
                        )}
                        aria-hidden="true"
                      >
                        {num}
                      </span>
                      {p.name}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* DESKTOP — vertical rail with position tick + editorial names.
                Kept from the previous iteration since desktop looked right. */}
            <ul
              role="listbox"
              aria-label="Export catalogue (desktop)"
              className="relative hidden flex-col gap-6 border-l border-white/15 py-1 lg:flex"
            >
              {products.map((p, i) => {
                const isActive = i === active;
                const num = String(i + 1).padStart(2, "0");
                return (
                  <li key={p.id} className="relative">
                    {isActive ? (
                      <motion.span
                        layoutId="catalogue-active-tick"
                        aria-hidden="true"
                        className="absolute -left-px top-1/2 h-[3px] w-8 -translate-y-1/2 rounded-full bg-brand-orange-bright shadow-[0_0_12px_rgba(255,122,26,0.55)]"
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 28,
                        }}
                      />
                    ) : null}
                    <button
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onClick={() => onSelect?.(i)}
                      className={cn(
                        "group flex w-full items-baseline gap-4 pl-10 pr-2 text-left",
                        "rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange-bright/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                      )}
                    >
                      <span
                        className={cn(
                          "font-mono text-[0.7rem] font-semibold tabular-nums tracking-[0.14em] transition-colors duration-500 ease-premium",
                          isActive ? "text-brand-orange-bright" : "text-white/35"
                        )}
                        aria-hidden="true"
                      >
                        {num}
                      </span>
                      <motion.span
                        layout
                        transition={{
                          duration: reduced ? 0 : 0.5,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className={cn(
                          "block font-semibold leading-[0.98] tracking-[-0.035em] transition-[color,font-size,opacity] duration-500 ease-premium",
                          isActive
                            ? "text-[clamp(2rem,4vw,3.15rem)] text-white opacity-100"
                            : "text-[clamp(1.25rem,1.7vw,1.55rem)] text-white/85 opacity-45 hover:opacity-80"
                        )}
                      >
                        {p.name}
                      </motion.span>
                    </button>
                    {isActive && p.blurb ? (
                      <motion.p
                        layout
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: reduced ? 0 : 0.45,
                          delay: reduced ? 0 : 0.15,
                          ease: "easeOut",
                        }}
                        className="mt-2 max-w-[26rem] pl-10 text-[0.95rem] leading-[1.55] text-white/60"
                      >
                        {p.blurb}
                      </motion.p>
                    ) : null}
                  </li>
                );
              })}
            </ul>

            {/* Active product spec chips + CTAs. */}
            <div className="flex flex-col gap-5">
              {chips.length ? (
                <AnimatePresence mode="wait">
                  <motion.ul
                    key={`chips-${activeProduct.id}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{
                      duration: reduced ? 0 : 0.35,
                      ease: "easeOut",
                    }}
                    className="flex flex-wrap gap-2"
                  >
                    {chips.map((c) => (
                      <li
                        key={c.key}
                        className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-[0.72rem] font-medium tracking-wide text-white/85"
                      >
                        {c.label}
                      </li>
                    ))}
                  </motion.ul>
                </AnimatePresence>
              ) : null}

              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <MagneticButton
                  type="button"
                  variant="primary"
                  size="md"
                  className="h-11 px-5 text-sm sm:h-12 sm:px-6"
                  onClick={() => onViewSpecs?.(activeProduct)}
                >
                  View specs
                  <ArrowUpRight className="h-4 w-4" />
                </MagneticButton>
                <EnquireActions
                  label="Enquire"
                  size="md"
                  tone="dark"
                  whatsappVariant="glass"
                  whatsappMessage={enquireMessage}
                  emailSubject={enquireSubject}
                  emailBody={enquireMessage}
                  whatsappClassName="h-11 border border-white/20 !bg-white/10 px-5 text-sm text-white hover:!bg-white/[0.16] sm:h-12 sm:px-6"
                />
                {activeProduct.landingHref ? (
                  <a
                    href={activeProduct.landingHref}
                    className="inline-flex h-11 items-center gap-1.5 px-2 text-[0.8rem] font-semibold text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline sm:h-12 sm:text-sm"
                  >
                    Full export guide
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
                  </a>
                ) : null}
              </div>

              {/* Live-region for screen readers on active-product change. */}
              <p className="sr-only" aria-live="polite">
                Now showing {activeProduct.name}, product {stepLabel} of {totalLabel}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
