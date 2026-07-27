import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { origin, markets } from "@/lib/constants";

const MAP_W = 600;
const MAP_H = 300;
const MASK_SRC = "/textures/earth-water-mask.jpg";

/** Equirectangular projection into the MAP_W x MAP_H viewport. */
const project = (lat, lng) => ({
  x: ((lng + 180) / 360) * MAP_W,
  y: ((90 - lat) / 180) * MAP_H,
});

/** Quadratic arc string that always bows upward (like a shipping lane). */
function arcPath(from, to) {
  const a = project(from.lat, from.lng);
  const b = project(to.lat, to.lng);
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const lift = Math.abs(b.x - a.x) * 0.32 + 24;
  return { d: `M${a.x},${a.y} Q${mx},${my - lift} ${b.x},${b.y}`, a, b };
}

const EUROPE = { name: "Europe", lat: 51, lng: 9, status: "future" };
const ARC_TARGETS = [
  ...markets.filter((m) => ["Dubai", "Riyadh", "Kuwait City"].includes(m.name)),
  EUROPE,
];

export function WorldRoutes({ reduced = false }) {
  const canvasRef = useRef(null);
  const [failed, setFailed] = useState(false);

  const routes = useMemo(
    () =>
      ARC_TARGETS.map((t) => ({
        ...arcPath(origin, t),
        future: t.status === "future",
        name: t.name,
      })),
    []
  );

  const originPt = useMemo(() => project(origin.lat, origin.lng), []);
  const europePt = useMemo(() => project(EUROPE.lat, EUROPE.lng), []);
  const dubaiPt = useMemo(() => {
    const d = markets.find((m) => m.name === "Dubai") || markets[0];
    return project(d.lat, d.lng);
  }, []);

  // Sample the land mask into a dotted map on a canvas (cheap, no per-dot data).
  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = MASK_SRC;

    img.onload = () => {
      if (cancelled) return;
      try {
        const sw = 220;
        const sh = 110;
        const off = document.createElement("canvas");
        off.width = sw;
        off.height = sh;
        const octx = off.getContext("2d", { willReadFrequently: true });
        octx.drawImage(img, 0, 0, sw, sh);
        const { data } = octx.getImageData(0, 0, sw, sh);

        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = MAP_W;
        canvas.height = MAP_H;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, MAP_W, MAP_H);

        const step = 2;
        for (let sy = 0; sy < sh; sy += step) {
          const lat = 90 - (sy / sh) * 180;
          if (lat < -56 || lat > 83) continue; // trim Antarctica / far Arctic
          for (let sx = 0; sx < sw; sx += step) {
            const i = (sy * sw + sx) * 4;
            const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
            if (lum < 110) {
              // land = dark in this mask
              const px = (sx / sw) * MAP_W;
              const py = (sy / sh) * MAP_H;
              ctx.beginPath();
              ctx.arc(px, py, 1.1, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(255,255,255,0.18)";
              ctx.fill();
            }
          }
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    };
    img.onerror = () => {
      if (!cancelled) setFailed(true);
    };

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-[2rem] border border-white/12 bg-[#0a1420] shadow-soft-lg">
      <div className="relative aspect-[2/1] w-full">
        {/* Regional glow behind the India -> Gulf corridor */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(40% 55% at 66% 52%, rgba(249,115,22,0.16), transparent 70%)",
          }}
        />

        {/* Soft ocean plane — never load the 1.4MB marble as fallback */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 45%, #163a5c 0%, #0c1e30 55%, #071018 100%)",
          }}
        />

        {/* Dotted continents from compressed land mask */}
        {!failed ? (
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        ) : null}

        {/* Routes + markers */}
        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          fill="none"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Shipping routes from India to the Gulf and Europe"
        >
          {routes.map((r, i) => {
            const color = r.future ? "#f97316" : "#ef233c";
            return (
              <g key={r.name}>
                <path d={r.d} stroke={color} strokeWidth="1" opacity="0.28" />
                <motion.path
                  d={r.d}
                  stroke={color}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeDasharray={r.future ? "2 7" : "5 9"}
                  {...(reduced
                    ? { strokeDasharray: r.future ? "2 7" : undefined, opacity: 0.85 }
                    : {
                        animate: { strokeDashoffset: [0, -56] },
                        transition: {
                          duration: 3 + i * 0.4,
                          repeat: Infinity,
                          ease: "linear",
                        },
                      })}
                />
              </g>
            );
          })}

          {/* Destination markers */}
          {markets.map((m) => {
            const p = project(m.lat, m.lng);
            return (
              <circle key={m.name} cx={p.x} cy={p.y} r="2.6" fill="#22C55E">
                <title>{`${m.name}, ${m.country}`}</title>
              </circle>
            );
          })}

          {/* Europe expansion marker */}
          <circle cx={europePt.x} cy={europePt.y} r="3" fill="#f97316">
            <title>Europe (expansion)</title>
          </circle>

          {/* Origin marker with pulse */}
          {!reduced && (
            <motion.circle
              cx={originPt.x}
              cy={originPt.y}
              r="4"
              fill="none"
              stroke="#f97316"
              strokeWidth="1.5"
              animate={{ r: [4, 15], opacity: [0.6, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <circle cx={originPt.x} cy={originPt.y} r="4.2" fill="#f97316">
            <title>{`${origin.name}, ${origin.country} (origin)`}</title>
          </circle>

          {/* Labels */}
          <text x={originPt.x - 6} y={originPt.y + 16} fontSize="11" fontWeight="700" textAnchor="end" fill="rgba(255,255,255,0.85)">
            India
          </text>
          <text x={dubaiPt.x} y={dubaiPt.y + 18} fontSize="10" fontWeight="600" textAnchor="middle" fill="rgba(255,255,255,0.7)">
            Gulf
          </text>
          <text x={europePt.x} y={europePt.y - 8} fontSize="10" fontWeight="600" textAnchor="middle" fill="rgba(249,115,22,0.9)">
            Europe
          </text>
        </svg>

        {/* Title */}
        <div className="absolute left-5 top-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
            Global Export Network
          </p>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-5 flex items-center gap-4 text-[11px] text-white/70">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-brand-red" aria-hidden="true" />
            <span>Active lanes</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-brand-orange" aria-hidden="true" />
            <span>Expansion</span>
          </span>
        </div>
      </div>
    </div>
  );
}
