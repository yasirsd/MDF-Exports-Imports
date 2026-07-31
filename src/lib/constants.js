import { productImages, scenes } from "@/lib/images";

/** Primary navigation links (anchor targets). */
export const navLinks = [
  { label: "Products", href: "#products" },
  { label: "Story", href: "#story" },
  { label: "Process", href: "#process" },
  { label: "Markets", href: "#markets" },
  { label: "Contact", href: "#contact" },
];

/**
 * Product catalogue. Four export lines only.
 * Category field is a soft badge label (no filter tabs).
 */
export const products = [
  {
    id: "mangoes",
    name: "Banganapalli Mango",
    category: "Fruit",
    image: productImages.mangoes,
    featured: true,
    landingHref: "/products/banganapalli-mango",
    landingLabel: "Learn more. Banganapalli mango export",
    featuredLandingLabel: "Mango export guide",
    blurb: "Andhra-grown Banganapalli, sea-freight ready.",
    copy: "Andhra-grown Banganapalli mango packed for export programmes. Firm flesh and transport tolerance suited to reefer sea freight when maturity and cold chain are handled correctly.",
    varieties: ["Banganapalli"],
    season: "Typically Mar – Apr (confirm on enquiry)",
    pack: "CFB carton · foam net / tray · 3–5kg",
    coldChain: "Typically held / shipped 10°–13°C",
    markets: ["UAE", "KSA", "Qatar", "Oman", "Bahrain"],
    highlights: ["Andhra origin", "Banganapalli", "Sea-freight ready"],
  },
  {
    id: "indian-apple",
    name: "Indian Apple",
    category: "Fruit",
    image: productImages.indianApple,
    landingHref: "/products/indian-apple",
    landingLabel: "Learn more. Indian apple export",
    featured: true,
    featuredLandingLabel: "Apple export guide",
    blurb: "Premium hill-origin fruit, reefer ready.",
    copy: "Premium Indian apples sourced from Himachal Pradesh and Jammu & Kashmir. Graded for export programmes with unbroken cold-chain handling via reefer sea freight.",
    varieties: ["Kinnaur", "Shimla", "Seasonal lots"],
    season: "On enquiry",
    pack: "Export packing · on enquiry",
    coldChain: "Pre-cooled · reefer sea freight",
    markets: ["UAE", "KSA", "Qatar", "Oman", "Kuwait"],
    highlights: ["Hill origin", "Cold-chain graded", "Reefer ready"],
  },
  {
    id: "pomegranate",
    name: "Pomegranate",
    category: "Fruit",
    image: productImages.pomegranate,
    landingHref: "/products/indian-pomegranate",
    landingLabel: "Pomegranate export",
    featuredLandingLabel: "Pomegranate export",
    blurb: "Deep-red arils, superior brix.",
    copy: "Deep-red, high-brix pomegranates graded for size and colour. Built for premium retail displays across the Gulf. Sourced from Maharashtra (Bhagwa & Ganesh) with cold-chain handling.",
    varieties: ["Bhagwa", "Ganesh"],
    season: "Sep – Dec (Hasta Bahar)",
    pack: "Corrugated carton · 2.7–4.0kg",
    coldChain: "Pre-cooled · held 5°–7°C",
    markets: ["UAE", "KSA", "Qatar"],
    highlights: ["High brix", "Deep colour", "Premium retail"],
  },
  {
    id: "dry-red-chilli",
    name: "Guntur Dry Red Chilli",
    category: "Spice",
    image: productImages.dryRedChilli,
    featured: true,
    landingHref: "/products/guntur-red-chilli",
    landingLabel: "Learn more. Guntur export",
    featuredLandingLabel: "Guntur export guide",
    blurb: "Teja & Sannam, sun-dried grades from Andhra.",
    copy: "Sun-dried Teja and Sannam chillies from Guntur. Andhra’s signature spice export with clean colour and reliable pungency for importers and processors.",
    varieties: ["Teja", "Sannam", "Teja Deluxe"],
    season: "Year-round (dried)",
    pack: "Jute / PP bag · 10kg / 25kg",
    coldChain: "Dry ambient · moisture-controlled store",
    markets: ["UAE", "KSA", "Qatar", "Oman", "Kuwait"],
    highlights: ["Teja & Sannam", "Sun dried", "Andhra origin"],
  },
];

