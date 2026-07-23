import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("three") || id.includes("@react-three")) return "three";
            if (id.includes("gsap")) return "gsap";
            if (id.includes("framer-motion") || id.includes("/motion/")) return "motion";
            if (id.includes("embla")) return "embla";
            if (id.includes("react-dom") || id.includes("scheduler")) return "react-vendor";
          }
        },
      },
    },
  },
});
