import { motion } from "motion/react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { Button } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { brandHello, site } from "@/lib/config";
import { easePremium } from "@/lib/motion";
import { cn, whatsappUrl } from "@/lib/utils";

/**
 * Editorial overlay copy for the full-bleed showcase.
 * Always mounted; visibility toggled via CSS / aria (never unmount for SEO).
 * Below lg: condensed (blurb + CTAs). lg+: full editorial (copy, highlights, season/pack).
 */
export function ProductFeatured({
  product,
  onViewSpecs,
  active = true,
  id,
  labelledBy,
  className,
}) {
  const reduced = usePrefersReducedMotion();
  if (!product) return null;

  const enquireHref = whatsappUrl(
    site.whatsapp,
    brandHello(`I'd like to enquire about ${product.name} for import.`)
  );

  const duration = reduced ? 0 : 0.55;
  const guideLabel = product.featuredLandingLabel || product.landingLabel || "Export guide";
  const longCopy = product.copy || product.blurb;

  return (
    <motion.div
      id={id}
      role="tabpanel"
      aria-labelledby={labelledBy}
      aria-hidden={!active}
      initial={false}
      animate={{
        opacity: active ? 1 : 0,
        y: active || reduced ? 0 : 14,
      }}
      transition={{ duration, ease: easePremium }}
      className={cn(
        "max-w-[34rem]",
        // Mobile: frosted plate so type doesn't compete with the photo
        "rounded-2xl border border-white/15 bg-[#0a0806]/78 p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-4",
        "lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none",
        active ? "relative z-[1] pointer-events-auto" : "pointer-events-none absolute inset-0 z-0",
        className
      )}
    >
      <p className="inline-flex items-center gap-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white/80 sm:text-[0.7rem] lg:text-white/70">
        <span className="h-px w-7 bg-brand-orange-bright/80" aria-hidden="true" />
        Featured export
        <span className="text-white/35">·</span>
        <span className="tracking-[0.16em] text-brand-orange-bright/90">{product.category}</span>
      </p>

      <h3 className="mt-3 text-[clamp(1.75rem,7vw,2.35rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-white sm:mt-4 lg:text-[clamp(2rem,4vw,3.35rem)]">
        {product.name}
      </h3>

      {/* Mobile blurb + desktop long copy — both stay in DOM for SEO/prerender */}
      {product.blurb ? (
        <p className="mt-3 max-w-[30rem] text-[0.95rem] font-normal leading-[1.55] text-white/88 sm:mt-4 lg:hidden">
          {product.blurb}
        </p>
      ) : null}
      <p
        className={cn(
          "mt-3 max-w-[30rem] text-[clamp(0.95rem,1.05vw,1.125rem)] font-normal leading-[1.65] text-white/72 sm:mt-4",
          product.blurb ? "hidden lg:block" : "block"
        )}
      >
        {longCopy}
      </p>

      {product.highlights?.length ? (
        <ul className="mt-5 hidden flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.8rem] font-medium tracking-wide text-white/55 lg:flex">
          {product.highlights.map((h, i) => (
            <li key={h} className="inline-flex items-center gap-3">
              {i > 0 ? <span className="h-3 w-px bg-white/25" aria-hidden="true" /> : null}
              <span>{h}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <dl className="mt-5 hidden max-w-md grid-cols-2 gap-x-8 border-t border-white/15 pt-4 lg:grid">
        <div>
          <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/40">
            Season
          </dt>
          <dd className="mt-1.5 text-[0.9rem] font-medium leading-snug text-white/88">
            {product.season}
          </dd>
        </div>
        <div>
          <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/40">
            Pack
          </dt>
          <dd className="mt-1.5 text-[0.9rem] font-medium leading-snug text-white/88">
            {product.pack}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3">
        <MagneticButton
          type="button"
          variant="primary"
          size="md"
          tabIndex={active ? undefined : -1}
          className="h-10 px-5 text-sm lg:h-14 lg:px-8 lg:text-base"
          onClick={() => onViewSpecs?.(product)}
        >
          View specs
          <ArrowUpRight className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
        </MagneticButton>

        <Button
          asChild
          variant="glass"
          size="md"
          className="h-10 border border-white/20 !bg-white/10 px-5 text-sm text-white hover:!bg-white/18 lg:h-14 lg:px-8 lg:text-base"
        >
          <a
            href={enquireHref}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={active ? undefined : -1}
          >
            <MessageCircle className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
            Enquire
          </a>
        </Button>

        {product.landingHref ? (
          <a
            href={product.landingHref}
            tabIndex={active ? undefined : -1}
            className="inline-flex h-10 items-center gap-1.5 px-1.5 text-[0.8125rem] font-semibold text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline sm:px-2 sm:text-sm lg:h-14"
          >
            {guideLabel}
            <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
          </a>
        ) : null}
      </div>
    </motion.div>
  );
}
