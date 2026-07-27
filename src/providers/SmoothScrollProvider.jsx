import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { bindDocumentScroll } from "@/lib/documentScroll";

const LenisContext = createContext(null);

function isCoarsePointer() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

function scheduleIdle(fn, timeout = 900) {
  const ric = typeof window !== "undefined" ? window.requestIdleCallback : null;
  if (ric) {
    const id = ric(fn, { timeout });
    return () => window.cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(fn, 120);
  return () => clearTimeout(id);
}

function normalizeTarget(target) {
  if (!target || typeof target !== "string") return "";
  return target.startsWith("#") ? target.slice(1) : target;
}

/** Sections that need ScrollTrigger soon after mount / nav. */
const ST_SECTION_IDS = new Set(["story", "about", "process"]);

export function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);
  const [lenis, setLenis] = useState(null);
  const prefersReduced = usePrefersReducedMotion();
  const storyLockedRef = useRef(false);

  useEffect(() => {
    if (prefersReduced) return undefined;

    let cancelled = false;
    let instance = null;
    let nativeRafId = 0;
    let onGsapRaf = null;
    let gsapMod = null;
    let ScrollTrigger = null;
    let gsapReady = false;
    let gsapLoading = false;
    let refreshTimer;
    let mediaTimer;
    let pendingRefresh = false;
    let cleanupIdle = () => {};
    let storyIo = null;

    const scheduleRefresh = () => {
      if (!ScrollTrigger) return;
      // Defer layout refresh while Story Observer owns scroll — but do not drop it.
      if (storyLockedRef.current) {
        pendingRefresh = true;
        return;
      }
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        pendingRefresh = false;
        ScrollTrigger?.refresh();
      }, 220);
    };

    const onMediaLoaded = () => {
      clearTimeout(mediaTimer);
      mediaTimer = setTimeout(scheduleRefresh, 120);
    };

    const onStoryLock = (e) => {
      const locked = Boolean(e?.detail?.locked);
      storyLockedRef.current = locked;
      if (!locked && pendingRefresh) scheduleRefresh();
    };

    const stopNativeRaf = () => {
      if (nativeRafId) {
        cancelAnimationFrame(nativeRafId);
        nativeRafId = 0;
      }
    };

    const startNativeRaf = () => {
      stopNativeRaf();
      const loop = (time) => {
        instance?.raf(time);
        nativeRafId = requestAnimationFrame(loop);
      };
      nativeRafId = requestAnimationFrame(loop);
    };

    const attachGsap = async () => {
      if (cancelled || gsapReady || gsapLoading || !instance) return;
      gsapLoading = true;
      try {
        const [gsapPkg, stPkg] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (cancelled || !instance) return;

        gsapMod = gsapPkg.gsap || gsapPkg.default;
        ScrollTrigger = stPkg.ScrollTrigger;
        gsapMod.registerPlugin(ScrollTrigger);

        stopNativeRaf();
        instance.on("scroll", ScrollTrigger.update);
        onGsapRaf = (time) => instance.raf(time * 1000);
        gsapMod.ticker.add(onGsapRaf);
        gsapMod.ticker.lagSmoothing(0);

        window.addEventListener("load", scheduleRefresh);
        window.addEventListener("ut:media-loaded", onMediaLoaded);
        window.addEventListener("ut:story-scroll-lock", onStoryLock);

        const ro = new ResizeObserver(scheduleRefresh);
        ro.observe(document.body);

        if (document.fonts?.ready) {
          document.fonts.ready
            .then(() => {
              if (!cancelled) scheduleRefresh();
            })
            .catch(() => {});
        }

        const prevCleanup = instance.__utCleanup;
        instance.__utCleanup = () => {
          prevCleanup?.();
          clearTimeout(refreshTimer);
          clearTimeout(mediaTimer);
          window.removeEventListener("load", scheduleRefresh);
          window.removeEventListener("ut:media-loaded", onMediaLoaded);
          window.removeEventListener("ut:story-scroll-lock", onStoryLock);
          ro.disconnect();
          if (onGsapRaf && gsapMod) gsapMod.ticker.remove(onGsapRaf);
        };

        gsapReady = true;
        scheduleRefresh();
      } catch (err) {
        console.warn("[smooth-scroll] Failed to init GSAP/ScrollTrigger", err);
      } finally {
        gsapLoading = false;
      }
    };

    const maybeAttachGsapForTarget = (target) => {
      const id = normalizeTarget(target);
      if (ST_SECTION_IDS.has(id)) attachGsap();
    };

    const onEnsureSection = (e) => {
      maybeAttachGsapForTarget(e?.detail?.target);
    };

    const onHash = () => {
      maybeAttachGsapForTarget(window.location.hash);
    };

    const watchStoryProximity = () => {
      const el = document.getElementById("story");
      if (!el || typeof IntersectionObserver === "undefined") {
        // Fallback: if #story isn't in the tree yet, retry shortly.
        return;
      }
      storyIo = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            attachGsap();
            storyIo?.disconnect();
            storyIo = null;
          }
        },
        // Entering/near the Story band — not the generic boot idle window.
        // (DeferMount may mount the chunk slightly earlier via its own margin.)
        { root: null, rootMargin: "120px 0px", threshold: 0.01 }
      );
      storyIo.observe(el);
    };

    cleanupIdle = scheduleIdle(async () => {
      if (cancelled) return;
      try {
        const { default: Lenis } = await import("lenis");
        if (cancelled) return;

        const coarse = isCoarsePointer();
        instance = new Lenis({
          duration: coarse ? 0.9 : 1.15,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          syncTouch: false,
          touchMultiplier: coarse ? 1.2 : 1.6,
          wheelMultiplier: 1,
        });

        lenisRef.current = instance;
        setLenis(instance);
        startNativeRaf();

        instance.__utCleanup = () => {
          stopNativeRaf();
          instance.destroy();
        };

        window.addEventListener("ut:ensure-section", onEnsureSection);
        window.addEventListener("hashchange", onHash);
        onHash();

        // #story placeholder is in the first paint tree (DeferMount keeps the id).
        watchStoryProximity();
        // If React hasn't committed #story yet, observe on next frames.
        requestAnimationFrame(() => {
          if (!cancelled && !storyIo && !gsapReady) watchStoryProximity();
        });
      } catch (err) {
        console.warn("[smooth-scroll] Failed to init Lenis", err);
      }
    });

    return () => {
      cancelled = true;
      cleanupIdle();
      storyIo?.disconnect();
      window.removeEventListener("ut:ensure-section", onEnsureSection);
      window.removeEventListener("hashchange", onHash);
      if (instance?.__utCleanup) instance.__utCleanup();
      lenisRef.current = null;
      setLenis(null);
    };
  }, [prefersReduced]);

  // Single document-scroll source: Lenis when ready, otherwise native
  // (covers reduced-motion and the idle window before Lenis mounts).
  useEffect(() => {
    return bindDocumentScroll(lenis);
  }, [lenis]);

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
    if (typeof window !== "undefined") {
      // Force deferred sections to mount before scrolling to their anchors.
      window.dispatchEvent(
        new CustomEvent("ut:ensure-section", {
          detail: { target },
        })
      );
      window.dispatchEvent(
        new CustomEvent("ut:release-story-scroll", {
          detail: { target },
        })
      );
    }

    const runScroll = () => {
      if (lenis) {
        lenis.start();
        lenis.scrollTo(target, {
          offset: -80,
          duration: 1.2,
          force: true,
          ...options,
        });
      } else if (typeof target === "string") {
        const el = document.querySelector(target);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (typeof window !== "undefined") {
        window.scrollTo({ top: target, behavior: "smooth" });
      }
    };

    // Allow React to mount the deferred section after ensure-section.
    if (typeof target === "string" && target.startsWith("#")) {
      requestAnimationFrame(() => {
        requestAnimationFrame(runScroll);
      });
      return;
    }

    runScroll();
  };
}
