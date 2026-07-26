# MDF Exports & Imports — Premium Export Website

A world-class, cinematic marketing website for **MDF Exports & Imports** — a premium agricultural export brand rooted in _MD Fruits_ heritage, bringing 40+ years of excellence from Andhra Pradesh, India to the Middle East, Asia-Pacific and beyond.

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
| `VITE_WHATSAPP_NUMBER` | WhatsApp number (digits only) |
| `VITE_CONTACT_PHONE` | Primary phone (`tel:` link) |
| `VITE_CONTACT_EMAIL` | Primary email |
| `VITE_SITE_URL` | Canonical URL for SEO / Open Graph |
| `VITE_MAP_QUERY` | Contact map address or `lat,lng` |

## Brand

Central brand configuration lives in [`src/lib/config.js`](src/lib/config.js). Theme-aware logos:

- [`src/images/DarkPNG.webp`](src/images/DarkPNG.webp) — mark for dark surfaces
- [`src/images/LightPNG.webp`](src/images/LightPNG.webp) — mark for light surfaces

## License

Private — all rights reserved by MDF Exports & Imports.
