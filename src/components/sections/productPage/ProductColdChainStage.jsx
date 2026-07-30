import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

const ACCENT_STROKE = {
  sky: { stroke: "#38bdf8", fill: "#1e3a5f", held: "#7dd3fc", soft: "rgba(56,189,248,0.35)" },
  rose: { stroke: "#fb7185", fill: "#4c0519", held: "#fda4af", soft: "rgba(251,113,133,0.35)" },
};

/**
 * Shared CSS SVG cold-chain stage. Extracted from Apple/Pom.
 * props: accent ('sky'|'rose'), tempLabel, nodes?, steps[{n,title,desc}]
 */
export function ProductColdChainStage({
  accent = "sky",
  tempLabel = "0–4°C",
  title = "Cold chain hold",
  steps = [],
  className,
}) {
  const prefersReduced = usePrefersReducedMotion();
  const c = ACCENT_STROKE[accent] || ACCENT_STROKE.sky;
  const panel =
    accent === "rose"
      ? "border-rose-400/20 bg-rose-400/[0.05]"
      : "border-sky-400/20 bg-sky-400/[0.05]";
  const stepBorder =
    accent === "rose" ? "border-rose-400/15 bg-rose-400/[0.05]" : "border-sky-400/15 bg-sky-400/[0.05]";
  const stepN = accent === "rose" ? "text-rose-300/70" : "text-sky-300/70";
  const stepTitle = accent === "rose" ? "text-rose-100" : "text-sky-100";
  const stepDesc = accent === "rose" ? "text-rose-200/45" : "text-sky-200/45";

  return (
    <div className={cn("relative", className)}>
      <div className={cn("overflow-hidden rounded-2xl border p-5 sm:p-6", panel)}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <p
            className={cn(
              "text-[0.55rem] font-bold uppercase tracking-[0.16em]",
              accent === "rose" ? "text-rose-300/80" : "text-sky-300/80"
            )}
          >
            {title}
          </p>
          <p
            className={cn(
              "rounded-full border px-2.5 py-1 text-[0.65rem] font-bold tabular-nums",
              accent === "rose"
                ? "border-rose-400/30 text-rose-200"
                : "border-sky-400/30 text-sky-200"
            )}
          >
            {tempLabel}
          </p>
        </div>

        <svg
          viewBox="0 0 200 120"
          className="mx-auto h-auto w-full max-w-sm"
          aria-hidden="true"
        >
          {!prefersReduced ? (
            <style>{`
              @keyframes pc-pulse {
                0%, 100% { opacity: 0.35; }
                50% { opacity: 1; }
              }
              @keyframes pc-flow {
                0% { stroke-dashoffset: 24; }
                100% { stroke-dashoffset: 0; }
              }
              .pc-pulse { animation: pc-pulse 2.4s ease-in-out infinite; }
              .pc-flow { stroke-dasharray: 6 6; animation: pc-flow 1.8s linear infinite; }
            `}</style>
          ) : null}
          <defs>
            <linearGradient id={`pc-grad-${accent}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={c.stroke} stopOpacity="0.15" />
              <stop offset="50%" stopColor={c.stroke} stopOpacity="0.55" />
              <stop offset="100%" stopColor={c.stroke} stopOpacity="0.15" />
            </linearGradient>
          </defs>
          {/* Reefer body */}
          <rect
            x="28"
            y="28"
            width="144"
            height="56"
            rx="8"
            fill={c.fill}
            stroke={c.stroke}
            strokeWidth="1.5"
            opacity="0.85"
          />
          <rect
            x="36"
            y="36"
            width="128"
            height="40"
            rx="4"
            fill={`url(#pc-grad-${accent})`}
            className={prefersReduced ? undefined : "pc-pulse"}
          />
          {/* Flow line */}
          <path
            d="M20 100 H180"
            fill="none"
            stroke={c.soft}
            strokeWidth="2"
            strokeLinecap="round"
            className={prefersReduced ? undefined : "pc-flow"}
          />
          <text
            x="100"
            y="80"
            textAnchor="middle"
            fill={c.held}
            fontSize="9"
            fontWeight="700"
          >
            Held
          </text>
          <circle cx="36" cy="100" r="8" fill={c.fill} stroke={c.stroke} strokeWidth="1" />
          <circle cx="164" cy="100" r="8" fill={c.fill} stroke={c.stroke} strokeWidth="1" />
        </svg>

        {steps.length > 0 ? (
          <ol
            className={cn(
              "mt-4 grid gap-2 border-t pt-4",
              accent === "rose" ? "border-rose-400/15" : "border-sky-400/15",
              steps.length >= 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-3"
            )}
          >
            {steps.map((s) => (
              <li
                key={s.n || s.title}
                className={cn("rounded-xl border px-3 py-3 text-center", stepBorder)}
              >
                <p className={cn("text-[0.55rem] font-bold uppercase tracking-[0.14em]", stepN)}>
                  {s.n}
                </p>
                <p className={cn("mt-1 text-sm font-extrabold", stepTitle)}>{s.title}</p>
                {s.desc ? (
                  <p className={cn("mt-0.5 text-[0.65rem]", stepDesc)}>{s.desc}</p>
                ) : null}
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </div>
  );
}
