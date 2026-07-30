/**
 * Content-matched image library for MDF Exports & Imports.
 *
 * Catalogue (only): mangoes · Indian apple · pomegranate · Guntur dry red chilli.
 * Every `scenes` / gallery entry documents the on-screen narrative it supports.
 * Do not reuse a photo for an unrelated step (e.g. fruit still ≠ cold store).
 */

/** Self-hosted assets keyed by Unsplash photo id (without `photo-`). */
const LOCAL_MEDIA = {
  // Logistics / destination only. Produce photos stay on Unsplash until first-party shoots exist.
  "1494412574643-ff11b0a5c1c3": "container-ship", // aerial container terminal (port loading)
  "1605745341112-85968b19335b": "container-port", // vessel under way (shipping)
  "1512453979798-5ea266f8880c": "dubai",
  "1553413077-190dd305871c": "delivered", // importer / warehouse aisle
};

function localPath(slug, size) {
  return `/media/${slug}-${size}.jpg`;
}

function pickLocalSize(w) {
  return w <= 720 ? "640" : "1200";
}

/**
 * @param {string} id  Unsplash photo id (the part after `photo-`)
 * @param {number} [w]
 * @param {number} [q]
 */
export function unsplash(id, w = 1200, q = 80) {
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
  const slug = LOCAL_MEDIA[id];
  if (slug) {
    return `${localPath(slug, "640")} 640w, ${localPath(slug, "1200")} 1200w`;
  }
  return widths.map((w) => `${unsplash(id, w, q)} ${w}w`).join(", ");
}

/** @param {string} id */
export function unsplashLQ(id) {
  const slug = LOCAL_MEDIA[id];
  if (slug) return localPath(slug, "lq");
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=32&q=20&blur=20`;
}

/**
 * Product catalogue stills. One primary photo per live SKU.
 * dryRedChilli must be dried pods (not spice flat-lays / fresh single peppers).
 */
export const productImages = {
  mangoes: "1755842546298-d5cb56b5afee", // multiple ripe mangoes on the farm / orchard tree
  indianApple: "1560806887-1e4cd0b6cbd6", // red apple lot
  pomegranate: "1541344999736-83eca272f6fc", // whole + open arils
  dryRedChilli: "1766158554170-1e8b1899c8ae", // dense dried red chilli pile
};

/**
 * Narrative scenes. Keys describe the story beat, not a random crop.
 * Consumers: Story chapters, Process stages, Legacy timeline, Hero helpers.
 */
export const scenes = {
  /** Open farmland / sunrise. Process 01, Legacy regional */
  farmSunrise: "1500382017468-9049fed747ef",

  /** Mangoes ripening on the tree. Story Origin / Harvest, Process Farm */
  mangoOrchard: "1755842546298-d5cb56b5afee",

  /** Grower hands selecting fruit. Story People, Process Sorting */
  growerHands: "1570913149827-d2ac84ab3f9a",

  /** Graded apple lot (inspection-ready). Process Quality Check */
  gradedApples: "1567306226416-28f0efdc88ce",

  /**
   * Apples in wooden farm crates. Harvest collected / crate packing beat.
   * Not a grocery paper bag; not mixed tropical assortment.
   */
  harvestCollect: "1625238780743-d7b5b0bec6ed",

  /**
   * Mangoes packed in market crates. Process Packaging / Story Care primary.
   * Shows fruit in crates (export-pack narrative), not retail veg shelves.
   */
  mangoCrates: "1587009048714-98d52b7c668d",

  /** Dried chilli market bowl. Gallery lots */
  chilliLots: "1763994685403-88aaa750af61",

  /** Sun-dried chilli close pile (India drying context) */
  chilliDried: "1526576935508-6bccc1e07580",

  /** Storage / distribution bay. Process Cold Storage & Customer handoff */
  warehouse: "1553413077-190dd305871c",

  /**
   * Port container terminal (local file slug container-ship).
   * Use for loading AND destination port. Not for “ship at sea”.
   */
  portTerminal: "1494412574643-ff11b0a5c1c3",

  /**
   * Vessel under way (local file slug container-port).
   * Use for shipping / voyage. Not for dock loading.
   */
  vesselAtSea: "1605745341112-85968b19335b",

  /** Gulf destination skyline. Story Arrival / Legacy Today (markets), not “port” */
  dubai: "1512453979798-5ea266f8880c",

  // --- Back-compat aliases used across Story / Process / Legacy ---
  farmField: "1755842546298-d5cb56b5afee", // orchard, not nursery pots
  farmer: "1570913149827-d2ac84ab3f9a", // grower hands with fruit
  growerPortrait: "1570913149827-d2ac84ab3f9a",
  harvest: "1755842546298-d5cb56b5afee", // peak ripeness on the tree
  packaging: "1587009048714-98d52b7c668d", // mangoes in crates
  crates: "1625238780743-d7b5b0bec6ed", // apple crates ready for the journey
  market: "1587009048714-98d52b7c668d", // founding fruit trade. Mango crates
  containerShip: "1605745341112-85968b19335b", // voyage (was mislabeled)
  containerPort: "1494412574643-ff11b0a5c1c3", // terminal loading (was mislabeled)
  delivered: "1553413077-190dd305871c",
};

/**
 * Gallery. Ordered journey; caption is written for the photo, not the other way around.
 * @type {{ id: string, caption: string, alt: string }[]}
 */
export const galleryItems = [
  {
    id: scenes.mangoOrchard,
    caption: "Mangoes ripening on the tree",
    alt: "Ripe mangoes hanging from orchard branches",
  },
  {
    id: productImages.mangoes,
    caption: "Export-grade mangoes",
    alt: "Ripe mangoes hanging from orchard branches on the farm",
  },
  {
    id: productImages.indianApple,
    caption: "Indian apple. Graded lots",
    alt: "Lot of red apples graded for export",
  },
  {
    id: scenes.growerHands,
    caption: "Selected by hand",
    alt: "Hand selecting a ripe apple in the orchard",
  },
  {
    id: productImages.pomegranate,
    caption: "Pomegranate. Deep colour",
    alt: "Fresh pomegranates with deep red arils",
  },
  {
    id: productImages.dryRedChilli,
    caption: "Guntur dry red chilli",
    alt: "Close-up pile of dried red chillies",
  },
  {
    id: scenes.chilliLots,
    caption: "Andhra chilli lots",
    alt: "Bowl of dried red chillies ready for spice programmes",
  },
  {
    id: scenes.mangoCrates,
    caption: "Packed in export crates",
    alt: "Mangoes packed tightly in wooden market crates",
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
