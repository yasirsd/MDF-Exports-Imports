import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

/**
 * Chunking notes (P0 critical path):
 * - Do NOT force `three` into a named manual chunk. That previously caused Vite's
 *   modulepreload helper to land inside the three vendor file, so the entry
 *   statically imported ~228KB gzip of Three on every first load.
 * - three / @react-three stay behind the dynamic `import()` of Globe only.
 * - modulePreload.resolveDependencies is a safety net against accidental preloads.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    modulePreload: {
      resolveDependencies: (_filename, deps) =>
        deps.filter(
          (dep) =>
            !dep.includes("three") &&
            !dep.includes("gsap") &&
            !dep.includes("lenis")
        ),
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;

          // Leave Three.js to automatic async splitting via Globe's dynamic import.
          if (id.includes("three") || id.includes("@react-three")) {
            return undefined;
          }

          if (id.includes("gsap")) return "gsap";
          if (id.includes("lenis")) return "lenis";
          if (id.includes("embla")) return "embla";
          if (id.includes("framer-motion") || id.includes("/motion/")) return "motion";

          // Keep React core with react-dom so it is not absorbed into motion.
          if (
            id.includes("react-dom") ||
            id.includes("scheduler") ||
            /node_modules[/\\]react[/\\]/.test(id)
          ) {
            return "react-vendor";
          }

          return undefined;
        },
      },
    },
  },
});
