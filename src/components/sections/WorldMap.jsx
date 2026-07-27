import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { StaticGlobe } from "@/components/sections/globe/StaticGlobe";
import { markets, origin } from "@/lib/constants";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

const Globe = lazy(() => import("@/components/sections/globe/Globe"));

function isConstrainedConnection() {
  const conn = typeof navigator !== "undefined" ? navigator.connection : null;
  if (!conn) return false;
  if (conn.saveData) return true;
  const type = conn.effectiveType;
  return type === "slow-2g" || type === "2g" || type === "3g";
}

function GlobeReadyBridge({ onReady, children }) {
  useEffect(() => {
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) onReady();
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [onReady]);

  return children;
}

/**
 * Static Earth is always painted first.
 * R3F Globe loads when near + not constrained; crossfades in when ready.
 */
function GlobeViewport({ reduced }) {
  const ref = useRef(null);
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [liveReady, setLiveReady] = useState(false);
  const [constrained] = useState(() => isConstrainedConnection());

  const onLiveReady = useCallback(() => setLiveReady(true), []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        const isNear = entry.isIntersecting;
        setNear(isNear);
        setPlaying(isNear && entry.intersectionRatio >= 0.12);
        if (!isNear) setLiveReady(false);
      },
      { root: null, rootMargin: "30% 0px", threshold: [0, 0.12, 0.25, 0.5] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const allowLive = !reduced && !constrained;
  const mountLive = allowLive && near;

  return (
    <div ref={ref} className="relative h-full w-full" data-globe-slot="">
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700 ease-out",
          liveReady ? "pointer-events-none opacity-0" : "opacity-100"
        )}
        aria-hidden={liveReady}
      >
        <StaticGlobe priority={near ? "high" : "auto"} loading={near ? "eager" : "lazy"} />
      </div>

      {mountLive ? (
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-out",
            liveReady ? "opacity-100" : "opacity-0"
          )}
        >
          <Suspense fallback={null}>
            <GlobeReadyBridge onReady={onLiveReady}>
              <Globe playing={playing} />
            </GlobeReadyBridge>
          </Suspense>
        </div>
      ) : null}
    </div>
  );
}

export function WorldMap() {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <section aria-label="Global markets" className="section-py relative overflow-x-clip bg-background">
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

          <div className="relative z-[1] -mx-4 h-[min(88vw,34rem)] sm:-mx-6 sm:h-[min(80vw,38rem)] lg:mx-0 lg:-mr-10 lg:h-[min(52vw,42rem)] xl:-mr-16">
            <GlobeViewport reduced={prefersReduced} />
          </div>
        </div>
      </Container>
    </section>
  );
}
