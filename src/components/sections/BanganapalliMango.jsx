import {
  ProductPageShell,
  ProductHero,
  ProductStage,
  ProductPill,
  ProductTimeline,
  ProductFeatureGrid,
  ProductColdChainStage,
  ProductEnquire,
  ProductFaq,
  PRODUCT_ATMOSPHERES,
} from "@/components/sections/productPage";
import { brandHello, site } from "@/lib/config";
import { unsplash, unsplashLQ, unsplashSrcSet, productImages } from "@/lib/images";
import { banganapalliMangoFaqs } from "@/lib/banganapalliMangoPage";
import { whatsappUrl } from "@/lib/utils";

export {
  BANGANAPALLI_MANGO_PATH,
  BANGANAPALLI_MANGO_META,
  banganapalliMangoFaqs,
} from "@/lib/banganapalliMangoPage";

const atm = PRODUCT_ATMOSPHERES.mango;

const originPoints = [
  {
    label: "Andhra Pradesh",
    value: "Home-state origin",
    note: "Banganapalli grown in our regional belt.",
  },
  {
    label: "Also cultivated in",
    value: "Karnataka & Tamil Nadu",
    note: "Regional variety identity, not a generic mix.",
  },
  {
    label: "Commercial base",
    value: "Andhra Pradesh",
    note: "Export desk based where the fruit is grown.",
  },
];

const exportTraits = [
  {
    title: "Large fruit size",
    note: "Typically suited to retail and wholesale display programmes.",
  },
  {
    title: "Firm flesh",
    note: "Helps arrival condition when harvest maturity is right.",
  },
  {
    title: "Transport tolerance",
    note: "Commonly preferred for bulk reefer sea freight vs delicate air-only lines.",
  },
];

const packing = [
  { label: "Carton type", value: "CFB boxes", note: "Corrugated fiberboard, typically 3–5 ply" },
  { label: "Net weight", value: "3–5kg", note: "Common export pack weights; confirm per lot" },
  { label: "Protection", value: "Foam net / tray", note: "Used to limit bruising in transit" },
  { label: "Private label", value: "On request", note: "Marking discussed per programme" },
];

const chainHighlights = [
  { label: "Hold / ship temp", value: "10–13°C", note: "Typical industry range; confirm per lot" },
  { label: "Mode", value: "Reefer sea", note: "Bulk programmes to Gulf ports" },
  { label: "Gulf transit", value: "About 7–10 days", note: "Typical India → Dubai window; sailing-dependent" },
];

const commercial = [
  { label: "Air freight MOQ", value: "On enquiry", note: "Industry reference often 500kg–1MT" },
  { label: "Sea freight MOQ", value: "On enquiry", note: "Often full 20ft / 40ft reefer" },
  { label: "Pricing", value: "On enquiry", note: "FOB / programme terms discussed per lot" },
  { label: "Lead time", value: "On enquiry", note: "Season, treatment and sailing dependent" },
];

const compliance = [
  {
    label: "APEDA packhouse",
    value: "Required path",
    note: "Export via APEDA-registered packhouse (not general registration alone)",
  },
  { label: "Phytosanitary", value: "As required", note: "Destination-driven certification" },
  { label: "Certificate of Origin", value: "As required", note: "Standard export documentation" },
  {
    label: "US / Japan treatment",
    value: "Partner facility",
    note: "Irradiation / VHT coordinated on enquiry. We do not operate these plants",
  },
];

const chainSteps = [
  { n: "01", title: "Harvest", desc: "Peak maturity for export" },
  { n: "02", title: "Packhouse", desc: "Grade · CFB pack" },
  { n: "03", title: "Hold", desc: "Typically 10–13°C" },
  { n: "04", title: "Sea", desc: "Reefer to Gulf / beyond" },
];

/**
 * Product landing. Banganapalli mango export (crawlable static route).
 * Genuine Andhra origin story. Cold-chain stage. No GSAP / R3F.
 */
