import {
  ProductPageShell,
  ProductHero,
  ProductStage,
  ProductPill,
  ProductMediaFrame,
  ProductStatStrip,
  ProductChipRow,
  ProductColdChainStage,
  ProductEnquire,
  ProductFaq,
  PRODUCT_ATMOSPHERES,
  ACCENT_CLASSES,
} from "@/components/sections/productPage";
import { RoughSketch } from "@/components/shared/RoughSketch";
import { brandHello } from "@/lib/config";
import { unsplash, unsplashLQ, unsplashSrcSet, productImages } from "@/lib/images";
import { indianPomegranateFaqs } from "@/lib/indianPomegranatePage";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

export {
  INDIAN_POMEGRANATE_PATH,
  INDIAN_POMEGRANATE_META,
  indianPomegranateFaqs,
} from "@/lib/indianPomegranatePage";

const atm = PRODUCT_ATMOSPHERES.pomegranate;

const districtChips = [
  { label: "Solapur", title: "Core Bhagwa belt · GI association" },
  { label: "Nashik", title: "Grower & packhouse network" },
  { label: "Ahmednagar", title: "Maharashtra supply belt" },
  { label: "Pune", title: "Packhouse hub" },
];

const packingChips = ["2.7kg", "3.0kg", "3.5kg", "4.0kg", "Private label"];

const certChips = ["APEDA", "FSSAI", "IEC", "Phytosanitary"];

const chainSteps = [
  { n: "01", title: "Harvest", desc: "Pre-cool 4–5 hrs" },
  { n: "02", title: "Hold", desc: "5–7°C · 90–95% RH" },
  { n: "03", title: "Reefer", desc: "Sea freight locked" },
  { n: "04", title: "Arrival", desc: "45–60 day window" },
];

