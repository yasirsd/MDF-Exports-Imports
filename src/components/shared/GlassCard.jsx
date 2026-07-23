import { cn } from "@/lib/utils";

/** Frosted-glass surface for testimonials, overlays, floating panels. */
export function GlassCard({ as: Comp = "div", className, children, ...props }) {
  return (
    <Comp className={cn("glass rounded-3xl shadow-soft", className)} {...props}>
      {children}
    </Comp>
  );
}
