import {
  ProductPageShell,
  ProductHero,
  ProductStage,
  ProductPill,
  ProductTimeline,
  ProductStatStrip,
  ProductChipRow,
  ProductHeatGradeStage,
  ProductEnquire,
  ProductFaq,
  PRODUCT_ATMOSPHERES,
} from "@/components/sections/productPage";
import { RoughSketch } from "@/components/shared/RoughSketch";
import { brandHello } from "@/lib/config";
import { unsplash, unsplashLQ, unsplashSrcSet, productImages } from "@/lib/images";
import { gunturFaqs } from "@/lib/gunturChilliPage";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export { GUNTUR_CHILLI_PATH, GUNTUR_CHILLI_META, gunturFaqs } from "@/lib/gunturChilliPage";

const atm = PRODUCT_ATMOSPHERES.guntur;

const grades = [
  {
    title: "Guntur Sannam S4 (334)",
    note: "Balanced heat and colour for spice programmes.",
  },
  {
    title: "Teja / S17",
    note: "Higher pungency for processors who need sharper heat.",
  },
  {
    title: "Teja Deluxe",
    note: "Premium Teja selection for demanding specs.",
  },
];

const tiers = ["Deluxe", "Best", "Medium Best"];

const formChips = ["Whole", "With stem", "Stemless", "Powder on request"];

const packingChips = ["Jute 5–50kg", "PP bags", "Cartons", "Private label"];

const audienceChips = [
  "Spice importers",
  "Wholesalers",
  "Grinders",
  "Food processors",
  "Gulf markets",
];

const certChips = ["APEDA", "FSSAI", "IEC", "Phytosanitary"];

const heatSketchOps = [
  { t: "l", x1: 18, y1: 48, x2: 55, y2: 22 },
  { t: "l", x1: 55, y1: 22, x2: 95, y2: 40 },
  { t: "l", x1: 95, y1: 40, x2: 140, y2: 16 },
  { t: "l", x1: 140, y1: 16, x2: 185, y2: 34 },
  { t: "c", x: 18, y: 48, d: 9, fill: "rgba(255,122,26,0.35)" },
  { t: "c", x: 55, y: 22, d: 9, fill: "rgba(255,122,26,0.35)" },
  { t: "c", x: 95, y: 40, d: 9, fill: "rgba(239,35,60,0.32)" },
  { t: "c", x: 140, y: 16, d: 9, fill: "rgba(239,35,60,0.32)" },
  { t: "c", x: 185, y: 34, d: 9, fill: "rgba(253,197,0,0.3)" },
];

/**
 * Product landing. Guntur Red Chilli export (crawlable static route).
 */
export function GunturRedChilli() {
  const reduced = usePrefersReducedMotion();
  const enquireMessage = brandHello(
    "I'd like export specs and pricing for Guntur red chilli. Destination: [country/port]. Form: [whole/other]. Volume: [approx]. Packing: [preferred]."
  );
  const emailSubject = "Export Enquiry — Guntur Red Chilli";
  const heroImg = productImages.dryRedChilli;

  return (
    <ProductPageShell>
      <ProductHero
        atmosphere={atm.hero}
        pill="Andhra Pradesh · Dried · Export grade"
        titleAccent="Guntur Red Chilli"
        title=" for Export"
        lead="Dried Guntur red chilli with clear regional identity — colour, heat character and documentation-ready lots. Share grade, destination and packing; we confirm what we can ship."
        enquireMessage={enquireMessage}
        emailSubject={emailSubject}
        secondaryHref="#specs"
        secondaryLabel="View export specs"
        image={{
          src: unsplash(heroImg, 1100, 88),
          srcSet: unsplashSrcSet(heroImg, [480, 640, 768, 960, 1200], 88),
          lqip: unsplashLQ(heroImg),
        }}
        imageAlt="Export-grade dried Guntur red chilli"
        imageFallback="Guntur red chilli"
        imageCaption={{
          kicker: "Guntur belt · Andhra Pradesh",
          title: "Colour · Heat · Clean lots",
        }}
      />

      <ProductStage atmosphere={atm.origin} step="01 · Origin">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <ProductPill className="border-brand-orange/35 text-brand-orange-bright">
              Heat &amp; colour identity
            </ProductPill>
            <h2 className="mt-5 text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
              Why Guntur red chilli stands apart
            </h2>
            <p className="mt-5 text-[1.05rem] leading-relaxed text-white/60">
              One of India&apos;s best-known chilli belts — strong colour and a heat profile for
              spice blends, masalas and food manufacturing. Variety, colour and heat vary by season
              and lot; we align each enquiry to your market&apos;s standards.
            </p>
            <ProductChipRow className="mt-6" items={audienceChips} />
          </div>
          <ProductTimeline items={grades} accent="brand-orange" />
        </div>
      </ProductStage>

      <ProductStage atmosphere={atm.specs} step="02 · Specs" id="specs">
        <ProductPill className="border-brand-orange/35 text-brand-orange-bright">
          Export programme
        </ProductPill>
        <h2 className="mt-5 max-w-3xl text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
          Export specifications &amp; packing
        </h2>
        <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-white/60">
          Sannam S4 and Teja lines in Deluxe / Best / Medium Best tiers. Moisture, foreign matter and
          broken limits confirmed lot-by-lot. Whole, stem or stemless — powder and private label on
          request.
        </p>

        <ProductStatStrip
          className="mt-8"
          accentClass="text-brand-orange-bright"
          stats={[
            { value: 14, prefix: "10–", suffix: "%", label: "Moisture max" },
            { value: 1, suffix: "%", label: "Foreign matter" },
            { value: 3, prefix: "2–", suffix: "%", label: "Broken / stalks" },
            { value: 50, prefix: "5–", suffix: "kg", label: "Jute pack range" },
          ]}
        />

        <ProductChipRow className="mt-6" items={formChips} />
        <ProductChipRow className="mt-3" items={packingChips} />

        <div className="relative mt-10">
          <ProductHeatGradeStage tiers={tiers} />
          <div className="pointer-events-none absolute -right-1 top-2 w-[min(100%,14rem)] text-brand-orange-bright/80 sm:-right-3">
            <RoughSketch
              viewBox="0 0 200 60"
              ops={heatSketchOps}
              className="h-14 w-full"
              strokeWidth={1.4}
              reduced={reduced}
              draw={!reduced}
            />
            <p className="mt-1 text-right text-[0.55rem] font-bold uppercase tracking-[0.14em] text-white/40">
              Heat · colour · tier
            </p>
          </div>
        </div>
      </ProductStage>

      <ProductStage atmosphere={atm.compliance} step="03 · Compliance">
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
        lead="Include destination, form, volume, grade or lab parameters and packing. We confirm availability, docs and commercial terms."
        enquireMessage={enquireMessage}
        emailSubject={emailSubject}
        checklist={[
          "Destination country / port",
          "Form & approximate volume",
          "Grade or lab parameters",
          "Preferred packing",
        ]}
      />

      <div aria-label="Guntur chilli FAQ">
        <ProductFaq atmosphere={atm.faq} faqs={gunturFaqs} />
      </div>
    </ProductPageShell>
  );
}
