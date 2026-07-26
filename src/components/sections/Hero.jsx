import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ArrowDown, Leaf, MapPin, Ship, ShieldCheck } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { LazyImage } from "@/components/shared/LazyImage";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { Button } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useScrollTo } from "@/providers/SmoothScrollProvider";
import { WorldRoutes } from "@/components/sections/hero/WorldRoutes";
import { HeroSketch } from "@/components/sections/hero/HeroSketch";
import { scenes, unsplash, unsplashLQ, unsplashSrcSet } from "@/lib/images";
import { certifications, exportDestinations } from "@/lib/constants";
import { brandHello, site } from "@/lib/config";
import { whatsappUrl } from "@/lib/utils";

const easePremium = [0.16, 1, 0.3, 1];

const certified = certifications.filter((c) => c.status === "certified");

export function Hero() {
  const ref = useRef(null);
  const prefersReduced = usePrefersReducedMotion();
  const scrollTo = useScrollTo();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.2]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative min-h-[100svh] w-full overflow-hidden bg-[#0b0b0b]"
    >
      {/* Cinematic background */}
      <motion.div
        style={prefersReduced ? undefined : { y: bgY, scale: bgScale }}
        className="absolute inset-0"
      >
        <LazyImage
          src={unsplash(scenes.farmSunrise, 2400)}
          srcSet={unsplashSrcSet(scenes.farmSunrise, [640, 828, 1080, 1440, 1920, 2400])}
          sizes="100vw"
          lqip={unsplashLQ(scenes.farmSunrise)}
          alt="Sunrise over agricultural fields in Andhra Pradesh, India"
          eager
          fallbackLabel="Sunrise over the farm"
          className="h-full w-full"
          imgClassName="object-cover"
        />
      </motion.div>

      {/* Grading: darker on the left for copy legibility, top scrim for the navbar */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/70 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-background via-background/40 to-transparent"
        aria-hidden="true"
      />
      {/* Single soft gold glow anchoring the visual card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[8%] top-[12%] hidden h-[55vh] w-[55vh] rounded-full bg-brand-orange/25 blur-[120px] lg:block"
      />

      {/* Hand-drawn export journey that draws itself in */}
      <HeroSketch reduced={prefersReduced} />

      {/* Content */}
      <motion.div
        style={prefersReduced ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex min-h-[100svh] flex-col pb-16 pt-28 sm:pb-20"
      >
        <Container className="my-auto">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            {/* Left: copy */}
            <div className="flex flex-col items-start">
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: easePremium }}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md"
              >
                <Leaf className="h-4 w-4 text-brand-orange" />
                <span>{site.experience} of agricultural excellence</span>
              </motion.span>

              <h1 className="mt-6 max-w-2xl text-[clamp(2.5rem,4.7vw,4.75rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-white">
                {"Exporting Freshness".split(" ").map((word, i) => (
                  <span key={word} className="inline-block overflow-hidden pb-1 align-bottom">
                    <motion.span
                      className="inline-block"
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: 0.9, delay: 0.15 + i * 0.1, ease: easePremium }}
                    >
                      {word}&nbsp;
                    </motion.span>
                  </span>
                ))}
                <span className="inline-block overflow-hidden pb-1 align-bottom">
                  <motion.span
                    className="inline-block text-gradient-orange"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.9, delay: 0.42, ease: easePremium }}
                  >
                    Beyond Borders.
                  </motion.span>
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.6, ease: easePremium }}
                className="mt-6 max-w-lg text-lead text-white/85"
              >
                Premium Indian fruits, vegetables and spices — sourced at peak
                freshness and shipped under an unbroken cold chain to importers
                across the Gulf and beyond.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.75, ease: easePremium }}
                className="mt-9 flex w-full flex-col items-stretch gap-3 xs:w-auto xs:flex-row xs:flex-wrap xs:items-center xs:gap-4"
              >
                <MagneticButton
                  asChild
                  variant="primary"
                  size="lg"
                  className="w-full xs:w-auto"
                  wrapperClassName="w-full xs:w-auto"
                >
                  <a
                    href={whatsappUrl(site.whatsapp, brandHello("I'd like to start importing."))}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Start Importing
                    <ArrowRight className="h-5 w-5" />
                  </a>
                </MagneticButton>
                <Button
                  variant="glass"
                  size="lg"
                  className="w-full border border-white/20 !bg-white/10 text-white hover:!bg-white/20 xs:w-auto"
                  onClick={() => scrollTo("#products")}
                >
                  Explore Products
                  <ArrowDown className="h-5 w-5" />
                </Button>
              </motion.div>

              {/* Trade identity line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.95 }}
                className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand-orange" />
                  <span>{site.location}</span>
                </span>
                <span className="hidden h-4 w-px bg-white/25 sm:block" aria-hidden="true" />
                <span className="flex items-center gap-2">
                  <Ship className="h-4 w-4 text-brand-orange" />
                  <span>Reefer cold-chain to the Gulf &amp; beyond</span>
                </span>
              </motion.div>

              {/* Export certifications */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.1 }}
                className="mt-5 flex flex-wrap items-center gap-2"
              >
                <span className="mr-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-white/55">
                  <ShieldCheck className="h-4 w-4 text-brand-orange" />
                  <span>Certified</span>
                </span>
                {certified.map((c) => (
                  <span
                    key={c.code}
                    title={c.name}
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm"
                  >
                    {c.code}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right: dotted world map with live export routes */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.35, ease: easePremium }}
              className="relative mx-auto hidden w-full max-w-lg lg:block"
            >
              <WorldRoutes reduced={prefersReduced} />

              {/* Destinations chip */}
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.95, ease: easePremium }}
                className="absolute -right-5 -top-5 z-20 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur-xl"
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/65">
                  Exporting to
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  {exportDestinations.map((d) => (
                    <span key={d.code} title={d.name} className="text-xl leading-none">
                      {d.flag}
                    </span>
                  ))}
                  <span className="ml-1 text-sm font-bold">6+</span>
                </div>
              </motion.div>

              {/* Produce inset â keeps the freshness identity */}
              <div className="absolute -bottom-6 -left-6 z-20 w-36 overflow-hidden rounded-2xl border-2 border-white/20 shadow-soft-lg">
                <div className="relative aspect-[4/3] w-full">
                  <LazyImage
                    src={unsplash(scenes.crates, 600)}
                    lqip={unsplashLQ(scenes.crates)}
                    alt="Export-grade crates of freshly harvested produce"
                    fallbackLabel="Farm-fresh produce"
                    className="h-full w-full"
                    imgClassName="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" aria-hidden="true" />
                  <span className="absolute bottom-2 left-3 text-xs font-semibold text-white">
                    Farm-fresh
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 1 }}
        style={prefersReduced ? undefined : { opacity: contentOpacity }}
        className="absolute inset-x-0 bottom-6 z-10 flex justify-center"
      >
        <span className="flex h-10 w-6 items-start justify-center rounded-full border border-white/40 p-1.5">
          <motion.span
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-2 w-1 rounded-full bg-white/80"
          />
        </span>
      </motion.div>
    </section>
  );
}
