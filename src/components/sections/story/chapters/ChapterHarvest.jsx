import { motion } from "motion/react";
import { Ruler, Palette, Droplets, BadgeCheck } from "lucide-react";
import { LazyImage } from "@/components/shared/LazyImage";
import { ChapterPill } from "@/components/sections/story/StoryChrome";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { unsplash, unsplashLQ, unsplashSrcSet } from "@/lib/images";
import { cn } from "@/lib/utils";

const FEATURE_ICONS = { Ruler, Palette, Droplets, BadgeCheck };

const GRADE_STEPS = [
  { n: "01", title: "Size", desc: "Uniform" },
  { n: "02", title: "Colour", desc: "Peak hue" },
  { n: "03", title: "Sweet", desc: "Brix check" },
  { n: "04", title: "Grade", desc: "Export only" },
];

/**
 * Chapter 03. Peak ripeness.
 * Matches Chapter 02 polish: framed harvest portrait + grading timeline + feature cards.
 * Direct Lucide icons. Rail-safe padding. Warm sunlight atmosphere from shell.
 */
export function ChapterHarvest({ chapter, active }) {
  const reduced = usePrefersReducedMotion();
  const features = chapter.features || [];

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 w-full flex-col overflow-hidden lg:flex-row lg:items-center",
        "lg:pr-36 xl:pr-44",
        !active && "pointer-events-none"
      )}
    >
      {/* Contained harvest portrait */}
      <div className="relative flex w-full shrink-0 justify-center px-5 pt-[max(4.5rem,10svh)] sm:px-8 lg:w-[40%] lg:justify-end lg:px-6 lg:pt-24 xl:px-10">
        <div className="relative w-full max-w-[15.5rem] sm:max-w-[18rem] lg:max-w-[20rem]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-amber-400/20 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
            <LazyImage
              src={unsplash(chapter.image, 900, 88)}
              srcSet={unsplashSrcSet(chapter.image, [480, 640, 768, 960, 1200], 88)}
              sizes="(min-width:1024px) 21rem, 19rem"
              lqip={unsplashLQ(chapter.image)}
              alt="Harvest selected at peak ripeness"
              fallbackLabel="The Harvest"
              eager={active}
              className="absolute inset-0 h-full w-full"
              imgClassName="object-cover object-center"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#151008]/80 via-transparent to-transparent" />
          </div>

          <motion.div
            className="absolute inset-x-3 bottom-3 z-10 rounded-xl border border-amber-400/25 bg-[#151008]/92 px-3 py-3 text-center sm:inset-x-4 sm:bottom-4"
            initial={false}
            animate={active && !reduced ? { y: [16, 0], opacity: [0, 1] } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p
              className="text-[clamp(1.75rem,4vw,2.25rem)] font-extrabold leading-none tracking-[-0.04em]"
              aria-hidden="true"
            >
              <span className="text-brand-orange-bright">FR</span>
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1.75px #ff7a1a" }}
              >
                E
              </span>
              <span className="text-brand-orange-bright">SH</span>
            </p>
            <p className="mt-1.5 text-[0.55rem] font-bold uppercase tracking-[0.16em] text-amber-300/80">
              Peak ripeness only
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="relative flex min-h-0 flex-1 flex-col justify-center px-5 py-7 sm:px-8 lg:px-10 lg:pb-16 lg:pt-24 xl:px-12">
        <div className="mx-auto w-full max-w-lg lg:mx-0">
          <ChapterPill className="border-amber-400/35 text-amber-300">
            {chapter.pill}
          </ChapterPill>

          <h2 className="mt-4 text-[clamp(1.75rem,4vw,3.25rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-white [overflow-wrap:anywhere]">
            {chapter.title}
          </h2>

          <p className="mt-4 text-[clamp(0.9rem,1.1vw,1.05rem)] leading-relaxed text-white/65">
            {chapter.copy}
          </p>

          {/* Grading timeline. Chapter's unique visual idea */}
          <div className="relative mt-7">
            <div
              className="pointer-events-none absolute left-[12%] right-[12%] top-3.5 hidden h-px bg-gradient-to-r from-amber-500/20 via-brand-orange-bright/50 to-amber-500/20 sm:block"
              aria-hidden="true"
            />
            <ol className="grid grid-cols-4 gap-2">
              {GRADE_STEPS.map((s, i) => (
                <li key={s.n} className="flex flex-col items-center text-center">
                  <motion.span
                    className="relative z-[1] grid h-7 w-7 place-items-center rounded-full border border-amber-400/45 bg-[#151008] text-[0.55rem] font-bold text-amber-300"
                    initial={false}
                    animate={
                      active && !reduced
                        ? { scale: [0.7, 1], opacity: [0, 1] }
                        : { scale: 1, opacity: 1 }
                    }
                    transition={{ delay: 0.1 * i, duration: 0.4 }}
                  >
                    {s.n}
                  </motion.span>
                  <p className="mt-2 text-[0.65rem] font-extrabold text-white">{s.title}</p>
                  <p className="mt-0.5 hidden text-[0.55rem] text-white/40 sm:block">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* 2×2 feature cards */}
          <div className="mt-7 grid grid-cols-2 gap-2.5 sm:gap-3">
            {features.map((f, i) => {
              const IconCmp = FEATURE_ICONS[f.icon] || BadgeCheck;
              return (
                <motion.div
                  key={f.n}
                  className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-3.5 sm:p-4"
                  initial={false}
                  animate={
                    active && !reduced
                      ? { y: [12, 0], opacity: [0, 1] }
                      : { y: 0, opacity: 1 }
                  }
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.4 }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <IconCmp className="h-4 w-4 text-brand-orange-bright" aria-hidden="true" />
                    <span className="text-[0.55rem] font-bold tabular-nums text-brand-orange-bright">
                      {f.n}
                    </span>
                  </div>
                  <p className="mt-2.5 text-sm font-extrabold text-white">{f.title}</p>
                  <p className="mt-1 text-[0.7rem] leading-relaxed text-white/50 sm:text-xs">
                    {f.desc}
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
