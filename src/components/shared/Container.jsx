import { cn } from "@/lib/utils";

/** Consistent max-width page container. */
export function Container({ as: Comp = "div", className, children, ...props }) {
  return (
    <Comp
      className={cn(
        // Fluid gutters (20px → 40px) + a gentle ultrawide max so the layout
        // never feels stretched on 1920/2560 displays.
        "mx-auto w-full max-w-7xl px-[clamp(1.25rem,4vw,2.5rem)] 3xl:max-w-[88rem]",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
