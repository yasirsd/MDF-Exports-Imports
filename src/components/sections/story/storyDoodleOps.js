/**
 * RoughSketch op sets for storytelling chapter doodles.
 * All rendered in brand orange via currentColor.
 */

export const STORY_DOODLES = {
  sprout: {
    viewBox: "0 0 160 160",
    ops: [
      { t: "l", x1: 80, y1: 140, x2: 80, y2: 70 },
      { t: "p", d: "M80 90 C 55 70, 40 50, 48 32" },
      { t: "p", d: "M80 90 C 105 70, 120 50, 112 32" },
      { t: "p", d: "M48 32 q 16 -18 32 0" },
      { t: "p", d: "M112 32 q -16 -18 -32 0" },
    ],
  },
  handshake: {
    viewBox: "0 0 160 100",
    ops: [
      { t: "p", d: "M20 55 L55 55 L70 40 L90 55 L140 55" },
      { t: "p", d: "M55 55 L70 70 L90 55" },
      { t: "c", x: 40, y: 40, d: 18 },
      { t: "c", x: 120, y: 40, d: 18 },
    ],
  },
  basket: {
    viewBox: "0 0 160 140",
    ops: [
      { t: "p", d: "M30 50 L130 50 L120 120 L40 120 Z" },
      { t: "p", d: "M45 50 Q80 20 115 50" },
      { t: "l", x1: 55, y1: 65, x2: 55, y2: 105 },
      { t: "l", x1: 80, y1: 65, x2: 80, y2: 105 },
      { t: "l", x1: 105, y1: 65, x2: 105, y2: 105 },
    ],
  },
  crate: {
    viewBox: "0 0 180 140",
    ops: [
      { t: "p", d: "M20 40 L160 40 L155 120 L25 120 Z" },
      { t: "l", x1: 20, y1: 65, x2: 160, y2: 65 },
      { t: "l", x1: 20, y1: 90, x2: 160, y2: 90 },
      { t: "l", x1: 55, y1: 40, x2: 50, y2: 120 },
      { t: "l", x1: 100, y1: 40, x2: 100, y2: 120 },
      { t: "l", x1: 145, y1: 40, x2: 140, y2: 120 },
    ],
  },
  ship: {
    viewBox: "0 0 200 120",
    ops: [
      { t: "p", d: "M20 80 L180 80 L160 100 L40 100 Z" },
      { t: "p", d: "M50 80 L50 45 L90 45 L90 80" },
      { t: "p", d: "M95 80 L95 55 L140 55 L140 80" },
      { t: "p", d: "M10 75 Q 50 65 100 75 T 190 75", dash: true },
    ],
  },
  stamp: {
    viewBox: "0 0 220 140",
    ops: [
      { t: "p", d: "M18 28 L202 28 L202 112 L18 112 Z" },
      { t: "l", x1: 18, y1: 48, x2: 202, y2: 48 },
      { t: "l", x1: 150, y1: 28, x2: 150, y2: 112 },
      { t: "c", x: 175, y: 80, d: 36 },
    ],
  },
  steam: {
    viewBox: "0 0 80 160",
    ops: [
      { t: "p", d: "M20 150 C 10 110, 35 90, 20 50 C 8 20, 30 10, 22 0", dash: true },
      { t: "p", d: "M45 150 C 55 115, 30 95, 48 55 C 60 25, 40 12, 52 0", dash: true },
      { t: "p", d: "M68 150 C 75 120, 55 100, 70 60", dash: true },
    ],
  },
};

export function getStoryDoodle(id) {
  return STORY_DOODLES[id] || STORY_DOODLES.sprout;
}
