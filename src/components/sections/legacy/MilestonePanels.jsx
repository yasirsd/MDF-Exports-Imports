import { memo } from "react";
import CountUp from "react-countup";
import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import { LazyImage } from "@/components/shared/LazyImage";
import { MilestoneFrame } from "@/components/sections/legacy/MilestoneFrame";
import {
  InfraViz,
  LaunchRoutesViz,
  NetworkViz,
  RegionalMapViz,
  TodayPresenceViz,
} from "@/components/sections/legacy/legacyViz";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { unsplash, unsplashLQ, unsplashSrcSet } from "@/lib/images";
import { easePremium } from "@/lib/motion";
import { cn } from "@/lib/utils";

function MaskImage({ id, alt, className, eager, imgClassName, active }) {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] border border-white/12 shadow-[0_28px_70px_rgba(0,0,0,0.4)]",
        className
      )}
    >
      <motion.div
        className="absolute inset-0 h-full w-full"
        initial={false}
        animate={
          reduced
            ? { scale: 1, x: 0, y: 0 }
            : active
              ? { scale: [1.04, 1.1], x: [0, -12], y: [0, -8] }
              : { scale: 1.04, x: 0, y: 0 }
        }
        transition={
          active && !reduced
            ? { duration: 14, repeat: Infinity, repeatType: "reverse", ease: "linear" }
            : { duration: 0.8, ease: easePremium }
        }
      >
        <LazyImage
          src={unsplash(id, 1400, 88)}
          srcSet={unsplashSrcSet(id, [640, 800, 1080, 1400], 88)}
          sizes="(min-width:1024px) 48vw, 92vw"
          lqip={unsplashLQ(id)}
          alt={alt}
          fallbackLabel={alt}
          eager={eager}
          className="absolute inset-0 h-full w-full"
          imgClassName={cn("object-cover object-center", imgClassName)}
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
    </div>
  );
}

function StaggerIn({ active, children, className, delay = 0 }) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      className={className}
      initial={false}
      animate={
        reduced
          ? { opacity: 1, y: 0 }
          : active
            ? { opacity: 1, y: 0 }
            : { opacity: 0.85, y: 12 }
      }
      transition={{ duration: 0.55, delay: active && !reduced ? delay : 0, ease: easePremium }}
    >
      {children}
    </motion.div>
  );
}

function ChipList({ items, active, tone = "emerald" }) {
  const reduced = usePrefersReducedMotion();
  const tones = {
    emerald: "border-emerald-400/35 bg-emerald-400/10 text-emerald-100",
    sky: "border-sky-400/35 bg-sky-400/10 text-sky-100",
  };

  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <motion.li
          key={item}
          initial={false}
          animate={
            reduced
              ? { opacity: 1, y: 0 }
              : active
                ? { opacity: 1, y: 0 }
                : { opacity: 0.5, y: 8 }
          }
          transition={{
            duration: 0.4,
            delay: active && !reduced ? 0.15 + i * 0.06 : 0,
            ease: easePremium,
          }}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-xs font-semibold",
            tones[tone]
          )}
        >
          {item}
        </motion.li>
      ))}
    </ul>
  );
}

/** 1984 — immersive origin split */
function OriginPanel({ milestone, active, unlocked }) {
  const live = active || unlocked;
  const reduced = usePrefersReducedMotion();
  return (
    <MilestoneFrame milestone={milestone} active={active} unlocked={unlocked}>
      <div className="grid items-stretch gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        <StaggerIn active={active} delay={0.05}>
          <div className="relative">
            <MaskImage
              id={milestone.image}
              alt={milestone.title}
              className="aspect-[16/11] w-full lg:aspect-[5/4] lg:min-h-[22rem]"
              eager={active}
              active={active}
            />
            <div
              className="pointer-events-none absolute inset-0 rounded-[1.75rem] opacity-[0.14] mix-blend-overlay"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              }}
              aria-hidden="true"
            />
          </div>
        </StaggerIn>
        <StaggerIn active={active} delay={0.14} className="flex flex-col justify-end gap-4">
          <motion.div
            animate={active && !reduced ? { y: [0, -3, 0] } : { y: 0 }}
            transition={
              active && !reduced
                ? { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.3 }
            }
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-2 text-sm font-semibold text-white/80"
          >
            <MapPin className="h-4 w-4 text-brand-orange-bright" aria-hidden="true" />
            {milestone.location}
          </motion.div>
          <div className="rounded-[1.75rem] border border-brand-orange-bright/30 bg-gradient-to-br from-brand-orange-bright/15 to-transparent p-6 sm:p-7">
            <p className="text-[clamp(3rem,6vw,4.5rem)] font-extrabold leading-none tracking-tight text-brand-orange-bright">
              {active ? (
                <CountUp end={milestone.stat.end} duration={2.2} suffix={milestone.stat.suffix} />
              ) : live ? (
                <>
                  {milestone.stat.end}
                  {milestone.stat.suffix}
                </>
              ) : (
                <span>0{milestone.stat.suffix}</span>
              )}
            </p>
            <p className="mt-2 text-base font-semibold text-white/70">{milestone.stat.label}</p>
          </div>
        </StaggerIn>
      </div>
    </MilestoneFrame>
  );
}

