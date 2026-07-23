import { memo, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TiltCard } from "@/components/shared/TiltCard";
import { Marquee } from "@/components/shared/Marquee";
import { LazyImage } from "@/components/shared/LazyImage";
import { Badge } from "@/components/ui/badge";
import { products, productCategories } from "@/lib/constants";
import { unsplash, unsplashLQ, unsplashSrcSet } from "@/lib/images";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

const ProductCard = memo(function ProductCard({ product }) {
  return (
    <motion.div layout variants={fadeUp} className="h-full">
      <TiltCard className="group h-full rounded-3xl" max={6}>
        <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-soft transition-shadow duration-500 ease-premium hover:shadow-soft-lg">
          <div className="relative aspect-[4/5] overflow-hidden">
            <LazyImage
              src={unsplash(product.image, 800)}
              srcSet={unsplashSrcSet(product.image)}
              sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
              lqip={unsplashLQ(product.image)}
              alt={`${product.name} — export quality`}
              fallbackLabel={product.name}
              className="h-full w-full"
              imgClassName="transition-transform duration-900 ease-premium group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" aria-hidden="true" />
            <div className="absolute left-4 top-4">
              <Badge variant="glass" className="text-white">{product.category}</Badge>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
              <h3 className="text-xl font-extrabold text-white drop-shadow">{product.name}</h3>
              <span className="grid h-9 w-9 translate-y-2 place-items-center rounded-full bg-white/90 text-[#111] opacity-0 transition-all duration-500 ease-premium group-hover:translate-y-0 group-hover:opacity-100">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </div>
          <p className="p-5 text-sm text-muted-foreground">{product.blurb}</p>
        </article>
      </TiltCard>
    </motion.div>
  );
});

export function Products() {
  const [active, setActive] = useState("All");

  const filtered = useMemo(
    () => (active === "All" ? products : products.filter((p) => p.category === active)),
    [active]
  );

  return (
    <section id="products" className="section-py relative bg-background">
      <Container>
        <SectionHeading
          contained={false}
          eyebrow="The Catalogue"
          title="Export-grade produce, hand-selected."
          description="Premium fruits, vegetables and spices — sourced at peak freshness and graded to international standards."
        />

        <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Filter products by category">
          {productCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={active === cat}
              onClick={() => setActive(cat)}
              className={cn(
                "rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-300 ease-premium",
                active === cat
                  ? "border-brand-red bg-brand-red text-white shadow-soft"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div
          layout
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-10 grid grid-cols-1 gap-4 xs:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>

      <div className="mt-16 border-y border-border/60 bg-surface/40 py-5 md:mt-20">
        <Marquee itemClassName="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {[
            "Farm Fresh",
            "Export Grade",
            "Cold Chain Verified",
            "Global Logistics",
            "Peak-Season Sourcing",
            "International Standards",
            "40+ Years of Trust",
          ].map((word) => (
            <span key={word} className="flex items-center gap-8">
              <span>{word}</span>
              <span className="text-brand-gold">◆</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
