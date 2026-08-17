import { productImages } from "@/lib/images";

/**
 * Flagship export guides. Single source of truth for Products strip,
 * Footer, and MobileMenu. Paths must stay crawlable <a href> targets.
 */
export const premiumProducts = [
  {
    id: "banganapalli-mango",
    path: "/products/banganapalli-mango",
    title: "Banganapalli Mango",
    blurb: "Andhra-grown Banganapalli. Sea-freight packing and cold chain.",
    badge: "Fresh fruit",
    cta: "Mango export guide",
    image: productImages.mangoes,
  },
  {
    id: "guntur-red-chilli",
    path: "/products/guntur-red-chilli",
    title: "Guntur Red Chilli",
    blurb: "Dried Teja & Sannam grades from Andhra. Colour, heat and clean lots.",
    badge: "Spice",
    cta: "Guntur export guide",
    image: productImages.dryRedChilli,
  },
  {
    id: "black-pepper",
    path: "/products/black-pepper",
    title: "Black Pepper",
    blurb: "Malabar & Tellicherry grades. Garbled MG1 / TGSEB, spec-documented lots.",
    badge: "Spice",
    cta: "Black pepper export guide",
    image: productImages.blackPepper,
  },
  {
    id: "indian-apple",
    path: "/products/indian-apple",
    title: "Indian Apple",
    blurb: "Hill-origin fruit from Himachal & J&K. Cold-chain graded for export.",
    badge: "Fresh fruit",
    cta: "Apple export guide",
    image: productImages.indianApple,
  },
  {
    id: "indian-pomegranate",
    path: "/products/indian-pomegranate",
    title: "Indian Pomegranate",
    blurb: "Maharashtra Bhagwa & Ganesh. TSS, packing and reefer-ready lots.",
    badge: "Fresh fruit",
    cta: "Pomegranate export guide",
    image: productImages.pomegranate,
  },
];
