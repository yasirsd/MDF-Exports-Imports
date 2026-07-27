import { motion } from "motion/react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Icon } from "@/components/shared/Icon";
import { advantages } from "@/lib/constants";
import { fadeUpReduced, motionSafe, viewportOnce } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

const cardVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function WhyChooseUs() {
  const reduced = usePrefersReducedMotion();
  const variants = motionSafe(reduced, cardVariant, fadeUpReduced);

  return (
    <section aria-label="Why MDF" className="section-py relative bg-background">
      <Container>
        <SectionHeading
          contained={false}
          align="center"
          annotate
          eyebrow="Why MDF"
          title="Built for importers who expect more."
          description="Every consignment is backed by four decades of discipline — from farm to destination port."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-14 grid auto-rows-[minmax(180px,auto)] grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4"
        >
          {advantages.map((item, i) => (
            <motion.div
              key={item.title}
              custom={i}
              variants={variants}
              className={cn(
                "group relative overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-soft transition-shadow duration-500 hover:shadow-soft-lg",
                item.span
              )}
            >
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-red/5 blur-2xl transition-transform duration-700 ease-premium group-hover:scale-150"
                aria-hidden="true"
              />
              <div className="relative flex h-full flex-col">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-red/10 text-brand-red transition-colors duration-500 group-hover:bg-brand-red group-hover:text-white">
                  <Icon name={item.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-extrabold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
