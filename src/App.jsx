import { Suspense, lazy, useEffect, useState } from "react";
import { SEO } from "@/components/shared/SEO";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Navbar } from "@/components/layout/Navbar";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { DeferMount } from "@/components/shared/DeferMount";
import { SectionErrorBoundary } from "@/components/shared/SectionErrorBoundary";
import { Hero } from "@/components/sections/Hero";
import { MarketsGlobeShell } from "@/components/sections/globe/StaticGlobe";

// Below-the-fold sections are code-split for a fast first paint.
const named = (loader, name) => lazy(() => loader().then((m) => ({ default: m[name] })));

const PrivacyPolicy = named(() => import("@/components/sections/PrivacyPolicy"), "PrivacyPolicy");
const GunturRedChilli = named(
  () => import("@/components/sections/GunturRedChilli"),
  "GunturRedChilli"
);
const IndianApple = named(() => import("@/components/sections/IndianApple"), "IndianApple");
const IndianPomegranate = named(
  () => import("@/components/sections/IndianPomegranate"),
  "IndianPomegranate"
);
const BanganapalliMango = named(
  () => import("@/components/sections/BanganapalliMango"),
  "BanganapalliMango"
);
const Storytelling = named(() => import("@/components/sections/Storytelling"), "Storytelling");
const Products = named(() => import("@/components/sections/Products"), "Products");
const About = named(() => import("@/components/sections/About"), "About");
const WhyChooseUs = named(() => import("@/components/sections/WhyChooseUs"), "WhyChooseUs");
const ExportProcess = named(() => import("@/components/sections/ExportProcess"), "ExportProcess");
const Statistics = named(() => import("@/components/sections/Statistics"), "Statistics");
const WorldMap = named(() => import("@/components/sections/WorldMap"), "WorldMap");
const Certifications = named(() => import("@/components/sections/Certifications"), "Certifications");
const Gallery = named(() => import("@/components/sections/Gallery"), "Gallery");
const Testimonials = named(() => import("@/components/sections/Testimonials"), "Testimonials");
const FAQ = named(() => import("@/components/sections/FAQ"), "FAQ");
const Contact = named(() => import("@/components/sections/Contact"), "Contact");
const Footer = named(() => import("@/components/layout/Footer"), "Footer");

/**
 * Reserve height + Suspense; DeferMount keeps `id` mounted for nav/hash.
 */
function Section({
  id,
  children,
  minH = "min-h-[80vh]",
  eagerIdle = false,
  boundaryName,
  suspenseFallback,
}) {
  const body = (
    <DeferMount id={id} minH={minH} eagerIdle={eagerIdle} placeholder={suspenseFallback}>
      <Suspense fallback={suspenseFallback ?? <div className={minH} aria-hidden="true" />}>
        {children}
      </Suspense>
    </DeferMount>
  );

  if (!boundaryName) return body;

  return (
    <SectionErrorBoundary name={boundaryName} minH={minH}>
      {body}
    </SectionErrorBoundary>
  );
}

const GLOBE_TEXTURES = [
  "/textures/earth-blue-marble.jpg",
  "/textures/earth-topology.jpg",
];

function preloadImages(urls) {
  urls.forEach((src) => {
    const img = new Image();
    img.decoding = "async";
    img.src = src;
  });
}

function isConstrainedConnection() {
  const conn = typeof navigator !== "undefined" ? navigator.connection : null;
  if (!conn) return false;
  if (conn.saveData) return true;
  const type = conn.effectiveType;
  return type === "slow-2g" || type === "2g" || type === "3g";
}

/**
 * Prefetch Globe/Markets when #markets approaches. Not on a fixed post-load
 * idle. Skip warm-prefetch on constrained connections (DeferMount still loads
 * on demand).
 */
