import { motion } from "motion/react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ParallaxImage } from "@/components/shared/ParallaxImage";
import { SketchAnnotation } from "@/components/shared/SketchAnnotation";
import { timeline } from "@/lib/constants";
import { site } from "@/lib/config";
import { scenes, unsplash, unsplashLQ, unsplashSrcSet } from "@/lib/images";
import { fadeUp, viewportOnce } from "@/lib/motion";

export function About() {
  return (
    <section id="about" className="section-py relative overflow-hidden bg-surface-2">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <ParallaxImage
              src={unsplash(scenes.market, 1200)}
              srcSet={unsplashSrcSet(scenes.market)}
              sizes="(min-width:1024px) 50vw, 100vw"
              lqip={unsplashLQ(scenes.market)}
              alt="Fresh produce at market, the heritage of MD Fruits"
              fallbackLabel="40 years of heritage"
              className="aspect-[3/4] w-full rounded-4xl"
              strength={50}
            />
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="absolute -bottom-6 -right-2 rounded-3xl border border-border bg-surface p-6 shadow-soft-lg sm:-right-6"
            >
              <p className="text-4xl font-extrabold text-brand-red">
                <span className="relative inline-block">
                  {site.experience}
                  <SketchAnnotation variant="circle" seed={9} className="text-brand-orange-bright" />
                </span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">of growing trust</p>
            </motion.div>
          </div>

          <div>
            <SectionHeading
              contained={false}
              eyebrow="Our Story"
              title="Four decades of freshness, now global."
              description={`What began as ${site.parent} — a family fruit business in ${site.location} — has grown into a legacy of quality. Universal Traders carries that heritage to the world.`}
            />

            <ol className="mt-10 space-y-0">
              {timeline.map((item, i) => (
                <motion.li
                  key={item.year}
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  className="relative flex gap-5 pb-8 last:pb-0"
                >
                  <div className="flex flex-col items-center">
                    <span className="grid h-3 w-3 place-items-center rounded-full bg-brand-red ring-4 ring-brand-red/15" />
                    {i < timeline.length - 1 ? (
                      <span className="mt-1 w-px flex-1 bg-border" aria-hidden="true" />
                    ) : null}
                  </div>
                  <div className="-mt-1 pb-2">
                    <p className="text-sm font-bold uppercase tracking-widest text-brand-red">{item.year}</p>
                    <h3 className="mt-1 text-lg font-extrabold">{item.title}</h3>
                    <p className="mt-1 text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