/** Featured catalogue card. Prefer premium landing guides when present. */
export function getFeaturedProduct() {
  const landingFeatured = products.find((p) => p.landingHref && p.featured);
  if (landingFeatured) return landingFeatured;
  const landing = products.find((p) => p.landingHref);
  if (landing) return landing;
  return products.find((p) => p.featured) || products[0] || null;
}

/** Target export markets. Status drives globe styling. */
export const markets = [
  { name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708, status: "active" },
  { name: "Abu Dhabi", country: "UAE", lat: 24.4539, lng: 54.3773, status: "active" },
  { name: "Riyadh", country: "Saudi Arabia", lat: 24.7136, lng: 46.6753, status: "active" },
  { name: "Doha", country: "Qatar", lat: 25.2854, lng: 51.531, status: "active" },
  { name: "Muscat", country: "Oman", lat: 23.588, lng: 58.3829, status: "active" },
  { name: "Kuwait City", country: "Kuwait", lat: 29.3759, lng: 47.9774, status: "active" },
  { name: "Manama", country: "Bahrain", lat: 26.2285, lng: 50.586, status: "active" },
  // Future expansion. Gold markers / arcs on the globe
  { name: "Europe", country: "Future", lat: 50.1109, lng: 8.6821, status: "future" },
  { name: "Africa", country: "Future", lat: 6.5244, lng: 3.3792, status: "future" },
  { name: "South Africa", country: "Future", lat: -26.2041, lng: 28.0473, status: "future" },
  { name: "North America", country: "Future", lat: 40.7128, lng: -74.006, status: "future" },
  { name: "Canada", country: "Future", lat: 43.6532, lng: -79.3832, status: "future" },
  { name: "South America", country: "Future", lat: -23.5505, lng: -46.6333, status: "future" },
  { name: "China", country: "Future", lat: 31.2304, lng: 121.4737, status: "future" },
  { name: "Japan", country: "Future", lat: 35.6762, lng: 139.6503, status: "future" },
  { name: "Australia", country: "Future", lat: -33.8688, lng: 151.2093, status: "future" },
  { name: "Vietnam", country: "Future", lat: 10.8231, lng: 106.6297, status: "future" },
  { name: "South Korea", country: "Future", lat: 37.5665, lng: 126.978, status: "future" },
  { name: "Russia", country: "Future", lat: 55.7558, lng: 37.6173, status: "future" },
];

/** Origin (India) coordinates. */
export const origin = { name: "Andhra Pradesh", country: "India", lat: 15.9129, lng: 79.74 };

/** Country-level export destinations (hero flags + footer GCC chips). */
export const exportDestinations = [
  { flag: "🇦🇪", code: "UAE", name: "United Arab Emirates" },
  { flag: "🇸🇦", code: "KSA", name: "Saudi Arabia" },
  { flag: "🇶🇦", code: "QAT", name: "Qatar" },
  { flag: "🇴🇲", code: "OMN", name: "Oman" },
  { flag: "🇰🇼", code: "KWT", name: "Kuwait" },
  { flag: "🇧🇭", code: "BHR", name: "Bahrain" },
];

/** Headline statistics (animated counters). */
export const stats = [
  { id: "years", value: 40, suffix: "+", label: "Years Experience" },
  { id: "network", value: 1000, suffix: "+", label: "Farm Network" },
  { id: "quality", value: 100, suffix: "%", label: "Quality Checked" },
  { id: "markets", value: 6, suffix: "+", label: "GCC Markets" },
];

/** Why-choose-us bento cards. */
export const advantages = [
  { icon: "Award", title: "Export Quality", desc: "Every consignment graded to international specifications before it leaves the packhouse.", span: "lg:col-span-2" },
  { icon: "Repeat", title: "Reliable Supply", desc: "Year-round volumes backed by a 1000+ farmer network." },
  { icon: "Globe2", title: "Global Standards", desc: "Documentation and compliance for GCC & EU markets." },
  { icon: "ScanSearch", title: "Quality Inspection", desc: "Multi-stage manual and lab checks on every lot.", span: "lg:col-span-2" },
  { icon: "Snowflake", title: "Cold Chain", desc: "Unbroken temperature control from farm to port." },
  { icon: "Package", title: "Packaging Excellence", desc: "Ventilated, branded, export-grade packaging." },
  { icon: "Truck", title: "Fast Logistics", desc: "Optimised routing to GCC ports within days." },
  { icon: "Handshake", title: "Trusted Farmers", desc: "Four decades of relationships built on fairness." },
];

