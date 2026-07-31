import { env } from "@/lib/utils";

const DEFAULT_WHATSAPP = "919000000000";
const DEFAULT_PHONE = "+919000000000";
const DEFAULT_EMAIL = "exports@mdfexportsimports.com";

/** Central site + brand configuration. Single source of truth for MDF. */
export const site = {
  name: "MDF Exports & Imports",
  shortName: "MDF",
  /** Compact mark for monogram fallbacks */
  logo: "MDF",
  tagline: "Exporting India's Freshness to the World.",
  shortTag: "Exports & Imports",
  subheading: "Indian Fruits • Guntur Dry Red Chilli • Gulf Export",
  /** Heritage lineage. Family origins (kept for storytelling authenticity) */
  heritage: "MD Fruits",
  experience: "40+ Years",
  location: "Andhra Pradesh, India",
  foundingYear: "1984",
  mapQuery: env("VITE_MAP_QUERY", "Andhra Pradesh, India"),
  url: env("VITE_SITE_URL", "https://www.mdfexport.com"),
  whatsapp: env("VITE_WHATSAPP_NUMBER", DEFAULT_WHATSAPP),
  phone: env("VITE_CONTACT_PHONE", DEFAULT_PHONE),
  email: env("VITE_CONTACT_EMAIL", DEFAULT_EMAIL),
  hours: "Mon–Sat · 9:00 AM – 7:00 PM IST",
  description:
    "MDF Exports & Imports ships Andhra Banganapalli mango, Indian apples, pomegranate, and Guntur dry red chilli from Andhra Pradesh to the Gulf. Built on 40+ years of agricultural excellence.",
  socials: [
    // LinkedIn / YouTube intentionally left as platform placeholders until brand URLs are provided
    { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "Linkedin" },
    { label: "Instagram", href: "https://www.instagram.com/mdf.exim", icon: "Instagram" },
    // Canonical profile resolved from share/18tiq99Kzm → profile.php?id=61592829143871 (Mdf Exim)
    { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61592829143871", icon: "Facebook" },
    { label: "YouTube", href: "https://www.youtube.com/", icon: "Youtube" },
  ],
};

/** WhatsApp / enquiry opener using the current brand name. */
export function brandHello(body) {
  return `Hello ${site.name}${body ? `. ${body}` : "."}`;
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
