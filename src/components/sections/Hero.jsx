import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import { AnimatePresence, motion, useMotionValue, useTransform } from "motion/react";
import { ArrowDown, MapPin, Ship, ShieldCheck } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { LazyImage } from "@/components/shared/LazyImage";
import { EnquireActions } from "@/components/shared/EnquireActions";
import { Button } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useDocumentScroll } from "@/hooks/useDocumentScroll";
import { useScrollTo } from "@/providers/SmoothScrollProvider";
import { WorldRoutes } from "@/components/sections/hero/WorldRoutes";
import { HeroSketch } from "@/components/sections/hero/HeroSketch";
import { productImages, unsplash, unsplashLQ } from "@/lib/images";
import { certifications, exportDestinations } from "@/lib/constants";
import { brandHello, site } from "@/lib/config";
import { easePremium } from "@/lib/motion";

const START_IMPORTING = brandHello("I'd like to start importing.");

const certified = certifications.filter((c) => c.status === "operating");

const FRESH_PRODUCT_SLIDES = [
  {
    id: "mangoes",
    image: productImages.mangoes,
    alt: "Export-grade Indian mangoes on the farm",
  },
  {
    id: "apple",
    image: productImages.indianApple,
    alt: "Premium Indian apples graded for export",
  },
  {
    id: "pomegranate",
    image: productImages.pomegranate,
    alt: "Deep-red Indian pomegranates for export",
  },
  {
    id: "chilli",
    image: productImages.dryRedChilli,
    alt: "Guntur dry red chillies ready for export",
  },
];

const FRESH_PRODUCT_INTERVAL_MS = 3200;

/** Compact hero inset that cycles the four catalogue products. */
function HeroFreshProductsCard({ reduced = false }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || FRESH_PRODUCT_SLIDES.length < 2) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % FRESH_PRODUCT_SLIDES.length);
    }, FRESH_PRODUCT_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reduced]);

  const slide = FRESH_PRODUCT_SLIDES[index];

  return (
    <div className="absolute -bottom-6 -left-6 z-20 w-36 overflow-hidden rounded-2xl border-2 border-white/20 shadow-soft-lg">
      <div className="relative aspect-[4/3] w-full bg-[#120e0b]">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={slide.id}
            className="absolute inset-0 origin-center will-change-transform"
            initial={reduced ? false : { opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, scale: 0.96 }}
            transition={{ duration: reduced ? 0 : 0.7, ease: easePremium }}
          >
            <LazyImage
              src={unsplash(slide.image, 600)}
              lqip={unsplashLQ(slide.image)}
              alt={slide.alt}
              fallbackLabel="Fresh products"
              eager={index === 0}
              className="h-full w-full"
              imgClassName="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" aria-hidden="true" />
        <span className="absolute bottom-2 left-3 text-xs font-semibold text-white">
          Fresh products
        </span>
      </div>
    </div>
  );
}

/**
 * Hero parallax progress from shared document scroll. No GSAP/ScrollTrigger.
 * For a top-of-page section this matches ST start "top top" / end "bottom top"
 * (and Motion offset ["start start","end start"]): progress = scrollY / height.
 */
function useHeroDocumentProgress(sectionRef, enabled) {
  const { scrollY } = useDocumentScroll();
  const progress = useMotionValue(0);

  useEffect(() => {
    if (!enabled) {
      progress.set(0);
      return undefined;
    }

    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const h = el.offsetHeight || 1;
      const y = scrollY.get();
      progress.set(Math.min(1, Math.max(0, y / h)));
    };

    const unsub = scrollY.on("change", update);
    update();

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    if (ro && sectionRef.current) ro.observe(sectionRef.current);
    window.addEventListener("resize", update, { passive: true });

    return () => {
      unsub();
      ro?.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [sectionRef, enabled, scrollY, progress]);

  return progress;
}

export function Hero() {
  const ref = useRef(null);
  const prefersReduced = usePrefersReducedMotion();
  const scrollTo = useScrollTo();

  const scrollYProgress = useHeroDocumentProgress(ref, !prefersReduced);

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
          src="/hero/farm-sunrise-1600.jpg"
          srcSet={[
            "/hero/farm-sunrise-640.jpg 640w",
            "/hero/farm-sunrise-1080.jpg 1080w",
            "/hero/farm-sunrise-1600.jpg 1600w",
          ].join(", ")}
          sizes="100vw"
          lqip="/hero/farm-sunrise-lq.jpg"
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
            {/* Left: copy — 40+ years + tagline as one hero lockup */}
            <div className="flex flex-col items-start">
              <h1 className="max-w-2xl text-white">
                <motion.span
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: easePremium }}
                  className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1"
                >
                  <span
                    className="text-[clamp(2.75rem,5vw,4.25rem)] font-extrabold leading-none tracking-[-0.04em] text-gradient-gold tabular-nums"
                    aria-label={`${site.experience} of agricultural excellence`}
                  >
                    {prefersReduced ? (
                      "40+"
                    ) : (
                      <CountUp end={40} duration={2.2} suffix="+" />
                    )}
                  </span>
                  <span className="text-[0.7rem] font-bold uppercase leading-snug tracking-[0.18em] text-white/70 sm:text-[0.75rem]">
                    Years of agricultural excellence
                  </span>
                </motion.span>

                <span className="block text-[clamp(2.5rem,4.7vw,4.75rem)] font-extrabold leading-[0.98] tracking-[-0.03em]">
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
                </span>
              </h1>

              {/* LCP element. Paint immediately (no opacity/delay gate). */}
              <p className="mt-6 max-w-lg text-lead text-white/85">
                Indian Banganapalli mango, apples, pomegranate, and Guntur dry red chilli.
                Sourced at peak quality and shipped under an unbroken cold chain
                to importers across the Gulf and beyond.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.75, ease: easePremium }}
                className="mt-9 flex w-full flex-col items-stretch gap-3 xs:w-auto xs:flex-row xs:flex-wrap xs:items-center xs:gap-4"
              >
                <EnquireActions
                  magnetic
                  tone="dark"
                  label="Start Importing"
                  whatsappMessage={START_IMPORTING}
                  emailSubject="Export Enquiry — MDF"
                  emailBody={START_IMPORTING}
                  whatsappClassName="w-full xs:w-auto"
                />
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
                  <span>Compliance</span>
                </span>
                {certified.map((c) => (
                  <span
                    key={c.code}
                    title={c.name}
                    className="rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs font-semibold text-white/90"
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
                className="absolute -right-5 -top-5 z-20 rounded-2xl border border-white/15 bg-black/55 px-4 py-3 text-white"
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

              {/* Fruit inset — cycles mango / apple / pomegranate / chilli */}
              <HeroFreshProductsCard reduced={prefersReduced} />
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
