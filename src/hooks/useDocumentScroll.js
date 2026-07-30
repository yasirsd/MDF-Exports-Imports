import { documentScrollY, documentScrollYProgress } from "@/lib/documentScroll";

/**
 * Document-level scrollY / scrollYProgress driven by Lenis (or native fallback).
 * Does not measure scroll itself. Values are written by SmoothScrollProvider.
 */
export function useDocumentScroll() {
  return {
    scrollY: documentScrollY,
    scrollYProgress: documentScrollYProgress,
  };
}
