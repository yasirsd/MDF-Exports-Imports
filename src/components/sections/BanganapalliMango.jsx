import {
  ProductPageShell,
  ProductHero,
  ProductStage,
  ProductPill,
  ProductTimeline,
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
import { banganapalliMangoFaqs } from "@/lib/banganapalliMangoPage";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export {
  BANGANAPALLI_MANGO_PATH,
  BANGANAPALLI_MANGO_META,
  banganapalliMangoFaqs,
} from "@/lib/banganapalliMangoPage";

const atm = PRODUCT_ATMOSPHERES.mango;

const originChips = [
  { label: "Andhra Pradesh", title: "Home-state origin" },
  { label: "Karnataka", title: "Also cultivated" },
  { label: "Tamil Nadu", title: "Also cultivated" },
];

const exportTraits = [
  { title: "Large fruit size", note: "Retail and wholesale display programmes." },
  { title: "Firm flesh", note: "Arrival condition when maturity is right." },
  { title: "Transport tolerance", note: "Preferred for bulk reefer sea freight." },
];

const packingChips = ["CFB 3–5 ply", "3–5kg nets", "Foam / tray", "Private label"];

const certChips = [
  "APEDA packhouse",
  "Phytosanitary",
  "Certificate of Origin",
  "Partner VHT / irradiation",
];

const chainSteps = [
  { n: "01", title: "Harvest", desc: "Peak maturity for export" },
  { n: "02", title: "Packhouse", desc: "Grade · CFB pack" },
  { n: "03", title: "Hold", desc: "Typically 10–13°C" },
  { n: "04", title: "Sea", desc: "Reefer to Gulf / beyond" },
];

const chainSketchOps = [
  { t: "l", x1: 24, y1: 42, x2: 88, y2: 30 },
  { t: "l", x1: 88, y1: 30, x2: 152, y2: 44 },
  { t: "l", x1: 152, y1: 44, x2: 220, y2: 32 },
  { t: "c", x: 24, y: 42, d: 11, fill: "rgba(253,197,0,0.28)" },
  { t: "c", x: 88, y: 30, d: 11, fill: "rgba(253,197,0,0.28)" },
  { t: "c", x: 152, y: 44, d: 11, fill: "rgba(56,160,220,0.32)" },
  { t: "c", x: 220, y: 32, d: 11, fill: "rgba(56,160,220,0.32)" },
];

/**
 * Product landing. Banganapalli mango export (crawlable static route).
 */
export function BanganapalliMango() {
  const reduced = usePrefersReducedMotion();
  const enquireMessage = brandHello(
    "I'd like export specs and pricing for Banganapalli mango. Destination: [country/port]. Volume: [approx]. Packing: [3-5kg CFB / preferred]. Shipping: sea reefer / air. Any US irradiation or Japan VHT requirement: [yes/no]."
  );
  const emailSubject = "Export Enquiry — Banganapalli Mango";
  const heroImg = productImages.mangoCrop;
  const lotImg = productImages.mangoes;

  return (
    <ProductPageShell>
      <ProductHero
        atmosphere={atm.hero}
        pill="Andhra Pradesh · Banganapalli · Fresh"
        titleAccent="Banganapalli Mangoes"
        titleAccentClass="text-gradient-gold"
        title=" for Export"
        lead="Andhra-grown Banganapalli for buyers who need clear regional origin, export packing and a cold-chain path that can travel by sea. Share destination, volume and packing — we confirm what we can ship."
        enquireMessage={enquireMessage}
        emailSubject={emailSubject}
        secondaryHref="#cold-chain"
        secondaryLabel="View packing & cold chain"
        image={{
          src: unsplash(heroImg, 1100, 88),
          srcSet: unsplashSrcSet(heroImg, [480, 640, 768, 960, 1200], 88),
          lqip: unsplashLQ(heroImg),
        }}
        imageAlt="Banganapalli mangoes growing on the tree in Andhra Pradesh"
        imageFallback="Banganapalli mango"
        imageCaption={{
          kicker: "Andhra Pradesh · Orchard crop",
          title: "Banganapalli · Sea-freight ready · Docs on enquiry",
        }}
      />

      <ProductStage atmosphere={atm.origin} step="01 · Origin">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <ProductMediaFrame
            src={unsplash(lotImg, 900, 86)}
            srcSet={unsplashSrcSet(lotImg, [480, 640, 800, 1000], 86)}
            lqip={unsplashLQ(lotImg)}
            alt="Freshly harvested mango lot ready for packing"
            fallbackLabel="Mango lot"
            aspect="aspect-[5/4] lg:aspect-[4/5]"
            caption={{ kicker: "Harvest lot", title: "Southern belt · Export packing" }}
          />
          <div>
            <ProductPill className="border-brand-gold/35 text-brand-gold">Andhra grown</ProductPill>
            <h2 className="mt-5 text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
              Where our mangoes come from
            </h2>
            <p className="mt-5 text-[1.05rem] leading-relaxed text-white/60">
              Banganapalli from Andhra Pradesh — also grown in Karnataka and Tamil Nadu. Regional
              variety identity, not a generic mixed-origin assortment. Orchard and packhouse
              allocation confirmed on enquiry.
            </p>
            <ProductChipRow className="mt-6" items={originChips} />
          </div>
        </div>
      </ProductStage>

      <ProductStage atmosphere={atm.varieties} step="02 · Variety">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <ProductPill className="border-brand-gold/35 text-brand-gold">Export variety</ProductPill>
            <h2 className="mt-5 text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
              Why Banganapalli suits export
            </h2>
            <p className="mt-5 text-[1.05rem] leading-relaxed text-white/60">
              Size, firm flesh and transport tolerance for bulk reefer programmes. Harvest typically
              opens around March–April in southern belts — exact windows confirmed per season.
            </p>
          </div>
          <ProductTimeline items={exportTraits} accent="brand-gold" />
        </div>
      </ProductStage>

      <ProductStage atmosphere={atm.specs} step="03 · Cold chain" id="cold-chain">
        <ProductPill className="border-sky-400/35 text-sky-300">Packing &amp; logistics</ProductPill>
        <h2 className="mt-5 max-w-3xl text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
          Grades, packing &amp; cold chain
        </h2>
        <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-white/60">
          CFB packing, foam or tray protection, and hold temperatures around 10–13°C. Gulf reefer
          sailings are typically about a week — grade, MOQ and lead time confirmed on enquiry.
        </p>

        <ProductStatStrip
          className="mt-8"
          accentClass="text-gradient-gold"
          stats={[
            { value: 13, prefix: "10–", suffix: "°C", label: "Hold / ship temp" },
            { value: 10, prefix: "7–", suffix: " days", label: "Gulf transit" },
            { value: 5, prefix: "3–", suffix: "kg", label: "Common pack weight" },
            { value: 40, suffix: "ft", label: "Reefer programmes" },
          ]}
        />

        <ProductChipRow className="mt-6" items={packingChips} />

        <div className="relative mt-10 grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="relative">
            <ProductColdChainStage
              accent="sky"
              tempLabel="10–13°C"
              title="Reefer sea freight · cold chain"
              steps={chainSteps}
            />
            <div className="pointer-events-none absolute -right-2 -top-4 w-[min(100%,16rem)] text-brand-gold/80 sm:-right-4">
              <RoughSketch
                viewBox="0 0 250 70"
                ops={chainSketchOps}
                className="h-16 w-full"
                strokeWidth={1.4}
                reduced={reduced}
                draw={!reduced}
              />
              <p className="mt-1 text-right text-[0.55rem] font-bold uppercase tracking-[0.14em] text-white/40">
                Orchard → packhouse → reefer → port
              </p>
            </div>
          </div>
          <ProductMediaFrame
            src={unsplash(lotImg, 800, 84)}
            srcSet={unsplashSrcSet(lotImg, [480, 640, 800], 84)}
            lqip={unsplashLQ(lotImg)}
            alt="Mango harvest lot staged for export packing"
            fallbackLabel="Export lot"
            aspect="aspect-[4/3]"
            caption={{ kicker: "Bulk programmes", title: "Sea freight ready when maturity is right" }}
          />
        </div>
      </ProductStage>

      <ProductStage atmosphere={atm.compliance} step="04 · Compliance">
        <ProductPill>Documentation &amp; treatment</ProductPill>
        <h2 className="mt-5 max-w-3xl text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
          Compliance path
        </h2>
        <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-white/60">
          APEDA-registered packhouse path, phytosanitary and Certificate of Origin as required. US
          irradiation or Japan VHT coordinated via partner facilities when your market needs them —
          ask before you book.
        </p>
        <ProductChipRow className="mt-6" items={certChips} />
      </ProductStage>

      <ProductEnquire
        atmosphere={atm.enquire}
        title="Request a quote on WhatsApp"
        lead="Include destination, approximate volume, packing preference, and any US/Japan treatment need. We confirm availability, docs and commercial terms."
        enquireMessage={enquireMessage}
        emailSubject={emailSubject}
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
