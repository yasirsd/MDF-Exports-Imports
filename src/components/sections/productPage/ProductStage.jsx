import { Container } from "@/components/shared/Container";
import { cn } from "@/lib/utils";

/**
 * Full-bleed atmosphere band — one idea per section.
 * Optional step label e.g. "01 · Origin".
 */
export function ProductStage({
  atmosphere,
  step,
  id,
  className,
  containerClassName,
  children,
}) {
  const { base = "#0a0a0c", glow } = atmosphere || {};

  return (
    <section
      id={id}
      className={cn("relative overflow-hidden section-py scroll-mt-24", className)}
      style={{ backgroundColor: base }}
    >
      {glow ? (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: glow }}
          aria-hidden="true"
        />
      ) : null}
      <Container className={cn("relative z-[1]", containerClassName)}>
        {step ? (
          <p className="mb-5 text-[0.55rem] font-bold uppercase tracking-[0.22em] text-white/40 sm:text-[0.65rem]">
            {step}
          </p>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
