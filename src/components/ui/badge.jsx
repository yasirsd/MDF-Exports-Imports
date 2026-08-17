import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-surface-2 text-muted-foreground",
        red: "border-brand-red/20 bg-brand-red/10 text-brand-red",
        gold: "border-brand-gold/30 bg-brand-gold/10 text-brand-gold",
        success: "border-success/20 bg-success/10 text-success",
        glass: "glass text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
