import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { LazyImage } from "@/components/shared/LazyImage";
import { ProductPill } from "./ProductPill";
import { ProductStage } from "./ProductStage";
import { useInViewMotion } from "./useInViewMotion";
import { cn } from "@/lib/utils";

/**
 * Full-bleed product hero — framed 4:5 portrait, not a marketing card dump.
 */
export function ProductHero({
  atmosphere,
  pill,
  title,
  titleAccent,
  titleAccentClass = "text-gradient-orange",
  lead,
  enquireHref,
  secondaryHref,
  secondaryLabel = "View specs",
  image,
  imageCaption,
  imageAlt,
  imageFallback,
}) {
  const { container, item } = useInViewMotion();

  return (
    <ProductStage atmosphere={atmosphere} className="section-py-sm pb-12 sm:pb-16">
      <motion.div
        className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14"
        {...container}
      >
        <div>
          {pill ? <ProductPill>{pill}</ProductPill> : null}
          <motion.h1
            className="mt-5 text-[clamp(2.35rem,5.5vw,4rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-white"
            {...item}
          >
            {titleAccent ? (
              <>
                <span className={titleAccentClass}>{titleAccent}</span>
                {title ? <span className="block text-white">{title}</span> : null}
              </>
            ) : (
              title
            )}
          </motion.h1>
          {lead ? (
            <motion.p
              className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-white/60"
              {...item}
            >
              {lead}
            </motion.p>
          ) : null}
          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            {...item}
          >
            <Button asChild size="lg" className="shadow-glow">
              <a href={enquireHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" />
                Request a quote on WhatsApp
              </a>
            </Button>
            {secondaryHref ? (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/25 bg-transparent text-white hover:bg-white/5 hover:text-white"
              >
                <a href={secondaryHref}>{secondaryLabel}</a>
              </Button>
            ) : null}
          </motion.div>
        </div>

        <motion.div className="relative mx-auto w-full max-w-md lg:max-w-none" {...item}>
          <div
            className="absolute -inset-3 rounded-[1.5rem] opacity-60 blur-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,122,26,0.25), rgba(56,160,220,0.12), transparent)",
            }}
            aria-hidden="true"
          />
          <figure
            className={cn(
              "relative aspect-[4/5] overflow-hidden rounded-sm border border-white/15 bg-black/40",
              "shadow-[0_28px_70px_rgba(0,0,0,0.45)]"
            )}
          >
            <LazyImage
              src={image.src}
              srcSet={image.srcSet}
              sizes={image.sizes || "(min-width:1024px) 38vw, 90vw"}
              lqip={image.lqip}
              alt={imageAlt}
              fallbackLabel={imageFallback}
              eager
              className="absolute inset-0 h-full w-full"
              imgClassName="object-cover object-center"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            {imageCaption ? (
              <figcaption className="absolute bottom-5 left-5 right-5">
                {imageCaption.kicker ? (
                  <p className="text-[0.55rem] font-bold uppercase tracking-[0.16em] text-white/50">
                    {imageCaption.kicker}
                  </p>
                ) : null}
                {imageCaption.title ? (
                  <p className="mt-1 text-lg font-extrabold text-white">
                    {imageCaption.title}
                  </p>
                ) : null}
              </figcaption>
            ) : null}
          </figure>
        </motion.div>
      </motion.div>
    </ProductStage>
  );
}
