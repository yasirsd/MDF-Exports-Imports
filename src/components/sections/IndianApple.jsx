import {
  ProductPageShell,
  ProductHero,
  ProductStage,
  ProductPill,
  ProductFeatureGrid,
  ProductMediaFrame,
  ProductStatStrip,
  ProductChipRow,
  ProductColdChainStage,
  ProductEnquire,
  ProductFaq,
  PRODUCT_ATMOSPHERES,
} from "@/components/sections/productPage";
import { RoughSketch } from "@/components/shared/RoughSketch";
import { brandHello } from "@/lib/config";
import { unsplash, unsplashLQ, unsplashSrcSet, productImages } from "@/lib/images";
import { indianAppleFaqs } from "@/lib/indianApplePage";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export { INDIAN_APPLE_PATH, INDIAN_APPLE_META, indianAppleFaqs } from "@/lib/indianApplePage";

const atm = PRODUCT_ATMOSPHERES.apple;

const origins = [
  {
    label: "Himachal Pradesh",
    value: "Shimla & Kinnaur belts",
    note: "Recognised hill orchards. Packhouse partners for graded fruit.",
  },
  {
    label: "Jammu & Kashmir",
    value: "Kashmir apple belt",
    note: "Trusted grower and packhouse network for export programmes.",
  },
];

const varietyChips = ["Shimla", "Kinnaur", "Richared"];

const discussChips = [
  "Grade / class",
  "Size / count",
  "Packing",
  "Private label",
  "MOQ",
  "Lead time",
];

const chainSteps = [
  { n: "01", title: "Packhouse", desc: "Pre-cool & grade" },
  { n: "02", title: "Load", desc: "Reefer sealed" },
  { n: "03", title: "Sea freight", desc: "Temp held" },
  { n: "04", title: "Arrival", desc: "Buyer handoff" },
];

const certChips = ["APEDA", "FSSAI", "IEC", "Phytosanitary"];

const chainSketchOps = [
  { t: "l", x1: 20, y1: 38, x2: 80, y2: 28 },
  { t: "l", x1: 80, y1: 28, x2: 145, y2: 40 },
  { t: "l", x1: 145, y1: 40, x2: 210, y2: 26 },
  { t: "c", x: 20, y: 38, d: 10, fill: "rgba(56,160,220,0.3)" },
  { t: "c", x: 80, y: 28, d: 10, fill: "rgba(56,160,220,0.3)" },
  { t: "c", x: 145, y: 40, d: 10, fill: "rgba(56,160,220,0.3)" },
  { t: "c", x: 210, y: 26, d: 10, fill: "rgba(56,160,220,0.3)" },
];

/**
 * Product landing. Premium Indian Apple export (crawlable static route).
 */
