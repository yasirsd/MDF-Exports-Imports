import { Award, Snowflake, Package, Clock3 } from "lucide-react";

const PROOFS = [
  { icon: Award, label: "APEDA aligned" },
  { icon: Snowflake, label: "Cold chain verified" },
  { icon: Package, label: "Private label ready" },
  { icon: Clock3, label: "40+ years of trust" },
];

/**
 * Compact export-proof strip — purposeful, not filler marquee.
 */
export function ProductProof() {
  return (
    <div className="mt-14 border-y border-border/70 bg-surface/50 py-5 md:mt-20 md:py-6">
      <ul className="mx-auto flex max-w-[90rem] flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 sm:px-8 lg:justify-between lg:px-10">
        {PROOFS.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="inline-flex items-center gap-2.5 text-sm font-semibold text-muted-foreground"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full border border-brand-orange-bright/25 bg-brand-orange-bright/[0.07] text-brand-orange-bright">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
