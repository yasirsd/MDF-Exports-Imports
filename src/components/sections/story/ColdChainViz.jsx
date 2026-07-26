import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/**
 * SVG-first cold-chain visualization.
 * Never depends on Unsplash — always looks complete.
 * Shows reefer container, temperature gauge, and animated route.
 */
export function ColdChainViz({ active = false, className }) {
  const reduced = usePrefersReducedMotion();
  const animate = active && !reduced;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] border border-sky-400/20 bg-gradient-to-br from-[#0a1628] via-[#0c1a30] to-[#061018] shadow-[0_0_60px_rgba(56,160,220,0.12)] sm:rounded-[2rem]",
        className
      )}
    >
      {/* Icy atmosphere */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(56,180,240,0.15), transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(20,80,140,0.2), transparent 50%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(180,220,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(180,220,255,0.4) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-6 p-5 sm:p-7 lg:p-8">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-400/10 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-sky-300">
            <span
              className={cn("h-1.5 w-1.5 rounded-full bg-sky-300", animate && "animate-pulse")}
            />
            Live reefer · 0°–5°C
          </span>
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-sky-200/50">
            Cold chain locked
          </span>
        </div>

        <svg
          viewBox="0 0 640 280"
          className="h-auto w-full"
          role="img"
          aria-label="Animated refrigerated container on an export cold-chain route"
        >
          {/* Route line */}
          <path
            d="M40 200 C 140 200, 180 120, 280 120 S 400 200, 520 160 L 600 160"
            fill="none"
            stroke="rgba(120,190,255,0.2)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <motion.path
            d="M40 200 C 140 200, 180 120, 280 120 S 400 200, 520 160 L 600 160"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="8 10"
            initial={false}
            animate={animate ? { strokeDashoffset: [0, -72] } : { strokeDashoffset: 0 }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
          />

          {/* Nodes */}
          {[
            { x: 40, y: 200, label: "Packhouse" },
            { x: 280, y: 120, label: "Port" },
            { x: 520, y: 160, label: "Gulf" },
          ].map((n) => (
            <g key={n.label}>
              <circle cx={n.x} cy={n.y} r="7" fill="#0a1628" stroke="#38bdf8" strokeWidth="2" />
              <circle cx={n.x} cy={n.y} r="3" fill="#7dd3fc" />
              <text
                x={n.x}
                y={n.y + 24}
                textAnchor="middle"
                fill="rgba(186,230,253,0.75)"
                fontSize="11"
                fontWeight="600"
              >
                {n.label}
              </text>
            </g>
          ))}

          {/* Reefer container illustration */}
          <g transform="translate(170, 28)">
            <rect
              x="0"
              y="20"
              width="200"
              height="72"
              rx="6"
              fill="#0f2744"
              stroke="#38bdf8"
              strokeWidth="1.5"
              opacity="0.95"
            />
            {/* Container ribs */}
            {[28, 56, 84, 112, 140, 168].map((x) => (
              <line
                key={x}
                x1={x}
                y1="22"
                x2={x}
                y2="90"
                stroke="rgba(125,211,252,0.25)"
                strokeWidth="1"
              />
            ))}
            <rect x="8" y="32" width="52" height="20" rx="3" fill="rgba(56,189,248,0.15)" />
            <text x="14" y="46" fill="#7dd3fc" fontSize="10" fontWeight="700">
              REEFER
            </text>
            {/* Temp dial */}
            <circle cx="168" cy="56" r="18" fill="#061018" stroke="#38bdf8" strokeWidth="1.5" />
            <motion.g
              style={{ transformOrigin: "168px 56px" }}
              animate={animate ? { rotate: [0, 18, -8, 0] } : { rotate: 0 }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <line x1="168" y1="56" x2="168" y2="42" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
            </motion.g>
            <text x="168" y="80" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontWeight="700">
              2°C
            </text>
            {/* Wheels */}
            <circle cx="36" cy="100" r="8" fill="#1e3a5f" stroke="#38bdf8" strokeWidth="1" />
            <circle cx="164" cy="100" r="8" fill="#1e3a5f" stroke="#38bdf8" strokeWidth="1" />
          </g>
        </svg>

        <div className="grid grid-cols-3 gap-2 border-t border-sky-400/15 pt-4 sm:gap-3">
          {[
            { v: "0°–5°C", l: "Locked range" },
            { v: "24/7", l: "Monitoring" },
            { v: "GCC", l: "Active lanes" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="text-sm font-extrabold text-sky-200 sm:text-base">{s.v}</p>
              <p className="mt-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-sky-200/45">
                {s.l}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
