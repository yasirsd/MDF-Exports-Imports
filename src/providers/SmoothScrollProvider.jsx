import { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext(null);

export function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);
  const [lenis, setLenis] = useState(null);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReduced) return undefined;

    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    lenisRef.current = instance;
    setLenis(instance);

    instance.on("scroll", ScrollTrigger.update);

    const onRaf = (time) => instance.raf(time * 1000);
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    // Keep pinned/scrubbed triggers aligned as async content (lazy sections,
    // images, fonts) changes the document height after initial layout.
    let refreshTimer;
    const scheduleRefresh = () => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 180);
    };

    window.addEventListener("load", scheduleRefresh);
    window.addEventListener("ut:media-loaded", scheduleRefresh);

    const ro = new ResizeObserver(scheduleRefresh);
    ro.observe(document.body);

    if (document.fonts?.ready) {
      document.fonts.ready.then(scheduleRefresh).catch(() => {});
    }

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener("load", scheduleRefresh);
      window.removeEventListener("ut:media-loaded", scheduleRefresh);
      ro.disconnect();
      gsap.ticker.remove(onRaf);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, [prefersReduced]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

/** Access the active Lenis instance (null when reduced motion / not ready). */
export function useLenis() {
  return useContext(LenisContext);
}

/** Programmatic smooth scroll to an element or offset, with native fallback. */
export function useScrollTo() {
  const lenis = useLenis();
  return (target, options = {}) => {
    if (lenis) {
      lenis.scrollTo(target, { offset: -80, duration: 1.2, ...options });
    } else if (typeof target === "string") {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (typeof window !== "undefined") {
      window.scrollTo({ top: target, behavior: "smooth" });
    }
  };
}
