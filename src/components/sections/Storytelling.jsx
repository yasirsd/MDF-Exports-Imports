import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LazyImage } from "@/components/shared/LazyImage";
import { RoughSketch } from "@/components/shared/RoughSketch";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { scenes, unsplash, unsplashLQ, unsplashSrcSet } from "@/lib/images";

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  { id: scenes.farmField, eyebrow: "The Origin", title: "Freshness begins at the farm.", copy: "Rooted in Andhra Pradesh, across a thousand-strong network of trusted farms." },
  { id: scenes.farmer, eyebrow: "The People", title: "Grown by hands we trust.", copy: "Four decades of relationships with the farmers who know the land best." },
  { id: scenes.harvest, eyebrow: "The Harvest", title: "Picked at peak ripeness.", copy: "Selected by size, colour and sweetness — never before its time." },
  { id: scenes.packaging, eyebrow: "The Care", title: "Packed to export standards.", copy: "Ventilated, branded, protective packaging built for the journey." },
  { id: scenes.containerShip, eyebrow: "The Journey", title: "Shipped across the seas.", copy: "An unbroken cold chain from our packhouse to your port." },
  { id: scenes.dubai, eyebrow: "The Arrival", title: "Delivered to the world.", copy: "Fresh in Dubai, the Gulf, and soon — Europe." },
];

const ORANGE = "#ff7a1a";

// Hand-drawn route baseline + plane marker for the progress track.
const ROUTE_OPS = [
  { t: "p", d: "M12 14 q 150 -8 300 0 t 300 0 t 300 0 t 276 0", dash: true },
];
// Points RIGHT (forward, matching the left-to-right track), filled for a
// crisp read at small size.
const PLANE_OPS = [{ t: "p", d: "M84 40 L16 12 L38 40 L16 68 Z", fill: true }];

