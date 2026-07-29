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
  ACCENT_CLASSES,
} from "@/components/sections/productPage";
import { brandHello, site } from "@/lib/config";
import { unsplash, unsplashLQ, unsplashSrcSet, productImages } from "@/lib/images";
import { indianPomegranateFaqs } from "@/lib/indianPomegranatePage";
import { whatsappUrl, cn } from "@/lib/utils";

export {
  INDIAN_POMEGRANATE_PATH,
  INDIAN_POMEGRANATE_META,
  indianPomegranateFaqs,
} from "@/lib/indianPomegranatePage";

const atm = PRODUCT_ATMOSPHERES.pomegranate;

const districts = [
  {
    label: "Solapur",
    value: "Core Bhagwa belt",
    note: "GI association for Solapur Bhagwa.",
  },
  {
    label: "Nashik",
    value: "Grower network",
    note: "Trusted packhouse partners for export lots.",
  },
  {
    label: "Ahmednagar",
    value: "Supply belt",
    note: "Maharashtra network for graded fruit programmes.",
  },
  {
    label: "Pune",
    value: "Packhouse hub",
    note: "Coordination for cold-chain ready consignments.",
  },
];

const specHighlights = [
  { label: "Premium TSS", value: "15–16° Brix", note: "Typical premium grade" },
  { label: "Fruit weight", value: "200–400g", note: "Premium up to 500g+" },
  { label: "Diameter", value: "50–90mm", note: "Premium up to 100mm+" },
  { label: "Shelf life", value: "45–60 days", note: "With proper cold chain" },
  { label: "Hold temp", value: "5–7°C", note: "90–95% RH typical" },
  { label: "Pre-cool", value: "4–5 hrs", note: "After harvest" },
];

const packingWeights = [
  { label: "Carton", value: "2.7kg" },
  { label: "Carton", value: "3.0kg" },
  { label: "Carton", value: "3.5kg" },
  { label: "Carton", value: "4.0kg" },
];

const commercial = [
  { label: "Minimum order", value: "On enquiry" },
  { label: "Commercial basis", value: "On enquiry" },
  { label: "Pricing", value: "On enquiry" },
  { label: "Lead time", value: "On enquiry" },
  { label: "Harvest window", value: "Sep–Dec" },
  { label: "Container ref.", value: "~13.5 MT · on enquiry" },
];

const chainSteps = [
  { n: "01", title: "Harvest", desc: "Pre-cool 4–5 hrs" },
  { n: "02", title: "Hold", desc: "5–7°C · 90–95% RH" },
  { n: "03", title: "Reefer", desc: "Sea freight locked" },
  { n: "04", title: "Arrival", desc: "45–60 day window" },
];

const chainHighlights = [
  { label: "Pre-cool", value: "Within 4–5 hrs" },
  { label: "Hold", value: "5–7°C" },
  { label: "Humidity", value: "90–95% RH" },
  { label: "Window", value: "45–60 days" },
];

const compliance = [
  { label: "APEDA", value: "In use", note: "Agricultural export alignment" },
  { label: "FSSAI", value: "In use", note: "Food safety framework" },
  { label: "IEC", value: "Available", note: "As required for consignment" },
  { label: "Phytosanitary", value: "As required", note: "Destination-driven docs" },
];

function VarietyPanel({ eyebrow, name, body, accent = "rose" }) {
  const a = ACCENT_CLASSES[accent] || ACCENT_CLASSES.rose;
  return (
    <div className={cn("rounded-2xl border px-6 py-7 sm:px-8 sm:py-8", a.border, a.bg)}>
      <p className={cn("text-[0.55rem] font-bold uppercase tracking-[0.16em]", a.text)}>
        {eyebrow}
      </p>
      <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-white">{name}</h3>
      <p className="mt-4 text-[1.05rem] leading-relaxed text-white/60">{body}</p>
    </div>
  );
}

/**
 * Product landing — Indian Pomegranate export (crawlable static route).
 * Chapter DNA: Bhagwa/Ganesh panels + 5–7°C cold chain — no GSAP / R3F.
 */
