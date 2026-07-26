import { Helmet } from "react-helmet-async";
import { site } from "@/lib/config";

/**
 * Per-page SEO: meta, OpenGraph, Twitter cards and JSON-LD structured data.
 */
export function SEO({
  title,
  description,
  path = "/",
  image = "/og-image.png",
}) {
  const fullTitle = title ? `${title} — ${site.name}` : `${site.name} — ${site.tagline}`;
  const desc = description || site.description;
  const url = `${site.url}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${site.url}${image}`;

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.name,
    alternateName: site.shortName,
    url: site.url,
    logo: `${site.url}/favicon.svg`,
    slogan: site.tagline,
    description: desc,
    foundingDate: site.foundingYear,
    address: {
      "@type": "PostalAddress",
      addressRegion: "Andhra Pradesh",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: site.email,
      telephone: site.phone,
      areaServed: ["AE", "SA", "QA", "OM", "KW", "BH"],
      availableLanguage: ["en", "hi", "ar"],
    },
    areaServed: [
      "United Arab Emirates",
      "Saudi Arabia",
      "Qatar",
      "Oman",
      "Kuwait",
      "Bahrain",
    ],
    sameAs: site.socials.map((s) => s.href),
  };

  return (
    <Helmet>
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${site.name} — ${site.tagline}`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={imageUrl} />

      <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
    </Helmet>
  );
}
