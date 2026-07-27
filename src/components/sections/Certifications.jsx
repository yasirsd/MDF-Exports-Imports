import { motion } from "motion/react";
import { BadgeCheck, Clock } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { certifications } from "@/lib/constants";
import { fadeUp, fadeUpReduced, motionSafe, viewportOnce } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

export function Certifications() {
  const reduced = usePrefersReducedMotion();
  const variants = motionSafe(reduced, fadeUp, fadeUpReduced);

  return (
    <section aria-label="Certifications" className="section-py bg-background">
      <Container>
        <SectionHeading
          contained={false}
          align="center"
          annotate
          eyebrow="Compliance & Trust"
          title="Built for export compliance."
          description="We work within recognised Indian food-safety and export frameworks — ask our desk for market-specific documentation. More certifications are on our roadmap."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-14 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3"
        >
          {certifications.map((cert, i) => {
            const future = cert.status === "future";
            return (
              <motion.div
                key={cert.code}
                variants={variants}
                custom={i}
                className={cn(
                  "group relative flex flex-col justify-between overflow-hidden rounded-3xl border p-6 shadow-soft transition-all duration-500 hover:shadow-soft-lg",
                  future ? "border-dashed border-brand-gold/40 bg-brand-gold/5" : "border-border bg-surface"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      "grid h-12 w-12 place-items-center rounded-2xl",
                      future ? "bg-brand-gold/15 text-brand-gold" : "bg-success/10 text-success"
                    )}
                  >
                    {future ? <Clock className="h-6 w-6" /> : <BadgeCheck className="h-6 w-6" />}
                  </span>
                  <Badge variant={future ? "gold" : "success"}>
                    {future ? "Roadmap" : "In use"}
                  </Badge>
                </div>
                <div className="mt-6">
                  <h3 className="text-2xl font-extrabold tracking-tight">{cert.code}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{cert.name}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
