import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/**
 * Packhouse visualization. SVG-first (never Unsplash).
 * Shows Sort → Pack → Seal with a ventilated crate illustration.
 * Matches ColdChainViz craft level for Chapter 04.
 */
export function PackhouseViz({ active = false, className }) {
  const reduced = usePrefersReducedMotion();
  const animate = active && !reduced;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] border border-white/12 bg-gradient-to-br from-[#121214] via-[#161618] to-[#0a0a0c] shadow-[0_0_60px_rgba(255,122,26,0.1)] sm:rounded-[2rem]",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 35% 30%, rgba(255,122,26,0.12), transparent 50%), radial-gradient(ellipse at 80% 75%, rgba(80,80,90,0.25), transparent 50%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
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
            Packhouse · Live line
          </span>
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white/40">
            Export grade
          </span>
        </div>

        <svg
          viewBox="0 0 640 280"
          className="h-auto w-full"
          role="img"
          aria-label="Packhouse line: sort, pack, and seal ventilated export crates"
        >
          <defs>
            <linearGradient id="packFlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ff7a1a" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#ff9a40" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ff7a1a" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* Conveyor / flow line */}
          <path
            d="M40 200 H600"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <motion.path
            d="M40 200 H600"
            fill="none"
            stroke="url(#packFlow)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="8 10"
            initial={false}
            animate={animate ? { strokeDashoffset: [0, -72] } : { strokeDashoffset: 0 }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
          />

          {/* Station nodes */}
          {[
            { x: 90, label: "Sort" },
            { x: 320, label: "Pack" },
            { x: 550, label: "Seal" },
          ].map((n) => (
            <g key={n.label}>
              <circle cx={n.x} cy="200" r="8" fill="#121214" stroke="#ff7a1a" strokeWidth="2" />
              <circle cx={n.x} cy="200" r="3.5" fill="#ffb060" />
              <text
                x={n.x}
                y="228"
                textAnchor="middle"
                fill="rgba(255,200,150,0.8)"
                fontSize="12"
                fontWeight="700"
              >
                {n.label}
              </text>
            </g>
          ))}

          {/* Ventilated crate illustration */}
          <g transform="translate(210, 36)">
            <rect
              x="0"
              y="16"
              width="220"
              height="110"
              rx="8"
              fill="#1a1a1e"
              stroke="rgba(255,140,40,0.45)"
              strokeWidth="1.75"
            />
            {/* Crate slats */}
            {[18, 48, 78, 108, 138, 168, 198].map((x) => (
              <line
                key={x}
                x1={x}
                y1="22"
                x2={x}
                y2="120"
                stroke="rgba(255,160,80,0.18)"
                strokeWidth="1.25"
              />
            ))}
            {/* Vent slots */}
            {[32, 58, 84].map((y) => (
              <rect
                key={y}
                x="14"
                y={y}
                width="192"
                height="6"
                rx="2"
                fill="rgba(255,122,26,0.12)"
              />
            ))}
            <rect
              x="12"
              y="28"
              width="72"
              height="22"
              rx="4"
              fill="rgba(255,122,26,0.15)"
            />
            <text x="20" y="43" fill="#ff9a40" fontSize="11" fontWeight="800">
              MDF CRATE
            </text>
            {/* Produce dots inside */}
            {[
              [110, 48],
              [130, 55],
              [150, 46],
              [170, 58],
              [120, 72],
              [145, 78],
              [165, 70],
            ].map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="7"
                fill={i % 2 === 0 ? "rgba(255,122,26,0.55)" : "rgba(74,180,90,0.45)"}
              />
            ))}
            {/* Lot seal */}
            <g transform="translate(150, 92)">
              <rect
                x="0"
                y="0"
                width="56"
                height="20"
                rx="4"
                fill="#0a0a0c"
                stroke="#ff7a1a"
                strokeWidth="1.25"
              />
              <text
                x="28"
                y="14"
                textAnchor="middle"
                fill="#ffb060"
                fontSize="9"
                fontWeight="800"
              >
                LOT ID
              </text>
            </g>
          </g>

          {/* Moving pack marker */}
          <motion.g
            initial={false}
            animate={animate ? { x: [70, 300, 530, 70] } : { x: 300 }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <rect
              x="0"
              y="168"
              width="36"
              height="24"
              rx="3"
              fill="#1a1a1e"
              stroke="#ff7a1a"
              strokeWidth="1.5"
            />
            <circle cx="10" cy="196" r="5" fill="#2a2a30" stroke="#ff9a40" strokeWidth="1" />
            <circle cx="26" cy="196" r="5" fill="#2a2a30" stroke="#ff9a40" strokeWidth="1" />
          </motion.g>
        </svg>

        <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4 sm:gap-3">
          {[
            { v: "Sort", l: "Grade & reject" },
            { v: "Pack", l: "Ventilated crate" },
            { v: "Seal", l: "Label & lot ID" },
          ].map((s) => (
            <div key={s.v} className="text-center">
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
