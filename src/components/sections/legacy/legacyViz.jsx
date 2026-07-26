import { motion } from "motion/react";
import { Sprout, MapPinned, Users } from "lucide-react";
import { cn } from "@/lib/utils";

/** 1998 — stylised regional expansion */
export function RegionalMapViz({ active }) {
  return (
    <div className="relative h-full min-h-[16rem] overflow-hidden rounded-[1.75rem] border border-emerald-400/25 bg-gradient-to-br from-[#0c1410] via-[#0a120e] to-[#07100c] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:min-h-[18rem] sm:p-6 lg:p-7">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-emerald-300/90">
          South India network
        </p>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[0.55rem] font-bold uppercase tracking-[0.12em] text-emerald-200">
          Expanding
        </span>
      </div>
      <svg viewBox="0 0 360 200" className="mt-5 h-auto w-full" aria-hidden="true">
        <ellipse
          cx="180"
          cy="110"
          rx="128"
          ry="74"
          fill="rgba(74,140,70,0.1)"
          stroke="rgba(110,180,120,0.28)"
          strokeWidth="1.25"
        />
        {[
          { x: 150, y: 100, r: 6, label: "AP" },
          { x: 198, y: 82, r: 5, label: "TN" },
          { x: 220, y: 122, r: 5.5, label: "KA" },
          { x: 128, y: 134, r: 4.5, label: "KL" },
          { x: 172, y: 148, r: 4, label: "" },
        ].map((d, i) => (
          <g key={i}>
            {active ? (
              <motion.circle
                cx={d.x}
                cy={d.y}
                r={d.r}
                fill="none"
                stroke="#6ee7b7"
                strokeWidth="1.25"
                animate={{ r: [d.r, d.r + 12], opacity: [0.55, 0] }}
                transition={{ duration: 2.1, repeat: Infinity, delay: i * 0.22 }}
              />
            ) : null}
            <circle cx={d.x} cy={d.y} r={d.r} fill="#34d399" />
            {d.label ? (
              <text
                x={d.x}
                y={d.y - 10}
                textAnchor="middle"
                fill="rgba(209,250,229,0.85)"
                fontSize="9"
                fontWeight="700"
              >
                {d.label}
              </text>
            ) : null}
          </g>
        ))}
        {active ? (
          <motion.path
            d="M150 100 Q 175 70 198 82 Q 215 100 220 122 Q 180 150 128 134"
            fill="none"
            stroke="#6ee7b7"
            strokeWidth="1.75"
            strokeDasharray="5 7"
            animate={{ strokeDashoffset: [0, -24] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
          />
        ) : null}
      </svg>
    </div>
  );
}

const CLUSTER_NODES = [
  { label: "Coastal AP", icon: MapPinned },
  { label: "Rayalaseema", icon: Sprout },
  { label: "Partner hubs", icon: Users },
  { label: "Pack routes", icon: MapPinned },
  { label: "Season lots", icon: Sprout },
  { label: "Quality cells", icon: Users },
];

/** 2010 — partner ecosystem (no empty placeholder tiles) */
export function NetworkViz({ active, stats }) {
  return (
    <div className="relative h-full min-h-[16rem] overflow-hidden rounded-[1.75rem] border border-amber-400/25 bg-gradient-to-br from-[#151008] via-[#120e08] to-[#0c0a06] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:min-h-[18rem] sm:p-6 lg:p-7">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-amber-200/90">
        Partner ecosystem
      </p>

      <ul className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
        {CLUSTER_NODES.map((node, i) => {
          const Icon = node.icon;
          return (
            <motion.li
              key={node.label}
              className="flex items-center gap-2.5 rounded-xl border border-amber-400/20 bg-amber-400/[0.07] px-3 py-2.5"
              initial={false}
              animate={
                active
                  ? { opacity: [0.35, 1], y: [8, 0] }
                  : { opacity: 0.55, y: 0 }
              }
              transition={{ delay: active ? i * 0.05 : 0, duration: 0.4 }}
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-amber-400/15 text-amber-200">
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="text-xs font-semibold text-white/85">{node.label}</span>
            </motion.li>
          );
        })}
      </ul>

      {stats?.length ? (
        <div className="mt-5 grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/10 bg-black/25 px-3.5 py-3"
            >
              <p className="text-2xl font-extrabold tracking-tight text-amber-200 sm:text-3xl">
                {s.display ?? (
                  <>
                    {s.end}
                    {s.suffix}
                  </>
                )}
              </p>
              <p className="mt-1 text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-white/40">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** 2020 — cold-chain */
export function InfraViz({ active }) {
  return (
    <div className="relative h-full min-h-[16rem] overflow-hidden rounded-[1.75rem] border border-sky-400/25 bg-gradient-to-br from-[#060b14] via-[#081220] to-[#0a1524] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:min-h-[18rem] sm:p-6 lg:p-7">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-sky-300/90">
          Cold chain locked
        </p>
        <span className="rounded-full border border-sky-400/40 bg-sky-400/10 px-2.5 py-1 text-[0.55rem] font-bold uppercase tracking-[0.12em] text-sky-300">
          0°–5°C
        </span>
      </div>
      <svg viewBox="0 0 400 140" className="mt-6 h-auto w-full" aria-hidden="true">
        <path
          d="M24 80 C 100 80, 130 42, 200 42 S 300 80, 376 80"
          fill="none"
          stroke="rgba(125,211,252,0.22)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <motion.path
          d="M24 80 C 100 80, 130 42, 200 42 S 300 80, 376 80"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2.75"
          strokeDasharray="8 10"
          strokeLinecap="round"
          initial={false}
          animate={active ? { strokeDashoffset: [0, -72] } : { strokeDashoffset: 0 }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
        />
        {["Farm", "Packhouse", "Port"].map((label, i) => {
          const x = [24, 200, 376][i];
          const y = [80, 42, 80][i];
          return (
            <g key={label}>
              <circle cx={x} cy={y} r="8" fill="#060b14" stroke="#38bdf8" strokeWidth="2" />
              <circle cx={x} cy={y} r="3" fill="#7dd3fc" />
              <text
                x={x}
                y={y + 26}
                textAnchor="middle"
                fill="rgba(186,230,253,0.75)"
                fontSize="11"
                fontWeight="700"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** 2024 — launch routes */
export function LaunchRoutesViz({ active, routes = [] }) {
  return (
    <div className="relative h-full min-h-[16rem] overflow-hidden rounded-[1.75rem] border border-brand-orange-bright/30 bg-gradient-to-br from-[#140d08] via-[#120b07] to-[#0a0806] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:min-h-[18rem] sm:p-6 lg:p-7">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand-orange-bright">
        Export lanes live
      </p>
      <svg viewBox="0 0 400 160" className="mt-4 h-auto w-full" aria-hidden="true">
        <circle cx="70" cy="100" r="12" fill="#ff7a1a" />
        <text
          x="70"
          y="130"
          textAnchor="middle"
          fill="rgba(255,200,150,0.9)"
          fontSize="11"
          fontWeight="800"
        >
          IN
        </text>
        {[
          { x: 200, y: 48 },
          { x: 280, y: 68 },
          { x: 340, y: 96 },
          { x: 300, y: 132 },
        ].map((p, i) => (
          <g key={i}>
            <path
              d={`M82 100 Q ${130 + i * 18} ${38 + i * 12} ${p.x} ${p.y}`}
              fill="none"
              stroke="rgba(255,140,40,0.28)"
              strokeWidth="1.75"
            />
            {active ? (
              <motion.path
                d={`M82 100 Q ${130 + i * 18} ${38 + i * 12} ${p.x} ${p.y}`}
                fill="none"
                stroke="#ff9a40"
                strokeWidth="2"
                strokeDasharray="5 7"
                animate={{ strokeDashoffset: [0, -24] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.12,
                }}
              />
            ) : null}
            <circle cx={p.x} cy={p.y} r="6" fill="#ffb060" />
          </g>
        ))}
      </svg>
      <ul className="mt-2 flex flex-wrap gap-2">
        {routes.map((r, i) => (
          <motion.li
            key={r}
            initial={false}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0.55, y: 6 }}
            transition={{ duration: 0.4, delay: active ? 0.1 + i * 0.06 : 0 }}
            className="rounded-full border border-brand-orange-bright/35 bg-brand-orange-bright/10 px-3 py-1.5 text-xs font-semibold text-orange-100"
          >
            {r}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/** Today — market presence */
export function TodayPresenceViz({ markets = [], className, active = false }) {
  return (
    <div
      className={cn(
        "relative flex h-full min-h-[16rem] flex-col justify-center overflow-hidden rounded-[1.75rem] border border-brand-orange-bright/30 bg-gradient-to-br from-[#120c08] to-[#0a0705] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:min-h-[18rem] sm:p-6 lg:p-7",
        className
      )}
    >
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand-orange-bright">
        Active presence
      </p>
      <ul className="mt-5 flex flex-wrap gap-2.5">
        {markets.map((m, i) => (
          <motion.li
            key={m}
            initial={false}
            animate={
              active
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0.55, y: 8, scale: 0.98 }
            }
            transition={{ duration: 0.45, delay: active ? 0.08 + i * 0.05 : 0 }}
            className={cn(
              "rounded-full border px-3.5 py-2 text-sm font-semibold",
              String(m).toLowerCase().includes("soon")
                ? "border-brand-orange-bright/50 bg-brand-orange-bright/12 text-brand-orange-bright"
                : "border-white/15 bg-white/[0.05] text-white/90"
            )}
          >
            {m}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
