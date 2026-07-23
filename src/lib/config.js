import { env } from "@/lib/utils";

const DEFAULT_WHATSAPP = "919000000000";
const DEFAULT_PHONE = "+919000000000";
const DEFAULT_EMAIL = "exports@universaltraders.com";

/** Central site + brand configuration. */
export const site = {
  name: "Universal Traders",
  logo: "UT",
  tagline: "Exporting India's Freshness to the World.",
  subheading: "Premium Fruits • Vegetables • Spices • Agricultural Products",
  parent: "MD Fruits",
  experience: "40+ Years",
  location: "Andhra Pradesh, India",
  // Query used for the embedded contact map. Set a precise business address
  // (or "lat,lng") via VITE_MAP_QUERY for an accurate pin.
  mapQuery: env("VITE_MAP_QUERY", "Andhra Pradesh, India"),
  url: env("VITE_SITE_URL", "https://universaltraders.com"),
  whatsapp: env("VITE_WHATSAPP_NUMBER", DEFAULT_WHATSAPP),
  phone: env("VITE_CONTACT_PHONE", DEFAULT_PHONE),
  email: env("VITE_CONTACT_EMAIL", DEFAULT_EMAIL),
  hours: "Mon–Sat · 9:00 AM – 7:00 PM IST",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "Linkedin" },
    { label: "Instagram", href: "https://www.instagram.com/", icon: "Instagram" },
    { label: "Facebook", href: "https://www.facebook.com/", icon: "Facebook" },
    { label: "YouTube", href: "https://www.youtube.com/", icon: "Youtube" },
  ],
};

/** True when real contact details have not been configured via .env. */
export const usingPlaceholderContact =
  site.whatsapp === DEFAULT_WHATSAPP ||
  site.phone === DEFAULT_PHONE ||
  site.email === DEFAULT_EMAIL;

if (import.meta.env?.DEV && usingPlaceholderContact) {
  // eslint-disable-next-line no-console
  console.warn(
    "[Universal Traders] Placeholder contact details are in use. Set VITE_WHATSAPP_NUMBER, VITE_CONTACT_PHONE and VITE_CONTACT_EMAIL in .env before shipping."
  );
}
