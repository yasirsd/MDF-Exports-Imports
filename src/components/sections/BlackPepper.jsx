import {
  ProductPageShell,
  ProductHero,
  ProductStage,
  ProductPill,
  ProductTimeline,
  ProductStatStrip,
  ProductChipRow,
  ProductHeatGradeStage,
  ProductMediaFrame,
  ProductEnquire,
  ProductFaq,
  PRODUCT_ATMOSPHERES,
} from "@/components/sections/productPage";
import { RoughSketch } from "@/components/shared/RoughSketch";
import { brandHello } from "@/lib/config";
import { unsplash, unsplashLQ, unsplashSrcSet, productImages } from "@/lib/images";
import { blackPepperFaqs } from "@/lib/blackPepperPage";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export { BLACK_PEPPER_PATH, BLACK_PEPPER_META, blackPepperFaqs } from "@/lib/blackPepperPage";

const atm = PRODUCT_ATMOSPHERES.blackPepper;

const grades = [
  {
    title: "Malabar Garbled 1 (MG1)",
    note: "Premium garbled tier — high density, clean berries, top volatile oil.",
  },
  {
    title: "Malabar Garbled 2 (MG2)",
    note: "Reliable spec for blenders and grinders working to a consistent recipe.",
  },
  {
    title: "Tellicherry Garbled Special Extra Bold (TGSEB)",
    note: "Largest berries, highest pungency — retail and premium programmes.",
  },
  {
    title: "Tellicherry Garbled Extra Bold (TGEB)",
    note: "Bold berries, strong aroma — a step below TGSEB, still premium.",
  },
];

const tiers = ["MG1", "TGSEB", "TGEB"];

const formChips = ["Whole peppercorns", "Cracked", "Powder on request", "Private label"];

const packingChips = ["Jute 25–50kg + liner", "PP woven bags", "Cartons", "Vacuum for premium"];

const audienceChips = [
  "Spice importers",
  "Blenders",
  "Grinders",
  "Food processors",
  "Retail packers",
];

const certChips = ["Spices Board", "APEDA", "FSSAI", "IEC", "Phytosanitary"];

const gradeSketchOps = [
  { t: "l", x1: 18, y1: 30, x2: 60, y2: 30 },
  { t: "l", x1: 60, y1: 30, x2: 100, y2: 22 },
  { t: "l", x1: 100, y1: 22, x2: 145, y2: 18 },
  { t: "l", x1: 145, y1: 18, x2: 185, y2: 12 },
  { t: "c", x: 60, y: 30, d: 8, fill: "rgba(200,160,80,0.35)" },
  { t: "c", x: 100, y: 22, d: 9, fill: "rgba(200,160,80,0.45)" },
  { t: "c", x: 145, y: 18, d: 10, fill: "rgba(200,160,80,0.55)" },
  { t: "c", x: 185, y: 12, d: 11, fill: "rgba(200,160,80,0.7)" },
];

/**
 * Product landing. Black Pepper export (crawlable static route).
 */
