# Universal Traders — Premium Export Website

A world-class, cinematic marketing website for **Universal Traders** — a premium agricultural export brand (a _MD Fruits_ company) bringing 40+ years of heritage from Andhra Pradesh, India to the Middle East and beyond.

> _Exporting India's Freshness to the World._

Built as a storytelling experience inspired by Apple, Stripe and Linear: large editorial typography, generous whitespace, buttery scroll motion, an interactive 3D globe, and full dark-mode, SEO and accessibility support.

## Tech stack

- **React 18** (JavaScript, no TypeScript) + **Vite 6**
- **Tailwind CSS** design tokens + **shadcn/ui**-style primitives (Radix)
- **Framer Motion** (`motion`) · **Lenis** smooth scroll · **GSAP ScrollTrigger** (pinned + horizontal storytelling)
- **React Three Fiber** + **drei** (interactive globe)
- **Embla Carousel** · **React CountUp** · **React Intersection Observer**
- **lucide-react** icons · **react-helmet-async** for SEO

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (optional but recommended)
cp .env.example .env   # then edit values

# 3. Start the dev server
npm run dev

# 4. Production build + local preview
npm run build
npm run preview
```

### Environment variables

All are optional — sensible defaults are used if unset. See [`.env.example`](.env.example).

| Variable | Purpose |
| --- | --- |
| `VITE_WHATSAPP_NUMBER` | WhatsApp number (digits only) for the inquiry flow |
| `VITE_CONTACT_PHONE` | `tel:` link for the call button |
| `VITE_CONTACT_EMAIL` | Contact email |
| `VITE_SITE_URL` | Canonical URL used for SEO / OpenGraph |

## Project structure

```
src/
  lib/            config, constants (products, markets, stats…), images, motion presets, utils
  hooks/          usePrefersReducedMotion, useMousePosition, useScrollProgress
  providers/      ThemeProvider (dark/light), SmoothScrollProvider (Lenis + GSAP)
  components/
    ui/           Button, Card, Accordion, Badge, Sheet (shadcn-style primitives)
    layout/       Navbar, MobileMenu, Footer, Logo, ThemeToggle, ScrollProgress, FloatingActions
    shared/       Container, SectionHeading, RevealText, ParallaxImage, LazyImage,
                  TiltCard, GlassCard, MagneticButton, Marquee, Icon, SEO
    sections/     Hero, Storytelling, Products, About, WhyChooseUs, ExportProcess,
                  Statistics, WorldMap (+ globe/), Certifications, Gallery,
                  Testimonials, FAQ, Contact
  App.jsx         Section composition with per-section lazy loading
  main.jsx        Providers + root render
```

## Design system

- **Colors** (CSS variables, light/dark): brand red `#ef233c`, premium gold `#fdc500`, light bg `#F8F8F6`, dark bg `#0D0D0D`.
- **Type**: Inter Variable — extra-bold headings, medium body, semibold buttons, with a fluid `clamp()` scale.
- **Motion**: shared easing (`cubic-bezier(0.16, 1, 0.3, 1)`), reveal / parallax / tilt / magnetic presets. Every animation degrades gracefully under `prefers-reduced-motion`.

## Imagery

Product and lifestyle photography is hotlinked from **Unsplash** with on-the-fly optimisation, centralised in [`src/lib/images.js`](src/lib/images.js). `LazyImage` renders a blur-up placeholder and a branded gradient fallback if any image fails to load. To self-host, download the images and swap the URL helper.

## Accessibility & performance

- Semantic landmarks, skip link, keyboard-navigable menu/accordion/carousel, visible focus rings, reduced-motion fallbacks (including a static globe).
- Route-level code splitting, lazy images, memoised cards, and manual vendor chunks (`three`, `gsap`, `motion`, `embla`).
- SEO: meta + OpenGraph + Twitter cards, JSON-LD `Organization` schema, `robots.txt`, `sitemap.xml`.

---

### Note on the build environment

If `npm install` hangs or fails with TLS/connection resets to `registry.npmjs.org`, your current network is blocking the npm registry (some ISPs do this via SNI filtering — the same block can also affect `images.unsplash.com`, so photos may fall back to gradients). Install from an unblocked network (mobile hotspot / VPN / alternate DNS such as Cloudflare `1.1.1.1` with DoH), then `npm run dev` works normally.
