import { Suspense, lazy } from "react";
import { motion } from "motion/react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { markets, origin } from "@/lib/constants";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { fadeUp, viewportOnce } from "@/lib/motion";

const Globe = lazy(() => import("@/components/sections/globe/Globe"));

function GlobeFallback() {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="relative h-56 w-56">
        <div className="absolute inset-0 animate-[spin_12s_linear_infinite] rounded-full border border-brand-red/30" />
        <div className="absolute inset-4 animate-[spin_9s_linear_infinite_reverse] rounded-full border border-brand-gold/30" />
        <div className="absolute inset-0 grid place-items-center">
          <span className="text-sm font-medium text-muted-foreground">Loading globe…</span>
        </div>
      </div>
    </div>
  );
}

/** Static Earth used when reduced motion is preferred. */
function StaticGlobe() {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-full border border-border shadow-soft-lg">
        <img
          src="/textures/earth-blue-marble.jpg"
          alt="World map highlighting Universal Traders export markets"
          loading="lazy"
          decoding="async"
          className="h-full w-full scale-[1.4] object-cover"
          style={{ objectPosition: "62% 42%" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 50% 45%, transparent 55%, rgba(0,0,0,0.45) 100%)" }}
          aria-hidden="true"
        />
        <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gold shadow-glow ring-4 ring-brand-gold/25" />
      </div>
    </div>
  );
}

export function WorldMap() {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <section id="markets" className="section-py relative overflow-hidden bg-background">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              contained={false}
              eyebrow="Global Reach"
              title="From Andhra Pradesh to the world."
              description="India highlighted at the origin, with live shipping lanes to the Gulf and Europe glowing on the horizon."
            />
            <div className="mt-8 flex flex-wrap gap-2">
              <Badge variant="gold">Origin · {origin.name}</Badge>
              <Badge variant="success">Active · Gulf markets</Badge>
              <Badge variant="gold">Future · Europe</Badge>
            </div>

            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3"
            >
              {[origin, ...markets].map((m, i) => (
                <motion.li
                  key={m.name}
                  variants={fadeUp}
                  custom={i}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span
                    className={
                      m === origin
                        ? "h-2 w-2 shrink-0 rounded-full bg-brand-gold"
                        : m.status === "future"
                        ? "h-2 w-2 shrink-0 rounded-full bg-brand-gold"
                        : "h-2 w-2 shrink-0 rounded-full bg-success"
                    }
                    aria-hidden="true"
                  />
                  {m.name}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <div className="relative aspect-square w-full">
            <div
              className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-60 blur-3xl"
              style={{ background: "radial-gradient(circle at 50% 45%, rgba(239,35,60,0.25), transparent 60%)" }}
              aria-hidden="true"
            />
            {prefersReduced ? (
              <StaticGlobe />
            ) : (
              <Suspense fallback={<GlobeFallback />}>
                <Globe />
              </Suspense>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
