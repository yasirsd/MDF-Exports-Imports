import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/**
 * Arrival visualization. SVG-first climax (never Unsplash).
 * One illustration, like ColdChainViz: skyline + clearance arc + glowing markets.
 * No cramped dual-column list inside the card.
 */
export function ArrivalViz({ active = false, className }) {
  const reduced = usePrefersReducedMotion();
  const animate = active && !reduced;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] border border-brand-orange-bright/20 bg-gradient-to-br from-[#140d08] via-[#1a110b] to-[#0a0705] shadow-[0_0_60px_rgba(255,122,26,0.12)] sm:rounded-[2rem]",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 75% 40%, rgba(255,140,40,0.18), transparent 50%), radial-gradient(ellipse at 20% 70%, rgba(255,160,60,0.07), transparent 45%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,180,100,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,180,100,0.55) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-5 p-5 sm:gap-6 sm:p-7 lg:p-8">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange-bright/40 bg-brand-orange-bright/10 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand-orange-bright">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full bg-brand-orange-bright",
                animate && "animate-pulse"
              )}
            />
            Port arrival · Cleared
          </span>
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white/40">
            Fresh at destination
          </span>
        </div>

        <svg
          viewBox="0 0 640 280"
          className="h-auto w-full"
          role="img"
          aria-label="Export arrival from Andhra Pradesh into Gulf markets"
        >
          <defs>
            <linearGradient id="arrivalSea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,140,40,0.08)" />
              <stop offset="100%" stopColor="rgba(255,140,40,0.02)" />
            </linearGradient>
            <linearGradient id="arrivalArc" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ff7a1a" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#ff9a40" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ff7a1a" stopOpacity="0.35" />
            </linearGradient>
            <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,140,40,0.45)" />
              <stop offset="100%" stopColor="rgba(255,140,40,0)" />
            </radialGradient>
          </defs>

          {/* Horizon sea */}
          <rect x="0" y="168" width="640" height="112" fill="url(#arrivalSea)" />
          <path
            d="M0 168 Q 160 158 320 168 T 640 164 L 640 280 L 0 280 Z"
            fill="rgba(255,122,26,0.04)"
          />

          {/* Soft far glow behind skyline */}
          <ellipse cx="470" cy="150" rx="150" ry="70" fill="url(#hubGlow)" />

          {/* Skyline silhouette */}
          <g fill="#1a120c" stroke="rgba(255,160,80,0.35)" strokeWidth="1.25">
            <rect x="360" y="108" width="28" height="60" rx="2" />
            <rect x="392" y="78" width="34" height="90" rx="2" />
            <rect x="430" y="52" width="40" height="116" rx="2" />
            <path d="M450 52 L450 28 L460 52 Z" />
            <rect x="476" y="88" width="26" height="80" rx="2" />
            <rect x="508" y="68" width="36" height="100" rx="2" />
            <rect x="548" y="98" width="24" height="70" rx="2" />
            <rect x="576" y="118" width="22" height="50" rx="2" />
          </g>
          {/* Window lights */}
          {[
            [398, 95],
            [410, 110],
            [440, 80],
            [452, 100],
            [452, 120],
            [518, 90],
            [530, 110],
            [556, 120],
          ].map(([x, y], i) => (
            <rect
              key={i}
              x={x}
              y={y}
              width="5"
              height="7"
              rx="0.5"
              fill={i % 3 === 0 ? "rgba(255,180,80,0.55)" : "rgba(255,140,40,0.28)"}
            />
          ))}

          {/* Route arc */}
          <path
            d="M80 150 C 180 70, 340 55, 470 120"
            fill="none"
            stroke="rgba(255,140,40,0.18)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <motion.path
            d="M80 150 C 180 70, 340 55, 470 120"
            fill="none"
            stroke="url(#arrivalArc)"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeDasharray="9 11"
            initial={false}
            animate={animate ? { strokeDashoffset: [0, -80] } : { strokeDashoffset: 0 }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
          />

          {/* Origin node */}
          <g>
            <circle cx="80" cy="150" r="16" fill="rgba(255,122,26,0.15)" />
            <circle
              cx="80"
              cy="150"
              r="9"
              fill="#ff7a1a"
              stroke="rgba(255,220,180,0.55)"
              strokeWidth="1.5"
            />
            <text
              x="80"
              y="153.5"
              textAnchor="middle"
              fill="#1a0e06"
              fontSize="8"
              fontWeight="800"
            >
              IN
            </text>
            <text
              x="80"
              y="180"
              textAnchor="middle"
              fill="rgba(255,210,160,0.85)"
              fontSize="11"
              fontWeight="600"
            >
              Andhra
            </text>
          </g>

          {/* Moving cargo pulse */}
          <motion.circle
            r="7"
            cx="100"
            cy="140"
            fill="#ffb060"
            initial={false}
            animate={
              animate
                ? { cx: [100, 220, 360, 450], cy: [140, 85, 75, 115] }
                : { cx: 360, cy: 75 }
            }
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            r="16"
            cx="100"
            cy="140"
            fill="rgba(255,140,40,0.22)"
            initial={false}
            animate={
              animate
                ? { cx: [100, 220, 360, 450], cy: [140, 85, 75, 115] }
                : { cx: 360, cy: 75 }
            }
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Destination hub */}
          <g>
            {animate ? (
              <motion.circle
                cx="470"
                cy="120"
                r="14"
                fill="none"
                stroke="#ff7a1a"
                strokeWidth="1.5"
                style={{ transformOrigin: "470px 120px" }}
                animate={{ scale: [1, 2.3], opacity: [0.55, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            ) : null}
            <circle
              cx="470"
              cy="120"
              r="11"
              fill="#140d08"
              stroke="#ff7a1a"
              strokeWidth="2"
            />
            <circle cx="470" cy="120" r="4" fill="#ffb060" />
            <text
              x="470"
              y="150"
              textAnchor="middle"
              fill="rgba(255,210,160,0.9)"
              fontSize="11"
              fontWeight="700"
            >
              Gulf Hub
            </text>
          </g>

          {/* Market pins */}
          {[
            { x: 400, y: 200, label: "DXB", soon: false },
            { x: 455, y: 210, label: "RUH", soon: false },
            { x: 510, y: 200, label: "DOH", soon: false },
            { x: 565, y: 212, label: "EU", soon: true },
          ].map((p) => (
            <g key={p.label}>
              <circle
                cx={p.x}
                cy={p.y}
                r="11"
                fill={p.soon ? "rgba(255,122,26,0.12)" : "rgba(16,185,129,0.12)"}
                stroke={p.soon ? "#ff7a1a" : "#34d399"}
                strokeWidth="1.5"
                strokeDasharray={p.soon ? "3 3" : undefined}
              />
              <text
                x={p.x}
                y={p.y + 3.5}
                textAnchor="middle"
                fill={p.soon ? "#ffb060" : "#6ee7b7"}
                fontSize="8"
                fontWeight="800"
              >
                {p.label}
              </text>
            </g>
          ))}

          {/* Cleared badge */}
          <g transform="translate(200 208)">
            <rect
              x="0"
              y="0"
              width="120"
              height="32"
              rx="16"
              fill="rgba(20,13,8,0.92)"
              stroke="rgba(255,140,40,0.55)"
              strokeWidth="1.5"
            />
            <circle cx="22" cy="16" r="5" fill="#ff7a1a" />
            <text
              x="68"
              y="20"
              textAnchor="middle"
              fill="#ff9a40"
              fontSize="11"
              fontWeight="800"
              letterSpacing="1.8"
            >
              CLEARED
            </text>
          </g>
        </svg>

        <div className="grid grid-cols-3 gap-2 border-t border-brand-orange-bright/15 pt-4 sm:gap-3">
          {[
            { v: "5+", l: "Gulf markets" },
            { v: "EU", l: "Opening soon" },
            { v: "Fresh", l: "On arrival" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="text-sm font-extrabold text-orange-100 sm:text-base">{s.v}</p>
              <p className="mt-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-white/40">
                {s.l}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
