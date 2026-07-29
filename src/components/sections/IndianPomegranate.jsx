import {
  ArrowLeft,
  MessageCircle,
  MapPin,
  Snowflake,
  Package,
  FileCheck,
  Ship,
  Thermometer,
  Droplets,
} from "lucide-react";
import { Container } from "@/components/shared/Container";
import { GlassCard } from "@/components/shared/GlassCard";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { LazyImage } from "@/components/shared/LazyImage";
import { brandHello, site } from "@/lib/config";
import { unsplash, unsplashLQ, unsplashSrcSet, productImages } from "@/lib/images";
import { indianPomegranateFaqs } from "@/lib/indianPomegranatePage";
import { whatsappUrl } from "@/lib/utils";

export {
  INDIAN_POMEGRANATE_PATH,
  INDIAN_POMEGRANATE_META,
  indianPomegranateFaqs,
} from "@/lib/indianPomegranatePage";

const districts = [
  { name: "Solapur", note: "Core Bhagwa belt — GI association for Solapur Bhagwa." },
  { name: "Nashik", note: "Trusted grower and packhouse partners for export lots." },
  { name: "Ahmednagar", note: "Maharashtra supply network for graded fruit programmes." },
  { name: "Pune", note: "Packhouse coordination for cold-chain ready consignments." },
];

const specHighlights = [
  { label: "Premium TSS", value: "15–16° Brix", note: "Typical premium grade" },
  { label: "Fruit weight", value: "200–400g", note: "Premium up to 500g+" },
  { label: "Diameter", value: "50–90mm", note: "Premium up to 100mm+" },
  { label: "Shelf life", value: "45–60 days", note: "With proper cold chain" },
  { label: "Hold temp", value: "5–7°C", note: "90–95% RH typical" },
  { label: "Pre-cool", value: "4–5 hrs", note: "After harvest" },
];

const packingWeights = ["2.7kg", "3.0kg", "3.5kg", "4.0kg"];

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

const enquireChecklist = [
  "Destination country / port",
  "Variety (Bhagwa / Ganesh) and approximate volume",
  "Preferred size / grade and carton net weight",
  "Preferred shipping mode",
];

/**
 * CSS-only cold-chain stage — chapter Journey language without motion/GSAP/R3F.
 * Tuned for pomegranate hold range (5–7°C), not generic reefer chrome alone.
 */
