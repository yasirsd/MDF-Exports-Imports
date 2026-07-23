/**
 * Curated stock imagery (Unsplash) organised by category.
 * Images are hotlinked with on-the-fly optimisation params. A branded
 * gradient fallback is rendered by <LazyImage> if any URL fails to load.
 */

/**
 * Build an optimised Unsplash URL for a given photo id.
 * @param {string} id  Unsplash photo id (the part after `photo-`)
 * @param {number} [w] target width in px
 * @param {number} [q] quality 1-100
 */
export function unsplash(id, w = 1200, q = 80) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;
}

/**
 * Build a responsive `srcSet` string for an Unsplash id so browsers download
 * an appropriately-sized asset per device (never a desktop image on a phone).
 * @param {string} id  Unsplash photo id
 * @param {number[]} [widths] candidate widths in px
 * @param {number} [q] quality 1-100
 */
export function unsplashSrcSet(id, widths = [384, 480, 640, 768, 1080, 1440, 1920], q = 78) {
  return widths.map((w) => `${unsplash(id, w, q)} ${w}w`).join(", ");
}

/** Low-quality placeholder (blur-up) variant. */
export function unsplashLQ(id) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=32&q=20&blur=20`;
}

/** Hero + storytelling scene imagery. */
export const scenes = {
  farmSunrise: "1500382017468-9049fed747ef", // green fields at sunrise
  farmField: "1523348837708-15d4a09cfac2", // agriculture rows
  farmer: "1592982537447-7440770cbfc9", // farmer in field
  harvest: "1471193945509-9ad0617afabf", // harvest baskets
  packaging: "1607349913338-fca6f7fc42d0", // packing produce
  containerShip: "1494412574643-ff11b0a5c1c3", // container ship
  containerPort: "1605745341112-85968b19335b", // port cranes
  dubai: "1512453979798-5ea266f8880c", // dubai skyline
  delivered: "1553413077-190dd305871c", // logistics delivery
  crates: "1610348725531-843dff563e2c", // wooden crates of produce
  market: "1488459716781-31db52582fe9", // fresh market
};

/** Product catalogue imagery. */
export const productImages = {
  bananas: "1571771894821-ce9b6c11b08e",
  lemons: "1590502593747-42a996133562",
  redChilli: "1583119022894-919a68a3d0e3",
  greenChilli: "1588252303782-cb80119abd6d",
  onions: "1518977956812-cd3dbadaaf31",
  tomatoes: "1592924357228-91a4daadcfea", // verified: fresh red tomatoes
  mangoes: "1553279768-865429fa0078",
  drumsticks: "1615485290382-441e4d049cb5",
  coconut: "1580052614034-c55d20bfee3b", // verified: coconuts
  pomegranate: "1541344999736-83eca272f6fc",
  freshVegetables: "1540420773420-3366772f4999",
  seasonalFruits: "1619566636858-adf3ef46400b",
  dryRedChilli: "1596040033229-a9821ebd058d",
  spices: "1509358271058-acd22cc93898",
};

/** Gallery imagery (mixed lifestyle + product). */
export const galleryImages = [
  "1610348725531-843dff563e2c",
  "1567306226416-28f0efdc88ce",
  "1524594152303-9fd13543fe6e",
  "1470119693884-47d3a1d1f180",
  "1416879595882-3373a0480b5b",
  "1488459716781-31db52582fe9",
  "1502741224143-90386d7f8c82",
  "1518843875459-f738682238a6",
  "1607305387299-a3d9611cd469",
  "1600585152220-90363fe7e115",
];
