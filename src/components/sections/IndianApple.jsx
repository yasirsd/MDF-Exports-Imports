import {
  ProductPageShell,
  ProductHero,
  ProductStage,
  ProductPill,
  ProductFeatureGrid,
  ProductColdChainStage,
  ProductEnquire,
  ProductFaq,
  PRODUCT_ATMOSPHERES,
} from "@/components/sections/productPage";
import { brandHello, site } from "@/lib/config";
import { unsplash, unsplashLQ, unsplashSrcSet, productImages } from "@/lib/images";
import { indianAppleFaqs } from "@/lib/indianApplePage";
import { whatsappUrl } from "@/lib/utils";

export { INDIAN_APPLE_PATH, INDIAN_APPLE_META, indianAppleFaqs } from "@/lib/indianApplePage";

const atm = PRODUCT_ATMOSPHERES.apple;

const origins = [
  {
    label: "Himachal Pradesh",
    value: "Shimla & Kinnaur belts",
    note: "Recognised hill orchards — packhouse partners for graded fruit.",
  },
  {
    label: "Jammu & Kashmir",
    value: "Kashmir apple belt",
    note: "Trusted grower and packhouse network for export programmes.",
  },
];

const varieties = [
  {
    label: "Shimla",
    value: "Himachal belt",
    note: "Trusted regional line from premium growing districts.",
  },
  {
    label: "Kinnaur",
    value: "Himachal belt",
    note: "High-altitude orchards known for colour and firmness.",
  },
  {
    label: "Richared",
    value: "Delicious family",
    note: "Mid-season variety across Himachal Pradesh and Jammu & Kashmir.",
  },
];

const discussionPoints = [
  { label: "Grade / class", value: "On enquiry" },
  { label: "Size / count", value: "On enquiry" },
  { label: "Packing", value: "On enquiry" },
  { label: "Private label", value: "On request" },
  { label: "Minimum order", value: "On enquiry" },
  { label: "Commercial basis", value: "On enquiry" },
  { label: "Pricing", value: "On enquiry" },
  { label: "Lead time", value: "On enquiry" },
  { label: "Harvest window", value: "On enquiry" },
];

const chainSteps = [
  { n: "01", title: "Packhouse", desc: "Pre-cool & grade" },
  { n: "02", title: "Load", desc: "Reefer sealed" },
  { n: "03", title: "Sea freight", desc: "Temp held" },
  { n: "04", title: "Arrival", desc: "Buyer handoff" },
];

const chainHighlights = [
  { label: "Pre-cooling", value: "Before load" },
  { label: "Shipping", value: "Reefer by sea" },
  { label: "Transit", value: "Temp held" },
];

const compliance = [
  { label: "APEDA", value: "In use", note: "Agricultural export alignment" },
  { label: "FSSAI", value: "In use", note: "Food safety framework" },
  { label: "IEC", value: "Available", note: "As required for consignment" },
  { label: "Phytosanitary", value: "As required", note: "Destination-driven docs" },
];

/**
 * Product landing — Premium Indian Apple export (crawlable static route).
 * Chapter DNA: hill origin + shared cold-chain stage — no GSAP / R3F.
 */
