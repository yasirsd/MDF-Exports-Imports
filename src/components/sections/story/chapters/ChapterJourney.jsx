import { motion } from "motion/react";
import { Snowflake, Ship, Clock } from "lucide-react";
import { ChapterPill } from "@/components/sections/story/StoryChrome";
import { ColdChainViz } from "@/components/sections/story/ColdChainViz";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

const STAT_ICONS = { Snowflake, Ship, Clock };

/**
 * Chapter 05. Logistics visualization.
 * SVG-first cold chain (never an empty image box) + timeline + icon stats.
 * Navy / icy atmosphere owned by the parent shell.
 */
export function ChapterJourney({ chapter, active }) {
  const reduced = usePrefersReducedMotion();
  const timeline = chapter.timeline || [];
  const stats = chapter.stats || [];

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
        {/* Viz column. Always complete without Unsplash */}
        <div className="min-w-0">
          <ColdChainViz active={active} />

          {/* Timeline */}
          <ol className="mt-5 grid grid-cols-5 gap-1 sm:mt-6 sm:gap-2">
            {timeline.map((step, i) => (
              <li key={step.n} className="flex flex-col items-center text-center">
                <motion.span
                  className="grid h-6 w-6 place-items-center rounded-full border border-sky-400/40 bg-[#060b14] text-[0.5rem] font-bold text-sky-300 sm:h-7 sm:w-7 sm:text-[0.55rem]"
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
                <p className="mt-1.5 text-[0.55rem] font-extrabold uppercase tracking-[0.06em] text-sky-100/90 sm:text-[0.6rem]">
                  {step.title}
                </p>
                <p className="mt-0.5 hidden text-[0.5rem] text-sky-200/40 sm:block">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Copy */}
        <div className="min-w-0">
          <ChapterPill className="border-sky-400/35 text-sky-300">{chapter.pill}</ChapterPill>
          <h2 className="mt-4 text-[clamp(1.75rem,3.8vw,3.15rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-white [overflow-wrap:anywhere]">
            {chapter.title}
          </h2>
          <p className="mt-4 max-w-md text-[clamp(0.9rem,1.05vw,1.05rem)] leading-relaxed text-sky-100/60">
            {chapter.copy}
          </p>

          {/* Always 3-up from sm. Never a tall empty stack on desktop */}
          <div className="mt-7 grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
            {stats.map((s, i) => {
              const IconCmp = STAT_ICONS[s.icon] || Snowflake;
              return (
                <motion.div
                  key={s.label}
                  className="rounded-2xl border border-sky-400/20 bg-sky-400/[0.06] p-3.5 sm:p-4"
                  initial={false}
                  animate={
                    active && !reduced
                      ? { y: [10, 0], opacity: [0, 1] }
                      : { y: 0, opacity: 1 }
                  }
                  transition={{ delay: 0.12 + i * 0.08, duration: 0.4 }}
                >
                  <IconCmp className="h-4 w-4 text-sky-300" aria-hidden="true" />
                  <p className="mt-2.5 text-lg font-extrabold tracking-tight text-sky-200 sm:text-xl">
                    {s.value}
                  </p>
                  <p className="mt-1 text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-sky-200/45">
                    {s.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
