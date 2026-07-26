import { env } from "@/lib/utils";

const DEFAULT_WHATSAPP = "919000000000";
const DEFAULT_PHONE = "+919000000000";
const DEFAULT_EMAIL = "exports@mdfexportsimports.com";

/** Central site + brand configuration — single source of truth for MDF. */
export const site = {
  name: "MDF Exports & Imports",
  shortName: "MDF",
  /** Compact mark for monogram fallbacks */
  logo: "MDF",
  tagline: "Exporting India's Freshness to the World.",
  shortTag: "Exports & Imports",
  subheading: "Premium Fruits • Vegetables • Spices • Agricultural Products",
  /** Heritage lineage — family origins (kept for storytelling authenticity) */
  heritage: "MD Fruits",
  experience: "40+ Years",
  location: "Andhra Pradesh, India",
  foundingYear: "1984",
  mapQuery: env("VITE_MAP_QUERY", "Andhra Pradesh, India"),
  url: env("VITE_SITE_URL", "https://mdfexportsimports.com"),
  whatsapp: env("VITE_WHATSAPP_NUMBER", DEFAULT_WHATSAPP),
  phone: env("VITE_CONTACT_PHONE", DEFAULT_PHONE),
  email: env("VITE_CONTACT_EMAIL", DEFAULT_EMAIL),
  hours: "Mon–Sat · 9:00 AM – 7:00 PM IST",
  description:
    "MDF Exports & Imports delivers premium fruits, vegetables, spices and agricultural products from Andhra Pradesh, India to the Gulf, Asia-Pacific and beyond — built on 40+ years of agricultural excellence.",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "Linkedin" },
    { label: "Instagram", href: "https://www.instagram.com/", icon: "Instagram" },
    { label: "Facebook", href: "https://www.facebook.com/", icon: "Facebook" },
    { label: "YouTube", href: "https://www.youtube.com/", icon: "Youtube" },
  ],
};

/** WhatsApp / enquiry opener using the current brand name. */
export function brandHello(body) {
  return `Hello ${site.name}${body ? ` — ${body}` : "."}`;
}

/** True when real contact details have not been configured via .env. */
export const usingPlaceholderContact =
  site.whatsapp === DEFAULT_WHATSAPP ||
  site.phone === DEFAULT_PHONE ||
  site.email === DEFAULT_EMAIL;

if (import.meta.env?.DEV && usingPlaceholderContact) {
  // eslint-disable-next-line no-console
  console.warn(
    `[${site.name}] Placeholder contact details are in use. Set VITE_WHATSAPP_NUMBER, VITE_CONTACT_PHONE and VITE_CONTACT_EMAIL in .env before shipping.`
  );
}
