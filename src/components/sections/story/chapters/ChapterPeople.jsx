import CountUp from "react-countup";
import { motion } from "motion/react";
import { Award, Sprout } from "lucide-react";
import { LazyImage } from "@/components/shared/LazyImage";
import { ChapterPill } from "@/components/sections/story/StoryChrome";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { unsplash, unsplashLQ, unsplashSrcSet } from "@/lib/images";
import { cn } from "@/lib/utils";

const TRUST_STEPS = [
  { n: "01", title: "Meet", desc: "Partner farms" },
  { n: "02", title: "Grow", desc: "Season care" },
  { n: "03", title: "Pick", desc: "Peak moment" },
  { n: "04", title: "Trust", desc: "40+ years" },
];

/**
 * Chapter 02 — Organic immersive storytelling.
 * Unique identity: framed grower portrait + trust timeline + alive counters.
 * Direct Lucide icons (no registry). Title never clips (fluid clamp + wrap).
 */
export function ChapterPeople({ chapter, active }) {
  const reduced = usePrefersReducedMotion();
  const counters = chapter.counters || [];
  const icons = { Award, Sprout };

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 w-full flex-col overflow-hidden lg:flex-row lg:items-center",
        "lg:pr-36 xl:pr-44",
        !active && "pointer-events-none"
      )}
    >
      {/* Contained editorial portrait — smaller, sharper, no full-bleed stretch */}
      <div className="relative flex w-full shrink-0 justify-center px-5 pt-[max(4.5rem,10svh)] sm:px-8 lg:w-[42%] lg:justify-end lg:px-6 lg:pt-24 xl:px-10">
        <div className="relative w-full max-w-[15.5rem] sm:max-w-[18rem] lg:max-w-[20rem]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/12 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
            <LazyImage
              src={unsplash(chapter.image, 900, 88)}
              srcSet={unsplashSrcSet(chapter.image, [480, 640, 768, 960, 1200], 88)}
              sizes="(min-width:1024px) 21rem, 19rem"
              lqip={unsplashLQ(chapter.image)}
              alt="Partner growers in the field"
              fallbackLabel="The Growers"
              eager={active}
              className="absolute inset-0 h-full w-full"
              imgClassName="object-cover object-center"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0c1410]/70 via-transparent to-transparent" />
          </div>

          <motion.blockquote
            className="absolute inset-x-3 bottom-3 z-10 rounded-xl border border-white/15 bg-[#0c1410]/92 p-3 sm:inset-x-4 sm:bottom-4 sm:p-3.5"
            initial={false}
            animate={active && !reduced ? { y: [16, 0], opacity: [0, 1] } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs font-semibold leading-snug text-white sm:text-sm">
              “{chapter.quote}”
            </p>
            <footer className="mt-1.5 text-[0.55rem] font-bold uppercase tracking-[0.16em] text-emerald-400">
              {chapter.quoteAttr}
            </footer>
          </motion.blockquote>
        </div>
      </div>

      {/* Content */}
      <div className="relative flex min-h-0 flex-1 flex-col justify-center px-5 py-7 sm:px-8 lg:px-10 lg:pb-16 lg:pt-24 xl:px-14">
        <div className="mx-auto w-full max-w-lg lg:mx-0">
          <ChapterPill className="border-emerald-500/30 text-emerald-300/90">
            {chapter.pill}
          </ChapterPill>

          <h2 className="mt-4 text-[clamp(1.75rem,4vw,3.25rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-white [overflow-wrap:anywhere]">
            {chapter.title}
          </h2>

          <p className="mt-4 text-[clamp(0.9rem,1.1vw,1.05rem)] leading-relaxed text-white/65">
            {chapter.copy}
          </p>

          {/* Trust timeline — chapter's unique visual idea */}
          <div className="relative mt-7">
            <div
              className="pointer-events-none absolute left-[12%] right-[12%] top-3.5 hidden h-px bg-gradient-to-r from-emerald-500/20 via-emerald-400/50 to-emerald-500/20 sm:block"
              aria-hidden="true"
            />
            <ol className="grid grid-cols-4 gap-2">
              {TRUST_STEPS.map((s, i) => (
                <li key={s.n} className="flex flex-col items-center text-center">
                  <motion.span
                    className="relative z-[1] grid h-7 w-7 place-items-center rounded-full border border-emerald-400/45 bg-[#0c1410] text-[0.55rem] font-bold text-emerald-300"
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

          {/* Alive counters */}
          <div className="mt-7 grid grid-cols-2 gap-3">
            {counters.map((s, i) => {
              const IconCmp = icons[s.icon] || Award;
              return (
                <motion.div
                  key={s.label}
                  className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4"
                  initial={false}
                  animate={
                    active && !reduced
                      ? { y: [12, 0], opacity: [0, 1] }
                      : { y: 0, opacity: 1 }
                  }
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.45 }}
                >
                  <IconCmp className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                  <p className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-300 sm:text-4xl">
                    {active ? (
                      <CountUp
                        key={`${s.label}-live`}
                        end={s.end}
                        duration={2.4}
                        separator=","
                        suffix={s.suffix}
                      />
                    ) : (
                      <span>0{s.suffix}</span>
                    )}
                  </p>
                  <p className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white/45">
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
