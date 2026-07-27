import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import { motion } from "motion/react";
import { Container } from "@/components/shared/Container";
import { stats } from "@/lib/constants";
import { fadeUp, fadeUpReduced, motionSafe, viewportOnce } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function Statistics() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const reduced = usePrefersReducedMotion();
  const variants = motionSafe(reduced, fadeUp, fadeUpReduced);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="bg-background py-16 md:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] bg-[#111] px-6 py-16 text-white shadow-soft-lg md:rounded-[2.5rem] md:px-12 md:py-20">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(70% 80% at 50% 0%, rgba(239,35,60,0.35), transparent 70%)",
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-24 left-1/2 h-64 w-[80%] -translate-x-1/2 opacity-30 blur-3xl"
            style={{
              background:
                "radial-gradient(50% 50% at 50% 50%, rgba(253,197,0,0.25), transparent 70%)",
            }}
            aria-hidden="true"
          />
          <div ref={ref} className="relative grid grid-cols-1 gap-8 xs:grid-cols-2 md:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.id}
                variants={variants}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                className="text-center"
              >
                <p className="text-5xl font-extrabold tracking-tight text-gradient-gold md:text-6xl">
                  {inView ? (
                    reduced ? (
                      <>
                        {stat.value.toLocaleString?.() ?? stat.value}
                        {stat.suffix}
                      </>
                    ) : (
                      <CountUp
                        end={stat.value}
                        duration={2.4}
                        separator=","
                        suffix={stat.suffix}
                      />
                    )
                  ) : (
                    <span>0{stat.suffix}</span>
                  )}
                </p>
                <p className="mt-3 text-sm font-medium uppercase tracking-[0.16em] text-white/60">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
