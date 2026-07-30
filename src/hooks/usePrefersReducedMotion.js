import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function readPrefersReduced() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  try {
    return window.matchMedia(QUERY).matches;
  } catch {
    return false;
  }
}

/**
 * Returns true when the user has requested reduced motion.
 * Synced from matchMedia on the first render so GSAP/R3F paths never
 * mount-then-unmount on a false → true flip.
 */
export function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(readPrefersReduced);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mql = window.matchMedia(QUERY);
    setPrefersReduced(mql.matches);
    const onChange = (e) => setPrefersReduced(e.matches);
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);

  return prefersReduced;
}
