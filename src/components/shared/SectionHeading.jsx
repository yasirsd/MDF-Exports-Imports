import { motion } from "motion/react";
import { Container } from "@/components/shared/Container";
import { RevealText } from "@/components/shared/RevealText";
import { SketchAnnotation } from "@/components/shared/SketchAnnotation";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Editorial section heading: small eyebrow + large title + optional lead.
 * `annotate` draws a hand-drawn underline beneath the title on scroll.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  contained = true,
  id,
  annotate = false,
}) {
  const content = (
    <div
      className={cn(
        "flex max-w-3xl flex-col gap-5",
        align === "center" && "mx-auto items-center text-center",
        className
      )}
    >
      {eyebrow ? (
        <motion.span
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-red"
        >
          <span className="h-px w-8 bg-brand-red/60" aria-hidden="true" />
          {eyebrow}
        </motion.span>
      ) : null}
      {annotate ? (
        <span className="relative inline-block">
          <RevealText as="h2" split className="text-h2 font-extrabold" id={id}>
            {title}
          </RevealText>
          <SketchAnnotation variant="underline" seed={13} className="text-brand-orange-bright" />
        </span>
      ) : (
        <RevealText as="h2" split className="text-h2 font-extrabold" id={id}>
          {title}
        </RevealText>
      )}
      {description ? (
        <motion.p
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-lead text-muted-foreground"
        >
          {description}
        </motion.p>
      ) : null}
    </div>
  );

  return contained ? <Container>{content}</Container> : content;
}
