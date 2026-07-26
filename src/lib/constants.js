import { productImages, scenes } from "@/lib/images";

/** Primary navigation links (anchor targets). */
export const navLinks = [
  { label: "Products", href: "#products" },
  { label: "Story", href: "#story" },
  { label: "Process", href: "#process" },
  { label: "Markets", href: "#markets" },
  { label: "Contact", href: "#contact" },
];

/** Product catalogue — export-ready assortment with B2B spec fields. */
export const products = [
  {
    id: "bananas",
    name: "Bananas",
    category: "Fruits",
    image: productImages.bananas,
    featured: true,
    blurb: "Cavendish & Robusta, export-grade ripeness.",
    copy: "Hand-selected bananas graded for colour, size and transit firmness — packed to arrive ready for Gulf retail and wholesale.",
    varieties: ["Cavendish", "Robusta"],
    season: "Year-round",
    pack: "Ventilated carton · 13kg / 18kg",
    coldChain: "Pre-cooled · held 13°–14°C in transit",
    markets: ["UAE", "KSA", "Qatar", "Oman"],
    highlights: ["Export ripeness", "Uniform fingers", "Retail ready"],
  },
  {
    id: "lemons",
    name: "Lemons",
    category: "Fruits",
    image: productImages.lemons,
    blurb: "High-juice, thin-skin, long shelf life.",
    copy: "Bright, high-juice lemons with thin skin and excellent shelf life — selected for foodservice and retail programmes.",
    varieties: ["Eureka", "Local thin-skin"],
    season: "Year-round",
    pack: "Ventilated carton · 5kg / 10kg",
    coldChain: "Cool-chain recommended · 8°–10°C",
    markets: ["UAE", "KSA", "Kuwait"],
    highlights: ["High juice", "Long shelf life", "Foodservice grade"],
  },
  {
    id: "mangoes",
    name: "Mangoes",
    category: "Fruits",
    image: productImages.mangoes,
    featured: true,
    blurb: "Alphonso, Banganapalli & Kesar varieties.",
    copy: "Peak-season Indian mangoes — Alphonso, Banganapalli and Kesar — harvested at the right maturity for flavour and arrival condition.",
    varieties: ["Alphonso", "Banganapalli", "Kesar"],
    season: "Mar – Jul",
    pack: "Foam-net + carton · 3kg / 5kg",
    coldChain: "Controlled ripening · 10°–12°C",
    markets: ["UAE", "KSA", "Qatar", "Oman", "Bahrain"],
    highlights: ["Peak season", "Premium varieties", "Arrival quality"],
  },
  {
    id: "pomegranate",
    name: "Pomegranate",
    category: "Fruits",
    image: productImages.pomegranate,
    blurb: "Deep-red arils, superior brix.",
    copy: "Deep-red, high-brix pomegranates graded for size and colour — built for premium retail displays across the Gulf.",
    varieties: ["Bhagwa", "Export red"],
    season: "Sep – Feb",
    pack: "Ventilated carton · 3.5kg / 5kg",
    coldChain: "Held 5°–7°C for extended freshness",
    markets: ["UAE", "KSA", "Qatar"],
    highlights: ["High brix", "Deep colour", "Premium retail"],
  },
  {
    id: "coconut",
    name: "Coconut",
    category: "Fruits",
    image: productImages.coconut,
    blurb: "Tender & semi-husked, freshly sourced.",
    copy: "Tender and semi-husked coconuts sourced fresh for juice and culinary use — cleaned and packed for export handling.",
    varieties: ["Tender", "Semi-husked"],
    season: "Year-round",
    pack: "Mesh / carton · count packs",
    coldChain: "Ambient to cool · avoid freezing",
    markets: ["UAE", "KSA", "Oman"],
    highlights: ["Fresh sourced", "Clean trimmed", "Count graded"],
  },
  {
    id: "tomatoes",
    name: "Tomatoes",
    category: "Vegetables",
    image: productImages.tomatoes,
    blurb: "Firm, uniform, cold-chain ready.",
    copy: "Firm, uniform tomatoes selected for colour break and transit strength — cold-chain ready for Gulf importers.",
    varieties: ["Hybrid round", "Cluster"],
    season: "Year-round",
    pack: "Ventilated crate · 5kg / 7kg",
    coldChain: "Unbroken cool chain · 10°–12°C",
    markets: ["UAE", "KSA", "Qatar", "Kuwait"],
    highlights: ["Firm fruit", "Uniform grade", "Cold-chain ready"],
  },
  {
    id: "onions",
    name: "Onions",
    category: "Vegetables",
    image: productImages.onions,
    blurb: "Red & pink, export-sized bulbs.",
    copy: "Red and pink onions sized for export programmes — cured, sorted and packed for stable storage life.",
    varieties: ["Red", "Pink"],
    season: "Year-round",
    pack: "Mesh bag · 10kg / 25kg",
    coldChain: "Dry ventilated storage · cool preferred",
    markets: ["UAE", "KSA", "Qatar", "Oman", "Kuwait"],
    highlights: ["Export size", "Well cured", "Stable storage"],
  },
  {
    id: "green-chilli",
    name: "Green Chilli",
    category: "Vegetables",
    image: productImages.greenChilli,
    blurb: "Crisp, vibrant, hand-selected.",
    copy: "Crisp green chillies hand-selected for colour, length and heat profile — packed to protect freshness in transit.",
    varieties: ["G4", "Byadgi green"],
    season: "Year-round",
    pack: "Ventilated carton · 2kg / 5kg",
    coldChain: "Pre-cooled · 7°–9°C",
    markets: ["UAE", "KSA", "Qatar"],
    highlights: ["Hand selected", "Vibrant colour", "Protected pack"],
  },
  {
    id: "drumsticks",
    name: "Drumsticks",
    category: "Vegetables",
    image: productImages.drumsticks,
    blurb: "Tender moringa pods, fibre-graded.",
    copy: "Tender moringa (drumstick) pods fibre-graded for culinary markets — a distinctive South Indian export line.",
    varieties: ["PKM", "Local tender"],
    season: "Nov – Apr",
    pack: "Ventilated carton · 5kg",
    coldChain: "Cool chain · 8°–10°C",
    markets: ["UAE", "KSA", "Oman"],
    highlights: ["Tender pods", "Fibre graded", "Specialty line"],
  },
  {
    id: "red-chilli",
    name: "Red Chilli",
    category: "Spices",
    image: productImages.redChilli,
    blurb: "High-colour, controlled pungency.",
    copy: "Fresh red chillies with high colour and controlled pungency — graded for spice processors and retail packs.",
    varieties: ["Teja fresh", "Sannam"],
    season: "Dec – May",
    pack: "Ventilated carton · 5kg / 10kg",
    coldChain: "Cool ventilated · avoid moisture",
    markets: ["UAE", "KSA", "Qatar", "Kuwait"],
    highlights: ["High colour", "Controlled heat", "Processor ready"],
  },
  {
    id: "dry-red-chilli",
    name: "Dry Red Chilli",
    category: "Spices",
    image: productImages.dryRedChilli,
    featured: true,
    blurb: "Teja & Sannam, sun-dried grades.",
    copy: "Sun-dried Teja and Sannam chillies — Andhra’s signature spice export with clean colour and reliable pungency.",
    varieties: ["Teja", "Sannam"],
    season: "Year-round (dried)",
    pack: "Jute / PP bag · 10kg / 25kg",
    coldChain: "Dry ambient · moisture-controlled store",
    markets: ["UAE", "KSA", "Qatar", "Oman", "Kuwait"],
    highlights: ["Teja & Sannam", "Sun dried", "Andhra origin"],
  },
  {
    id: "spices",
    name: "Spices",
    category: "Spices",
    image: productImages.spices,
    blurb: "Turmeric, cumin, coriander & more.",
    copy: "A curated spice assortment — turmeric, cumin, coriander and companion lines — packed to importer specifications.",
    varieties: ["Turmeric", "Cumin", "Coriander"],
    season: "Year-round",
    pack: "Food-grade bag / carton · MOQ by SKU",
    coldChain: "Dry ambient · sealed packs",
    markets: ["UAE", "KSA", "Qatar", "Europe soon"],
    highlights: ["Multi-SKU", "Clean grade", "Spec packing"],
  },
  {
    id: "fresh-vegetables",
    name: "Fresh Vegetables",
    category: "Assortments",
    image: productImages.freshVegetables,
    blurb: "Mixed consignments, made to order.",
    copy: "Mixed vegetable consignments built to your programme — graded, packed and cold-chain ready for Gulf distribution.",
    varieties: ["Buyer programme mix"],
    season: "Year-round",
    pack: "Mixed ventilated crates · made to order",
    coldChain: "Unbroken cool chain by SKU",
    markets: ["UAE", "KSA", "Qatar", "Oman"],
    highlights: ["Made to order", "Mixed loads", "Programme ready"],
  },
  {
    id: "seasonal-fruits",
    name: "Seasonal Fruits",
    category: "Assortments",
    image: productImages.seasonalFruits,
    blurb: "Curated by harvest calendar.",
    copy: "Seasonal fruit assortments curated from the harvest calendar — so importers get peak flavour without guesswork.",
    varieties: ["Seasonal mix"],
    season: "By harvest calendar",
    pack: "Mixed export cartons · programme packs",
    coldChain: "SKU-specific cool chain",
    markets: ["UAE", "KSA", "Qatar", "Bahrain"],
    highlights: ["Calendar led", "Peak flavour", "Curated mix"],
  },
];

