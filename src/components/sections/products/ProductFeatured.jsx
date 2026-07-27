import { motion } from "motion/react";
import { MessageCircle, FileText } from "lucide-react";
import { LazyImage } from "@/components/shared/LazyImage";
import { Button } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { brandHello, site } from "@/lib/config";
import { unsplash, unsplashLQ, unsplashSrcSet } from "@/lib/images";
import { whatsappUrl } from "@/lib/utils";

/**
 * Signature featured product stage — editorial portrait + commercial CTAs.
 */
export function ProductFeatured({ product, onViewSpecs }) {
  const reduced = usePrefersReducedMotion();
  if (!product) return null;

  const enquireHref = whatsappUrl(
    site.whatsapp,
    brandHello(`I'd like to enquire about ${product.name} for import.`)
  );

  return (
    <motion.div
      key={product.id}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12"
    >
      <div className="relative mx-auto w-full max-w-md lg:max-w-none">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-border/80 bg-[#140e0a] shadow-[0_28px_70px_rgba(20,14,10,0.18)] sm:rounded-[2rem]">
          <LazyImage
            src={unsplash(product.image, 1100, 88)}
            srcSet={unsplashSrcSet(product.image, [480, 640, 768, 960, 1200], 88)}
            sizes="(min-width:1024px) 38vw, 90vw"
            lqip={unsplashLQ(product.image)}
            alt={`${product.name} — export quality`}
            fallbackLabel={product.name}
            eager
            className="absolute inset-0 h-full w-full"
            imgClassName="object-cover object-center"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#140e0a]/75 via-transparent to-transparent" />
          <div className="absolute left-4 top-4 sm:left-5 sm:top-5">
            <span className="inline-flex rounded-full border border-white/20 bg-black/70 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white">
              {product.category}
            </span>
          </div>
          {product.featured ? (
            <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5">
              <span className="inline-flex rounded-full border border-brand-orange-bright/50 bg-[#1a0e06]/85 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-brand-orange-bright">
                Flagship line
              </span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="min-w-0">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-orange-bright">
          Featured export
        </p>
        <h3 className="mt-3 text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-foreground">
          {product.name}
        </h3>
        <p className="mt-4 max-w-lg text-[clamp(0.95rem,1.1vw,1.1rem)] leading-relaxed text-muted-foreground">
          {product.copy || product.blurb}
        </p>

        {product.highlights?.length ? (
          <ul className="mt-5 flex flex-wrap gap-2">
            {product.highlights.map((h) => (
              <li
                key={h}
                className="rounded-full border border-brand-orange-bright/25 bg-brand-orange-bright/[0.06] px-3 py-1.5 text-xs font-semibold text-foreground/80"
              >
                {h}
              </li>
            ))}
          </ul>
        ) : null}

        <dl className="mt-6 grid grid-cols-2 gap-3 sm:max-w-md">
          <div className="rounded-2xl border border-border bg-surface px-3.5 py-3">
            <dt className="text-[0.55rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Season
            </dt>
            <dd className="mt-1 text-sm font-semibold text-foreground">{product.season}</dd>
          </div>
          <div className="rounded-2xl border border-border bg-surface px-3.5 py-3">
            <dt className="text-[0.55rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Pack
            </dt>
            <dd className="mt-1 text-sm font-semibold text-foreground">{product.pack}</dd>
          </div>
        </dl>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            type="button"
            size="lg"
            className="bg-brand-orange-bright text-[#1a0e06] shadow-[0_10px_32px_rgba(255,122,26,0.3)] hover:bg-[#ff8a2a] hover:brightness-100"
            onClick={() => onViewSpecs?.(product)}
          >
            <FileText className="h-5 w-5" />
            View specs
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href={enquireHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
              Enquire
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
