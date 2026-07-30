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
          srcSet={unsplashSrcSet(stage.image, [480, 640, 768, 960], 80)}
          sizes="(min-width:1024px) 30vw, (min-width:640px) 46vw, 78vw"
          lqip={unsplashLQ(stage.image)}
          alt={`${stage.title}. Export process step ${stage.step}`}
          fallbackLabel={stage.title}
          className="h-full w-full"
          imgClassName="object-cover transition-transform duration-900 ease-premium group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/25" aria-hidden="true" />
        <span className="absolute left-5 top-4 text-6xl font-extrabold text-white/85 drop-shadow-lg">
          {stage.step}
        </span>
        <span className="absolute right-5 top-5 grid h-14 w-14 place-items-center rounded-2xl bg-black/55 text-white">
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

/**
 * Horizontal scrub of nine export stages.
 *
 * Important: ancestors must NOT use content-visibility while this pin is active. * contain-intrinsic-size on DeferMount/.cv-auto was collapsing pin-spacer height
 * so scrub distance stayed ~0 and the track never moved.
 */
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
      const getScrollDistance = () => {
        // Use the pinned viewport width, not window. Matches what the user sees.
        const viewW = section.clientWidth || window.innerWidth;
        const distance = track.scrollWidth - viewW;
        return Math.max(Math.ceil(distance), 1);
      };

      gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          scrub: 0.45,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        },
      });
    }, section);

    const refresh = () => ScrollTrigger.refresh();

    // Layout can settle one frame later (fonts, deferred siblings, images).
    let raf1 = requestAnimationFrame(() => {
      raf1 = requestAnimationFrame(refresh);
    });
    const t1 = window.setTimeout(refresh, 120);
    const t2 = window.setTimeout(refresh, 600);

    const onStoryLock = (e) => {
      // Recompute after Story releases the scroll lock.
      if (!e?.detail?.locked) refresh();
    };

    window.addEventListener("ut:media-loaded", refresh);
    window.addEventListener("load", refresh);
    window.addEventListener("ut:story-scroll-lock", onStoryLock);

    return () => {
      cancelAnimationFrame(raf1);
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("ut:media-loaded", refresh);
      window.removeEventListener("load", refresh);
      window.removeEventListener("ut:story-scroll-lock", onStoryLock);
      ctx.revert();
    };
  }, [prefersReduced]);

  return (
    <section aria-label="Export process" className="relative bg-surface-2">
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
              <div
                key={stage.step}
                className="overflow-hidden rounded-3xl border border-border bg-surface shadow-soft"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <LazyImage
                    src={unsplash(stage.image, 700)}
                    srcSet={unsplashSrcSet(stage.image, [480, 640, 768, 960], 80)}
                    sizes="(min-width:768px) 33vw, (min-width:640px) 50vw, 100vw"
                    lqip={unsplashLQ(stage.image)}
                    alt={`${stage.title}. Export process step ${stage.step}`}
                    fallbackLabel={stage.title}
                    className="h-full w-full"
                    imgClassName="object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent"
                    aria-hidden="true"
                  />
                  <span className="absolute left-4 top-3 text-4xl font-extrabold text-white/85 drop-shadow">
                    {stage.step}
                  </span>
                  <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-xl bg-black/55 text-white">
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
        <div ref={sectionRef} className="relative h-[100svh] w-full overflow-hidden">
          <div className="flex h-full w-full items-center">
            <div
              ref={trackRef}
              className="flex w-max gap-6 pl-6 pr-24 will-change-transform sm:pl-8 lg:pl-10"
            >
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