export function IndianApple() {
  const reduced = usePrefersReducedMotion();
  const enquireMessage = brandHello(
    "I'd like export specs and pricing for premium Indian apples. Destination: [country/port]. Varieties: [Kinnaur/Shimla/other]. Volume: [approx]. Size/grade & packing: [preferred]. Shipping: reefer sea / other."
  );
  const emailSubject = "Export Enquiry — Indian Apple";
  const heroImg = productImages.indianApple;
  const detailImg = productImages.indianAppleDetail;
  const coldImg = productImages.appleColdStorage;

  return (
    <ProductPageShell>
      <ProductHero
        atmosphere={atm.hero}
        pill="Himachal & J&K · Fresh · Cold chain"
        titleAccent="Premium Indian Apples"
        title=" for Export"
        lead="Clear hill origin, consistent grading and a cold-chain story buyers can trust. Share varieties, size profile, destination and packing — we confirm what we can source."
        enquireMessage={enquireMessage}
        emailSubject={emailSubject}
        secondaryHref="#cold-chain"
        secondaryLabel="View cold chain"
        image={{
          src: unsplash(heroImg, 1100, 88),
          srcSet: unsplashSrcSet(heroImg, [480, 640, 768, 960, 1200], 88),
          lqip: unsplashLQ(heroImg),
        }}
        imageAlt="Premium Kinnaur Indian apples packed for export"
        imageFallback="Indian apples"
        imageCaption={{
          kicker: "Kinnaur · Graded close-up",
          title: "Origin clarity · Graded lots · Cold chain",
        }}
      />

      <ProductStage atmosphere={atm.origin} step="01 · Origin">
        <ProductPill className="border-sky-400/35 text-sky-300">Hill orchards</ProductPill>
        <h2 className="mt-5 max-w-3xl text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
          Where our apples come from
        </h2>
        <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-white/60">
          Sourced from Himachal Pradesh (Shimla &amp; Kinnaur) and Jammu &amp; Kashmir through
          trusted packhouse partners. Our export desk in Andhra Pradesh coordinates enquiry, docs
          and programme delivery.
        </p>
        <div className="mt-8">
          <ProductFeatureGrid items={origins} accent="sky" columns={2} />
        </div>
      </ProductStage>

      <ProductStage atmosphere={atm.varieties} step="02 · Varieties">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <ProductPill className="border-brand-gold/35 text-brand-gold">Season &amp; lot</ProductPill>
            <h2 className="mt-5 text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
              Varieties we can supply
            </h2>
            <p className="mt-5 text-[1.05rem] leading-relaxed text-white/60">
              Shimla, Kinnaur and Richared — matched to season and lot, not treated as one
              interchangeable SKU. Tell us colour and size grades; we match available fruit or say
              clearly when we cannot.
            </p>
            <ProductChipRow className="mt-6" items={varietyChips} />
          </div>
          <ProductMediaFrame
            src={unsplash(detailImg, 900, 86)}
            srcSet={unsplashSrcSet(detailImg, [480, 640, 800, 1000], 86)}
            lqip={unsplashLQ(detailImg)}
            alt="Close-up of export-grade Kinnaur red apples"
            fallbackLabel="Kinnaur detail"
            caption={{ kicker: "Lot detail", title: "Colour · firmness · grade on enquiry" }}
          />
        </div>
      </ProductStage>

      <ProductStage atmosphere={atm.specs} step="03 · Cold chain" id="cold-chain">
        <ProductPill className="border-sky-400/35 text-sky-300">Fresh produce logistics</ProductPill>
        <h2 className="mt-5 max-w-3xl text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
          Grades, packing &amp; cold chain
        </h2>
        <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-white/60">
          Pre-cool, grade and ship unbroken in reefer sea freight. Size, packing and commercial
          terms are set per programme — not a single published SKU sheet.
        </p>

        <ProductStatStrip
          className="mt-8"
          accentClass="text-sky-300"
          stats={[
            { value: 4, label: "Cold-chain steps" },
            { value: 6, suffix: "+", label: "GCC markets" },
            { value: 40, suffix: "+", label: "Years network" },
            { value: 100, suffix: "%", label: "Lot checks" },
          ]}
        />

        <ProductChipRow className="mt-6" items={discussChips} />

        <div className="relative mt-10 grid items-start gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
          <ProductMediaFrame
            src={unsplash(coldImg, 900, 86)}
            srcSet={unsplashSrcSet(coldImg, [480, 640, 800, 1000], 86)}
            lqip={unsplashLQ(coldImg)}
            alt="Apples in wooden crates inside cold storage"
            fallbackLabel="Cold storage"
            aspect="aspect-[4/3] lg:aspect-[4/5]"
            caption={{ kicker: "Cold storage", title: "Held from packhouse to port" }}
          />
          <div className="relative">
            <ProductColdChainStage
              accent="sky"
              tempLabel="Held"
              title="Reefer sea freight · cold chain"
              steps={chainSteps}
            />
            <div className="pointer-events-none absolute -left-1 -top-3 w-[min(100%,14rem)] text-sky-300/80 sm:-left-3">
              <RoughSketch
                viewBox="0 0 230 65"
                ops={chainSketchOps}
                className="h-14 w-full"
                strokeWidth={1.4}
                reduced={reduced}
                draw={!reduced}
              />
            </div>
          </div>
        </div>
      </ProductStage>

      <ProductStage atmosphere={atm.compliance} step="04 · Compliance">
        <ProductPill>Documentation</ProductPill>
        <h2 className="mt-5 max-w-3xl text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
          Compliance we work with
        </h2>
        <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-white/60">
          APEDA, FSSAI, IEC and phytosanitary documentation as required. Extra certificates only when
          they are in place for a specific lot — ask for your destination path before booking.
        </p>
        <ProductChipRow className="mt-6" items={certChips} />
      </ProductStage>

      <ProductEnquire
        atmosphere={atm.enquire}
        title="Request a quote on WhatsApp"
        lead="Include destination, varieties, volume, size/grade and packing. We confirm sourcing, cold-chain path and commercial terms."
        enquireMessage={enquireMessage}
        emailSubject={emailSubject}
        checklist={[
          "Destination country / port",
          "Varieties and approximate volume",
          "Preferred size / grade and packing",
          "Preferred shipping mode",
        ]}
      />

      <div aria-label="Indian apple FAQ">
        <ProductFaq atmosphere={atm.faq} faqs={indianAppleFaqs} />
      </div>
    </ProductPageShell>
  );
}
