import { motion } from "motion/react";
import { Package, ShieldCheck, Tag } from "lucide-react";
import { ChapterPill } from "@/components/sections/story/StoryChrome";
import { PackhouseViz } from "@/components/sections/story/PackhouseViz";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

const CHIP_ICONS = [Package, ShieldCheck, Tag];

/**
 * Chapter 04. Packhouse care.
 * Matches Chapter 05 polish: SVG-first PackhouseViz + process timeline + chips.
 * No Unsplash dependency for the hero. Rail-safe padding.
 */
export function ChapterCare({ chapter, active }) {
  const reduced = usePrefersReducedMotion();
  const steps = chapter.processSteps || [];
  const chips = chapter.chips || [];

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 w-full flex-col justify-center overflow-hidden px-5",
        "pt-[max(5.5rem,12svh)] pb-[max(4.5rem,10svh)] sm:px-8 lg:py-20",
        "lg:pl-10 lg:pr-36 xl:pl-14 xl:pr-44",
        !active && "pointer-events-none"
      )}
    >
      <div className="mx-auto grid w-full max-w-[90rem] items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 xl:gap-12">
        <div className="min-w-0">
          <PackhouseViz active={active} />

          <ol className="mt-5 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-3">
            {steps.map((step, i) => (
              <li key={step.n} className="flex flex-col items-center text-center">
                <motion.span
                  className="grid h-7 w-7 place-items-center rounded-full border border-brand-orange-bright/40 bg-[#0e0e10] text-[0.55rem] font-bold text-brand-orange-bright"
                  initial={false}
                  animate={
                    active && !reduced
                      ? { scale: [0.75, 1], opacity: [0, 1] }
                      : { scale: 1, opacity: 1 }
                  }
                  transition={{ delay: 0.08 * i, duration: 0.35 }}
                >
                  {step.n}
                </motion.span>
                <p className="mt-1.5 text-[0.65rem] font-extrabold uppercase tracking-[0.06em] text-white/90">
                  {step.title}
                </p>
                <p className="mt-0.5 hidden text-[0.55rem] text-white/40 sm:block">
                  {step.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="min-w-0 max-w-md">
          <ChapterPill className="border-brand-orange-bright/40 text-brand-orange-bright">
            {chapter.pill}
          </ChapterPill>

          <h2 className="mt-4 text-[clamp(1.75rem,3.8vw,3.15rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-white [overflow-wrap:anywhere]">
            {chapter.title}
          </h2>

          <p className="mt-4 text-[clamp(0.9rem,1.05vw,1.05rem)] leading-relaxed text-white/60">
            {chapter.copy}
          </p>

          {chapter.overlayQuote ? (
            <motion.blockquote
              className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              initial={false}
              animate={
                active && !reduced
                  ? { y: [10, 0], opacity: [0, 1] }
                  : { y: 0, opacity: 1 }
              }
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <p className="text-sm font-semibold leading-snug text-white/85">
                “{chapter.overlayQuote}”
              </p>
            </motion.blockquote>
          ) : null}

          <ul className="mt-6 flex flex-col gap-2.5">
            {chips.map((chip, i) => {
              const IconCmp = CHIP_ICONS[i] || Package;
              return (
                <motion.li
                  key={chip}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3"
                  initial={false}
                  animate={
                    active && !reduced
                      ? { x: [10, 0], opacity: [0, 1] }
                      : { x: 0, opacity: 1 }
                  }
                  transition={{ delay: 0.22 + i * 0.07, duration: 0.35 }}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-orange-bright/12 text-brand-orange-bright">
                    <IconCmp className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-white/85">{chip}</span>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
