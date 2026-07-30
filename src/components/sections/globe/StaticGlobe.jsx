/** Lightweight static Earth. Safe to show before the WorldMap chunk loads. */
export function StaticGlobe({ priority = "auto", className = "", loading = "lazy" }) {
  return (
    <div className={`grid h-full w-full place-items-center ${className}`.trim()}>
      <div className="relative aspect-square w-full max-w-md overflow-visible">
        <img
          src="/textures/earth-blue-marble.jpg"
          alt="World map highlighting MDF Exports & Imports export markets"
          decoding="async"
          loading={loading}
          fetchpriority={priority}
          className="h-full w-full scale-[1.15] object-cover"
          style={{
            objectPosition: "62% 42%",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 50%, #000 58%, transparent 72%)",
            maskImage:
              "radial-gradient(circle at 50% 50%, #000 58%, transparent 72%)",
          }}
        />
        <span
          className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gold shadow-[0_0_12px_rgba(253,197,0,0.55)]"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

/** Suspense / DeferMount shell that keeps the markets globe slot non-empty. */
export function MarketsGlobeShell({ className = "min-h-[100vh]" }) {
  return (
    <div
      className={`grid place-items-center px-4 py-16 ${className}`.trim()}
      aria-hidden="true"
      data-globe-shell=""
    >
      <div className="h-[min(88vw,34rem)] w-full max-w-md sm:h-[min(80vw,38rem)]">
        <StaticGlobe priority="low" loading="lazy" />
      </div>
    </div>
  );
}
