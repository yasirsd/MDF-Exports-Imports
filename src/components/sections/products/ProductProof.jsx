import { Award, Snowflake, Package, Clock3 } from "lucide-react";

const PROOFS = [
  { icon: Award, label: "APEDA aligned" },
  { icon: Snowflake, label: "Cold chain verified" },
  { icon: Package, label: "Private label ready" },
  { icon: Clock3, label: "40+ years of trust" },
];

/**
 * Export-proof strip — continuous with page background after showcase feather.
 */
export function ProductProof() {
  return (
    <div className="-mt-6 bg-background pb-8 pt-2 md:-mt-8 md:pb-10 md:pt-3">
      <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 border-b border-border/60 px-[clamp(1.25rem,4vw,2.5rem)] pb-7 3xl:max-w-[88rem] lg:justify-between md:pb-8">
        {PROOFS.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="inline-flex items-center gap-2.5 text-[0.8rem] font-medium tracking-wide text-muted-foreground"
          >
            <Icon
              className="h-3.5 w-3.5 shrink-0 text-brand-orange-bright/75"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