function usePrefetchHeavyChunks() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.__PRERENDER__) return undefined;

    let io;
    let idleId;
    let timeoutId;

    const warmGlobe = () => {
      import("@/components/sections/WorldMap");
      import("@/components/sections/globe/Globe");
      preloadImages(GLOBE_TEXTURES);
    };

    const scheduleWarm = () => {
      if (isConstrainedConnection()) return;
      const ric = window.requestIdleCallback;
      if (ric) {
        // Long timeout: don't race Story/Products on the same early idle window.
        idleId = ric(warmGlobe, { timeout: 8000 });
      } else {
        timeoutId = window.setTimeout(warmGlobe, 4000);
      }
    };

    const el = document.getElementById("markets");
    if (!el || typeof IntersectionObserver === "undefined") {
      // Fallback if placeholder missing. Still avoid boot-idle contention.
      const onLoad = () => {
        const ric = window.requestIdleCallback;
        if (ric) idleId = ric(scheduleWarm, { timeout: 10000 });
        else timeoutId = window.setTimeout(scheduleWarm, 6000);
      };
      if (document.readyState === "complete") onLoad();
      else window.addEventListener("load", onLoad, { once: true });
      return () => {
        window.removeEventListener("load", onLoad);
        if (idleId != null) window.cancelIdleCallback?.(idleId);
        if (timeoutId != null) clearTimeout(timeoutId);
      };
    }

    io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          scheduleWarm();
          io.disconnect();
        }
      },
      // Warm-only margin (mount stays IO-gated in WorldMap). Wider than before
      // so textures/JS often finish before a normal scroll arrives.
      { root: null, rootMargin: "1400px 0px", threshold: 0.01 }
    );
    io.observe(el);

    return () => {
      io?.disconnect();
      if (idleId != null) window.cancelIdleCallback?.(idleId);
      if (timeoutId != null) clearTimeout(timeoutId);
    };
  }, []);
}

import {
  GUNTUR_CHILLI_META,
  GUNTUR_CHILLI_PATH,
  gunturFaqs,
} from "@/lib/gunturChilliPage";
import {
  INDIAN_APPLE_META,
  INDIAN_APPLE_PATH,
  indianAppleFaqs,
} from "@/lib/indianApplePage";
import {
  INDIAN_POMEGRANATE_META,
  INDIAN_POMEGRANATE_PATH,
  indianPomegranateFaqs,
} from "@/lib/indianPomegranatePage";
import {
  BANGANAPALLI_MANGO_META,
  BANGANAPALLI_MANGO_PATH,
  banganapalliMangoFaqs,
} from "@/lib/banganapalliMangoPage";
import { site } from "@/lib/config";

function resolvePage() {
  if (typeof window === "undefined") return "home";
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/privacy" || window.location.hash === "#privacy") return "privacy";
  if (path === BANGANAPALLI_MANGO_PATH) return "banganapalli-mango";
  if (path === GUNTUR_CHILLI_PATH) return "guntur-chilli";
  if (path === INDIAN_APPLE_PATH) return "indian-apple";
  if (path === INDIAN_POMEGRANATE_PATH) return "indian-pomegranate";
  return "home";
}

/** Home vs Privacy vs product landings. Real paths + legacy #privacy hash. */
function useAppPage() {
  const [page, setPage] = useState(resolvePage);

  useEffect(() => {
    const sync = () => setPage(resolvePage());
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  return page;
}

function gunturJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Guntur Red Chilli",
      description: GUNTUR_CHILLI_META.description,
      category: "Dried spices",
      brand: {
        "@type": "Brand",
        name: site.name,
      },
      url: `${site.url}${GUNTUR_CHILLI_PATH}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: gunturFaqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.a,
        },
      })),
    },
  ];
}

function indianAppleJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Premium Indian Apple",
      alternateName: "Indian Apple",
      description: INDIAN_APPLE_META.description,
      category: "Fresh fruit",
      brand: {
        "@type": "Brand",
        name: site.name,
      },
      url: `${site.url}${INDIAN_APPLE_PATH}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: indianAppleFaqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.a,
        },
      })),
    },
  ];
}

function indianPomegranateJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Indian Pomegranate",
      description: INDIAN_POMEGRANATE_META.description,
      category: "Fresh fruit",
      brand: {
        "@type": "Brand",
        name: site.name,
      },
      url: `${site.url}${INDIAN_POMEGRANATE_PATH}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: indianPomegranateFaqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.a,
        },
      })),
    },
  ];
}

function banganapalliMangoJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Banganapalli Mango",
      alternateName: "Andhra Banganapalli Mango",
      description: BANGANAPALLI_MANGO_META.description,
      category: "Fresh fruit",
      brand: {
        "@type": "Brand",
        name: site.name,
      },
      url: `${site.url}${BANGANAPALLI_MANGO_PATH}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: banganapalliMangoFaqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.a,
        },
      })),
    },
  ];
}