/** Export process stages. Image must match the step title (not a random SKU still). */
export const processStages = [
  {
    step: "01",
    title: "Farm",
    desc: "Sourced from trusted partner farms across Andhra Pradesh.",
    icon: "Sprout",
    image: scenes.mangoOrchard,
  },
  {
    step: "02",
    title: "Sorting",
    desc: "Hand-sorted and graded by size, colour and ripeness.",
    icon: "ListFilter",
    image: scenes.growerHands,
  },
  {
    step: "03",
    title: "Quality Check",
    desc: "Multi-point inspection with lab-backed testing.",
    icon: "ScanSearch",
    image: scenes.gradedApples,
  },
  {
    step: "04",
    title: "Packaging",
    desc: "Ventilated, export-grade, branded packaging.",
    icon: "Package",
    image: scenes.packaging, // mangoes in crates. Matches packaging copy
  },
  {
    step: "05",
    title: "Cold Storage",
    desc: "Pre-cooled and held under precise temperature.",
    icon: "Snowflake",
    image: scenes.warehouse, // distribution bay / cold-chain hold
  },
  {
    step: "06",
    title: "Container Loading",
    desc: "Reefer containers loaded and sealed with care.",
    icon: "Container",
    image: scenes.portTerminal,
  },
  {
    step: "07",
    title: "Shipping",
    desc: "Optimised sea & air routes to destination markets.",
    icon: "Ship",
    image: scenes.vesselAtSea,
  },
  {
    step: "08",
    title: "Destination Port",
    desc: "Cleared and handled by trusted partners.",
    icon: "Anchor",
    image: scenes.portTerminal, // port yard. Not a city skyline
  },
  {
    step: "09",
    title: "Customer",
    desc: "Delivered fresh to importers and distributors.",
    icon: "Handshake",
    image: scenes.delivered,
  },
];

/**
 * Interactive legacy timeline (Our Story).
 * Each milestone has a unique layout key rendered by a dedicated panel.
 */
export const legacyMilestones = [
  {
    id: "m-1984",
    year: "1984",
    layout: "origin",
    pill: "THE BEGINNING",
    title: "MD Fruits is founded",
    copy: "A family fruit business takes root in Andhra Pradesh. Built on soil, season, and a promise to never ship what we would not eat ourselves.",
    image: scenes.market, // founding fruit trade. Mango crates
    location: "Andhra Pradesh, India",
    stat: { end: 40, suffix: "+", label: "Years of growing trust" },
    accent: "warm",
  },
  {
    id: "m-1998",
    year: "1998",
    layout: "regional",
    pill: "REGIONAL REACH",
    title: "Regional leadership",
    copy: "Trusted supply relationships expand across South India. What began as one family's craft becomes a regional standard for freshness.",
    image: scenes.farmSunrise,
    location: "South India network",
    highlights: ["Andhra Pradesh", "Tamil Nadu", "Karnataka"],
    accent: "green",
  },
  {
    id: "m-2010",
    year: "2010",
    layout: "network",
    pill: "THE NETWORK",
    title: "Scaling the network",
    copy: "Hundreds of partner farms join the ecosystem. Relationships measured in seasons, not contracts alone.",
    image: scenes.farmer,
    stats: [
      { end: 1000, suffix: "+", label: "Partner farms" },
      { end: 12, suffix: "+", label: "Districts" },
    ],
    accent: "earth",
  },
  {
    id: "m-2020",
    year: "2020",
    layout: "infra",
    pill: "INFRASTRUCTURE",
    title: "Export-grade infrastructure",
    copy: "Cold chain, packhouse and quality systems mature. So freshness survives the miles before it ever sees a port.",
    image: scenes.warehouse, // packhouse / cold-chain infrastructure
    chips: ["Pre-cool", "Reefer ready", "Lot traceability"],
    accent: "ice",
  },
  {
    id: "m-2024",
    year: "2024",
    layout: "launch",
    pill: "GLOBAL LAUNCH",
    title: "MDF Exports & Imports launches",
    copy: "Four decades of MD Fruits heritage step onto the world stage. The same care that began on the farm now clears Gulf ports as MDF Exports & Imports.",
    image: scenes.vesselAtSea,
    routes: ["Dubai", "Riyadh", "Doha", "Muscat"],
    accent: "amber",
  },
  {
    id: "m-today",
    year: "Today",
    layout: "today",
    pill: "THE JOURNEY CONTINUES",
    title: "Delivering to the world",
    copy: "Premium Indian produce reaching the Middle East and beyond. With new continents on the horizon, and the same promise in every crate.",
    image: scenes.dubai,
    markets: ["UAE", "KSA", "Qatar", "Oman", "Kuwait", "Europe soon"],
    closing: "From Andhra Pradesh to your port. Same care, every mile.",
    accent: "cinematic",
  },
];