export function IndianPomegranate() {
  const enquireHref = whatsappUrl(
    site.whatsapp,
    brandHello(
      "I'd like export specs and pricing for Indian pomegranates. Destination: [country/port]. Variety: [Bhagwa/Ganesh]. Volume: [approx]. Size/grade & carton net weight: [preferred]. Shipping: reefer sea / other."
    )
  );

  const heroImg = productImages.pomegranate;

  return (
    <ProductPageShell>
      <ProductHero
        atmosphere={atm.hero}
        pill="Maharashtra · Bhagwa · Ganesh"
        titleAccent="Indian Pomegranates"
        titleAccentClass="text-gradient-red"
        title=" for Export"
        lead="MDF Exports & Imports supplies fresh Indian pomegranates for international buyers who need clear origin, consistent grading and a cold-chain path they can trust. Share your preferred variety (Bhagwa or Ganesh), size profile, destination market and packing format — we confirm what we can source and how it can ship."
        enquireHref={enquireHref}
        secondaryHref="#cold-chain"
        secondaryLabel="View cold chain"
        image={{
          src: unsplash(heroImg, 1100, 88),
          srcSet: unsplashSrcSet(heroImg, [480, 640, 768, 960, 1200], 88),
          lqip: unsplashLQ(heroImg),
        }}
        imageAlt="Export-grade Indian pomegranates"
        imageFallback="Indian pomegranates"
        imageCaption={{
          kicker: "Maharashtra · Cold-chain ready",
          title: "Bhagwa · Ganesh · Graded lots",
        }}
      />

      <ProductStage atmosphere={atm.origin} step="01 · Origin">
        <ProductPill className="border-rose-400/35 text-rose-300">Maharashtra orchards</ProductPill>
        <h2 className="mt-5 max-w-3xl text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
          Where our pomegranates come from
        </h2>
        <p className="mt-5 max-w-3xl text-[1.05rem] leading-relaxed text-white/60">
          Pomegranates of commercial export quality are not grown in Andhra Pradesh. We source from
          Maharashtra — India&apos;s dominant pomegranate export region, including the Solapur, Nashik,
          Ahmednagar and Pune districts — through trusted grower and packhouse partners. Our
          commercial base is in Andhra Pradesh: we act as your export counterpart for enquiry,
          documentation and programme coordination. We are not positioning Andhra as the orchard
          origin for this product.
        </p>
        <div className="mt-8">
          <ProductFeatureGrid items={districts} accent="rose" columns={4} />
        </div>
      </ProductStage>

      <ProductStage atmosphere={atm.varieties} step="02 · Varieties">
        <ProductPill className="border-rose-400/35 text-rose-300">Season &amp; lot</ProductPill>
        <h2 className="mt-5 max-w-3xl text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
          Varieties we can supply
        </h2>
        <p className="mt-5 max-w-3xl text-[1.05rem] leading-relaxed text-white/60">
          Variety availability follows season and lot. We supply:
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <VarietyPanel
            eyebrow="Dominant export variety"
            name="Bhagwa"
            accent="rose"
            body="The dominant Indian export variety. Buyers typically look for a glossy deep-red rind, dark pink arils, high sweetness and strong shelf-life performance under cold chain. Solapur Bhagwa is associated with a Geographical Indication (GI) tag; whether a specific consignment is supplied as GI-tagged Solapur fruit is confirmed lot-by-lot on enquiry — we do not treat every Maharashtra Bhagwa lot as automatically GI-certified."
          />
          <VarietyPanel
            eyebrow="Secondary commercial line"
            name="Ganesh"
            accent="brand-gold"
            body="A secondary commercial line with pinkish-yellow to reddish-yellow rind and lighter pink arils. Sweetness is generally medium versus premium Bhagwa, and it is often discussed at a lower price point for programmes that do not need Bhagwa's colour and TSS profile."
          />
        </div>

        <p className="mt-8 max-w-3xl text-[1.05rem] leading-relaxed text-white/55">
          We do not treat &quot;Indian pomegranate&quot; as one interchangeable SKU. Tell us the variety mix,
          colour preference and size grades your buyers expect, and we will match available lots or
          say clearly when we cannot.
        </p>
      </ProductStage>

      <ProductStage atmosphere={atm.specs} step="03 · Cold chain" id="cold-chain">
        <ProductPill className="border-sky-400/35 text-sky-300">
          Fresh produce logistics
        </ProductPill>
        <h2 className="mt-5 max-w-3xl text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
          Grades, packing &amp; cold chain
        </h2>
        <p className="mt-5 max-w-3xl text-[1.05rem] leading-relaxed text-white/60">
          Pomegranates are fresh produce. Export programmes depend on grade, sizing, packing
          discipline and unbroken temperature control. Typical industry-standard discussion ranges
          (exact figures confirmed per lot before booking): Sweetness (TSS) about 15–16° Brix for
          premium grade. Fruit weight typically 200–400g, premium lots up to 500g+. Diameter
          typically 50–90mm, premium up to 100mm+. Grading: A Grade / B Grade, or Extra Class /
          Class I / Class II depending on destination market&apos;s standard. Packing: corrugated
          fiberboard cartons, common net weights 2.7kg / 3.0kg / 3.5kg / 4.0kg; private-label marking
          on request. Cold chain: pre-cooled within 4–5 hours of harvest, held at about 5–7°C with
          90–95% relative humidity. Shelf life: typically 45–60 days post-harvest when proper cold
          chain is maintained through transit and arrival handling. Harvest/availability: Hasta
          Bahar cycle, roughly September–December, peak quality in that window. Minimum order: on
          enquiry (programmes often discussed around a 20ft container load, roughly ~13.5 MT, but
          volume confirmed per order). Commercial basis / pricing / lead time: on enquiry. Lot
          parameters (colour, firmness, defects, size mix) confirmed before booking against
          destination requirements.
        </p>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="flex flex-col gap-5">
            <ProductFeatureGrid items={chainHighlights} accent="rose" columns={4} />
            <ProductFeatureGrid items={specHighlights} accent="rose" columns={3} />
            <ProductFeatureGrid
              items={packingWeights.map((p, i) => ({
                label: `Net weight ${i + 1}`,
                value: p.value,
              }))}
              accent="sky"
              columns={4}
            />
            <ProductFeatureGrid items={commercial} accent="white" columns={3} />
          </div>
          <ProductColdChainStage
            accent="rose"
            tempLabel="5–7°C"
            title="Cold chain · 5–7°C"
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
        lead="The fastest way to start is WhatsApp to our export desk. Include: destination country / port, variety (Bhagwa / Ganesh) and approximate volume, preferred size / grade and carton net weight, preferred shipping mode. We will confirm sourcing availability, cold-chain path and commercial terms. No obligation until you place an order."
        enquireHref={enquireHref}
        checklist={[
          "Destination country / port",
          "Variety (Bhagwa / Ganesh) and approximate volume",
          "Preferred size / grade and carton net weight",
          "Preferred shipping mode",
        ]}
      />

      <div aria-label="Indian pomegranate FAQ">
        <ProductFaq atmosphere={atm.faq} faqs={indianPomegranateFaqs} />
      </div>
    </ProductPageShell>
  );
}