export default function App() {
  usePrefetchHeavyChunks();
  const page = useAppPage();

  if (page === "privacy") {
    return (
      <>
        <SEO
          title="Privacy Policy"
          description="How MDF Exports & Imports collects and uses enquiry information on this website."
          path="/privacy"
        />
        <Suspense fallback={<div className="min-h-[60vh]" aria-hidden="true" />}>
          <PrivacyPolicy />
        </Suspense>
      </>
    );
  }

  if (page === "banganapalli-mango") {
    return (
      <>
        <SEO
          documentTitle={BANGANAPALLI_MANGO_META.documentTitle}
          description={BANGANAPALLI_MANGO_META.description}
          path={BANGANAPALLI_MANGO_META.path}
          jsonLd={banganapalliMangoJsonLd()}
        />
        <Suspense fallback={<div className="min-h-[60vh]" aria-hidden="true" />}>
          <BanganapalliMango />
        </Suspense>
      </>
    );
  }

  if (page === "guntur-chilli") {
    return (
      <>
        <SEO
          documentTitle={GUNTUR_CHILLI_META.documentTitle}
          description={GUNTUR_CHILLI_META.description}
          path={GUNTUR_CHILLI_META.path}
          jsonLd={gunturJsonLd()}
        />
        <Suspense fallback={<div className="min-h-[60vh]" aria-hidden="true" />}>
          <GunturRedChilli />
        </Suspense>
      </>
    );
  }

  if (page === "indian-apple") {
    return (
      <>
        <SEO
          documentTitle={INDIAN_APPLE_META.documentTitle}
          description={INDIAN_APPLE_META.description}
          path={INDIAN_APPLE_META.path}
          jsonLd={indianAppleJsonLd()}
        />
        <Suspense fallback={<div className="min-h-[60vh]" aria-hidden="true" />}>
          <IndianApple />
        </Suspense>
      </>
    );
  }

  if (page === "indian-pomegranate") {
    return (
      <>
        <SEO
          documentTitle={INDIAN_POMEGRANATE_META.documentTitle}
          description={INDIAN_POMEGRANATE_META.description}
          path={INDIAN_POMEGRANATE_META.path}
          jsonLd={indianPomegranateJsonLd()}
        />
        <Suspense fallback={<div className="min-h-[60vh]" aria-hidden="true" />}>
          <IndianPomegranate />
        </Suspense>
      </>
    );
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-brand-red focus:px-5 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <SEO />
      <ScrollProgress />
      <Navbar />

      <main id="main">
        <Hero />
        {/* Catalogue first. Near-fold IO-gated sections follow. */}
        <Section id="products" minH="min-h-[100vh]">
          <Products />
        </Section>
        <Section id="story" minH="min-h-[100svh]" boundaryName="The export journey">
          <Storytelling />
        </Section>
        <Section id="about" minH="min-h-[220vh]">
          <About />
        </Section>
        <Section id="why">
          <WhyChooseUs />
        </Section>
        <Section id="process" minH="min-h-[100svh]">
          <ExportProcess />
        </Section>
        <Section id="statistics" minH="min-h-[60vh]">
          <Statistics />
        </Section>
        {/* Markets: IO DeferMount only (no eagerIdle). Globe warm is gated in
            usePrefetchHeavyChunks + WorldMap viewport mount. */}
        <Section
          id="markets"
          minH="min-h-[100vh]"
          boundaryName="Global markets"
          suspenseFallback={<MarketsGlobeShell className="min-h-[100vh]" />}
        >
          <WorldMap />
        </Section>
        <Section id="certifications">
          <Certifications />
        </Section>
        <Section id="gallery" minH="min-h-[100vh]">
          <Gallery />
        </Section>
        <Section id="testimonials">
          <Testimonials />
        </Section>
        <Section id="faq" minH="min-h-[70vh]">
          <FAQ />
        </Section>
        <Section id="contact" minH="min-h-[90vh]">
          <Contact />
        </Section>
      </main>

      <Section id="footer" minH="min-h-[40vh]">
        <Footer />
      </Section>
      <FloatingActions />
    </>
  );
}