export function BanganapalliMango() {
  const enquireHref = whatsappUrl(
    site.whatsapp,
    brandHello(
      "I'd like export specs and pricing for Banganapalli mango. Destination: [country/port]. Volume: [approx]. Packing: [3-5kg CFB / preferred]. Shipping: sea reefer / air. Any US irradiation or Japan VHT requirement: [yes/no]."
    )
  );

  const heroImg = productImages.mangoes;

  return (
    <ProductPageShell>
      <ProductHero
        atmosphere={atm.hero}
        pill="Andhra Pradesh · Banganapalli · Fresh"
        titleAccent="Banganapalli Mangoes"
        titleAccentClass="text-gradient-gold"
        title=" for Export"
        lead="MDF Exports & Imports supplies Andhra-grown Banganapalli mango for international buyers who need clear regional origin, export packing and a cold-chain path that can travel by sea. Share your destination market, approximate volume and packing preference. We confirm what we can ship and on what timeline."
        enquireHref={enquireHref}
        secondaryHref="#cold-chain"
        secondaryLabel="View packing & cold chain"
        image={{
          src: unsplash(heroImg, 1100, 88),
          srcSet: unsplashSrcSet(heroImg, [480, 640, 768, 960, 1200], 88),
          lqip: unsplashLQ(heroImg),
        }}
        imageAlt="Export-grade Banganapalli mango"
        imageFallback="Banganapalli mango"
        imageCaption={{
          kicker: "Andhra Pradesh · Regional origin",
          title: "Banganapalli · Sea-freight ready · Docs on enquiry",
        }}
      />

      <ProductStage atmosphere={atm.origin} step="01 · Origin">
        <ProductPill className="border-brand-gold/35 text-brand-gold">Andhra grown</ProductPill>
        <h2 className="mt-5 max-w-3xl text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
          Where our mangoes come from
        </h2>
        <p className="mt-5 max-w-3xl text-[1.05rem] leading-relaxed text-white/60">
          Banganapalli is grown in Andhra Pradesh, our home state, and is also cultivated in
          Karnataka and Tamil Nadu. This page is about that regional variety, not a generic
          &quot;Indian mango&quot; assortment mixed across unrelated origins. We supply Banganapalli
          from this southern growing belt with the same regional clarity we bring to other Andhra
          programmes. Exact orchard and packhouse allocation for your consignment is confirmed on
          enquiry before booking.
        </p>
        <div className="mt-8">
          <ProductFeatureGrid items={originPoints} accent="brand-gold" columns={3} />
        </div>
      </ProductStage>

      <ProductStage atmosphere={atm.varieties} step="02 · Variety">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <ProductPill className="border-brand-gold/35 text-brand-gold">
              Export variety
            </ProductPill>
            <h2 className="mt-5 text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
              Why Banganapalli suits export
            </h2>
            <p className="mt-5 text-[1.05rem] leading-relaxed text-white/60">
              Buyers who need bulk sea freight often look for mango with good size, firm flesh and
              transport tolerance. Banganapalli is widely used in that role. More delicate varieties
              are frequently pushed toward air freight; Banganapalli is commonly packed for reefer
              container programmes when maturity, packing and temperature are handled correctly. We
              supply Banganapalli specifically. We do not list other state-specific mango varieties
              on this page. Typical Banganapalli harvest timing opens around March–April in many
              southern programmes, earlier than later-season peaks elsewhere. Exact opening and
              closing dates for your year are confirmed on enquiry, not published as fixed calendar
              guarantees.
            </p>
          </div>
          <ProductTimeline items={exportTraits} accent="brand-gold" />
        </div>
      </ProductStage>

      <ProductStage atmosphere={atm.specs} step="03 · Cold chain" id="cold-chain">
        <ProductPill className="border-sky-400/35 text-sky-300">
          Packing &amp; logistics
        </ProductPill>
        <h2 className="mt-5 max-w-3xl text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
          Grades, packing &amp; cold chain
        </h2>
        <p className="mt-5 max-w-3xl text-[1.05rem] leading-relaxed text-white/60">
          Export mango programmes depend on grade, sizing, packing discipline and temperature
          control. Industry-standard packing for Banganapalli commonly uses corrugated fiberboard
          (CFB) boxes, typically 3–5 ply, with common net weights in the 3–5kg range and foam nets
          or tray packing for transit protection. Lots are typically stored and shipped around
          10–13°C. Sea freight from Indian ports to Gulf destinations such as Dubai often takes
          about 7–10 days in a reefer container, depending on the sailing. Exact grade, pack weight,
          marking, minimum order and lead time are confirmed on enquiry. Air programmes and full
          20ft / 40ft reefer sea loads are discussed against your volume and destination rather than
          locked to a single published MOQ.
        </p>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="flex flex-col gap-4">
            <ProductFeatureGrid items={packing} accent="brand-gold" columns={2} />
            <ProductFeatureGrid items={chainHighlights} accent="sky" columns={3} />
            <ProductFeatureGrid items={commercial} accent="white" columns={4} />
          </div>
          <ProductColdChainStage
            accent="sky"
            tempLabel="10–13°C"
            title="Reefer sea freight · cold chain"
            steps={chainSteps}
          />
        </div>
      </ProductStage>

      <ProductStage atmosphere={atm.compliance} step="04 · Compliance">
        <ProductPill>Documentation &amp; treatment</ProductPill>
        <h2 className="mt-5 max-w-3xl text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
          Compliance &amp; destination treatments
        </h2>
        <p className="mt-5 max-w-3xl text-[1.05rem] leading-relaxed text-white/60">
          Standard mango export programmes require an APEDA-registered packhouse specifically, not
          only a general APEDA registration, along with phytosanitary certification and a
          Certificate of Origin as the destination requires. Some markets add treatment steps. For
          the USA, irradiation at a USDA-APHIS approved facility is typically required. For Japan,
          Vapor Heat Treatment (VHT) is typically required. We coordinate those treatments through a
          partner facility when your programme needs them. We do not claim to own or operate
          irradiation or VHT infrastructure ourselves. Japan also restricts mango imports to
          approved Indian states, and Andhra Pradesh is one of them. That is a genuine advantage for
          Andhra-grown Banganapalli when treatment and paperwork are confirmed for your shipment.
          Ask our desk for the path that matches your destination before you book.
        </p>
        <div className="mt-8">
          <ProductFeatureGrid items={compliance} accent="white" columns={2} />
        </div>
      </ProductStage>

      <ProductEnquire
        atmosphere={atm.enquire}
        title="Request a quote on WhatsApp"
        lead="The fastest way to start is WhatsApp to our export desk. Include destination country or port, approximate volume, preferred packing (for example 3–5kg CFB), and whether your market needs US irradiation or Japan VHT. We will confirm availability, documentation path, treatment coordination if required, and commercial terms. No obligation until you place an order."
        enquireHref={enquireHref}
        checklist={[
          "Destination country / port",
          "Approximate volume (air or sea)",
          "Preferred packing",
          "US / Japan treatment if required",
        ]}
      />

      <div aria-label="Banganapalli mango FAQ">
        <ProductFaq atmosphere={atm.faq} faqs={banganapalliMangoFaqs} />
      </div>
    </ProductPageShell>
  );
}
