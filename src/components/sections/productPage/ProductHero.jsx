import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { EnquireActions } from "@/components/shared/EnquireActions";
import { LazyImage } from "@/components/shared/LazyImage";
import { exportDestinations } from "@/lib/constants";
import { ProductPill } from "./ProductPill";
import { ProductChipRow } from "./ProductChipRow";
import { ProductStage } from "./ProductStage";
import { useInViewMotion } from "./useInViewMotion";
import { useProductFrameParallax } from "./useProductImageParallax";
import { cn } from "@/lib/utils";

/**
 * Full-bleed product hero. Framed 4:5 portrait, not a marketing card dump.
 */
export function ProductHero({
  atmosphere,
  pill,
  title,
  titleAccent,
  titleAccentClass = "text-gradient-orange",
  lead,
  enquireMessage,
  emailSubject = "Export Enquiry — MDF",
  secondaryHref,
  secondaryLabel = "View specs",
  image,
  imageCaption,
  imageAlt,
  imageFallback,
  showDestinations = true,
}) {
  const { container, item } = useInViewMotion();
  const { frameRef, active: parallaxOn, y: imgY, inset } = useProductFrameParallax({
    from: "8%",
    to: "-14%",
    overscan: 0.14,
  });
  const destChips = exportDestinations.map((d) => ({
    label: d.code,
    title: d.name,
  }));

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
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            {...item}
          >
            <EnquireActions
              tone="dark"
              magnetic
              label="Request a quote"
              whatsappMessage={enquireMessage}
              emailSubject={emailSubject}
              emailBody={enquireMessage}
              whatsappClassName="shadow-glow"
            />
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
          {showDestinations ? (
            <motion.div className="mt-6" {...item}>
              <p className="mb-2.5 text-[0.55rem] font-bold uppercase tracking-[0.16em] text-white/40">
                Active GCC programmes
              </p>
              <ProductChipRow items={destChips} />
            </motion.div>
          ) : null}
        </div>

        <motion.div
          className="relative mx-auto w-full max-w-md [perspective:1400px] lg:max-w-none"
          {...item}
        >
          <div
            className="absolute -inset-6 rounded-[2rem] opacity-70 blur-3xl"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,122,26,0.28), rgba(239,35,60,0.12), rgba(56,160,220,0.1), transparent 70%)",
            }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-3 translate-x-2 translate-y-3 rounded-[1.65rem] bg-black/50 blur-[1px] sm:inset-4 sm:translate-x-3 sm:translate-y-4"
            aria-hidden="true"
          />

          <figure
            ref={frameRef}
            className={cn(
              "product-hero-frame group relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/20 bg-black/40",
              "shadow-[0_8px_16px_rgba(0,0,0,0.2),0_24px_48px_rgba(0,0,0,0.35),0_40px_90px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.18)]",
              "origin-center [transform-style:preserve-3d]",
              "lg:[transform:rotateY(-7deg)_rotateX(3deg)_translateZ(0)]",
              "transition-[transform,box-shadow] duration-700 ease-premium",
              "motion-safe:lg:hover:[transform:rotateY(-3deg)_rotateX(1deg)_translateY(-6px)_translateZ(12px)]",
              "motion-safe:lg:hover:shadow-[0_12px_24px_rgba(0,0,0,0.22),0_32px_64px_rgba(0,0,0,0.4),0_48px_110px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.22)]",
              "motion-reduce:lg:[transform:none] motion-reduce:lg:hover:[transform:none]"
            )}
          >
            <div
              className="pointer-events-none absolute inset-0 z-[2] rounded-[1.75rem] ring-1 ring-inset ring-white/25"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-br from-white/20 via-transparent to-black/30 opacity-80"
              aria-hidden="true"
            />
            {parallaxOn ? (
              <motion.div
                className="absolute will-change-transform"
                style={{ top: `-${inset}`, bottom: `-${inset}`, left: 0, right: 0, y: imgY }}
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
              </motion.div>
            ) : (
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
            )}
            <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            {imageCaption ? (
              <figcaption className="absolute bottom-5 left-5 right-5 z-[3]">
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