/** 1998 — map + landscape */
function RegionalPanel({ milestone, active, unlocked }) {
  return (
    <MilestoneFrame milestone={milestone} active={active} unlocked={unlocked}>
      <div className="grid items-stretch gap-5 lg:grid-cols-2 lg:gap-8">
        <StaggerIn active={active} delay={0.04}>
          <RegionalMapViz active={active} />
        </StaggerIn>
        <StaggerIn active={active} delay={0.12} className="flex flex-col gap-4">
          <MaskImage
            id={milestone.image}
            alt={milestone.title}
            className="aspect-[16/11] w-full flex-1 lg:min-h-[18rem]"
            eager={active}
            active={active}
          />
          {milestone.highlights?.length ? (
            <ChipList items={milestone.highlights} active={active} tone="emerald" />
          ) : null}
        </StaggerIn>
      </div>
    </MilestoneFrame>
  );
}

/** 2010 — people + ecosystem */
function NetworkPanel({ milestone, active, unlocked }) {
  const live = active || unlocked;
  return (
    <MilestoneFrame milestone={milestone} active={active} unlocked={unlocked}>
      <div className="grid items-stretch gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <StaggerIn active={active} delay={0.04}>
          <MaskImage
            id={milestone.image}
            alt={milestone.title}
            className="aspect-[16/11] w-full lg:aspect-auto lg:min-h-[22rem]"
            eager={active}
            active={active}
          />
        </StaggerIn>
        <StaggerIn active={active} delay={0.12}>
          <NetworkViz
            active={active}
            stats={(milestone.stats || []).map((s) => ({
              ...s,
              display: active ? (
                <CountUp end={s.end} duration={2.2} suffix={s.suffix} separator="," />
              ) : live ? (
                <>
                  {s.end.toLocaleString?.() ?? s.end}
                  {s.suffix}
                </>
              ) : (
                <>0{s.suffix}</>
              ),
            }))}
          />
        </StaggerIn>
      </div>
    </MilestoneFrame>
  );
}

/** 2020 — infra */
function InfraPanel({ milestone, active, unlocked }) {
  return (
    <MilestoneFrame milestone={milestone} active={active} unlocked={unlocked}>
      <div className="grid items-stretch gap-5 lg:grid-cols-2 lg:gap-8">
        <StaggerIn active={active} delay={0.04}>
          <InfraViz active={active} />
        </StaggerIn>
        <StaggerIn active={active} delay={0.12} className="flex flex-col gap-4">
          <MaskImage
            id={milestone.image}
            alt={milestone.title}
            className="aspect-[16/11] w-full flex-1 lg:min-h-[18rem]"
            eager={active}
            active={active}
          />
          {milestone.chips?.length ? (
            <ChipList items={milestone.chips} active={active} tone="sky" />
          ) : null}
        </StaggerIn>
      </div>
    </MilestoneFrame>
  );
}

/** 2024 — launch */
function LaunchPanel({ milestone, active, unlocked }) {
  return (
    <MilestoneFrame milestone={milestone} active={active} unlocked={unlocked}>
      <div className="grid items-stretch gap-5 lg:grid-cols-2 lg:gap-8">
        <StaggerIn active={active} delay={0.04}>
          <MaskImage
            id={milestone.image}
            alt={milestone.title}
            className="aspect-[16/10] w-full lg:min-h-[18rem]"
            eager={active}
            active={active}
          />
        </StaggerIn>
        <StaggerIn active={active} delay={0.12}>
          <LaunchRoutesViz active={active} routes={milestone.routes} />
        </StaggerIn>
      </div>
    </MilestoneFrame>
  );
}

/** Today — closing */
function TodayPanel({ milestone, active, unlocked }) {
  return (
    <MilestoneFrame milestone={milestone} active={active} unlocked={unlocked}>
      <div className="grid items-stretch gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        <StaggerIn active={active} delay={0.04}>
          <div className="relative overflow-hidden rounded-[1.75rem] border border-brand-orange-bright/25">
            <MaskImage
              id={milestone.image}
              alt={milestone.title}
              className="aspect-[16/10] w-full border-0 lg:min-h-[20rem]"
              eager={active}
              active={active}
            />
            <motion.p
              initial={false}
              animate={active ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 8 }}
              transition={{ duration: 0.5, delay: active ? 0.2 : 0, ease: easePremium }}
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 text-base font-semibold leading-snug text-white sm:p-7 sm:text-lg"
            >
              {milestone.closing}
            </motion.p>
          </div>
        </StaggerIn>
        <StaggerIn active={active} delay={0.14}>
          <TodayPresenceViz markets={milestone.markets} active={active} />
        </StaggerIn>
      </div>
    </MilestoneFrame>
  );
}

const PANELS = {
  origin: OriginPanel,
  regional: RegionalPanel,
  network: NetworkPanel,
  infra: InfraPanel,
  launch: LaunchPanel,
  today: TodayPanel,
};

/** Memo — inactive milestones skip reconcile when only the active index changes. */
export const MilestonePanel = memo(function MilestonePanel({
  milestone,
  active,
  unlocked,
}) {
  const Comp = PANELS[milestone.layout] || OriginPanel;
  return <Comp milestone={milestone} active={active} unlocked={unlocked} />;
});
