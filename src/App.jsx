import { Suspense, lazy } from "react";
import { SEO } from "@/components/shared/SEO";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Navbar } from "@/components/layout/Navbar";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { SketchDivider } from "@/components/shared/SketchDivider";
import { Hero } from "@/components/sections/Hero";

// Below-the-fold sections are code-split for a fast first paint.
const named = (loader, name) => lazy(() => loader().then((m) => ({ default: m[name] })));

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
 * Reserve a realistic height for each lazy section so chunks don't pop in
 * with empty bands (avoids layout shift / CLS on load).
 */
function Section({ children, minH = "min-h-[80vh]" }) {
  return (
    <Suspense fallback={<div className={minH} aria-hidden="true" />}>
      {children}
    </Suspense>
  );
}

export default function App() {
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
        <Section minH="min-h-[100svh]"><Storytelling /></Section>
        <Section minH="min-h-[100vh]"><Products /></Section>
        <SketchDivider />
        <Section minH="min-h-[220vh]"><About /></Section>
        <Section><WhyChooseUs /></Section>
        <Section minH="min-h-[100svh]"><ExportProcess /></Section>
        <Section minH="min-h-[60vh]"><Statistics /></Section>
        <SketchDivider seed={29} />
        <Section minH="min-h-[100vh]"><WorldMap /></Section>
        <Section><Certifications /></Section>
        <Section minH="min-h-[100vh]"><Gallery /></Section>
        <Section><Testimonials /></Section>
        <Section minH="min-h-[70vh]"><FAQ /></Section>
        <SketchDivider seed={41} />
        <Section minH="min-h-[90vh]"><Contact /></Section>
      </main>

      <Section minH="min-h-[40vh]"><Footer /></Section>
      <FloatingActions />
    </>
  );
}
