import { productImages, scenes } from "@/lib/images";

/** Primary navigation links (anchor targets). */
export const navLinks = [
  { label: "Products", href: "#products" },
  { label: "Story", href: "#story" },
  { label: "Process", href: "#process" },
  { label: "Markets", href: "#markets" },
  { label: "Contact", href: "#contact" },
];

/** Product catalogue. */
export const products = [
  { id: "bananas", name: "Bananas", category: "Fruits", image: productImages.bananas, blurb: "Cavendish & Robusta, export-grade ripeness." },
  { id: "lemons", name: "Lemons", category: "Fruits", image: productImages.lemons, blurb: "High-juice, thin-skin, long shelf life." },
  { id: "mangoes", name: "Mangoes", category: "Fruits", image: productImages.mangoes, blurb: "Alphonso, Banganapalli & Kesar varieties." },
  { id: "pomegranate", name: "Pomegranate", category: "Fruits", image: productImages.pomegranate, blurb: "Deep-red arils, superior brix." },
  { id: "coconut", name: "Coconut", category: "Fruits", image: productImages.coconut, blurb: "Tender & semi-husked, freshly sourced." },
  { id: "tomatoes", name: "Tomatoes", category: "Vegetables", image: productImages.tomatoes, blurb: "Firm, uniform, cold-chain ready." },
  { id: "onions", name: "Onions", category: "Vegetables", image: productImages.onions, blurb: "Red & pink, export-sized bulbs." },
  { id: "green-chilli", name: "Green Chilli", category: "Vegetables", image: productImages.greenChilli, blurb: "Crisp, vibrant, hand-selected." },
  { id: "drumsticks", name: "Drumsticks", category: "Vegetables", image: productImages.drumsticks, blurb: "Tender moringa pods, fibre-graded." },
  { id: "red-chilli", name: "Red Chilli", category: "Spices", image: productImages.redChilli, blurb: "High-colour, controlled pungency." },
  { id: "dry-red-chilli", name: "Dry Red Chilli", category: "Spices", image: productImages.dryRedChilli, blurb: "Teja & Sannam, sun-dried grades." },
  { id: "spices", name: "Spices", category: "Spices", image: productImages.spices, blurb: "Turmeric, cumin, coriander & more." },
  { id: "fresh-vegetables", name: "Fresh Vegetables", category: "Assortments", image: productImages.freshVegetables, blurb: "Mixed consignments, made to order." },
  { id: "seasonal-fruits", name: "Seasonal Fruits", category: "Assortments", image: productImages.seasonalFruits, blurb: "Curated by harvest calendar." },
];

export const productCategories = ["All", "Fruits", "Vegetables", "Spices", "Assortments"];

/** Target export markets — status drives globe styling. */
export const markets = [
  { name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708, status: "active" },
  { name: "Abu Dhabi", country: "UAE", lat: 24.4539, lng: 54.3773, status: "active" },
  { name: "Riyadh", country: "Saudi Arabia", lat: 24.7136, lng: 46.6753, status: "active" },
  { name: "Doha", country: "Qatar", lat: 25.2854, lng: 51.531, status: "active" },
  { name: "Muscat", country: "Oman", lat: 23.588, lng: 58.3829, status: "active" },
  { name: "Kuwait City", country: "Kuwait", lat: 29.3759, lng: 47.9774, status: "active" },
  { name: "Manama", country: "Bahrain", lat: 26.2285, lng: 50.586, status: "active" },
  { name: "Europe", country: "Future", lat: 50.1109, lng: 8.6821, status: "future" },
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

/** Company timeline. */
export const timeline = [
  { year: "1984", title: "MD Fruits is founded", desc: "A family fruit business takes root in Andhra Pradesh." },
  { year: "1998", title: "Regional leadership", desc: "Trusted supply relationships expand across South India." },
  { year: "2010", title: "Scaling the network", desc: "Hundreds of partner farms join the ecosystem." },
  { year: "2020", title: "Export-grade infrastructure", desc: "Cold chain, packhouse and quality systems mature." },
  { year: "2024", title: "Universal Traders launches", desc: "Four decades of heritage go global." },
  { year: "Today", title: "Delivering to the world", desc: "Premium Indian produce reaching the Middle East and beyond." },
];

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
  { quote: "Consistent quality and reliable timelines. Universal Traders has become our default partner for Indian produce.", name: "Ahmed Al-Farsi", role: "Importer", location: "Dubai, UAE", flag: "🇦🇪" },
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
    copy: "Fresh in Dubai, the Gulf, and soon — Europe. The same care that starts on the farm arrives at your door.",
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
  { q: "How do I start importing with Universal Traders?", a: "Send us your product list, volumes and destination via the contact form or WhatsApp. Our team will respond with pricing, lead times and documentation." },
];
