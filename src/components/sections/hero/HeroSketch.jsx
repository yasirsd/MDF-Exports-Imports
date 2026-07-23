import { RoughSketch } from "@/components/shared/RoughSketch";

/**
 * The hero's hand-drawn "export journey": a shipping/flight route that draws
 * itself across the scene, a plane at its leading tip, and a couple of sketched
 * export objects (origin ship, cargo container, compass) that draw in on load
 * and then gently boil. Orange ink, ambient, sits behind the copy.
 */

const OPS = {
  routeArc: {
    viewBox: "0 0 300 150",
    ops: [
      { t: "p", d: "M10 128 C 80 12, 210 12, 288 78" },
      { t: "c", x: 10, y: 128, d: 9, fill: true },
      { t: "c", x: 288, y: 78, d: 9, fill: true },
    ],
  },
  plane: {
    viewBox: "0 0 90 80",
    ops: [{ t: "p", d: "M6 40 L74 12 L52 40 L74 68 Z" }],
  },
  ship: {
    viewBox: "0 0 150 118",
    ops: [
      { t: "p", d: "M20 66 H124 L108 92 H36 Z" },
      { t: "p", d: "M72 66 V26" },
      { t: "p", d: "M72 31 L104 62 H72 Z" },
      { t: "p", d: "M10 104 q10 -11 20 0 t20 0 t20 0 t20 0 t20 0", dash: true },
    ],
  },
  container: {
    viewBox: "0 0 130 84",
    ops: [
      { t: "p", d: "M10 20 H120 V64 H10 Z" },
      { t: "p", d: "M30 20 V64" },
      { t: "p", d: "M50 20 V64" },
      { t: "p", d: "M70 20 V64" },
      { t: "p", d: "M90 20 V64" },
      { t: "p", d: "M110 20 V64" },
    ],
  },
  compass: {
    viewBox: "0 0 100 100",
    ops: [
      { t: "c", x: 50, y: 50, d: 86 },
      { t: "p", d: "M24 50 L50 41 L76 50 L50 59 Z" },
      { t: "p", d: "M50 24 L59 50 L50 76 L41 50 Z", fill: true },
    ],
  },
};

const PLACEMENTS = [
  { key: "routeArc", style: { top: "13%", right: "1%", width: 560, height: 280 }, seed: 12, delay: 200, dur: 1300, boil: false },
  { key: "plane", style: { top: "9%", right: "5%", width: 76, height: 68 }, seed: 5, delay: 1300, dur: 700, boil: true },
  { key: "ship", style: { bottom: "15%", left: "2%", width: 156, height: 122 }, seed: 22, delay: 500, dur: 1000, boil: true },
  { key: "container", style: { top: "18%", left: "4%", width: 126, height: 82 }, seed: 31, delay: 850, dur: 900, boil: true },
  { key: "compass", style: { bottom: "12%", right: "9%", width: 88, height: 88 }, seed: 44, delay: 1050, dur: 900, boil: true },
];

export function HeroSketch({ reduced = false }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[4] hidden text-brand-orange-bright sm:block"
    >
      {PLACEMENTS.map((p, i) => {
        const motif = OPS[p.key];
        return (
          <div
            key={i}
            className="absolute"
            style={{ ...p.style, opacity: p.key === "routeArc" ? 0.5 : 0.62 }}
          >
            <RoughSketch
              ops={motif.ops}
              viewBox={motif.viewBox}
              strokeWidth={1.7}
              roughness={1.5}
              bowing={1.2}
              seed={p.seed}
              trigger="mount"
              drawDelay={p.delay}
              drawDuration={p.dur}
              stagger={90}
              boil={p.boil}
              reduced={reduced}
              preserve="xMidYMid meet"
            />
          </div>
        );
      })}
    </div>
  );
}