/** @deprecated Use legacyMilestones. Kept for any residual imports. */
export const timeline = legacyMilestones.map((m) => ({
  year: m.year,
  title: m.title,
  desc: m.copy,
}));

/** Certifications. Status reflects trade readiness; registration numbers added when verified. */
export const certifications = [
  { code: "APEDA", name: "Agricultural & Processed Food Products Export Development Authority", status: "operating" },
  { code: "FSSAI", name: "Food Safety and Standards Authority of India", status: "operating" },
  { code: "IEC", name: "Import Export Code", status: "operating" },
  { code: "Phytosanitary", name: "Phytosanitary documentation for consignments", status: "operating" },
  { code: "Global G.A.P.", name: "Good Agricultural Practices", status: "future" },
  { code: "ISO", name: "ISO 22000 Food Safety Management", status: "future" },
];

/**
 * Representative importer feedback. Composites based on typical GCC buyer themes.
 * Replace with attributed, permissioned quotes before presenting as verified reviews.
 */
export const testimonials = [
  { quote: "Consistent grading and predictable sailings matter more than slogans. That is what we look for in an Indian produce partner.", name: "Gulf importer", role: "Composite feedback", location: "UAE", flag: "🇦🇪" },
  { quote: "Cold-chain discipline and clear lot communication are the difference between retail-ready and write-off.", name: "Distribution buyer", role: "Composite feedback", location: "Saudi Arabia", flag: "🇸🇦" },
  { quote: "Documentation readiness and responsive export desk support shorten the path from enquiry to first container.", name: "Wholesale buyer", role: "Composite feedback", location: "Qatar", flag: "🇶🇦" },
  { quote: "We value suppliers who treat every consignment like their reputation travels with the crate.", name: "Retail buyer", role: "Composite feedback", location: "Oman", flag: "🇴🇲" },
];

/**
 * Cinematic Storytelling chapters (Ismail-style scrollytelling).
 * Each chapter has a unique layout key rendered by a dedicated component.
 */
