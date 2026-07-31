/**
 * Content-matched image library for MDF Exports & Imports.
 *
 * Catalogue (only): mangoes · Indian apple · pomegranate · Guntur dry red chilli.
 * First-party produce photos live under src/images/ and resolve via local-* ids.
 * Logistics / chilli stills stay on Unsplash (or /media) until replaced.
 */

import appleColdStorage from "@/images/AppleColdStorage.jpeg";
import kinnaurApple1 from "@/images/KinnaurAppleCloseUp1.jpeg";
import kinnaurApple2 from "@/images/KinnaurAppleCloseUp2.jpeg";
import mangoCrop from "@/images/mangoCrop.jpeg";
import mangoLot from "@/images/MangoLot.jpeg";
import orangeLot from "@/images/orangeLot.jpeg";
import pomegranateLot from "@/images/pomegranateLot.jpeg";

/** Vite-imported first-party produce photos. */
const LOCAL_ASSETS = {
  "local-mango-crop": mangoCrop,
  "local-mango-lot": mangoLot,
  "local-apple-closeup-1": kinnaurApple1,
  "local-apple-closeup-2": kinnaurApple2,
  "local-apple-cold-storage": appleColdStorage,
  "local-pomegranate-lot": pomegranateLot,
  "local-orange-lot": orangeLot,
};

function isLocalAsset(id) {
  return Boolean(LOCAL_ASSETS[id]);
}

/** Self-hosted logistics assets keyed by Unsplash photo id (without `photo-`). */
const LOCAL_MEDIA = {
  "1494412574643-ff11b0a5c1c3": "container-ship",
  "1605745341112-85968b19335b": "container-port",
  "1512453979798-5ea266f8880c": "dubai",
  "1553413077-190dd305871c": "delivered",
};

function localPath(slug, size) {
  return `/media/${slug}-${size}.jpg`;
}

function pickLocalSize(w) {
  return w <= 720 ? "640" : "1200";
}

/**
 * @param {string} id  Unsplash photo id, or `local-*` first-party key
 * @param {number} [w]
 * @param {number} [q]
 */
export function unsplash(id, w = 1200, q = 80) {
  if (isLocalAsset(id)) return LOCAL_ASSETS[id];
  const slug = LOCAL_MEDIA[id];
  if (slug) return localPath(slug, pickLocalSize(w));
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;
}

/**
 * @param {string} id
 * @param {number[]} [widths]
 * @param {number} [q]
 */
export function unsplashSrcSet(id, widths = [384, 480, 640, 768, 1080, 1440, 1920], q = 78) {
  if (isLocalAsset(id)) {
    // Single high-res source; browser scales. Avoid fake multi-width CDN urls.
    return undefined;
  }
  const slug = LOCAL_MEDIA[id];
  if (slug) {
    return `${localPath(slug, "640")} 640w, ${localPath(slug, "1200")} 1200w`;
  }
  return widths.map((w) => `${unsplash(id, w, q)} ${w}w`).join(", ");
}

/** @param {string} id */
export function unsplashLQ(id) {
  if (isLocalAsset(id)) return LOCAL_ASSETS[id];
  const slug = LOCAL_MEDIA[id];
  if (slug) return localPath(slug, "lq");
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=32&q=20&blur=20`;
}

/**
 * Product catalogue stills. One primary photo per live SKU.
 * Mango / apple / pomegranate use first-party export photography.
 */
export const productImages = {
  /** Bulk harvest lot — products showcase, drawers, hero fresh card */
  mangoes: "local-mango-lot",
  /** Orchard / on-tree crop — Banganapalli product landing hero */
  mangoCrop: "local-mango-crop",
  indianApple: "local-apple-closeup-1",
  indianAppleDetail: "local-apple-closeup-2",
  appleColdStorage: "local-apple-cold-storage",
  pomegranate: "local-pomegranate-lot",
  orangeLot: "local-orange-lot",
  dryRedChilli: "1766158554170-1e8b1899c8ae",
};

/**
 * Narrative scenes. Keys describe the story beat, not a random crop.
 * Mango beats use first-party photos; other beats stay stock until replaced.
 */
export const scenes = {
  farmSunrise: "1500382017468-9049fed747ef",

  /** Mangoes on the tree — first-party crop */
  mangoOrchard: "local-mango-crop",

  growerHands: "1570913149827-d2ac84ab3f9a",

  gradedApples: "1567306226416-28f0efdc88ce",

  harvestCollect: "1625238780743-d7b5b0bec6ed",

  /** Packed / lot mango — first-party */
  mangoCrates: "local-mango-lot",

  chilliLots: "1763994685403-88aaa750af61",

  chilliDried: "1526576935508-6bccc1e07580",

  warehouse: "1553413077-190dd305871c",

  portTerminal: "1494412574643-ff11b0a5c1c3",

  vesselAtSea: "1605745341112-85968b19335b",

  dubai: "1512453979798-5ea266f8880c",

  // --- Back-compat aliases (mango → first-party) ---
  farmField: "local-mango-crop",
  farmer: "1570913149827-d2ac84ab3f9a",
  growerPortrait: "1570913149827-d2ac84ab3f9a",
  harvest: "local-mango-crop",
  packaging: "local-mango-lot",
  crates: "1625238780743-d7b5b0bec6ed",
  market: "local-mango-lot",
  containerShip: "1605745341112-85968b19335b",
  containerPort: "1494412574643-ff11b0a5c1c3",
  delivered: "1553413077-190dd305871c",
};

/**
 * Gallery. Prefer first-party produce lots; keep logistics / chilli stock.
 * @type {{ id: string, caption: string, alt: string }[]}
 */
export const galleryItems = [
  {
    id: productImages.mangoCrop,
    caption: "Mangoes on the tree",
    alt: "Green mangoes hanging from orchard branches in Andhra Pradesh",
  },
  {
    id: productImages.mangoes,
    caption: "Mango harvest lot",
    alt: "Large lot of freshly harvested mangoes ready for packing",
  },
  {
    id: productImages.indianApple,
    caption: "Kinnaur apple. Graded close-up",
    alt: "Export-grade Kinnaur red apples packed in a carton",
  },
  {
    id: productImages.indianAppleDetail,
    caption: "Kinnaur apple detail",
    alt: "Close-up of deep red Kinnaur apples in packing",
  },
  {
    id: productImages.appleColdStorage,
    caption: "Apple cold storage",
    alt: "Apples packed in wooden crates inside a cold storage facility",
  },
  {
    id: productImages.pomegranate,
    caption: "Pomegranate harvest lot",
    alt: "Large outdoor lot of harvested pomegranates being packed",
  },
  {
    id: productImages.orangeLot,
    caption: "Citrus harvest lot",
    alt: "Large outdoor lot of harvested oranges on a tarp",
  },
  {
    id: productImages.dryRedChilli,
    caption: "Guntur dry red chilli",
    alt: "Close-up pile of dried red chillies",
  },
  {
    id: scenes.portTerminal,
    caption: "Loaded at origin port",
    alt: "Container terminal at the origin port",
  },
  {
    id: scenes.vesselAtSea,
    caption: "Bound for Gulf markets",
    alt: "Container ship under way toward destination markets",
  },
];

/** @deprecated Prefer galleryItems. Kept so older imports do not crash during HMR. */
export const galleryImages = galleryItems.map((g) => g.id);