/** Category tabs — no "All"; browse by assortment type. */
export const productCategories = ["Fruits", "Vegetables", "Spices", "Assortments"];

/** Default landing category for the catalogue. */
export const defaultProductCategory = "Fruits";

/** Filter catalogue by category tab. */
export function getProductsByCategory(category = defaultProductCategory) {
  const cat = category || defaultProductCategory;
  return products.filter((p) => p.category === cat);
}

/** Counts for category rail badges. */
export function getProductCategoryCounts() {
  const counts = {};
  for (const cat of productCategories) {
    counts[cat] = products.filter((p) => p.category === cat).length;
  }
  return counts;
}

/** Featured product for a category (flagship first, else first in list). */
export function getFeaturedProduct(category = defaultProductCategory) {
  const list = getProductsByCategory(category);
  return list.find((p) => p.featured) || list[0] || null;
}

/** Target export markets — status drives globe styling. */
export const markets = [
  { name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708, status: "active" },
  { name: "Abu Dhabi", country: "UAE", lat: 24.4539, lng: 54.3773, status: "active" },
  { name: "Riyadh", country: "Saudi Arabia", lat: 24.7136, lng: 46.6753, status: "active" },
  { name: "Doha", country: "Qatar", lat: 25.2854, lng: 51.531, status: "active" },
  { name: "Muscat", country: "Oman", lat: 23.588, lng: 58.3829, status: "active" },
  { name: "Kuwait City", country: "Kuwait", lat: 29.3759, lng: 47.9774, status: "active" },
  { name: "Manama", country: "Bahrain", lat: 26.2285, lng: 50.586, status: "active" },
  // Future expansion — gold markers / arcs on the globe
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

/** Country-level export destinations (for hero flag chips). */
export const exportDestinations = [
  { flag: "🇦🇪", code: "UAE", name: "United Arab Emirates" },
  { flag: "🇸🇦", code: "KSA", name: "Saudi Arabia" },
  { flag: "🇶🇦", code: "QAT", name: "Qatar" },
  { flag: "🇴🇲", code: "OMN", name: "Oman" },
];

/** Headline statistics (animated counters). */
export const stats = [
  { id: "years", value: 40, suffix: "+", label: "Years Experience" },
  { id: "network", value: 1000, suffix: "+", label: "Farm Network" },
  { id: "quality", value: 100, suffix: "%", label: "Quality Checked" },
  { id: "support", value: 24, suffix: "/7", label: "Support" },
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

/** Export process stages (horizontal scroll). */
export const processStages = [
  { step: "01", title: "Farm", desc: "Sourced from trusted partner farms across Andhra Pradesh.", icon: "Sprout", image: "1523348837708-15d4a09cfac2" },
  { step: "02", title: "Sorting", desc: "Hand-sorted and graded by size, colour and ripeness.", icon: "ListFilter", image: "1471193945509-9ad0617afabf" },
  { step: "03", title: "Quality Check", desc: "Multi-point inspection with lab-backed testing.", icon: "ScanSearch", image: "1488459716781-31db52582fe9" },
  { step: "04", title: "Packaging", desc: "Ventilated, export-grade, branded packaging.", icon: "Package", image: "1607349913338-fca6f7fc42d0" },
  { step: "05", title: "Cold Storage", desc: "Pre-cooled and held under precise temperature.", icon: "Snowflake", image: "1610348725531-843dff563e2c" },
  { step: "06", title: "Container Loading", desc: "Reefer containers loaded and sealed with care.", icon: "Container", image: "1605745341112-85968b19335b" },
  { step: "07", title: "Shipping", desc: "Optimised sea & air routes to destination markets.", icon: "Ship", image: "1494412574643-ff11b0a5c1c3" },
  { step: "08", title: "Destination Port", desc: "Cleared and handled by trusted partners.", icon: "Anchor", image: "1512453979798-5ea266f8880c" },
  { step: "09", title: "Customer", desc: "Delivered fresh to importers and distributors.", icon: "Handshake", image: "1553413077-190dd305871c" },
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
    copy: "A family fruit business takes root in Andhra Pradesh — built on soil, season, and a promise to never ship what we would not eat ourselves.",
    image: scenes.market,
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
    copy: "Hundreds of partner farms join the ecosystem — relationships measured in seasons, not contracts alone.",
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
    copy: "Cold chain, packhouse and quality systems mature — so freshness survives the miles before it ever sees a port.",
    image: scenes.packaging,
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
    image: scenes.containerShip,
    routes: ["Dubai", "Riyadh", "Doha", "Muscat"],
    accent: "amber",
  },
  {
    id: "m-today",
    year: "Today",
    layout: "today",
    pill: "THE JOURNEY CONTINUES",
    title: "Delivering to the world",
    copy: "Premium Indian produce reaching the Middle East and beyond — with new continents on the horizon, and the same promise in every crate.",
    image: scenes.dubai,
    markets: ["UAE", "KSA", "Qatar", "Oman", "Kuwait", "Europe soon"],
    closing: "From Andhra Pradesh to your port — same care, every mile.",
    accent: "cinematic",
  },
];

/** @deprecated Use legacyMilestones — kept for any residual imports. */
export const timeline = legacyMilestones.map((m) => ({
  year: m.year,
  title: m.title,
  desc: m.copy,
}));

/** Certifications. */
export const certifications = [
  { code: "APEDA", name: "Agricultural & Processed Food Products Export Development Authority", status: "certified" },
  { code: "FSSAI", name: "Food Safety and Standards Authority of India", status: "certified" },
  { code: "IEC", name: "Import Export Code", status: "certified" },
  { code: "Phytosanitary", name: "Phytosanitary Certification", status: "certified" },
  { code: "Global G.A.P.", name: "Good Agricultural Practices", status: "future" },
  { code: "ISO", name: "ISO 22000 Food Safety Management", status: "future" },
];

/** Testimonials. */
export const testimonials = [
  { quote: "Consistent quality and reliable timelines. MDF Exports & Imports has become our default partner for Indian produce.", name: "Ahmed Al-Farsi", role: "Importer", location: "Dubai, UAE", flag: "🇦🇪" },
  { quote: "Their cold chain discipline is exceptional — produce arrives as fresh as the day it was picked.", name: "Khalid Rahman", role: "Distribution Head", location: "Riyadh, Saudi Arabia", flag: "🇸🇦" },
  { quote: "Four decades of experience shows. Documentation, grading and communication are all flawless.", name: "Yusuf Hassan", role: "Wholesale Buyer", location: "Doha, Qatar", flag: "🇶🇦" },
  { quote: "A rare supplier that treats every consignment like their own reputation depends on it.", name: "Salim Al-Balushi", role: "Retail Chain Buyer", location: "Muscat, Oman", flag: "🇴🇲" },
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
    copy: "Four decades of relationships with the farmers who know the soil, the season, and the standard — long before a crate is packed.",
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
    copy: "Selected by size, colour and sweetness — never before its time. Every lot earns its place in the consignment.",
    giantWord: "FRESH",
    image: scenes.harvest,
    features: [
      { n: "01", title: "Size", desc: "Uniform grading for pack-out and stable stacking at sea.", icon: "Ruler" },
      { n: "02", title: "Colour", desc: "Peak visual maturity checked under natural light.", icon: "Palette" },
      { n: "03", title: "Sweetness", desc: "Brix sampled at intake — never before its time.", icon: "Droplets" },
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
    copy: "Ventilated, branded, protective packaging built for the journey — so freshness survives the miles.",
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
    copy: "An unbroken cold chain from our packhouse to your port — reefer discipline, documentation, and trusted lanes.",
    image: scenes.containerShip,
    tempBadge: "0°–5°C",
    stats: [
      { value: "0°–5°C", label: "Reefer range", icon: "Snowflake" },
      { value: "GCC", label: "Active lanes", icon: "Ship" },
      { value: "24/7", label: "Chain watch", icon: "Clock" },
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
    copy: "Fresh in Dubai, the Gulf, and soon — new continents. The same care that starts on the farm arrives at your door.",
    image: scenes.dubai,
    doodle: "stamp",
  },
];

/** Frequently asked questions. */
export const faqs = [
  { q: "Which countries do you currently export to?", a: "We actively serve the UAE (Dubai, Abu Dhabi), Saudi Arabia, Qatar, Oman, Kuwait and Bahrain, with European markets on our expansion roadmap." },
  { q: "What is your minimum order quantity?", a: "MOQs vary by product and destination. Most consignments are shipped by the full or part reefer container. Share your requirement and we will tailor a quote." },
  { q: "How do you ensure produce stays fresh in transit?", a: "An unbroken cold chain — pre-cooling, temperature-controlled storage and reefer containers — keeps produce at optimal condition from farm to destination port." },
  { q: "Which certifications do you hold?", a: "We operate with APEDA, FSSAI, IEC and Phytosanitary certification, and are pursuing Global G.A.P. and ISO 22000 as part of our roadmap." },
  { q: "Can you handle custom packaging and private labelling?", a: "Yes. We offer export-grade, ventilated packaging and can accommodate branded and private-label requirements." },
  { q: "How do I start importing with MDF Exports & Imports?", a: "Send us your product list, volumes and destination via the contact form or WhatsApp. Our team will respond with pricing, lead times and documentation." },
];
