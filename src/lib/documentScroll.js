import { motionValue } from "motion/react";

/**
 * Shared document scroll MotionValues. Single source of truth.
 * Fed by Lenis when active, otherwise by the native scroll listener
 * (reduced-motion and the pre-Lenis idle window).
 */
export const documentScrollY = motionValue(0);
export const documentScrollYProgress = motionValue(0);

function readNativeScroll() {
  const y = window.scrollY || document.documentElement.scrollTop || 0;
  const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
  documentScrollY.set(y);
  documentScrollYProgress.set(max > 0 ? y / max : 0);
}

/**
 * Bind absolute page scroll to the shared MotionValues.
 * Pass a Lenis instance, or null/undefined for native scroll.
 * Returns an unbind function.
 */
export function bindDocumentScroll(lenis) {
  if (lenis) {
    const onScroll = (event) => {
      const scroll = event?.scroll ?? lenis.scroll ?? 0;
      const limit = event?.limit ?? lenis.limit ?? 0;
      documentScrollY.set(scroll);
      documentScrollYProgress.set(limit > 0 ? scroll / limit : 0);
    };
    lenis.on("scroll", onScroll);
    onScroll({ scroll: lenis.scroll, limit: lenis.limit });
    return () => {
      lenis.off("scroll", onScroll);
    };
  }

  const onScroll = () => readNativeScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  readNativeScroll();
  return () => {
    window.removeEventListener("scroll", onScroll);
  };
}
