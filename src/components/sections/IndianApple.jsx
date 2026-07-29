import {
  ArrowLeft,
  MessageCircle,
  Mountain,
  Snowflake,
  Package,
  FileCheck,
  Ship,
  Thermometer,
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
import { indianAppleFaqs } from "@/lib/indianApplePage";
import { whatsappUrl } from "@/lib/utils";

export { INDIAN_APPLE_PATH, INDIAN_APPLE_META, indianAppleFaqs } from "@/lib/indianApplePage";

const origins = [
  {
    region: "Himachal Pradesh",
    belts: "Shimla & Kinnaur belts",
    note: "Recognised hill orchards — packhouse partners for graded fruit.",
  },
  {
    region: "Jammu & Kashmir",
    belts: "Kashmir apple belt",
    note: "Trusted grower and packhouse network for export programmes.",
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

const enquireChecklist = [
  "Destination country / port",
  "Varieties and approximate volume",
  "Preferred size / grade and packing",
  "Preferred shipping mode",
];

/**
 * CSS-only cold-chain stage — chapter Journey language without motion/GSAP/R3F.
 */
function AppleColdChainStage() {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-sky-400/25 bg-gradient-to-br from-[#0a1628] via-[#0c1a30] to-[#061018] shadow-[0_0_60px_rgba(56,160,220,0.14)] sm:rounded-[2rem]">
      <style>{`
        @keyframes apple-route-dash {
          to { stroke-dashoffset: -72; }
        }
        @keyframes apple-temp-pulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @media (prefers-reduced-motion: reduce) {
          .apple-route-dash, .apple-temp-dot { animation: none !important; }
        }
        .apple-route-dash {
          animation: apple-route-dash 2.8s linear infinite;
        }
        .apple-temp-dot {
          animation: apple-temp-pulse 2.4s ease-in-out infinite;
        }
      `}</style>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(56,180,240,0.16), transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(20,80,140,0.22), transparent 50%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(180,220,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(180,220,255,0.4) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-6 p-5 sm:p-7 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-400/10 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-sky-300">
            <span className="apple-temp-dot h-1.5 w-1.5 rounded-full bg-sky-300" />
            Reefer sea freight · cold chain
          </span>
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-sky-200/50">
            Pre-cool → transit → arrival
          </span>
        </div>

        <svg
          viewBox="0 0 640 280"
          className="h-auto w-full"
          role="img"
          aria-label="Refrigerated container on an apple export cold-chain route"
        >
          <path
            d="M40 200 C 140 200, 180 120, 280 120 S 400 200, 520 160 L 600 160"
            fill="none"
            stroke="rgba(120,190,255,0.2)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            className="apple-route-dash"
            d="M40 200 C 140 200, 180 120, 280 120 S 400 200, 520 160 L 600 160"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="8 10"
          />

          {[
            { x: 40, y: 200, label: "Packhouse" },
            { x: 280, y: 120, label: "Port" },
            { x: 520, y: 160, label: "Buyer" },
          ].map((n) => (
            <g key={n.label}>
              <circle cx={n.x} cy={n.y} r="7" fill="#0a1628" stroke="#38bdf8" strokeWidth="2" />
              <circle cx={n.x} cy={n.y} r="3" fill="#7dd3fc" />
              <text
                x={n.x}
                y={n.y + 24}
                textAnchor="middle"
                fill="rgba(186,230,253,0.75)"
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
              fill="#0f2744"
              stroke="#38bdf8"
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
                stroke="rgba(125,211,252,0.25)"
                strokeWidth="1"
              />
            ))}
            <rect x="8" y="32" width="52" height="20" rx="3" fill="rgba(56,189,248,0.15)" />
            <text x="14" y="46" fill="#7dd3fc" fontSize="10" fontWeight="700">
              REEFER
            </text>
            <circle cx="168" cy="56" r="18" fill="#061018" stroke="#38bdf8" strokeWidth="1.5" />
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
              Held
            </text>
            <circle cx="36" cy="100" r="8" fill="#1e3a5f" stroke="#38bdf8" strokeWidth="1" />
            <circle cx="164" cy="100" r="8" fill="#1e3a5f" stroke="#38bdf8" strokeWidth="1" />
          </g>
        </svg>

        <ol className="grid grid-cols-2 gap-2 border-t border-sky-400/15 pt-4 sm:grid-cols-4 sm:gap-3">
          {chainSteps.map((s) => (
            <li key={s.n} className="rounded-xl border border-sky-400/15 bg-sky-400/[0.05] px-3 py-3 text-center">
              <p className="text-[0.55rem] font-bold uppercase tracking-[0.14em] text-sky-300/70">
                {s.n}
              </p>
              <p className="mt-1 text-sm font-extrabold text-sky-100">{s.title}</p>
              <p className="mt-0.5 text-[0.65rem] text-sky-200/45">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/**
 * Product landing — Premium Indian Apple export (crawlable static route).
 * Chapter-inspired atmosphere; CSS-only motion — no GSAP / motion / R3F.
 */
export function IndianApple() {
  const enquireHref = whatsappUrl(
    site.whatsapp,
    brandHello(
      "I'd like export specs and pricing for premium Indian apples. Destination: [country/port]. Varieties: [Kinnaur/Shimla/other]. Volume: [approx]. Size/grade & packing: [preferred]. Shipping: reefer sea / other."
    )
  );

  const backHome = () => {
    window.location.href = "/";
  };

  const heroImg = productImages.indianApple;

  return (
    <div className="relative min-h-[100svh] overflow-x-clip bg-background text-foreground">
      {/* Dual atmosphere: orchard warmth + cold-chain ice */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[75vh] bg-[radial-gradient(ellipse_at_12%_0%,rgba(239,35,60,0.2),transparent_52%),radial-gradient(ellipse_at_88%_8%,rgba(56,180,240,0.16),transparent_48%),radial-gradient(ellipse_at_50%_20%,rgba(253,197,0,0.08),transparent_40%)]"
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
        {/* Hero — chapter editorial scale */}
        <section className="section-py-sm pb-10 sm:pb-14">
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="red">Himachal &amp; J&amp;K sourced</Badge>
                  <Badge variant="gold">Fresh · Cold chain</Badge>
                </div>
                <p className="mt-6 inline-flex items-center rounded-full border border-border/80 bg-surface/60 px-3.5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Premium export line
                </p>
                <h1 className="mt-4 text-[clamp(2.35rem,5.5vw,4rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
                  <span className="text-gradient-orange">Premium Indian Apples</span>
                  <span className="block text-foreground"> for Export</span>
                </h1>
                <p className="mt-6 max-w-xl text-lead text-muted-foreground">
                  MDF Exports &amp; Imports supplies premium fresh Indian apples for international
                  buyers who need clear origin, consistent grading and a cold-chain story they can
                  trust. Share your preferred varieties, size profile, destination market and packing
                  format — we confirm what we can source and how it can ship.
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
                  className="absolute -inset-4 rounded-[2.25rem] bg-gradient-to-br from-brand-red/28 via-sky-500/10 to-brand-gold/18 blur-2xl"
                  aria-hidden="true"
                />
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-border/80 bg-[#140e0a] shadow-[0_28px_70px_rgba(20,14,10,0.28)] sm:rounded-[2rem]">
                  <LazyImage
                    src={unsplash(heroImg, 1100, 88)}
                    srcSet={unsplashSrcSet(heroImg, [480, 640, 768, 960, 1200], 88)}
                    sizes="(min-width:1024px) 38vw, 90vw"
                    lqip={unsplashLQ(heroImg)}
                    alt="Premium export-grade Indian apples"
                    fallbackLabel="Indian apples"
                    eager
                    className="absolute inset-0 h-full w-full"
                    imgClassName="object-cover object-center"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#140e0a]/85 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-sky-300">
                      Hill orchards · Reefer ready
                    </p>
                    <p className="mt-1 text-lg font-extrabold text-white">
                      Origin clarity · Graded lots · Cold chain
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Origin */}
        <section className="section-py bg-surface-2">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-14">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-red/30 bg-brand-red/10 text-brand-red">
                <Mountain className="h-7 w-7" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-h2 font-extrabold tracking-tight">Where our apples come from</h2>
                <p className="mt-5 text-[1.05rem] leading-relaxed text-muted-foreground">
                  Apples are not grown in Andhra Pradesh. We source from India&apos;s recognised
                  apple-growing regions — Himachal Pradesh (including the Shimla and Kinnaur belts)
                  and Jammu &amp; Kashmir — through trusted grower and packhouse partners. Our
                  commercial base is in Andhra Pradesh: we act as your export counterpart for
                  enquiry, documentation and programme coordination.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {origins.map((o) => (
                    <GlassCard
                      key={o.region}
                      className="group relative overflow-hidden p-6 transition-transform duration-500 ease-premium hover:-translate-y-1"
                    >
                      <div
                        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-sky-400/10 blur-2xl transition-opacity group-hover:opacity-100"
                        aria-hidden="true"
                      />
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-brand-orange-bright">
                        {o.belts}
                      </p>
                      <p className="mt-2 text-lg font-extrabold text-foreground">{o.region}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{o.note}</p>
                    </GlassCard>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Varieties */}
        <section className="section-py">
          <Container className="max-w-4xl">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-gold/35 bg-brand-gold/10 text-brand-gold">
                <Package className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="text-h2 font-extrabold tracking-tight">Varieties we can supply</h2>
              <p className="mt-5 text-[1.05rem] leading-relaxed text-muted-foreground">
                Variety availability follows season and lot. We supply Shimla and Kinnaur apples —
                trusted regional lines from Himachal Pradesh&apos;s premium growing belts — along with
                Richared, a mid-season Delicious-family variety grown across Himachal Pradesh and
                Jammu &amp; Kashmir. We do not treat &quot;Indian apple&quot; as one interchangeable SKU.
                Tell us the variety mix, colour preference and size grades your buyers expect, and we
                will match available lots or say clearly when we cannot.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-2">
              <Badge variant="gold">Shimla</Badge>
              <Badge variant="gold">Kinnaur</Badge>
              <Badge variant="gold">Richared</Badge>
            </div>
          </Container>
        </section>

        {/* Grades + cold chain — chapter Journey stage */}
        <section id="cold-chain" className="section-py scroll-mt-24 bg-[#060b14] text-white">
          <Container>
            <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
              <div>
                <span className="inline-flex items-center rounded-full border border-sky-400/35 bg-sky-400/10 px-3.5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sky-300">
                  Fresh produce logistics
                </span>
                <h2 className="mt-5 text-h2 font-extrabold tracking-tight text-white">
                  Grades, packing &amp; cold chain
                </h2>
                <p className="mt-5 text-[1.05rem] leading-relaxed text-sky-100/65">
                  Apples are fresh produce. Export programmes depend on grade, sizing, packing
                  discipline and unbroken temperature control — not shelf-stable dry packing.
                  Shipping is arranged via reefer container by sea freight, with temperature control
                  maintained from pre-cooling through transit. Typical discussion points: grade/class
                  on enquiry, size/count on enquiry, packing on enquiry, private label marking on
                  request, minimum order on enquiry, commercial basis on enquiry (pricing on
                  enquiry), lead time on enquiry, harvest/availability window on enquiry. Lot
                  parameters (firmness, colour, defects) are confirmed before booking against your
                  destination&apos;s requirements.
                </p>

                <ul className="mt-8 flex flex-col gap-2.5">
                  {[
                    { icon: Snowflake, label: "Pre-cooling before load" },
                    { icon: Ship, label: "Reefer container by sea freight" },
                    { icon: Thermometer, label: "Temperature held through transit" },
                  ].map((item) => (
                    <li
                      key={item.label}
                      className="flex items-center gap-3 rounded-xl border border-sky-400/20 bg-sky-400/[0.06] px-3.5 py-3"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-sky-400/12 text-sky-300">
                        <item.icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="text-sm font-semibold text-sky-100/90">{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <AppleColdChainStage />
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-9">
              {discussionPoints.map((c) => (
                <div
                  key={c.label}
                  className="rounded-2xl border border-dashed border-sky-400/25 bg-sky-400/[0.04] px-3 py-4 text-center"
                >
                  <p className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-sky-200/45">
                    {c.label}
                  </p>
                  <p className="mt-1 text-sm font-bold text-sky-100">{c.value}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Compliance */}
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

        {/* WhatsApp CTA */}
        <section className="section-py-sm pb-16">
          <Container>
            <GlassCard className="relative overflow-hidden border-brand-red/25 p-8 sm:p-12">
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-red/20 blur-3xl"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-sky-500/15 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative mx-auto max-w-2xl text-center">
                <h2 className="text-h2 font-extrabold tracking-tight">
                  Request a quote on WhatsApp
                </h2>
                <p className="mt-4 text-[1.05rem] leading-relaxed text-muted-foreground">
                  The fastest way to start is WhatsApp to our export desk. Include: destination
                  country / port, varieties and approximate volume, preferred size / grade and
                  packing, preferred shipping mode. We will confirm sourcing availability, cold-chain
                  path and commercial terms. No obligation until you place an order.
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

        {/* FAQ */}
        <section className="section-py bg-surface-2" aria-label="Indian apple FAQ">
          <Container className="max-w-3xl">
            <h2 className="text-center text-h2 font-extrabold tracking-tight">
              Frequently asked questions
            </h2>
            <Accordion type="single" collapsible className="mt-10 flex flex-col gap-4">
              {indianAppleFaqs.map((faq, i) => (
                <AccordionItem key={faq.q} value={`a-${i}`}>
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
