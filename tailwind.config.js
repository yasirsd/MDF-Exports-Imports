import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      /**
       * Responsive Design System — breakpoints
       * Mobile-first. Defaults (sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536)
       * are preserved; these extend the ladder to cover the full device range
       * (small phones → ultrawide) called out in the responsive spec.
       */
      screens: {
        xs: "480px", // large phones / small phablets
        "3xl": "1728px", // 16" MacBook Pro
        "4xl": "1920px", // FHD desktop
        "5xl": "2560px", // QHD / ultrawide
      },
      colors: {
        brand: {
          red: "#ef233c",
          gold: "#fdc500",
          orange: "#f97316",
          "orange-bright": "#ff7a1a",
        },
        success: "#22C55E",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        "surface-2": "hsl(var(--surface-2) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        "muted-foreground": "hsl(var(--muted-foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["'Inter Variable'", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
        "4xl": "2.5rem",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(17,17,17,0.04), 0 12px 32px rgba(17,17,17,0.06)",
        "soft-lg": "0 8px 24px rgba(17,17,17,0.08), 0 24px 64px rgba(17,17,17,0.10)",
        glow: "0 0 0 1px rgba(253,197,0,0.25), 0 12px 40px rgba(253,197,0,0.18)",
      },
      fontSize: {
        display: ["clamp(3rem, 8vw, 8rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        hero: ["clamp(2.75rem, 7vw, 6.5rem)", { lineHeight: "0.98", letterSpacing: "-0.03em" }],
        h1: ["clamp(2.25rem, 5vw, 4.5rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        h2: ["clamp(1.75rem, 3.5vw, 3rem)", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
        h3: ["clamp(1.35rem, 2vw, 1.9rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        lead: ["clamp(1.05rem, 1.5vw, 1.35rem)", { lineHeight: "1.55" }],
        body: ["clamp(1rem, 0.96rem + 0.28vw, 1.15rem)", { lineHeight: "1.65" }],
        small: ["clamp(0.85rem, 0.82rem + 0.15vw, 0.95rem)", { lineHeight: "1.5" }],
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
        "premium-in": "cubic-bezier(0.7, 0, 0.84, 0)",
      },
      transitionDuration: {
        900: "900ms",
        1200: "1200ms",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "gradient-pan": "gradient-pan 8s ease infinite",
        marquee: "marquee 32s linear infinite",
        "accordion-down": "accordion-down 0.3s ease-premium",
        "accordion-up": "accordion-up 0.3s ease-premium",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
