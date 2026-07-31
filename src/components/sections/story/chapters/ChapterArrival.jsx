import { motion } from "motion/react";
import { EnquireActions } from "@/components/shared/EnquireActions";
import { ChapterPill } from "@/components/sections/story/StoryChrome";
import { ArrivalViz } from "@/components/sections/story/ArrivalViz";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { brandHello } from "@/lib/config";
import { cn } from "@/lib/utils";

const START_IMPORTING = brandHello("I'd like to start importing.");

const MARKETS = [
  { city: "Dubai", status: "active" },
  { city: "Riyadh", status: "active" },
  { city: "Doha", status: "active" },
  { city: "Muscat", status: "active" },
  { city: "Kuwait", status: "active" },
  { city: "Europe", status: "soon" },
];

/**
 * Chapter 06. Arrival climax.
 * Matches Chapter 05 polish: one SVG hero + focused copy + markets + CTA.
 * Extra right padding clears the chapter rail.
 */
export function ChapterArrival({ chapter, active }) {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 w-full flex-col justify-center overflow-hidden px-5",
        "pt-[max(5.5rem,12svh)] pb-[max(4.5rem,10svh)] sm:px-8 lg:py-20",
        // Clear right rail ("06 THE ARRIVAL") + bottom chrome
        "lg:pl-10 lg:pr-36 xl:pl-14 xl:pr-44",
        !active && "pointer-events-none"
      )}
    >
      <div className="mx-auto grid w-full max-w-[90rem] items-center gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12 xl:gap-14">
        <div className="min-w-0">
          <ArrivalViz active={active} />
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

          {/* Compact market chips. Not a second dense list inside the viz */}
          <ul className="mt-7 flex flex-wrap gap-2">
            {MARKETS.map((m, i) => {
              const soon = m.status === "soon";
              return (
                <motion.li
                  key={m.city}
                  initial={false}
                  animate={
                    active && !reduced
                      ? { opacity: [0, 1], y: [6, 0] }
                      : { opacity: 1, y: 0 }
                  }
                  transition={{ delay: 0.08 + i * 0.04, duration: 0.35 }}
                >
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold",
                      soon
                        ? "border-brand-orange-bright/45 bg-brand-orange-bright/10 text-brand-orange-bright"
                        : "border-white/12 bg-white/[0.04] text-white/80"
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        soon ? "bg-brand-orange-bright" : "bg-emerald-400"
                      )}
                      aria-hidden="true"
                    />
                    {m.city}
                    {soon ? (
                      <span className="text-[0.55rem] uppercase tracking-[0.08em] opacity-80">
                        Soon
                      </span>
                    ) : null}
                  </span>
                </motion.li>
              );
            })}
          </ul>

          <motion.div
            className="mt-8"
            initial={false}
            animate={
              active && !reduced
                ? { y: [12, 0], opacity: [0, 1] }
                : { y: 0, opacity: 1 }
            }
            transition={{ delay: 0.3, duration: 0.45 }}
          >
            <EnquireActions
              tone="dark"
              label="Start Importing"
              whatsappMessage={START_IMPORTING}
              emailSubject="Export Enquiry — MDF"
              emailBody={START_IMPORTING}
              whatsappClassName="w-full bg-brand-orange-bright text-[#1a0e06] shadow-[0_10px_40px_rgba(255,122,26,0.35)] hover:bg-[#ff8a2a] hover:brightness-100 sm:w-auto"
            />
            <p className="mt-3 text-[0.65rem] font-medium text-white/35">
              From Andhra Pradesh to your port. Same care, every mile.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
