import { useEffect, useRef, useState } from "react";
import { isPrerender } from "@/lib/prerender";
import { cn } from "@/lib/utils";

function normalizeTarget(target) {
  if (!target || typeof target !== "string") return "";
  return target.startsWith("#") ? target.slice(1) : target;
}

/**
 * Mount children only when the placeholder nears the viewport.
 * Keeps CLS-stable min-height until then so lazy chunks don't fetch all at once.
 *
 * `id` stays on the wrapper at all times so nav / hash links resolve even before
 * the section chunk mounts. Nav clicks dispatch `ut:ensure-section` to force mount.
 * Build-time prerender sets `window.__PRERENDER__` and/or dispatches
 * `ut:ensure-section` with `target: "*"` so every section mounts for HTML capture.
 */
export function DeferMount({
  id,
  children,
  className,
  minH = "min-h-[80vh]",
  rootMargin = "400px 0px",
  /** If true, mount on first idle after paint (for near-fold sections). */
  eagerIdle = false,
  /** Shown before mount so critical slots (e.g. markets globe) are never blank. */
  placeholder = null,
}) {
  const ref = useRef(null);
  const [ready, setReady] = useState(() => isPrerender());

  useEffect(() => {
    if (ready) return undefined;

    const forceReady = () => setReady(true);

    const onEnsure = (event) => {
      const target = normalizeTarget(event?.detail?.target);
      if (target === "*" || target === "__all__" || (id && target === id)) {
        forceReady();
      }
    };

    const onHash = () => {
      if (id && normalizeTarget(window.location.hash) === id) forceReady();
    };

    window.addEventListener("ut:ensure-section", onEnsure);
    window.addEventListener("hashchange", onHash);
    onHash();

    if (eagerIdle) {
      const ric = window.requestIdleCallback;
      const idleId = ric
        ? ric(forceReady, { timeout: 1200 })
        : window.setTimeout(forceReady, 200);
      return () => {
        window.removeEventListener("ut:ensure-section", onEnsure);
        window.removeEventListener("hashchange", onHash);
        if (ric) window.cancelIdleCallback?.(idleId);
        else clearTimeout(idleId);
      };
    }

    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      forceReady();
      return () => {
        window.removeEventListener("ut:ensure-section", onEnsure);
        window.removeEventListener("hashchange", onHash);
      };
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          forceReady();
          io.disconnect();
        }
      },
      { root: null, rootMargin, threshold: 0.01 }
    );
    io.observe(el);

    return () => {
      window.removeEventListener("ut:ensure-section", onEnsure);
      window.removeEventListener("hashchange", onHash);
      io.disconnect();
    };
  }, [ready, eagerIdle, rootMargin, id]);

  return (
    <div
      id={id}
      ref={ref}
      className={cn(!ready && minH, className)}
      style={
        ready
          ? undefined
          : {
              contentVisibility: "auto",
              containIntrinsicSize: "1px 80vh",
            }
      }
    >
      {ready ? children : placeholder}
    </div>
  );
}
