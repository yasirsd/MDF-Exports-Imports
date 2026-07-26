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
      <span className="text-sm font-medium text-muted-foreground">Loading globe…</span>
    </div>
  );
}

/** Static Earth used when reduced motion is preferred — no circular frame. */
function StaticGlobe() {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="relative aspect-square w-full max-w-md overflow-visible">
        <img
          src="/textures/earth-blue-marble.jpg"
          alt="World map highlighting MDF Exports & Imports export markets"
          loading="lazy"
          decoding="async"
          className="h-full w-full scale-[1.15] object-cover"
          style={{
            objectPosition: "62% 42%",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 50%, #000 58%, transparent 72%)",
            maskImage:
              "radial-gradient(circle at 50% 50%, #000 58%, transparent 72%)",
          }}
        />
        <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gold shadow-[0_0_12px_rgba(253,197,0,0.55)]" />
      </div>
    </div>
  );
}

export function WorldMap() {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <section id="markets" className="section-py relative overflow-x-clip bg-background">
      <Container className="relative z-[1]">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-6 xl:gap-10">
          <div className="relative z-[2]">
            <SectionHeading
              contained={false}
              eyebrow="Global Reach"
              title="From Andhra Pradesh to the world."
              description="India highlighted at the origin, with live shipping lanes to the Gulf — and future lanes across Africa, the Americas, Asia-Pacific, and Europe."
            />
            <div className="mt-8 flex flex-wrap gap-2">
              <Badge variant="gold">Origin · {origin.name}</Badge>
              <Badge variant="success">Active · Gulf markets</Badge>
              <Badge variant="gold">Future · Global expansion</Badge>
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

          {/* Globe stage — open edges, no circular crop / red halo */}
          <div className="relative z-[1] -mx-4 h-[min(88vw,34rem)] sm:-mx-6 sm:h-[min(80vw,38rem)] lg:mx-0 lg:-mr-10 lg:h-[min(52vw,42rem)] xl:-mr-16">
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