export function IndianApple() {
  const enquireHref = whatsappUrl(
    site.whatsapp,
    brandHello(
      "I'd like export specs and pricing for premium Indian apples. Destination: [country/port]. Varieties: [Kinnaur/Shimla/other]. Volume: [approx]. Size/grade & packing: [preferred]. Shipping: reefer sea / other."
    )
  );

  const heroImg = productImages.indianApple;

  return (
    <ProductPageShell>
      <ProductHero
        atmosphere={atm.hero}
        pill="Himachal & J&K · Fresh · Cold chain"
        titleAccent="Premium Indian Apples"
        title=" for Export"
        lead="MDF Exports & Imports supplies premium fresh Indian apples for international buyers who need clear origin, consistent grading and a cold-chain story they can trust. Share your preferred varieties, size profile, destination market and packing format — we confirm what we can source and how it can ship."
        enquireHref={enquireHref}
        secondaryHref="#cold-chain"
        secondaryLabel="View cold chain"
        image={{
          src: unsplash(heroImg, 1100, 88),
          srcSet: unsplashSrcSet(heroImg, [480, 640, 768, 960, 1200], 88),
          lqip: unsplashLQ(heroImg),
        }}
        imageAlt="Premium export-grade Indian apples"
        imageFallback="Indian apples"
        imageCaption={{
          kicker: "Hill orchards · Reefer ready",
          title: "Origin clarity · Graded lots · Cold chain",
        }}
      />

      <ProductStage atmosphere={atm.origin} step="01 · Origin">
        <ProductPill className="border-sky-400/35 text-sky-300">Hill orchards</ProductPill>
        <h2 className="mt-5 max-w-3xl text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
          Where our apples come from
        </h2>
        <p className="mt-5 max-w-3xl text-[1.05rem] leading-relaxed text-white/60">
          Apples are not grown in Andhra Pradesh. We source from India&apos;s recognised apple-growing
          regions — Himachal Pradesh (including the Shimla and Kinnaur belts) and Jammu &amp; Kashmir
          — through trusted grower and packhouse partners. Our commercial base is in Andhra Pradesh:
          we act as your export counterpart for enquiry, documentation and programme coordination.
        </p>
        <div className="mt-8">
          <ProductFeatureGrid items={origins} accent="sky" columns={2} />
        </div>
      </ProductStage>

      <ProductStage atmosphere={atm.varieties} step="02 · Varieties">
        <ProductPill className="border-brand-gold/35 text-brand-gold">Season &amp; lot</ProductPill>
        <h2 className="mt-5 max-w-3xl text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
          Varieties we can supply
        </h2>
        <p className="mt-5 max-w-3xl text-[1.05rem] leading-relaxed text-white/60">
          Variety availability follows season and lot. We supply Shimla and Kinnaur apples — trusted
          regional lines from Himachal Pradesh&apos;s premium growing belts — along with Richared, a
          mid-season Delicious-family variety grown across Himachal Pradesh and Jammu &amp; Kashmir.
          We do not treat &quot;Indian apple&quot; as one interchangeable SKU. Tell us the variety mix,
          colour preference and size grades your buyers expect, and we will match available lots or
          say clearly when we cannot.
        </p>
        <div className="mt-8">
          <ProductFeatureGrid items={varieties} accent="brand-gold" columns={3} />
        </div>
      </ProductStage>

      <ProductStage atmosphere={atm.specs} step="03 · Cold chain" id="cold-chain">
        <ProductPill className="border-sky-400/35 text-sky-300">
          Fresh produce logistics
        </ProductPill>
        <h2 className="mt-5 max-w-3xl text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
          Grades, packing &amp; cold chain
        </h2>
        <p className="mt-5 max-w-3xl text-[1.05rem] leading-relaxed text-white/60">
          Apples are fresh produce. Export programmes depend on grade, sizing, packing discipline and
          unbroken temperature control — not shelf-stable dry packing. Shipping is arranged via
          reefer container by sea freight, with temperature control maintained from pre-cooling
          through transit. Typical discussion points: grade/class on enquiry, size/count on enquiry,
          packing on enquiry, private label marking on request, minimum order on enquiry, commercial
          basis on enquiry (pricing on enquiry), lead time on enquiry, harvest/availability window on
          enquiry. Lot parameters (firmness, colour, defects) are confirmed before booking against
          your destination&apos;s requirements.
        </p>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="flex flex-col gap-4">
            <ProductFeatureGrid items={chainHighlights} accent="sky" columns={3} />
            <ProductFeatureGrid items={discussionPoints} accent="sky" columns={3} />
          </div>
          <ProductColdChainStage
            accent="sky"
            tempLabel="Held"
            title="Reefer sea freight · cold chain"
            steps={chainSteps}
          />
        </div>
      </ProductStage>

      <ProductStage atmosphere={atm.compliance} step="04 · Compliance">
        <ProductPill>Documentation</ProductPill>
        <h2 className="mt-5 max-w-3xl text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
          Compliance documentation we work with
        </h2>
        <p className="mt-5 max-w-3xl text-[1.05rem] leading-relaxed text-white/60">
          Shipments are prepared within recognised Indian export and food-safety frameworks. In
          practice we work with APEDA (agricultural export alignment, in use), FSSAI (food safety
          framework, in use), and IEC and phytosanitary documentation as required for the
          consignment. We do not claim Global G.A.P., ISO 22000 or other certificates unless they are
          in place for a specific lot or grower. Ask our desk for the documents your destination
          requires before you book.
        </p>
        <div className="mt-8">
          <ProductFeatureGrid items={compliance} accent="white" columns={4} />
        </div>
      </ProductStage>

      <ProductEnquire
        atmosphere={atm.enquire}
        title="Request a quote on WhatsApp"
        lead="The fastest way to start is WhatsApp to our export desk. Include: destination country / port, varieties and approximate volume, preferred size / grade and packing, preferred shipping mode. We will confirm sourcing availability, cold-chain path and commercial terms. No obligation until you place an order."
        enquireHref={enquireHref}
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
