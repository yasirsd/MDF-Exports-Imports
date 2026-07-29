import { productImages } from "@/lib/images";

/**
 * Flagship export guides — single source of truth for Products strip,
 * Footer, and MobileMenu. Paths must stay crawlable <a href> targets.
 */
export const premiumProducts = [
  {
    id: "guntur-red-chilli",
    path: "/products/guntur-red-chilli",
    title: "Guntur Red Chilli",
    blurb: "Dried Teja & Sannam grades from Andhra — colour, heat, clean lots.",
    badge: "Spice",
    cta: "Guntur export guide",
    image: productImages.dryRedChilli,
  },
  {
    id: "indian-apple",
    path: "/products/indian-apple",
    title: "Indian Apple",
    blurb: "Hill-origin fruit from Himachal & J&K — cold-chain graded for export.",
    badge: "Fresh fruit",
    cta: "Apple export guide",
    image: productImages.indianApple,
  },
  {
    id: "indian-pomegranate",
    path: "/products/indian-pomegranate",
    title: "Indian Pomegranate",
    blurb: "Maharashtra Bhagwa & Ganesh — TSS, packing and reefer-ready lots.",
    badge: "Fresh fruit",
    cta: "Pomegranate export guide",
    image: productImages.pomegranate,
  },
];
