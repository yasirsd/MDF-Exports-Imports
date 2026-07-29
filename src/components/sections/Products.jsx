import { useCallback, useMemo, useState } from "react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProductCard } from "@/components/sections/products/ProductCard";
import { ProductDrawer } from "@/components/sections/products/ProductDrawer";
import { ProductFeatured } from "@/components/sections/products/ProductFeatured";
import { ProductFilters } from "@/components/sections/products/ProductFilters";
import { ProductProof } from "@/components/sections/products/ProductProof";
import {
  defaultProductCategory,
  getFeaturedProduct,
  getProductCategoryCounts,
  getProductsByCategory,
  productCategories,
} from "@/lib/constants";

/**
 * Export catalogue — featured stage, category rail, index + spec drawer.
 * Commercial heart of the site after Storytelling.
 */
export function Products() {
  const [active, setActive] = useState(defaultProductCategory);
  const [selected, setSelected] = useState(null);

  const counts = useMemo(() => getProductCategoryCounts(), []);
  const filtered = useMemo(() => getProductsByCategory(active), [active]);
  const featured = useMemo(() => getFeaturedProduct(active), [active]);

  const resultLabel = useMemo(() => {
    const n = filtered.length;
    return `Showing ${n} ${active.toLowerCase()}`;
  }, [active, filtered.length]);

  const openProduct = useCallback((product) => setSelected(product), []);
  const drawerOpen = Boolean(selected);

  return (
    <section aria-label="Products" className="section-py relative bg-background">
      {/* Soft atmospheric bridge from Story */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_20%_0%,rgba(255,122,26,0.08),transparent_55%)]"
        aria-hidden="true"
      />

      <Container className="relative">
        <SectionHeading
          contained={false}
          eyebrow="The Catalogue"
          title="Export-ready produce, graded for the journey."
          description="Premium fruits, vegetables and spices — sourced at peak freshness, packed to international standards, and ready for Gulf programmes."
        />

        <p className="mt-5 max-w-3xl text-sm text-muted-foreground">
          Origin spotlights:{" "}
          <a
            href="/products/guntur-red-chilli"
            className="font-semibold text-brand-red underline-offset-4 hover:underline"
          >
            Guntur Red Chilli export guide
          </a>
          {" · "}
          <a
            href="/products/indian-apple"
            className="font-semibold text-brand-red underline-offset-4 hover:underline"
          >
            Premium Indian Apple export guide
          </a>
          {" · "}
          <a
            href="/products/indian-pomegranate"
            className="font-semibold text-brand-red underline-offset-4 hover:underline"
          >
            Indian Pomegranate export guide
          </a>{" "}
          — dried spice and cold-chain fruit programmes for importers.
        </p>

        <div className="mt-10 lg:mt-12">
          <ProductFeatured product={featured} onViewSpecs={openProduct} />
        </div>

        <div className="mt-12 md:mt-14">
          <ProductFilters
            categories={productCategories}
            counts={counts}
            active={active}
            onChange={setActive}
            resultLabel={resultLabel}
          />
        </div>

        <div
          id="product-catalogue-panel"
          role="tabpanel"
          aria-labelledby={`product-tab-${active.toLowerCase()}`}
          className="mt-8"
        >
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
              <p className="text-base font-semibold text-foreground">No products in this category yet.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try another filter or enquire for a custom assortment.
              </p>
            </div>
          ) : (
            <div
              key={active}
              className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filtered.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpen={openProduct}
                  eager={i < 4}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </Container>

      <ProductProof />

      <ProductDrawer
        product={selected}
        open={drawerOpen}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />
    </section>
  );
}
