import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Icon } from "@/components/shared/Icon";
import { LazyImage } from "@/components/shared/LazyImage";
import { processStages } from "@/lib/constants";
import { unsplash, unsplashLQ, unsplashSrcSet } from "@/lib/images";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

function StageCard({ stage, index }) {
  return (
    <div className="group relative flex h-[62vh] max-h-[540px] min-h-[380px] w-[78vw] shrink-0 flex-col overflow-hidden rounded-4xl border border-border bg-surface shadow-soft sm:w-[46vw] lg:w-[30vw]">
      <div className="relative flex-1 overflow-hidden">
        <LazyImage
          src={unsplash(stage.image, 900)}
          srcSet={unsplashSrcSet(stage.image)}
          sizes="(min-width:1024px) 30vw, (min-width:640px) 46vw, 78vw"
          lqip={unsplashLQ(stage.image)}
          alt={`${stage.title} — export process step ${stage.step}`}
          fallbackLabel={stage.title}
          className="h-full w-full"
          imgClassName="object-cover transition-transform duration-900 ease-premium group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/25" aria-hidden="true" />
        <span className="absolute left-5 top-4 text-6xl font-extrabold text-white/85 drop-shadow-lg">
          {stage.step}
        </span>
        <span className="absolute right-5 top-5 grid h-14 w-14 place-items-center rounded-2xl bg-white/15 text-white backdrop-blur-md">
          <Icon name={stage.icon} className="h-7 w-7" />
        </span>
      </div>
      <div className="p-7">
        <h3 className="text-2xl font-extrabold">{stage.title}</h3>
        <p className="mt-2 text-muted-foreground">{stage.desc}</p>
        {index < processStages.length - 1 ? (
          <span className="mt-5 flex h-1 w-full overflow-hidden rounded-full bg-border">
            <span className="block h-full w-1/3 rounded-full bg-gradient-to-r from-brand-red to-brand-orange" />
          </span>
        ) : (
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-success">
            Delivered fresh
          </span>
        )}
      </div>
    </div>
  );
}

export function ExportProcess() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const prefersReduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (prefersReduced) return undefined;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return undefined;

    const ctx = gsap.context(() => {
      const getScrollDistance = () => track.scrollWidth - window.innerWidth + 96;

      gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section id="process" className="relative bg-surface-2">
      <div className="section-py pb-0">
        <Container>
          <SectionHeading
            contained={false}
            eyebrow="Farm to Port"
            title="Nine steps. One standard: fresh."
            description="A transparent, controlled journey from the farm gate to your destination port."
          />
        </Container>
      </div>

      {prefersReduced ? (
        <Container>
          <div className="mt-12 grid gap-5 pb-24 sm:grid-cols-2 lg:grid-cols-3">
            {processStages.map((stage) => (
              <div key={stage.step} className="overflow-hidden rounded-3xl border border-border bg-surface shadow-soft">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <LazyImage
                    src={unsplash(stage.image, 700)}
                    srcSet={unsplashSrcSet(stage.image)}
                    sizes="(min-width:768px) 33vw, (min-width:640px) 50vw, 100vw"
                    lqip={unsplashLQ(stage.image)}
                    alt={`${stage.title} — export process step ${stage.step}`}
                    fallbackLabel={stage.title}
                    className="h-full w-full"
                    imgClassName="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" aria-hidden="true" />
                  <span className="absolute left-4 top-3 text-4xl font-extrabold text-white/85 drop-shadow">{stage.step}</span>
                  <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-white backdrop-blur-md">
                    <Icon name={stage.icon} className="h-5 w-5" />
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-extrabold">{stage.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{stage.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      ) : (
        <div ref={sectionRef} className="relative h-[100svh] overflow-hidden">
          <div className="flex h-full items-center">
            <div ref={trackRef} className="flex gap-6 pl-6 pr-24 sm:pl-8 lg:pl-10 will-change-transform">
              {processStages.map((stage, i) => (
                <StageCard key={stage.step} stage={stage} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