const chainSketchOps = [
  { t: "l", x1: 22, y1: 40, x2: 85, y2: 28 },
  { t: "l", x1: 85, y1: 28, x2: 150, y2: 42 },
  { t: "l", x1: 150, y1: 42, x2: 215, y2: 30 },
  { t: "c", x: 22, y: 40, d: 10, fill: "rgba(244,63,94,0.32)" },
  { t: "c", x: 85, y: 28, d: 10, fill: "rgba(244,63,94,0.32)" },
  { t: "c", x: 150, y: 42, d: 10, fill: "rgba(56,160,220,0.3)" },
  { t: "c", x: 215, y: 30, d: 10, fill: "rgba(56,160,220,0.3)" },
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
 * Product landing. Indian Pomegranate export (crawlable static route).
 */
export function IndianPomegranate() {
  const reduced = usePrefersReducedMotion();
  const enquireMessage = brandHello(
    "I'd like export specs and pricing for Indian pomegranates. Destination: [country/port]. Variety: [Bhagwa/Ganesh]. Volume: [approx]. Size/grade & carton net weight: [preferred]. Shipping: reefer sea / other."
  );
  const emailSubject = "Export Enquiry — Indian Pomegranate";
  const heroImg = productImages.pomegranate;

  return (
    <ProductPageShell>
      <ProductHero
        atmosphere={atm.hero}
        pill="Maharashtra · Bhagwa · Ganesh"
        titleAccent="Indian Pomegranates"
        titleAccentClass="text-gradient-red"
        title=" for Export"
        lead="Clear Maharashtra origin, consistent grading and a cold-chain path buyers can trust. Share variety, size profile, destination and packing — we confirm what we can source."
        enquireMessage={enquireMessage}
        emailSubject={emailSubject}
        secondaryHref="#cold-chain"
        secondaryLabel="View cold chain"
        image={{
          src: unsplash(heroImg, 1100, 88),
          srcSet: unsplashSrcSet(heroImg, [480, 640, 768, 960, 1200], 88),
          lqip: unsplashLQ(heroImg),
        }}
        imageAlt="Harvest lot of Indian pomegranates packed for export"
        imageFallback="Indian pomegranates"
        imageCaption={{
          kicker: "Maharashtra · Harvest lot",
          title: "Bhagwa · Ganesh · Graded lots",
        }}
      />

      <ProductStage atmosphere={atm.origin} step="01 · Origin">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <ProductMediaFrame
            src={unsplash(heroImg, 900, 86)}
            srcSet={unsplashSrcSet(heroImg, [480, 640, 800, 1000], 86)}
            lqip={unsplashLQ(heroImg)}
            alt="Indian pomegranate harvest lot from Maharashtra"
            fallbackLabel="Pomegranate lot"
            aspect="aspect-[5/4] lg:aspect-[4/5]"
            caption={{ kicker: "Maharashtra belt", title: "Solapur · Nashik · export lots" }}
          />
          <div>
            <ProductPill className="border-rose-400/35 text-rose-300">Maharashtra orchards</ProductPill>
            <h2 className="mt-5 text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
              Where our pomegranates come from
            </h2>
            <p className="mt-5 text-[1.05rem] leading-relaxed text-white/60">
              Sourced from Maharashtra — Solapur, Nashik, Ahmednagar and Pune — through trusted
              grower and packhouse partners. Our Andhra Pradesh desk coordinates enquiry, docs and
              delivery. Andhra is not the orchard origin for this product.
            </p>
            <ProductChipRow className="mt-6" items={districtChips} />
          </div>
        </div>
      </ProductStage>

      <ProductStage atmosphere={atm.varieties} step="02 · Varieties">
        <ProductPill className="border-rose-400/35 text-rose-300">Season &amp; lot</ProductPill>
        <h2 className="mt-5 max-w-3xl text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
          Varieties we can supply
        </h2>
        <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-white/60">
          Bhagwa and Ganesh matched to season and lot — not one interchangeable SKU. Tell us colour
          and size grades; we match available fruit or say clearly when we cannot.
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <VarietyPanel
            eyebrow="Dominant export variety"
            name="Bhagwa"
            accent="rose"
            body="Deep-red rind, dark pink arils, high sweetness and strong shelf life under cold chain. Solapur Bhagwa has a GI association — GI-tagged lots confirmed enquiry-by-enquiry, not assumed for every Maharashtra lot."
          />
          <VarietyPanel
            eyebrow="Secondary commercial line"
            name="Ganesh"
            accent="brand-gold"
            body="Pinkish-yellow to reddish-yellow rind, lighter pink arils, medium sweetness versus premium Bhagwa. Often discussed at a lower price point when programmes do not need Bhagwa colour and TSS."
          />
        </div>
      </ProductStage>

      <ProductStage atmosphere={atm.specs} step="03 · Cold chain" id="cold-chain">
        <ProductPill className="border-sky-400/35 text-sky-300">Fresh produce logistics</ProductPill>
        <h2 className="mt-5 max-w-3xl text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
          Grades, packing &amp; cold chain
        </h2>
        <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-white/60">
          Pre-cool within hours of harvest, hold at 5–7°C, ship unbroken in reefer. Carton net
          weights and commercial terms set per programme — exact figures confirmed before booking.
        </p>

        <ProductStatStrip
          className="mt-8"
          accentClass="text-rose-300"
          stats={[
            { value: 16, prefix: "15–", suffix: "° Brix", label: "Premium TSS" },
            { value: 7, prefix: "5–", suffix: "°C", label: "Hold temp" },
            { value: 60, prefix: "45–", suffix: " days", label: "Shelf window" },
            { value: 4, prefix: "2.7–", suffix: "kg", label: "Carton nets" },
          ]}
        />

        <ProductChipRow className="mt-6" items={packingChips} />

        <div className="relative mt-10">
          <ProductColdChainStage
            accent="rose"
            tempLabel="5–7°C"
            title="Cold chain · 5–7°C"
            steps={chainSteps}
          />
          <div className="pointer-events-none absolute -right-1 -top-3 w-[min(100%,15rem)] text-rose-300/80 sm:-right-3">
            <RoughSketch
              viewBox="0 0 235 65"
              ops={chainSketchOps}
              className="h-14 w-full"
              strokeWidth={1.4}
              reduced={reduced}
              draw={!reduced}
            />
            <p className="mt-1 text-right text-[0.55rem] font-bold uppercase tracking-[0.14em] text-white/40">
              Pre-cool → hold → reefer → arrival
            </p>
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
        lead="Include destination, variety, volume, size/grade and carton net weight. We confirm sourcing, cold-chain path and commercial terms."
        enquireMessage={enquireMessage}
        emailSubject={emailSubject}
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
