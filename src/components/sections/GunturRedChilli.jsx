import {
  ProductPageShell,
  ProductHero,
  ProductStage,
  ProductPill,
  ProductTimeline,
  ProductFeatureGrid,
  ProductHeatGradeStage,
  ProductEnquire,
  ProductFaq,
  PRODUCT_ATMOSPHERES,
} from "@/components/sections/productPage";
import { brandHello, site } from "@/lib/config";
import { unsplash, unsplashLQ, unsplashSrcSet, productImages } from "@/lib/images";
import { gunturFaqs } from "@/lib/gunturChilliPage";
import { whatsappUrl } from "@/lib/utils";

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

const lotParams = [
  { label: "Moisture", value: "10–14% max" },
  { label: "Foreign matter", value: "1% max" },
  { label: "Broken / stalks", value: "2–3% max" },
];

const forms = [
  { label: "Whole", value: "Dried pods" },
  { label: "With stem", value: "Available" },
  { label: "Stemless", value: "Available" },
  { label: "Powder", value: "On request" },
];

const packing = [
  { label: "Jute bags", value: "5–50kg" },
  { label: "PP bags", value: "Export ready" },
  { label: "Carton formats", value: "On enquiry" },
  { label: "Private label", value: "On request" },
];

const commercial = [
  { label: "Minimum order", value: "On enquiry" },
  { label: "Commercial basis", value: "On enquiry" },
  { label: "Pricing", value: "On enquiry" },
  { label: "Lead time", value: "On enquiry" },
];

const audiences = [
  { label: "Spice importers", value: "Commercial volumes" },
  { label: "Wholesalers", value: "Programme supply" },
  { label: "Grinders", value: "Heat & colour" },
  { label: "Food processors", value: "Masalas & sauces" },
  { label: "Gulf & import markets", value: "Export lots" },
];

const compliance = [
  { label: "APEDA", value: "In use", note: "Agricultural export alignment" },
  { label: "FSSAI", value: "In use", note: "Food safety framework" },
  { label: "IEC", value: "Available", note: "As required for consignment" },
  { label: "Phytosanitary", value: "As required", note: "Destination-driven docs" },
];

/**
 * Product landing. Guntur Red Chilli export (crawlable static route).
 * Chapter DNA: atmospheres, pills, heat/grade stage. No GSAP / R3F.
 */
export function GunturRedChilli() {
  const enquireHref = whatsappUrl(
    site.whatsapp,
    brandHello(
      "I'd like export specs and pricing for Guntur red chilli. Destination: [country/port]. Form: [whole/other]. Volume: [approx]. Packing: [preferred]."
    )
  );

  const heroImg = productImages.dryRedChilli;

  return (
    <ProductPageShell>
      <ProductHero
        atmosphere={atm.hero}
        pill="Andhra Pradesh · Dried · Export grade"
        titleAccent="Guntur Red Chilli"
        title=" for Export"
        lead="MDF Exports & Imports supplies dried Guntur red chilli from Andhra Pradesh for international buyers who need consistent colour, heat character and documentation-ready lots. Tell us your grade preference, destination market and packing format. We respond with what we can ship and on what timeline."
        enquireHref={enquireHref}
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

      {/* Why Guntur */}
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
              Guntur is one of India&apos;s best-known chilli growing belts. Buyers typically look to
              this origin for dried red chilli with strong colour and a heat profile suited to spice
              blends, masalas, sauces and food manufacturing, distinct from generic &quot;red
              chilli&quot; sourced without a clear regional identity. Exact variety names, colour values
              and heat levels vary by season and lot. We align each enquiry to the grade and moisture
              / cleanliness standards your market requires, rather than treating all chilli as
              interchangeable.
            </p>
          </div>
          <ProductTimeline items={grades} accent="brand-orange" />
        </div>
      </ProductStage>

      {/* Specs + heat stage */}
      <ProductStage atmosphere={atm.specs} step="02 · Specs" id="specs">
        <ProductPill className="border-brand-orange/35 text-brand-orange-bright">
          Export programme
        </ProductPill>
        <h2 className="mt-5 max-w-3xl text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
          Export specifications &amp; packing
        </h2>
        <p className="mt-5 max-w-3xl text-[1.05rem] leading-relaxed text-white/60">
          We prepare consignments for export programmes, not retail sachets for walk-in trade.
          Available grades include Guntur Sannam S4 (334) for balanced heat and color, and Teja /
          S17 and Teja Deluxe for buyers needing higher pungency, each available in Deluxe, Best, and
          Medium Best quality tiers. Typical lot parameters: moisture 10–14% max, foreign matter 1%
          max, broken chillies and pods with stalks 2–3% max. Exact figures confirmed lot-by-lot
          before booking, matched to your destination market&apos;s requirements. Available whole,
          with stem or stemless; powder on request. Packing in 5–50kg jute, PP, or carton formats.
          Private label marking available on request. Minimum order: on enquiry · Commercial basis:
          on enquiry · Pricing on enquiry · Lead time: on enquiry
        </p>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
          <ProductHeatGradeStage tiers={tiers} />
          <div className="flex flex-col gap-6">
            <ProductFeatureGrid items={lotParams} accent="brand-orange" columns={3} />
            <ProductFeatureGrid items={forms} accent="brand-orange" columns={4} />
            <ProductFeatureGrid items={packing} accent="brand-gold" columns={4} />
            <ProductFeatureGrid items={commercial} accent="white" columns={4} />
          </div>
        </div>
      </ProductStage>

      {/* Compliance */}
      <ProductStage atmosphere={atm.compliance} step="03 · Compliance">
        <ProductPill>Documentation</ProductPill>
        <h2 className="mt-5 max-w-3xl text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
          Compliance documentation we work with
        </h2>
        <p className="mt-5 max-w-3xl text-[1.05rem] leading-relaxed text-white/60">
          Shipments are prepared within recognised Indian export and food-safety frameworks. In
          practice we work with APEDA (agricultural export alignment, in use), FSSAI (food safety
          framework, in use), and IEC and phytosanitary documentation as required for the
          consignment. We do not claim Global G.A.P., ISO 22000 or other certificates unless they are
          in place for a specific lot. Ask our desk for the documents your destination requires
          before you book.
        </p>
        <div className="mt-8">
          <ProductFeatureGrid items={compliance} accent="white" columns={4} />
        </div>
      </ProductStage>

      {/* Audience */}
      <ProductStage atmosphere={atm.compliance} step="04 · Buyers">
        <ProductPill className="border-brand-gold/35 text-brand-gold">Audience</ProductPill>
        <h2 className="mt-5 max-w-3xl text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
          Who this supply is for
        </h2>
        <p className="mt-5 max-w-3xl text-[1.05rem] leading-relaxed text-white/60">
          This page is for spice importers, wholesalers, grinders and food processors who buy dried
          chilli in commercial volumes, including buyers serving Gulf and other import markets. If
          you need sample photos, a recent lot description or packing photos, say so in your first
          message.
        </p>
        <div className="mt-8">
          <ProductFeatureGrid items={audiences} accent="brand-gold" columns={3} />
        </div>
      </ProductStage>

      <ProductEnquire
        atmosphere={atm.enquire}
        title="Request a quote on WhatsApp"
        lead="The fastest way to start is WhatsApp to our export desk. Include: destination country / port, preferred form (whole / other) and approximate volume, any grade or lab parameters your buyers require, preferred packing. We will confirm availability, documentation path and commercial terms. No obligation until you place an order."
        enquireHref={enquireHref}
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
