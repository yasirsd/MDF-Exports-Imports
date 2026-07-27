import { motion } from "motion/react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { LazyImage } from "@/components/shared/LazyImage";
import { galleryImages, unsplash, unsplashLQ, unsplashSrcSet } from "@/lib/images";
import { viewportOnce } from "@/lib/motion";

const captions = [
  "Export-grade crates",
  "Peak-season harvest",
  "Sorting & grading",
  "Orchard to origin",
  "Field freshness",
  "Market quality",
  "Selected by hand",
  "Cold-chain ready",
  "Loaded for export",
  "Delivered fresh",
];

// Masonry spans for an editorial, Apple-style layout. Prefixed so mobile
// stays a clean, uniform grid and the asymmetric bento only kicks in at md+.
const spans = [
  "md:row-span-2",
  "",
  "",
  "md:row-span-2",
  "",
  "md:col-span-2",
  "",
  "md:row-span-2",
  "",
  "",
];

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, delay: (i % 4) * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function Gallery() {
  return (
    <section aria-label="Gallery" className="section-py bg-surface-2">
      <Container>
        <SectionHeading
          contained={false}
          eyebrow="In the Field"
          title="A closer look at the craft."
          description="From orchard to origin port — the moments that make the difference."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:auto-rows-[220px]"
        >
          {galleryImages.map((img, i) => (
            <motion.figure
              key={img}
              custom={i}
              variants={item}
              className={`group relative overflow-hidden rounded-3xl ${spans[i] || ""}`}
            >
              <LazyImage
                src={unsplash(img, 900)}
                srcSet={unsplashSrcSet(img, [384, 480, 640, 768, 960], 80)}
                sizes="(min-width:768px) 25vw, 50vw"
                lqip={unsplashLQ(img)}
                alt={captions[i] || "MDF Exports & Imports export gallery"}
                fallbackLabel={captions[i]}
                className="h-full w-full"
                imgClassName="transition-transform duration-1200 ease-premium group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
              <figcaption className="absolute bottom-4 left-4 translate-y-3 text-sm font-semibold text-white opacity-0 transition-all duration-500 ease-premium group-hover:translate-y-0 group-hover:opacity-100">
                {captions[i]}
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
