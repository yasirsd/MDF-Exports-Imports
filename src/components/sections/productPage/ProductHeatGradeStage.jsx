import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/**
 * Guntur-only heat / colour / grade CSS viz — not a reefer clone.
 * Language: colour depth, heat band, clean lot — CSS loops only.
 */
export function ProductHeatGradeStage({
  className,
  title = "Colour · Heat · Clean lot",
  tiers = ["Deluxe", "Best", "Medium Best"],
}) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div className={cn("relative", className)}>
      <div className="overflow-hidden rounded-2xl border border-brand-orange/25 bg-brand-orange/[0.05] p-5 sm:p-6">
        <p className="mb-5 text-[0.55rem] font-bold uppercase tracking-[0.16em] text-brand-orange-bright">
          {title}
        </p>

        <svg
          viewBox="0 0 220 130"
          className="mx-auto h-auto w-full max-w-sm"
          aria-hidden="true"
        >
          {!prefersReduced ? (
            <style>{`
              @keyframes hg-glow {
                0%, 100% { opacity: 0.45; }
                50% { opacity: 1; }
              }
              @keyframes hg-rise {
                0%, 100% { transform: scaleY(0.72); }
                50% { transform: scaleY(1); }
              }
              .hg-glow { animation: hg-glow 2.6s ease-in-out infinite; }
              .hg-bar { transform-origin: bottom center; animation: hg-rise 2.8s ease-in-out infinite; }
              .hg-bar-2 { animation-delay: 0.35s; }
              .hg-bar-3 { animation-delay: 0.7s; }
            `}</style>
          ) : null}

          <defs>
            <linearGradient id="hg-heat" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#7c2d12" />
              <stop offset="45%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <linearGradient id="hg-colour" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7f1d1d" />
              <stop offset="50%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>

          {/* Colour band */}
          <rect
            x="16"
            y="18"
            width="188"
            height="14"
            rx="7"
            fill="url(#hg-colour)"
            className={prefersReduced ? undefined : "hg-glow"}
            opacity="0.9"
          />
          <text x="110" y="12" textAnchor="middle" fill="rgba(255,200,160,0.7)" fontSize="8" fontWeight="700">
            COLOUR DEPTH
          </text>

          {/* Heat bars */}
          <g transform="translate(40, 48)">
            <rect
              x="0"
              y="20"
              width="28"
              height="48"
              rx="4"
              fill="url(#hg-heat)"
              className={prefersReduced ? undefined : "hg-bar"}
              opacity="0.85"
            />
            <rect
              x="48"
              y="8"
              width="28"
              height="60"
              rx="4"
              fill="url(#hg-heat)"
              className={prefersReduced ? undefined : "hg-bar hg-bar-2"}
              opacity="0.95"
            />
            <rect
              x="96"
              y="28"
              width="28"
              height="40"
              rx="4"
              fill="url(#hg-heat)"
              className={prefersReduced ? undefined : "hg-bar hg-bar-3"}
              opacity="0.75"
            />
            <text x="62" y="82" textAnchor="middle" fill="rgba(255,180,100,0.75)" fontSize="8" fontWeight="700">
              HEAT BAND
            </text>
          </g>

          {/* Clean lot mark */}
          <circle
            cx="190"
            cy="78"
            r="16"
            fill="rgba(34,197,94,0.12)"
            stroke="#4ade80"
            strokeWidth="1.5"
            className={prefersReduced ? undefined : "hg-glow"}
          />
          <path
            d="M182 78 L188 84 L200 70"
            fill="none"
            stroke="#4ade80"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="190" y="108" textAnchor="middle" fill="rgba(134,239,172,0.7)" fontSize="7" fontWeight="700">
            CLEAN
          </text>
        </svg>

        <ol className="mt-5 grid grid-cols-3 gap-2 border-t border-brand-orange/15 pt-4">
          {tiers.map((t, i) => (
            <li
              key={t}
              className="rounded-xl border border-brand-orange/20 bg-brand-orange/[0.06] px-2 py-3 text-center"
            >
              <p className="text-[0.55rem] font-bold uppercase tracking-[0.14em] text-brand-orange-bright/70">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mt-1 text-sm font-extrabold text-orange-100">{t}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
