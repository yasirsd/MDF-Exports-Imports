import { ArrowLeft, MessageCircle, Flame, Package, FileCheck, Users } from "lucide-react";
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
import { gunturFaqs } from "@/lib/gunturChilliPage";
import { whatsappUrl } from "@/lib/utils";

export { GUNTUR_CHILLI_PATH, GUNTUR_CHILLI_META, gunturFaqs } from "@/lib/gunturChilliPage";
const grades = [
  {
    name: "Guntur Sannam S4 (334)",
    note: "Balanced heat and colour for spice programmes.",
  },
  {
    name: "Teja / S17",
    note: "Higher pungency for processors who need sharper heat.",
  },
  {
    name: "Teja Deluxe",
    note: "Premium Teja selection for demanding specs.",
  },
];

const tiers = ["Deluxe", "Best", "Medium Best"];

const lotParams = [
  { label: "Moisture", value: "10–14% max" },
  { label: "Foreign matter", value: "1% max" },
  { label: "Broken / stalks", value: "2–3% max" },
];

const forms = ["Whole", "With stem", "Stemless", "Powder on request"];

const packing = ["5–50kg jute", "PP bags", "Carton formats", "Private label on request"];

const commercial = [
  { label: "Minimum order", value: "On enquiry" },
  { label: "Commercial basis", value: "On enquiry" },
  { label: "Pricing", value: "On enquiry" },
  { label: "Lead time", value: "On enquiry" },
];

const audiences = [
  "Spice importers",
  "Wholesalers",
  "Grinders",
  "Food processors",
  "Gulf & other import markets",
];

/**
 * Product landing — Guntur Red Chilli export (crawlable static route).
 * Lightweight: CSS atmosphere only, no GSAP / motion / R3F.
 */
