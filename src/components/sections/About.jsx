import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "motion/react";
import { LegacyRail } from "@/components/sections/legacy/LegacyRail";
import { MilestonePanel } from "@/components/sections/legacy/MilestonePanels";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useLenis } from "@/providers/SmoothScrollProvider";
import { legacyMilestones } from "@/lib/constants";

/**
 * Our Story — cinematic legacy timeline.
 * Sticky glass spine + full-viewport editorial chapters.
 */
export function About() {
  const reduced = usePrefersReducedMotion();
  const lenis = useLenis();
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [unlocked, setUnlocked] = useState(() => new Set([0]));
  const [sectionInView, setSectionInView] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const closingOpacity = useTransform(scrollYProgress, [0.9, 1], [0.2, 1]);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    if (reduced) {
      setProgressValue(1);
      setUnlocked(new Set(legacyMilestones.map((_, i) => i)));
      return undefined;
    }
    return progress.on("change", (v) => setProgressValue(v));
  }, [progress, reduced]);

  // Mobile year strip is position:fixed — only show while Our Story is on screen.
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return undefined;

    const io = new IntersectionObserver(
      ([entry]) => setSectionInView(entry.isIntersecting && entry.intersectionRatio > 0.05),
      { threshold: [0, 0.05, 0.12, 0.25], rootMargin: "-8% 0px -12% 0px" }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return undefined;

    const nodes = root.querySelectorAll("[data-legacy-index]");
    if (!nodes.length) return undefined;

    const ratios = new Map();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const idx = Number(entry.target.getAttribute("data-legacy-index"));
          if (Number.isNaN(idx)) continue;
          ratios.set(idx, entry.isIntersecting ? entry.intersectionRatio : 0);
          if (entry.isIntersecting) {
            setUnlocked((prev) => {
              if (prev.has(idx)) return prev;
              const next = new Set(prev);
              next.add(idx);
              return next;
            });
          }
        }

        let best = 0;
        let bestRatio = -1;
        for (const [idx, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = idx;
          }
        }
        if (bestRatio > 0) setActiveIndex(best);
      },
      {
        root: null,
        threshold: [0.2, 0.4, 0.55, 0.7],
        rootMargin: "-18% 0px -28% 0px",
      }
    );

    nodes.forEach((node, i) => {
      node.setAttribute("data-legacy-index", String(i));
      io.observe(node);
    });

    return () => io.disconnect();
  }, []);

  const scrollToMilestone = useCallback(
    (i) => {
      const el = document.getElementById(`legacy-${legacyMilestones[i]?.id}`);
      if (!el) return;
      if (lenis) lenis.scrollTo(el, { offset: -72, duration: 1.15 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [lenis]
  );

  const milestones = useMemo(() => legacyMilestones, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="Our story — company legacy timeline"
      className="relative overflow-x-clip bg-[#070605] text-white"
    >
      {/* Soft page wash — no hard panel edges */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 10% 6%, rgba(255,122,26,0.08), transparent 55%), radial-gradient(ellipse 60% 40% at 92% 35%, rgba(30,22,14,0.45), transparent 60%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, #000 6%, #000 94%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, #000 6%, #000 94%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Compact intro — clears fixed navbar, no clipping */}
      <header className="relative z-[1] mx-auto max-w-[90rem] px-5 pb-8 pt-28 sm:px-8 sm:pt-32 lg:px-12 lg:pb-10 lg:pt-36">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-brand-orange-bright">
          Our Story
        </p>
        <h2 className="mt-3 max-w-4xl text-[clamp(2.1rem,4.8vw,3.75rem)] font-extrabold leading-[1.04] tracking-[-0.035em]">
          Four decades of freshness,
          <span className="text-white/90"> now global.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-[clamp(0.95rem,1.1vw,1.125rem)] leading-relaxed text-white/58">
          Follow the spine. Each year unlocks a chapter — from MD Fruits in Andhra Pradesh
          to MDF Exports & Imports, delivering freshness across the Gulf and beyond.
        </p>
      </header>

      <div className="relative mx-auto flex max-w-[90rem] gap-5 px-4 pb-28 sm:gap-7 sm:px-8 lg:gap-10 lg:px-12 lg:pb-36">
        <aside className="sticky top-[18svh] z-20 hidden self-start sm:block">
          <LegacyRail
            milestones={milestones}
            progress={progressValue}
            activeIndex={activeIndex}
            onSelect={scrollToMilestone}
          />
        </aside>

        {/* Mobile year strip — fixed, but only while #about is in view */}
        <div
          className={[
            "fixed bottom-20 left-1/2 z-30 flex -translate-x-1/2 gap-1.5 rounded-full border border-white/15 bg-black/70 px-2 py-1.5 backdrop-blur-xl transition-[opacity,visibility,transform] duration-300 sm:hidden",
            sectionInView
              ? "pointer-events-auto visible translate-y-0 opacity-100"
              : "pointer-events-none invisible translate-y-3 opacity-0",
          ].join(" ")}
          aria-hidden={!sectionInView}
        >
          {milestones.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => scrollToMilestone(i)}
              tabIndex={sectionInView ? 0 : -1}
              className={cnYear(activeIndex === i)}
              aria-label={m.year}
            >
              {m.year === "Today" ? "Now" : m.year.slice(2)}
            </button>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          {milestones.map((m, i) => (
            <MilestonePanel
              key={m.id}
              milestone={m}
              active={activeIndex === i}
              unlocked={unlocked.has(i) || reduced}
            />
          ))}

          <motion.p
            className="pb-6 text-center text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/35"
            style={{ opacity: closingOpacity }}
          >
            The journey continues
          </motion.p>
        </div>
      </div>
    </section>
  );
}

function cnYear(active) {
  return [
    "min-w-9 rounded-full px-2 py-1.5 text-[0.6rem] font-bold tabular-nums transition-colors",
    active
      ? "bg-brand-orange-bright text-[#1a0e06]"
      : "text-white/55 hover:text-white",
  ].join(" ");
}