export function Storytelling() {
  const rootRef = useRef(null);
  const prefersReduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (prefersReduced) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray(".story-slide");
      const captions = gsap.utils.toArray(".story-caption");
      const dots = gsap.utils.toArray(".story-rail-dot");
      const total = slides.length;

      const counter = root.querySelector(".story-counter-num");
      const marker = root.querySelector(".story-marker");

      gsap.set(slides, { autoAlpha: 0, scale: 1.12 });
      gsap.set(slides[0], { autoAlpha: 1, scale: 1 });
      captions.forEach((cap, ci) => {
        gsap.set(cap, { autoAlpha: 1 });
        gsap.set(cap.children, { autoAlpha: ci === 0 ? 1 : 0, y: ci === 0 ? 0 : 40 });
      });

      const setActiveDot = (idx) => {
        dots.forEach((d, di) => {
          const active = di === idx;
          d.style.backgroundColor = active ? ORANGE : "rgba(255,255,255,0.25)";
          d.style.height = active ? "2rem" : "0.75rem";
        });
      };

      const update = (idx, progress) => {
        setActiveDot(idx);
        if (counter) counter.textContent = String(idx + 1).padStart(2, "0");
        if (marker) marker.style.left = `${2 + progress * 96}%`;
      };
      update(0, 0);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${(total - 1) * 60}%`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: 1 / (total - 1),
            duration: { min: 0.25, max: 0.55 },
            delay: 0.03,
            ease: "power2.inOut",
            directional: true,
          },
          onUpdate: (self) => {
            const idx = Math.min(total - 1, Math.floor(self.progress * total + 0.0001));
            update(idx, self.progress);
          },
        },
      });

      for (let i = 1; i < total; i += 1) {
        tl.to(captions[i - 1].children, { autoAlpha: 0, y: -30, duration: 0.3, stagger: 0.05 }, ">");
        tl.to(slides[i - 1], { autoAlpha: 0, scale: 1.12, duration: 0.6 }, "<");
        tl.fromTo(
          slides[i],
          { autoAlpha: 0, scale: 1.12, xPercent: i % 2 ? 3 : -3 },
          { autoAlpha: 1, scale: 1, xPercent: 0, duration: 0.6 },
          "<"
        );
        tl.fromTo(
          captions[i].children,
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.08 },
          ">-0.1"
        );
      }
    }, root);

    return () => ctx.revert();
  }, [prefersReduced]);

  // Reduced-motion: simple stacked editorial layout.
  if (prefersReduced) {
    return (
      <section id="story" className="bg-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-16 px-6 py-24">
          {chapters.map((c, i) => (
            <div key={c.id} className="grid items-center gap-8 md:grid-cols-2">
              <LazyImage
                src={unsplash(c.id, 1200)}
                srcSet={unsplashSrcSet(c.id)}
                sizes="(min-width:768px) 50vw, 100vw"
                lqip={unsplashLQ(c.id)}
                alt={c.title}
                fallbackLabel={c.eyebrow}
                className="aspect-[4/3] w-full rounded-3xl"
              />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-orange-bright">
                  {String(i + 1).padStart(2, "0")} · {c.eyebrow}
                </p>
                <h3 className="mt-3 text-h2 font-extrabold">{c.title}</h3>
                <p className="mt-4 text-lead text-muted-foreground">{c.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={rootRef} id="story" className="relative h-[100svh] overflow-hidden bg-black">
      {chapters.map((c, i) => (
        <div key={c.id} className="story-slide absolute inset-0" style={{ zIndex: i }}>
          <LazyImage
            src={unsplash(c.id, 2000)}
            srcSet={unsplashSrcSet(c.id, [640, 828, 1080, 1440, 1920, 2400])}
            sizes="100vw"
            lqip={unsplashLQ(c.id)}
            alt={c.title}
            fallbackLabel={c.eyebrow}
            className="h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50" aria-hidden="true" />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-0 z-20 flex items-end">
        <div className="mx-auto w-full max-w-7xl px-6 pb-14 sm:px-8 sm:pb-16 lg:px-10">
          {/* Chapter counter */}
          <div className="mb-5 flex items-baseline gap-2">
            <span className="story-counter-num text-5xl font-extrabold leading-none text-brand-orange-bright sm:text-6xl">
              01
            </span>
            <span className="text-lg font-semibold text-white/45">/ 0{chapters.length}</span>
          </div>

          {/* Captions */}
          <div className="relative min-h-[180px] max-w-2xl">
            {chapters.map((c) => (
              <div key={c.id} className="story-caption absolute inset-0">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-orange-bright">
                  {c.eyebrow}
                </p>
                <h3 className="mt-3 text-h1 font-extrabold text-white">{c.title}</h3>
                <p className="mt-4 max-w-xl text-lead text-white/80">{c.copy}</p>
              </div>
            ))}
          </div>

          {/* Hand-drawn route progress track */}
          <div className="relative mt-6 h-10 w-full text-brand-orange-bright">
            <div className="absolute inset-x-0 top-1/2 h-6 -translate-y-1/2 opacity-45">
              <RoughSketch
                ops={ROUTE_OPS}
                viewBox="0 0 1200 28"
                preserve="none"
                strokeWidth={1.6}
                roughness={1.3}
                bowing={1.4}
                seed={7}
                trigger="mount"
                draw
                drawDuration={1500}
                boil={false}
                className="h-full w-full overflow-visible"
              />
            </div>
            <div
              className="story-marker absolute top-1/2 h-8 w-9 -translate-x-1/2 -translate-y-1/2"
              style={{ left: "2%" }}
            >
              <RoughSketch
                ops={PLANE_OPS}
                viewBox="0 0 90 80"
                strokeWidth={1.4}
                roughness={0.8}
                bowing={0.6}
                seed={3}
                trigger="mount"
                draw
                drawDuration={500}
                boil={false}
                className="h-full w-full overflow-visible"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-2 lg:flex">
        {chapters.map((c, i) => (
          <span
            key={c.id}
            className="story-rail-dot w-1 rounded-full transition-all duration-300 ease-premium"
            style={{
              height: i === 0 ? "2rem" : "0.75rem",
              backgroundColor: i === 0 ? ORANGE : "rgba(255,255,255,0.25)",
            }}
            aria-hidden="true"
          />
        ))}
      </div>
    </section>
  );
}