export function GunturRedChilli() {
  const enquireHref = whatsappUrl(
    site.whatsapp,
    brandHello(
      "I'd like export specs and pricing for Guntur red chilli. Destination: [country/port]. Form: [whole/other]. Volume: [approx]. Packing: [preferred]."
    )
  );

  const backHome = () => {
    window.location.href = "/";
  };

  const heroImg = productImages.dryRedChilli;

  return (
    <div className="relative min-h-[100svh] overflow-x-clip bg-background text-foreground">
      {/* Atmospheric wash — matches dark-first brand without heavy JS */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] bg-[radial-gradient(ellipse_at_20%_0%,rgba(239,35,60,0.22),transparent_55%),radial-gradient(ellipse_at_90%_10%,rgba(253,197,0,0.12),transparent_45%)]"
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
        {/* Hero */}
        <section className="section-py-sm pb-10 sm:pb-14">
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="red">Andhra Pradesh origin</Badge>
                  <Badge variant="gold">Dried · Export grade</Badge>
                </div>
                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Product line
                </p>
                <h1 className="mt-3 text-[clamp(2.35rem,5.5vw,4rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
                  <span className="text-gradient-orange">Guntur Red Chilli</span>
                  <span className="block text-foreground"> for Export</span>
                </h1>
                <p className="mt-6 max-w-xl text-lead text-muted-foreground">
                  MDF Exports & Imports supplies dried Guntur red chilli from Andhra Pradesh for
                  international buyers who need consistent colour, heat character and
                  documentation-ready lots. Tell us your grade preference, destination market and
                  packing format — we respond with what we can ship and on what timeline.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button asChild size="lg" className="shadow-glow">
                    <a href={enquireHref} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-5 w-5" />
                      Request a quote on WhatsApp
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a href="#specs">View export specs</a>
                  </Button>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                <div className="absolute -inset-4 rounded-[2.25rem] bg-gradient-to-br from-brand-red/30 via-transparent to-brand-gold/20 blur-2xl" aria-hidden="true" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-border/80 bg-[#140e0a] shadow-[0_28px_70px_rgba(20,14,10,0.28)] sm:rounded-[2rem]">
                  <LazyImage
                    src={unsplash(heroImg, 1100, 88)}
                    srcSet={unsplashSrcSet(heroImg, [480, 640, 768, 960, 1200], 88)}
                    sizes="(min-width:1024px) 38vw, 90vw"
                    lqip={unsplashLQ(heroImg)}
                    alt="Export-grade dried Guntur red chilli"
                    fallbackLabel="Guntur red chilli"
                    eager
                    className="absolute inset-0 h-full w-full"
                    imgClassName="object-cover object-center"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#140e0a]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand-orange-bright">
                      Guntur belt · Andhra Pradesh
                    </p>
                    <p className="mt-1 text-lg font-extrabold text-white">
                      Colour · Heat · Clean lots
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Why Guntur */}
        <section className="section-py bg-surface-2">
          <Container className="max-w-5xl">
            <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-14">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-red/30 bg-brand-red/10 text-brand-red">
                <Flame className="h-7 w-7" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-h2 font-extrabold tracking-tight">
                  Why Guntur red chilli stands apart
                </h2>
                <p className="mt-5 text-[1.05rem] leading-relaxed text-muted-foreground">
                  Guntur is one of India&apos;s best-known chilli growing belts. Buyers typically look to
                  this origin for dried red chilli with strong colour and a heat profile suited to
                  spice blends, masalas, sauces and food manufacturing — distinct from generic
                  &quot;red chilli&quot; sourced without a clear regional identity. Exact variety names, colour
                  values and heat levels vary by season and lot. We align each enquiry to the grade
                  and moisture / cleanliness standards your market requires, rather than treating all
                  chilli as interchangeable.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Specs */}
        <section id="specs" className="section-py scroll-mt-24">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-gold/35 bg-brand-gold/10 text-brand-gold">
                <Package className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="text-h2 font-extrabold tracking-tight">
                Export specifications &amp; packing
              </h2>
              <p className="mt-4 text-muted-foreground">
                We prepare consignments for export programmes — not retail sachets for walk-in
                trade. Available grades include Guntur Sannam S4 (334) for balanced heat and color,
                and Teja / S17 and Teja Deluxe for buyers needing higher pungency, each available in
                Deluxe, Best, and Medium Best quality tiers. Typical lot parameters: moisture 10–14%
                max, foreign matter 1% max, broken chillies and pods with stalks 2–3% max — exact
                figures confirmed lot-by-lot before booking, matched to your destination market&apos;s
                requirements. Available whole, with stem or stemless; powder on request. Packing in
                5–50kg jute, PP, or carton formats. Private label marking available on request.
                Minimum order: on enquiry · Commercial basis: on enquiry · Pricing on enquiry · Lead
                time: on enquiry
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {grades.map((g) => (
                <GlassCard key={g.name} className="p-6 transition-transform duration-500 ease-premium hover:-translate-y-1">
                  <p className="text-sm font-extrabold text-foreground">{g.name}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{g.note}</p>
                </GlassCard>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {tiers.map((t) => (
                <Badge key={t} variant="gold">
                  Quality tier · {t}
                </Badge>
              ))}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {lotParams.map((p) => (
                <div
                  key={p.label}
                  className="rounded-2xl border border-border bg-surface px-5 py-4 text-center shadow-soft"
                >
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    {p.label}
                  </p>
                  <p className="mt-1.5 text-lg font-extrabold text-foreground">{p.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <GlassCard className="p-6 sm:p-8">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-brand-orange-bright">
                  Forms
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {forms.map((f) => (
                    <li
                      key={f}
                      className="rounded-full border border-border bg-background/60 px-3 py-1.5 text-sm font-semibold"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard className="p-6 sm:p-8">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-brand-orange-bright">
                  Packing
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {packing.map((f) => (
                    <li
                      key={f}
                      className="rounded-full border border-border bg-background/60 px-3 py-1.5 text-sm font-semibold"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              {commercial.map((c) => (
                <div
                  key={c.label}
                  className="rounded-2xl border border-dashed border-border bg-surface-2/80 px-4 py-4 text-center"
                >
                  <p className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    {c.label}
                  </p>
                  <p className="mt-1 text-sm font-bold text-foreground">{c.value}</p>
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
                  unless they are in place for a specific lot. Ask our desk for the documents your
                  destination requires before you book.
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

        {/* Audience */}
        <section className="section-py">
          <Container className="max-w-4xl">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:gap-10">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-brand-gold/35 bg-brand-gold/10 text-brand-gold">
                <Users className="h-7 w-7" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-h2 font-extrabold tracking-tight">Who this supply is for</h2>
                <p className="mt-5 text-[1.05rem] leading-relaxed text-muted-foreground">
                  This page is for spice importers, wholesalers, grinders and food processors who buy
                  dried chilli in commercial volumes — including buyers serving Gulf and other import
                  markets. If you need sample photos, a recent lot description or packing photos, say
                  so in your first message.
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {audiences.map((a) => (
                    <li
                      key={a}
                      className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-semibold text-foreground/90"
                    >
                      {a}
                    </li>
                  ))}
                </ul>
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
              <div className="relative mx-auto max-w-2xl text-center">
                <h2 className="text-h2 font-extrabold tracking-tight">
                  Request a quote on WhatsApp
                </h2>
                <p className="mt-4 text-[1.05rem] leading-relaxed text-muted-foreground">
                  The fastest way to start is WhatsApp to our export desk. Include: destination
                  country / port, preferred form (whole / other) and approximate volume, any grade or
                  lab parameters your buyers require, preferred packing. We will confirm availability,
                  documentation path and commercial terms. No obligation until you place an order.
                </p>
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
        <section className="section-py bg-surface-2" aria-label="Guntur chilli FAQ">
          <Container className="max-w-3xl">
            <h2 className="text-center text-h2 font-extrabold tracking-tight">
              Frequently asked questions
            </h2>
            <Accordion type="single" collapsible className="mt-10 flex flex-col gap-4">
              {gunturFaqs.map((faq, i) => (
                <AccordionItem key={faq.q} value={`g-${i}`}>
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
