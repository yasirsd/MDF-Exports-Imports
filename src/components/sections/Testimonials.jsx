import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Quote, ArrowLeft, ArrowRight, Star } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { GlassCard } from "@/components/shared/GlassCard";
import { testimonials } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function Testimonials() {
  const reduced = usePrefersReducedMotion();
  const plugins = useMemo(
    () =>
      reduced
        ? []
        : [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })],
    [reduced]
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, plugins);
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i) => emblaApi?.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return undefined;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    setSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  return (
    <section aria-label="Testimonials" className="section-py relative overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-0 h-[420px] -translate-y-1/2 opacity-40 blur-3xl"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(253,197,0,0.18), transparent 70%)" }}
        aria-hidden="true"
      />
      <Container className="relative">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            contained={false}
            eyebrow="Buyer Themes"
            title="What importers value."
            description="Representative themes from GCC trade conversations. Replace with attributed quotes when available."
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous testimonial"
              className="grid h-12 w-12 place-items-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next testimonial"
              className="grid h-12 w-12 place-items-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface-2"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-12 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_60%] lg:flex-[0_0_42%]">
                <GlassCard className="flex h-full flex-col p-8">
                  <div className="flex items-center justify-between">
                    <Quote className="h-9 w-9 text-brand-gold" />
                    <div className="flex gap-0.5" aria-label="Rated 5 out of 5">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="h-4 w-4 fill-brand-gold text-brand-gold" />
                      ))}
                    </div>
                  </div>
                  <blockquote className="mt-5 flex-1 text-lead font-medium leading-relaxed">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-4 border-t border-border/60 pt-6">
                    <span
                      className="grid h-12 w-12 place-items-center rounded-2xl border border-border bg-surface-2 text-2xl"
                      aria-hidden="true"
                    >
                      {t.flag}
                    </span>
                    <div>
                      <p className="font-bold">{t.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {t.role} · {t.location}
                      </p>
                    </div>
                  </figcaption>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {snaps.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                selected === i ? "w-8 bg-brand-red" : "w-2 bg-border hover:bg-muted-foreground/40"
              )}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
