import { useState, useRef, useEffect } from "react";
import { site } from "@/lib/config";
import { cn } from "@/lib/utils";

/**
 * Lazy, optimised image with blur-up placeholder and a graceful branded
 * gradient fallback if the source fails to load.
 *
 * LQIP is unmounted once loaded (not only opacity-0) so a CSS specificity
 * leak cannot leave blur(24px) painted over the real photo.
 */
export function LazyImage({
  src,
  srcSet,
  sizes,
  lqip,
  alt,
  className,
  imgClassName,
  fallbackLabel,
  eager = false,
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const imgRef = useRef(null);

  // Notify the smooth-scroll provider so pinned ScrollTriggers recompute
  // once late-loading images change layout height.
  const notifyLayoutChange = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("ut:media-loaded"));
    }
  };

  const markLoaded = () => {
    setLoaded((prev) => {
      if (!prev) notifyLayoutChange();
      return true;
    });
  };

  // Cached / prerendered images may already be complete before onLoad binds.
  useEffect(() => {
    const img = imgRef.current;
    if (!img || errored) return;
    if (img.complete && img.naturalWidth > 0) {
      markLoaded();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-check when src changes
  }, [src, srcSet, errored]);

  return (
    <div className={cn("relative overflow-hidden bg-surface-2", className)}>
      {lqip && !errored && !loaded ? (
        <img
          src={lqip}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-105 object-cover blur-xl"
        />
      ) : null}

      {errored ? (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-brand-red/12 via-surface-2 to-brand-gold/12">
          <span
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(currentColor 1px, transparent 1px)",
              backgroundSize: "14px 14px",
              color: "#111",
            }}
          />
          <div className="relative flex flex-col items-center gap-3 px-4 text-center">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#111] text-xs font-extrabold tracking-tight text-white shadow-soft dark:bg-white dark:text-[#111]">
              {site.logo}
            </span>
            {fallbackLabel ? (
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {fallbackLabel}
              </span>
            ) : null}
          </div>
        </div>
      ) : (
        <img
          ref={imgRef}
          src={src}
          srcSet={srcSet}
          sizes={srcSet ? sizes || "100vw" : undefined}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={eager ? "high" : "auto"}
          onLoad={markLoaded}
          onError={() => {
            setErrored(true);
            notifyLayoutChange();
          }}
          className={cn(
            "h-full w-full object-cover transition-[opacity,transform] duration-700 ease-premium",
            loaded ? "opacity-100" : "opacity-0",
            imgClassName
          )}
          {...props}
        />
      )}
    </div>
  );
}