export const storyChapters = [
  {
    id: "origin",
    layout: "scrapbook",
    step: "01",
    rail: "The Origin",
    pill: "CHAPTER 01 · ANDHRA PRADESH",
    eyebrow: "The Origin",
    title: "Freshness begins at the farm.",
    copy: "Rooted in Andhra Pradesh, across a thousand-strong network of trusted partner farms where every harvest starts with the land.",
    year: "1984",
    yearCaption: "THE YEAR THE JOURNEY BEGAN",
    image: scenes.farmField,
    scrapLabel: "FARM LOG",
    scrapMeta: "EST. ORIGIN",
    location: "Andhra Pradesh, India",
    doodle: "sprout",
  },
  {
    id: "people",
    layout: "quote",
    step: "02",
    rail: "The People",
    pill: "CHAPTER 02 · THE GROWERS",
    eyebrow: "The People",
    title: "Grown by hands we trust.",
    copy: "Four decades of relationships with the farmers who know the soil, the season, and the standard. Long before a crate is packed.",
    quote: "The land remembers every season. So do we.",
    quoteAttr: "Partner grower network",
    image: scenes.farmer,
    portrait: scenes.growerPortrait,
    scrapLabel: "GROWER CARD",
    scrapMeta: "Trusted since day one",
    location: "Partner farms · Andhra Pradesh",
    doodle: "sprout",
    counters: [
      { end: 40, suffix: "+", label: "Years of trust", icon: "Award" },
      { end: 1000, suffix: "+", label: "Partner farms", icon: "Sprout" },
    ],
  },
  {
    id: "harvest",
    layout: "circleGrid",
    step: "03",
    rail: "The Harvest",
    pill: "CHAPTER 03 · PEAK RIPENESS",
    eyebrow: "How export-grade produce is chosen",
    title: "Picked at peak ripeness.",
    copy: "Selected by size, colour and sweetness. Never before its time. Every lot earns its place in the consignment.",
    giantWord: "FRESH",
    image: scenes.harvest,
    features: [
      { n: "01", title: "Size", desc: "Uniform grading for pack-out and stable stacking at sea.", icon: "Ruler" },
      { n: "02", title: "Colour", desc: "Peak visual maturity checked under natural light.", icon: "Palette" },
      { n: "03", title: "Sweetness", desc: "Brix sampled at intake. Never before its time.", icon: "Droplets" },
      { n: "04", title: "Grade", desc: "Export-only selection. Domestic grades stay home.", icon: "BadgeCheck" },
    ],
    doodle: "basket",
  },
  {
    id: "care",
    layout: "dual",
    step: "04",
    rail: "The Care",
    pill: "CHAPTER 04 · PACKHOUSE",
    eyebrow: "The Care",
    title: "Packed to export standards.",
    copy: "Ventilated, branded, protective packaging built for the journey. So freshness survives the miles.",
    imagePrimary: scenes.packaging,
    imageSecondary: scenes.crates,
    chips: ["Ventilated crates", "Private label ready", "APEDA aligned"],
    overlayQuote: "Protect the produce. Protect the reputation.",
    processSteps: [
      { n: "01", title: "Sort", desc: "Grade & reject" },
      { n: "02", title: "Pack", desc: "Ventilated crate" },
      { n: "03", title: "Seal", desc: "Label & lot ID" },
    ],
    doodle: "crate",
  },
  {
    id: "journey",
    layout: "routeMap",
    step: "05",
    rail: "The Journey",
    pill: "CHAPTER 05 · COLD CHAIN",
    eyebrow: "The Journey",
    title: "Shipped across the seas.",
    copy: "An unbroken cold chain from our packhouse to your port. Reefer discipline, documentation, and trusted lanes.",
    image: scenes.containerShip,
    tempBadge: "0°–5°C",
    stats: [
      { value: "0°–5°C", label: "Reefer range", icon: "Snowflake" },
      { value: "GCC", label: "Active lanes", icon: "Ship" },
      { value: "Monitored", label: "Reefer watch", icon: "Clock" },
    ],
    timeline: [
      { n: "01", title: "Farm", desc: "Harvest cool" },
      { n: "02", title: "Packhouse", desc: "Pre-cool & pack" },
      { n: "03", title: "Port", desc: "Reefer load" },
      { n: "04", title: "Sea", desc: "Temp locked" },
      { n: "05", title: "Gulf", desc: "Cleared fresh" },
    ],
    doodle: "ship",
  },
  {
    id: "arrival",
    layout: "world",
    step: "06",
    rail: "The Arrival",
    pill: "CHAPTER 06 · BEYOND BORDERS",
    eyebrow: "Beyond Borders",
    title: "Delivered to the world.",
    copy: "Fresh in Dubai, the Gulf, and soon. New continents. The same care that starts on the farm arrives at your door.",
    image: scenes.dubai,
    doodle: "stamp",
  },
];

/** Frequently asked questions. */
export const faqs = [
  { q: "Which countries do you currently export to?", a: "We actively serve the UAE (Dubai, Abu Dhabi), Saudi Arabia, Qatar, Oman, Kuwait and Bahrain, with European markets on our expansion roadmap." },
  { q: "What is your minimum order quantity?", a: "MOQs vary by product and destination. Most consignments are shipped by the full or part reefer container. Share your requirement and we will tailor a quote." },
  { q: "How do you ensure produce stays fresh in transit?", a: "An unbroken cold chain. Pre-cooling, temperature-controlled storage and reefer containers keep produce at optimal condition from farm to destination port." },
  { q: "Which certifications do you hold?", a: "We operate under APEDA, FSSAI, IEC and phytosanitary documentation pathways required for export consignments, and are pursuing Global G.A.P. and ISO 22000 as part of our roadmap. Ask our desk for the latest registration details for your market." },
  { q: "Can you handle custom packaging and private labelling?", a: "Yes. We offer export-grade, ventilated packaging and can accommodate branded and private-label requirements." },
  { q: "How do I start importing with MDF Exports & Imports?", a: "Send us your product list, volumes and destination via the contact form or WhatsApp. Our team will respond with pricing, lead times and documentation." },
];
