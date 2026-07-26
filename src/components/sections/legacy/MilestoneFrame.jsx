import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/**
 * Soft atmospheres — color blooms, never hard rectangular panels.
 */
const ACCENTS = {
  warm: {
    glow: "radial-gradient(ellipse 70% 60% at 18% 28%, rgba(255,140,40,0.22), transparent 68%), radial-gradient(ellipse 50% 45% at 72% 70%, rgba(120,50,15,0.12), transparent 70%)",
    pill: "border-brand-orange-bright/45 text-brand-orange-bright bg-brand-orange-bright/10",
    watermark: "text-brand-orange-bright/[0.06]",
  },
  green: {
    glow: "radial-gradient(ellipse 65% 55% at 78% 22%, rgba(74,160,90,0.2), transparent 68%), radial-gradient(ellipse 45% 40% at 25% 75%, rgba(30,70,40,0.14), transparent 70%)",
    pill: "border-emerald-400/40 text-emerald-300 bg-emerald-400/10",
    watermark: "text-emerald-400/[0.06]",
  },
  earth: {
    glow: "radial-gradient(ellipse 60% 55% at 42% 78%, rgba(200,140,60,0.16), transparent 68%), radial-gradient(ellipse 45% 40% at 80% 25%, rgba(90,55,20,0.12), transparent 70%)",
    pill: "border-amber-400/40 text-amber-200 bg-amber-400/10",
    watermark: "text-amber-300/[0.06]",
  },
  ice: {
    glow: "radial-gradient(ellipse 65% 55% at 68% 28%, rgba(56,170,230,0.18), transparent 68%), radial-gradient(ellipse 45% 40% at 20% 72%, rgba(20,50,90,0.14), transparent 70%)",
    pill: "border-sky-400/40 text-sky-300 bg-sky-400/10",
    watermark: "text-sky-300/[0.06]",
  },
  amber: {
    glow: "radial-gradient(ellipse 65% 55% at 28% 32%, rgba(255,122,26,0.2), transparent 68%), radial-gradient(ellipse 50% 45% at 85% 65%, rgba(100,45,10,0.12), transparent 70%)",
    pill: "border-brand-orange-bright/45 text-brand-orange-bright bg-brand-orange-bright/10",
    watermark: "text-brand-orange-bright/[0.06]",
  },
  cinematic: {
    glow: "radial-gradient(ellipse 70% 50% at 50% 12%, rgba(255,130,30,0.2), transparent 65%), radial-gradient(ellipse 50% 45% at 20% 80%, rgba(90,40,10,0.12), transparent 70%)",
    pill: "border-brand-orange-bright/50 text-brand-orange-bright bg-brand-orange-bright/10",
    watermark: "text-brand-orange-bright/[0.07]",
  },
};

const GLOW_MASK = {
  WebkitMaskImage:
    "radial-gradient(ellipse 86% 78% at 50% 48%, #000 0%, #000 32%, transparent 76%)",
  maskImage:
    "radial-gradient(ellipse 86% 78% at 50% 48%, #000 0%, #000 32%, transparent 76%)",
};

const EASE = [0.16, 1, 0.3, 1];

/**
 * Full-viewport editorial frame with scroll parallax + active choreography.
 */
export function MilestoneFrame({
  milestone,
  active,
  unlocked,
  children,
  className,
}) {
  const reduced = usePrefersReducedMotion();
  const accent = ACCENTS[milestone.accent] || ACCENTS.warm;
  const show = unlocked || active;
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const watermarkY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [48, -56]);
  const watermarkX = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [12, -18]);
  const glowY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-28, 36]);
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], reduced ? [1, 1, 1] : [0.96, 1.04, 0.98]);
  const mediaY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [36, -28]);

  return (
    <section
      ref={sectionRef}
      id={`legacy-${milestone.id}`}
      data-legacy-index
      aria-label={`${milestone.year}: ${milestone.title}`}
      className={cn(
        "relative flex min-h-[100svh] scroll-mt-24 flex-col justify-center overflow-visible py-16 sm:py-20 lg:min-h-[100svh] lg:py-24",
        className
      )}
    >
      {/* Atmosphere — drifts with scroll */}
      <motion.div
        className="pointer-events-none absolute -inset-x-6 -inset-y-20 sm:-inset-x-10"
        style={{
          background: accent.glow,
          y: glowY,
          scale: glowScale,
          ...GLOW_MASK,
        }}
        animate={
          reduced
            ? { opacity: show ? 1 : 0.28 }
            : active
              ? { opacity: [0.85, 1, 0.9] }
              : { opacity: show ? 0.55 : 0.22 }
        }
        transition={
          active && !reduced
            ? { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.7 }
        }
        aria-hidden="true"
      />

      {/* Year watermark — parallax drift */}
      <motion.p
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute right-2 top-10 select-none text-[clamp(4.5rem,14vw,9rem)] font-extrabold leading-none tracking-[-0.06em] sm:right-4 lg:top-14",
          accent.watermark
        )}
        style={{ y: watermarkY, x: watermarkX }}
        animate={{
          opacity: show ? (active ? 1 : 0.55) : 0.28,
          scale: active && !reduced ? 1.02 : 1,
        }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        {milestone.year}
      </motion.p>

      <motion.div
        initial={false}
        animate={
          show
            ? { opacity: 1, y: 0 }
            : reduced
              ? { opacity: 0.45, y: 0 }
              : { opacity: 0.3, y: 32 }
        }
        transition={{ duration: 0.7, ease: EASE }}
        className="relative z-[1] w-full"
      >
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <motion.span
            key={`pill-${milestone.id}-${active}`}
            initial={reduced ? false : { opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className={cn(
              "inline-flex rounded-full border px-3.5 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em]",
              accent.pill
            )}
          >
            {milestone.pill}
          </motion.span>
          {active ? (
            <motion.span
              initial={reduced ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="inline-flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-brand-orange-bright"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-orange-bright" />
              Now reading
            </motion.span>
          ) : null}
        </div>

        <motion.h3
          key={`title-${milestone.id}-${active}`}
          initial={false}
          animate={
            active || show
              ? { opacity: 1, y: 0, letterSpacing: "-0.035em" }
              : { opacity: 0.45, y: 18 }
          }
          transition={{ duration: 0.6, delay: active && !reduced ? 0.05 : 0, ease: EASE }}
          className="max-w-3xl text-[clamp(2rem,4.2vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.035em] text-white [overflow-wrap:anywhere]"
        >
          {milestone.title}
        </motion.h3>

        <motion.p
          initial={false}
          animate={show ? { opacity: 1, y: 0 } : { opacity: 0.35, y: 20 }}
          transition={{ duration: 0.55, delay: show && !reduced ? 0.1 : 0, ease: EASE }}
          className="mt-4 max-w-2xl text-[clamp(1rem,1.15vw,1.15rem)] leading-relaxed text-white/65"
        >
          {milestone.copy}
        </motion.p>

        <motion.div
          initial={false}
          animate={{ opacity: show ? 1 : 0.25 }}
          transition={{ duration: 0.65, delay: show && !reduced ? 0.14 : 0, ease: EASE }}
          className="mt-9 w-full"
        >
          <motion.div style={reduced ? undefined : { y: mediaY }}>
            {children}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
