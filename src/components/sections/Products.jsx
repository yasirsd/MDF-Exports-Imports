import { useCallback, useState } from "react";
import { Award, Clock3, Package, Snowflake } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProductDrawer } from "@/components/sections/products/ProductDrawer";
import { ProductSplitStage } from "@/components/sections/products/ProductSplitStage";
import { products } from "@/lib/constants";

/** Universal trust chips — sit above the sticky pin so they're visible while
 *  the visitor is still deciding whether to engage with the catalogue. */
const TRUST_CHIPS = [
  { icon: Award, label: "APEDA aligned" },
  { icon: Snowflake, label: "Cold chain verified" },
  { icon: Package, label: "Private label ready" },
  { icon: Clock3, label: "40+ years of trust" },
];

/**
 * Export catalogue.
 *
 * Structure: SectionHeading + trust strip live in normal flow above a
 * sticky-pinned split-screen catalogue stage. On desktop the stage holds for
 * ~50svh of scroll runway before Storytelling begins; on mobile the split
 * rotates 90° (photo on top, list below) and skips the pin so nothing clips.
 */
export function Products() {
  const [active, setActive] = useState(0);
  const [drawerProduct, setDrawerProduct] = useState(null);
  const drawerOpen = Boolean(drawerProduct);
  const openProduct = useCallback((product) => setDrawerProduct(product), []);

  return (
    <section aria-label="Products" className="relative bg-background pt-14 lg:pt-16">
      <Container className="relative z-[1]">
        <SectionHeading
          contained={false}
          eyebrow="The Catalogue"
          title="Export-ready produce, graded for the journey."
          description={`${products.length} focused export lines. Guntur dry red chilli, Malabar black pepper, Andhra Banganapalli mango, Indian apples, and pomegranate. Sourced at peak quality and packed for Gulf programmes.`}
          className="max-w-2xl"
        />

        {/* Trust strip — folds the old ProductProof band into the section
            header. Compact, always-visible above the sticky pin so it lands
            in-view for anyone scrolling past. */}
        <ul className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border/60 pt-6 text-[0.8rem] font-medium tracking-wide text-muted-foreground lg:mt-10">
          {TRUST_CHIPS.map(({ icon: Icon, label }) => (
            <li key={label} className="inline-flex items-center gap-2.5">
              <Icon
                className="h-3.5 w-3.5 shrink-0 text-brand-orange-bright/80"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              {label}
            </li>
          ))}
        </ul>
      </Container>

      <div className="relative mt-10 lg:mt-14">
        <ProductSplitStage
          active={active}
          onSelect={setActive}
          onViewSpecs={openProduct}
        />
      </div>

      <ProductDrawer
        product={drawerProduct}
        open={drawerOpen}
        onOpenChange={(open) => {
          if (!open) setDrawerProduct(null);
        }}
      />
    </section>
  );
}