function PomegranateColdChainStage() {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-rose-400/20 bg-gradient-to-br from-[#1a0610] via-[#12081a] to-[#060b14] shadow-[0_0_60px_rgba(244,63,94,0.12)] sm:rounded-[2rem]">
      <style>{`
        @keyframes pomo-route-dash {
          to { stroke-dashoffset: -72; }
        }
        @keyframes pomo-temp-pulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @media (prefers-reduced-motion: reduce) {
          .pomo-route-dash, .pomo-temp-dot { animation: none !important; }
        }
        .pomo-route-dash {
          animation: pomo-route-dash 2.8s linear infinite;
        }
        .pomo-temp-dot {
          animation: pomo-temp-pulse 2.4s ease-in-out infinite;
        }
      `}</style>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 28% 35%, rgba(244,63,94,0.18), transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(56,180,240,0.14), transparent 50%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,180,200,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(180,220,255,0.35) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-6 p-5 sm:p-7 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/40 bg-rose-400/10 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-rose-200">
            <span className="pomo-temp-dot h-1.5 w-1.5 rounded-full bg-rose-300" />
            Cold chain · 5–7°C
          </span>
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-rose-100/45">
            Pre-cool → reefer → arrival
          </span>
        </div>

        <svg
          viewBox="0 0 640 280"
          className="h-auto w-full"
          role="img"
          aria-label="Refrigerated pomegranate export cold-chain route"
        >
          <path
            d="M40 200 C 140 200, 180 120, 280 120 S 400 200, 520 160 L 600 160"
            fill="none"
            stroke="rgba(251,113,133,0.22)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            className="pomo-route-dash"
            d="M40 200 C 140 200, 180 120, 280 120 S 400 200, 520 160 L 600 160"
            fill="none"
            stroke="#fb7185"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="8 10"
          />

          {[
            { x: 40, y: 200, label: "Orchard" },
            { x: 280, y: 120, label: "Packhouse" },
            { x: 520, y: 160, label: "Buyer" },
          ].map((n) => (
            <g key={n.label}>
              <circle cx={n.x} cy={n.y} r="7" fill="#1a0610" stroke="#fb7185" strokeWidth="2" />
              <circle cx={n.x} cy={n.y} r="3" fill="#fecdd3" />
              <text
                x={n.x}
                y={n.y + 24}
                textAnchor="middle"
                fill="rgba(254,205,211,0.75)"
                fontSize="11"
                fontWeight="600"
              >
                {n.label}
              </text>
            </g>
          ))}

          <g transform="translate(170, 28)">
            <rect
              x="0"
              y="20"
              width="200"
              height="72"
              rx="6"
              fill="#2a0f1c"
              stroke="#fb7185"
              strokeWidth="1.5"
              opacity="0.95"
            />
            {[28, 56, 84, 112, 140, 168].map((x) => (
              <line
                key={x}
                x1={x}
                y1="22"
                x2={x}
                y2="90"
                stroke="rgba(251,113,133,0.25)"
                strokeWidth="1"
              />
            ))}
            <rect x="8" y="32" width="52" height="20" rx="3" fill="rgba(251,113,133,0.15)" />
            <text x="14" y="46" fill="#fecdd3" fontSize="10" fontWeight="700">
              REEFER
            </text>
            <circle cx="168" cy="56" r="18" fill="#0a0610" stroke="#38bdf8" strokeWidth="1.5" />
            <line
              x1="168"
              y1="56"
              x2="168"
              y2="42"
              stroke="#f97316"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <text x="168" y="80" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontWeight="700">
              5–7°C
            </text>
            <circle cx="36" cy="100" r="8" fill="#3f1528" stroke="#fb7185" strokeWidth="1" />
            <circle cx="164" cy="100" r="8" fill="#3f1528" stroke="#fb7185" strokeWidth="1" />
          </g>
        </svg>

        <ol className="grid grid-cols-2 gap-2 border-t border-rose-400/15 pt-4 sm:grid-cols-4 sm:gap-3">
          {chainSteps.map((s) => (
            <li
              key={s.n}
              className="rounded-xl border border-rose-400/15 bg-rose-400/[0.05] px-3 py-3 text-center"
            >
              <p className="text-[0.55rem] font-bold uppercase tracking-[0.14em] text-rose-300/70">
                {s.n}
              </p>
              <p className="mt-1 text-sm font-extrabold text-rose-50">{s.title}</p>
              <p className="mt-0.5 text-[0.65rem] text-rose-100/45">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/**
 * Product landing — Indian Pomegranate export (crawlable static route).
 * Chapter-inspired atmosphere; CSS-only motion — no GSAP / motion / R3F.
 */
export function IndianPomegranate() {
  const enquireHref = whatsappUrl(
    site.whatsapp,
    brandHello(
      "I'd like export specs and pricing for Indian pomegranates. Destination: [country/port]. Variety: [Bhagwa/Ganesh]. Volume: [approx]. Size/grade & carton net weight: [preferred]. Shipping: reefer sea / other."
    )
  );

  const backHome = () => {
    window.location.href = "/";
  };

  const heroImg = productImages.pomegranate;

  return (
    <div className="relative min-h-[100svh] overflow-x-clip bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[75vh] bg-[radial-gradient(ellipse_at_14%_0%,rgba(225,29,72,0.22),transparent_52%),radial-gradient(ellipse_at_88%_8%,rgba(56,180,240,0.12),transparent_48%),radial-gradient(ellipse_at_50%_18%,rgba(253,197,0,0.07),transparent_42%)]"
        aria-hidden="true"
      />

      <header className="relative z-[2] border-b border-border/80 bg-background/70 backdrop-blur-md">
        <Container className="flex items-center justify-between gap-4 py-5">
          <Logo
            size="nav"
            onClick={(e) => {
              e.preventDefault();
              backHome();
            }}
          />
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              backHome();
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-brand-red hover:text-brand-red"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to site
          </a>
        </Container>
      </header>

      <main className="relative z-[1]">
        <section className="section-py-sm pb-10 sm:pb-14">
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="red">Maharashtra sourced</Badge>
                  <Badge variant="gold">Bhagwa · Ganesh</Badge>
                </div>
                <p className="mt-6 inline-flex items-center rounded-full border border-border/80 bg-surface/60 px-3.5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Fresh fruit export line
                </p>
                <h1 className="mt-4 text-[clamp(2.35rem,5.5vw,4rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
                  <span className="text-gradient-red">Indian Pomegranates</span>
                  <span className="block text-foreground"> for Export</span>
                </h1>
                <p className="mt-6 max-w-xl text-lead text-muted-foreground">
                  MDF Exports &amp; Imports supplies fresh Indian pomegranates for international
                  buyers who need clear origin, consistent grading and a cold-chain path they can
                  trust. Share your preferred variety (Bhagwa or Ganesh), size profile, destination
                  market and packing format — we confirm what we can source and how it can ship.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button asChild size="lg" className="shadow-glow">
                    <a href={enquireHref} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-5 w-5" />
                      Request a quote on WhatsApp
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a href="#cold-chain">View cold chain</a>
                  </Button>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                <div
                  className="absolute -inset-4 rounded-[2.25rem] bg-gradient-to-br from-brand-red/30 via-rose-500/10 to-sky-500/15 blur-2xl"
                  aria-hidden="true"
                />
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-border/80 bg-[#140e0a] shadow-[0_28px_70px_rgba(20,14,10,0.28)] sm:rounded-[2rem]">
                  <LazyImage
                    src={unsplash(heroImg, 1100, 88)}
                    srcSet={unsplashSrcSet(heroImg, [480, 640, 768, 960, 1200], 88)}
                    sizes="(min-width:1024px) 38vw, 90vw"
                    lqip={unsplashLQ(heroImg)}
                    alt="Export-grade Indian pomegranates"
                    fallbackLabel="Indian pomegranates"
                    eager
                    className="absolute inset-0 h-full w-full"
                    imgClassName="object-cover object-center"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#140e0a]/85 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-rose-300">
                      Maharashtra · Cold-chain ready
                    </p>
                    <p className="mt-1 text-lg font-extrabold text-white">
                      Bhagwa · Ganesh · Graded lots
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="section-py bg-surface-2">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-14">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-red/30 bg-brand-red/10 text-brand-red">
                <MapPin className="h-7 w-7" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-h2 font-extrabold tracking-tight">
                  Where our pomegranates come from
                </h2>
                <p className="mt-5 text-[1.05rem] leading-relaxed text-muted-foreground">
                  Pomegranates of commercial export quality are not grown in Andhra Pradesh. We
                  source from Maharashtra — India&apos;s dominant pomegranate export region, including
                  the Solapur, Nashik, Ahmednagar and Pune districts — through trusted grower and
                  packhouse partners. Our commercial base is in Andhra Pradesh: we act as your
                  export counterpart for enquiry, documentation and programme coordination. We are
                  not positioning Andhra as the orchard origin for this product.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {districts.map((d) => (
                    <GlassCard
                      key={d.name}
                      className="group relative overflow-hidden p-5 transition-transform duration-500 ease-premium hover:-translate-y-1"
                    >
                      <div
                        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-rose-500/10 blur-2xl"
                        aria-hidden="true"
                      />
                      <p className="text-lg font-extrabold text-foreground">{d.name}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{d.note}</p>
                    </GlassCard>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="section-py">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-gold/35 bg-brand-gold/10 text-brand-gold">
                <Package className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="text-h2 font-extrabold tracking-tight">Varieties we can supply</h2>
              <p className="mt-5 text-[1.05rem] leading-relaxed text-muted-foreground">
                Variety availability follows season and lot. We supply:
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <GlassCard className="relative overflow-hidden border-brand-red/20 p-6 sm:p-8">
                <div
                  className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand-red/15 blur-3xl"
                  aria-hidden="true"
                />
                <Badge variant="red">Dominant export variety</Badge>
                <h3 className="mt-4 text-2xl font-extrabold tracking-tight">Bhagwa</h3>
                <p className="mt-4 text-[1.05rem] leading-relaxed text-muted-foreground">
                  The dominant Indian export variety. Buyers typically look for a glossy deep-red
                  rind, dark pink arils, high sweetness and strong shelf-life performance under cold
                  chain. Solapur Bhagwa is associated with a Geographical Indication (GI) tag;
                  whether a specific consignment is supplied as GI-tagged Solapur fruit is confirmed
                  lot-by-lot on enquiry — we do not treat every Maharashtra Bhagwa lot as
                  automatically GI-certified.
                </p>
              </GlassCard>

              <GlassCard className="relative overflow-hidden p-6 sm:p-8">
                <div
                  className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand-gold/12 blur-3xl"
                  aria-hidden="true"
                />
                <Badge variant="gold">Secondary commercial line</Badge>
                <h3 className="mt-4 text-2xl font-extrabold tracking-tight">Ganesh</h3>
                <p className="mt-4 text-[1.05rem] leading-relaxed text-muted-foreground">
                  A secondary commercial line with pinkish-yellow to reddish-yellow rind and lighter
                  pink arils. Sweetness is generally medium versus premium Bhagwa, and it is often
                  discussed at a lower price point for programmes that do not need Bhagwa&apos;s colour
                  and TSS profile.
                </p>
              </GlassCard>
            </div>

            <p className="mx-auto mt-8 max-w-3xl text-center text-[1.05rem] leading-relaxed text-muted-foreground">
              We do not treat &quot;Indian pomegranate&quot; as one interchangeable SKU. Tell us the variety
              mix, colour preference and size grades your buyers expect, and we will match available
              lots or say clearly when we cannot.
            </p>
          </Container>
        </section>

        <section id="cold-chain" className="section-py scroll-mt-24 bg-[#0a0610] text-white">
          <Container>
            <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
              <div>
                <span className="inline-flex items-center rounded-full border border-rose-400/35 bg-rose-400/10 px-3.5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-rose-200">
                  Fresh produce logistics
                </span>
                <h2 className="mt-5 text-h2 font-extrabold tracking-tight text-white">
                  Grades, packing &amp; cold chain
                </h2>
                <p className="mt-5 text-[1.05rem] leading-relaxed text-rose-50/65">
                  Pomegranates are fresh produce. Export programmes depend on grade, sizing, packing
                  discipline and unbroken temperature control. Typical industry-standard discussion
                  ranges (exact figures confirmed per lot before booking): Sweetness (TSS) about
                  15–16° Brix for premium grade. Fruit weight typically 200–400g, premium lots up to
                  500g+. Diameter typically 50–90mm, premium up to 100mm+. Grading: A Grade / B
                  Grade, or Extra Class / Class I / Class II depending on destination market&apos;s
                  standard. Packing: corrugated fiberboard cartons, common net weights 2.7kg / 3.0kg
                  / 3.5kg / 4.0kg; private-label marking on request. Cold chain: pre-cooled within
                  4–5 hours of harvest, held at about 5–7°C with 90–95% relative humidity. Shelf
                  life: typically 45–60 days post-harvest when proper cold chain is maintained
                  through transit and arrival handling. Harvest/availability: Hasta Bahar cycle,
                  roughly September–December, peak quality in that window. Minimum order: on enquiry
                  (programmes often discussed around a 20ft container load, roughly ~13.5 MT, but
                  volume confirmed per order). Commercial basis / pricing / lead time: on enquiry.
                  Lot parameters (colour, firmness, defects, size mix) confirmed before booking
                  against destination requirements.
                </p>

                <ul className="mt-8 flex flex-col gap-2.5">
                  {[
                    { icon: Snowflake, label: "Pre-cooled within 4–5 hours of harvest" },
                    { icon: Thermometer, label: "Held at about 5–7°C through transit" },
                    { icon: Droplets, label: "90–95% relative humidity typical" },
                    { icon: Ship, label: "Reefer path for 45–60 day shelf-life window" },
                  ].map((item) => (
                    <li
                      key={item.label}
                      className="flex items-center gap-3 rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-3.5 py-3"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-rose-400/12 text-rose-200">
                        <item.icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="text-sm font-semibold text-rose-50/90">{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <PomegranateColdChainStage />
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {specHighlights.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.05] px-3 py-4 text-center"
                >
                  <p className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-rose-200/50">
                    {s.label}
                  </p>
                  <p className="mt-1.5 text-lg font-extrabold text-rose-50">{s.value}</p>
                  <p className="mt-1 text-[0.65rem] text-rose-100/45">{s.note}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {packingWeights.map((w) => (
                <span
                  key={w}
                  className="rounded-full border border-rose-400/25 bg-white/[0.03] px-3.5 py-1.5 text-sm font-semibold text-rose-50/90"
                >
                  Carton · {w}
                </span>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
              {commercial.map((c) => (
                <div
                  key={c.label}
                  className="rounded-2xl border border-dashed border-rose-400/25 bg-rose-400/[0.04] px-3 py-4 text-center"
                >
                  <p className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-rose-200/45">
                    {c.label}
                  </p>
                  <p className="mt-1 text-sm font-bold text-rose-50">{c.value}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="section-py bg-surface-2">
          <Container className="max-w-4xl">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:gap-10">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-brand-red/30 bg-brand-red/10 text-brand-red">
                <FileCheck className="h-7 w-7" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-h2 font-extrabold tracking-tight">
                  Compliance documentation we work with
                </h2>
                <p className="mt-5 text-[1.05rem] leading-relaxed text-muted-foreground">
                  Shipments are prepared within recognised Indian export and food-safety frameworks.
                  In practice we work with APEDA (agricultural export alignment, in use), FSSAI (food
                  safety framework, in use), and IEC and phytosanitary documentation as required for
                  the consignment. We do not claim Global G.A.P., ISO 22000 or other certificates
                  unless they are in place for a specific lot or grower. Ask our desk for the
                  documents your destination requires before you book.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Badge variant="success">APEDA · in use</Badge>
                  <Badge variant="success">FSSAI · in use</Badge>
                  <Badge variant="default">IEC</Badge>
                  <Badge variant="default">Phytosanitary</Badge>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="section-py-sm pb-16">
          <Container>
            <GlassCard className="relative overflow-hidden border-brand-red/25 p-8 sm:p-12">
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-red/20 blur-3xl"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-rose-500/15 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative mx-auto max-w-2xl text-center">
                <h2 className="text-h2 font-extrabold tracking-tight">
                  Request a quote on WhatsApp
                </h2>
                <p className="mt-4 text-[1.05rem] leading-relaxed text-muted-foreground">
                  The fastest way to start is WhatsApp to our export desk. Include: destination
                  country / port, variety (Bhagwa / Ganesh) and approximate volume, preferred size /
                  grade and carton net weight, preferred shipping mode. We will confirm sourcing
                  availability, cold-chain path and commercial terms. No obligation until you place
                  an order.
                </p>
                <ul className="mx-auto mt-6 flex max-w-lg flex-wrap justify-center gap-2">
                  {enquireChecklist.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-semibold text-foreground/90"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild size="lg" className="mt-8 shadow-glow">
                  <a href={enquireHref} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5" />
                    Chat on WhatsApp
                  </a>
                </Button>
              </div>
            </GlassCard>
          </Container>
        </section>

        <section className="section-py bg-surface-2" aria-label="Indian pomegranate FAQ">
          <Container className="max-w-3xl">
            <h2 className="text-center text-h2 font-extrabold tracking-tight">
              Frequently asked questions
            </h2>
            <Accordion type="single" collapsible className="mt-10 flex flex-col gap-4">
              {indianPomegranateFaqs.map((faq, i) => (
                <AccordionItem key={faq.q} value={`p-${i}`}>
                  <AccordionTrigger>{faq.q}</AccordionTrigger>
                  <AccordionContent>
                    <p className="px-6 pb-6 leading-relaxed">{faq.a}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Container>
        </section>
      </main>
    </div>
  );
}
