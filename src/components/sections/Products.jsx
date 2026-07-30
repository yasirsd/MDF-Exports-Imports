import { useCallback, useState } from "react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProductDrawer } from "@/components/sections/products/ProductDrawer";
import { ProductProof } from "@/components/sections/products/ProductProof";
import { ProductShowcase } from "@/components/sections/products/ProductShowcase";

/**
 * Export catalogue. Soft-edge cinematic showcase + proof strip + spec drawer.
 * Homepage places this immediately after Hero.
 */
export function Products() {
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
          description="Four focused export lines. Andhra Banganapalli mango, Indian apples, pomegranate, and Guntur dry red chilli. Sourced at peak quality and packed for Gulf programmes."
          className="max-w-2xl"
        />
      </Container>

      {/* Negative margin pulls the soft stage up under the heading for one composition */}
      <div className="relative mt-6 lg:mt-8">
        <ProductShowcase onViewSpecs={openProduct} />
      </div>

      <ProductProof />

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
