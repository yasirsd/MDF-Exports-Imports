/** True only during the build-time Playwright capture pass. */
export function isPrerender() {
  return typeof window !== "undefined" && window.__PRERENDER__ === true;
}
