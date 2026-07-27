/**
 * Image helpers — prefer first-party `/media` assets for critical scenes,
 * fall back to Unsplash for the rest of the catalogue.
 */

/** Self-hosted critical assets keyed by Unsplash photo id (without `photo-`). */
const LOCAL_MEDIA = {
  "1523348837708-15d4a09cfac2": "farm-field",
  "1605673349798-5580680c4dea": "farmer",
  "1626906722163-bd4c03cb3b9b": "grower-portrait",
  "1471193945509-9ad0617afabf": "harvest",
  "1607349913338-fca6f7fc42d0": "packaging",
  "1610348725531-843dff563e2c": "crates",
  "1494412574643-ff11b0a5c1c3": "container-ship",
  "1512453979798-5ea266f8880c": "dubai",
  "1488459716781-31db52582fe9": "market",
  "1571771894821-ce9b6c11b08e": "bananas",
  "1605745341112-85968b19335b": "container-port",
  "1553413077-190dd305871c": "delivered",
};

function localPath(slug, size) {
  return `/media/${slug}-${size}.jpg`;
}

function pickLocalSize(w) {
  return w <= 720 ? "640" : "1200";
}

/**
 * Build an optimised image URL for a given photo id.
 * @param {string} id  Unsplash photo id (the part after `photo-`)
 * @param {number} [w] target width in px
 * @param {number} [q] quality 1-100 (Unsplash only)
 */
export function unsplash(id, w = 1200, q = 80) {
  const slug = LOCAL_MEDIA[id];
  if (slug) return localPath(slug, pickLocalSize(w));
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;
}

/**
 * Build a responsive `srcSet` string.
 * @param {string} id  Unsplash photo id
 * @param {number[]} [widths] candidate widths in px
 * @param {number} [q] quality 1-100
 */
export function unsplashSrcSet(id, widths = [384, 480, 640, 768, 1080, 1440, 1920], q = 78) {
  const slug = LOCAL_MEDIA[id];
  if (slug) {
    return `${localPath(slug, "640")} 640w, ${localPath(slug, "1200")} 1200w`;
  }
  return widths.map((w) => `${unsplash(id, w, q)} ${w}w`).join(", ");
}

/** Low-quality placeholder (blur-up) variant. */
export function unsplashLQ(id) {
  const slug = LOCAL_MEDIA[id];
  if (slug) return localPath(slug, "lq");
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=32&q=20&blur=20`;
}

/** Hero + storytelling scene imagery. */
export const scenes = {
  farmSunrise: "1500382017468-9049fed747ef", // green fields at sunrise (hero uses first-party files)
  farmField: "1523348837708-15d4a09cfac2",
  farmer: "1605673349798-5580680c4dea",
  growerPortrait: "1626906722163-bd4c03cb3b9b",
  harvest: "1471193945509-9ad0617afabf",
  packaging: "1607349913338-fca6f7fc42d0",
  containerShip: "1494412574643-ff11b0a5c1c3",
  containerPort: "1605745341112-85968b19335b",
  dubai: "1512453979798-5ea266f8880c",
  delivered: "1553413077-190dd305871c",
  crates: "1610348725531-843dff563e2c",
  market: "1488459716781-31db52582fe9",
};

/** Product catalogue imagery. */
export const productImages = {
  bananas: "1571771894821-ce9b6c11b08e",
  lemons: "1590502593747-42a996133562",
  redChilli: "1583119022894-919a68a3d0e3",
  greenChilli: "1588252303782-cb80119abd6d",
  onions: "1518977956812-cd3dbadaaf31",
  tomatoes: "1592924357228-91a4daadcfea",
  mangoes: "1553279768-865429fa0078",
  drumsticks: "1615485290382-441e4d049cb5",
  coconut: "1580052614034-c55d20bfee3b",
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