export function BlackPepper() {
  const reduced = usePrefersReducedMotion();
  const enquireMessage = brandHello(
    "I'd like export specs and pricing for Indian black pepper. Destination: [country/port]. Grade: [MG1 / TGSEB / other]. Volume: [approx]. Packing: [preferred]."
  );
  const emailSubject = "Export Enquiry — Black Pepper";
  const heroImg = productImages.blackPepper;
  const vineImg = productImages.blackPepperVine;
  const bowlImg = productImages.blackPepperBowl;

  return (
    <ProductPageShell>
      <ProductHero
        atmosphere={atm.hero}
        pill="Kerala · Malabar & Tellicherry · Export grade"
        titleAccent="Black Pepper"
        title=" for Export"
        lead="Sun-dried Malabar and Tellicherry black pepper from South India — garbled MG1 / TGSEB tiers with density, volatile oil and piperine documented per lot. Share destination and grade; we confirm what we can ship."
        enquireMessage={enquireMessage}
        emailSubject={emailSubject}
        secondaryHref="#specs"
        secondaryLabel="View export specs"
        image={{
          src: unsplash(heroImg, 1100, 88),
          srcSet: unsplashSrcSet(heroImg, [480, 640, 768, 960, 1200], 88),
          lqip: unsplashLQ(heroImg),
        }}
        imageAlt="Export-grade whole black peppercorns from the Malabar coast"
        imageFallback="Black pepper"
        imageCaption={{
          kicker: "Malabar coast · Kerala",
          title: "Density · Volatile oil · Piperine",
        }}
      />

      <ProductStage atmosphere={atm.origin} step="01 · Origin">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <ProductPill className="border-brand-gold/35 text-brand-gold">
              Grade identity
            </ProductPill>
            <h2 className="mt-5 text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
              Why Malabar pepper stands apart
            </h2>
            <p className="mt-5 text-[1.05rem] leading-relaxed text-white/60">
              Grown on the Western Ghats — Kerala&apos;s Idukki and Wayanad, Karnataka&apos;s
              Coorg — the Malabar coast is the reference origin for Indian black pepper.
              Berries are sun-dried, graded and garbled to MG1 / MG2 tiers; Tellicherry lines
              (TGSEB / TGEB) select the boldest berries with the highest piperine. Grade,
              volatile oil and piperine vary by season and lot; we align every enquiry to
              your market&apos;s spec.
            </p>
            <ProductChipRow className="mt-6" items={audienceChips} />
          </div>
          <div className="flex flex-col gap-8">
            <ProductMediaFrame
              src={unsplash(vineImg, 900, 85)}
              srcSet={unsplashSrcSet(vineImg, [480, 640, 768, 960], 85)}
              lqip={unsplashLQ(vineImg)}
              alt="Fresh green pepper berries growing on the vine before harvest"
              fallbackLabel="Pepper on the vine"
              aspect="aspect-[4/3]"
              caption={{
                kicker: "Origin · Western Ghats",
                title: "Where the crop begins",
              }}
            />
            <ProductTimeline items={grades} accent="brand-gold" />
          </div>
        </div>
      </ProductStage>

      <ProductStage atmosphere={atm.specs} step="02 · Specs" id="specs">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <div>
            <ProductPill className="border-brand-gold/35 text-brand-gold">
              Export programme
            </ProductPill>
            <h2 className="mt-5 text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white">
              Export specifications &amp; packing
            </h2>
            <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-white/60">
              Malabar Garbled and Tellicherry lines with density, moisture, volatile oil and
              piperine confirmed lot-by-lot. Whole, cracked or powdered on request —
              ASTA-format specs and private-label packing available for premium programmes.
            </p>

            <ProductStatStrip
              className="mt-8"
              accentClass="text-brand-gold"
              stats={[
                { value: 570, prefix: "500–", suffix: " g/L", label: "Bulk density" },
                { value: 12, suffix: "% max", label: "Moisture" },
                { value: 2, suffix: "% min", label: "Volatile oil" },
                { value: 6, prefix: "4–", suffix: "% +", label: "Piperine" },
              ]}
            />

            <ProductChipRow className="mt-6" items={formChips} />
            <ProductChipRow className="mt-3" items={packingChips} />
          </div>
          <ProductMediaFrame
            src={unsplash(bowlImg, 900, 85)}
            srcSet={unsplashSrcSet(bowlImg, [480, 640, 768, 960], 85)}
            lqip={unsplashLQ(bowlImg)}
            alt="Bowl of graded whole black peppercorns ready for export packing"
            fallbackLabel="Graded pepper lot"
            aspect="aspect-[4/5]"
            caption={{
              kicker: "Grading · Packing",
              title: "Documented, lot by lot",
            }}
          />
        </div>

        <div className="relative mt-10">
          <ProductHeatGradeStage tiers={tiers} />
          <div className="pointer-events-none absolute -right-1 top-2 w-[min(100%,14rem)] text-brand-gold/80 sm:-right-3">
            <RoughSketch
              viewBox="0 0 200 60"
              ops={gradeSketchOps}
              className="h-14 w-full"
              strokeWidth={1.4}
              reduced={reduced}
              draw={!reduced}
            />
            <p className="mt-1 text-right text-[0.55rem] font-bold uppercase tracking-[0.14em] text-white/40">
              Density · pungency · tier
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
          Spices Board of India RCMC, APEDA, FSSAI, IEC and phytosanitary paperwork as
          required. Extra certifications only when in place for a specific lot — ask for
          your destination path before booking.
        </p>
        <ProductChipRow className="mt-6" items={certChips} />
      </ProductStage>

      <ProductEnquire
        atmosphere={atm.enquire}
        title="Request a quote on WhatsApp"
        lead="Include destination, grade, volume, target piperine or lab parameters and packing. We confirm availability, docs and commercial terms."
        enquireMessage={enquireMessage}
        emailSubject={emailSubject}
        checklist={[
          "Destination country / port",
          "Grade & approximate volume",
          "Piperine / lab parameters",
          "Preferred packing",
        ]}
      />

      <div aria-label="Black pepper FAQ">
        <ProductFaq atmosphere={atm.faq} faqs={blackPepperFaqs} />
      </div>
    </ProductPageShell>
  );
}
