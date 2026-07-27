import { site } from "@/lib/config";
import { useTheme } from "@/providers/ThemeProvider";
import { cn } from "@/lib/utils";

const SIZE = {
  /** Fills nav row height without growing the bar (scale widens the mark). */
  nav: {
    width: 220,
    height: 40,
    img: "h-10 w-auto max-w-[min(42vw,15.5rem)] origin-left scale-[1.28] sm:max-w-[17rem] sm:scale-[1.32]",
    /** Display ~220–272 CSS px → 1x/2x density. */
    srcSet: (tone) =>
      `/brand/logo-${tone}-220w.webp 1x, /brand/logo-${tone}-440w.webp 2x`,
    src: (tone) => `/brand/logo-${tone}-440w.webp`,
  },
  /** Extra-large brand presence for the footer. */
  footer: {
    width: 420,
    height: 120,
    img: "h-[4.5rem] w-auto max-w-[min(88vw,22rem)] sm:h-24 sm:max-w-[26rem] md:h-28 md:max-w-[30rem] lg:h-32 lg:max-w-[34rem]",
    srcSet: (tone) =>
      `/brand/logo-${tone}-440w.webp 1x, /brand/logo-${tone}-880w.webp 2x`,
    src: (tone) => `/brand/logo-${tone}-880w.webp`,
  },
};

/**
 * MDF brand mark — theme-aware density srcset (WebP).
 * Light mark on dark surfaces; dark mark on light surfaces.
 * `inverted` forces the light mark (transparent nav over a dark hero).
 */
export function Logo({ className, onClick, inverted = false, size = "nav" }) {
  const { theme } = useTheme();
  const onDarkSurface = inverted || theme === "dark";
  const tone = onDarkSurface ? "light" : "dark";
  const preset = SIZE[size] || SIZE.nav;

  return (
    <a
      href="#top"
      onClick={onClick}
      className={cn(
        "group inline-flex shrink-0 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        size === "nav" && "h-10",
        className
      )}
      aria-label={`${site.name} — home`}
    >
      <img
        src={preset.src(tone)}
        srcSet={preset.srcSet(tone)}
        alt={site.name}
        width={preset.width}
        height={preset.height}
        decoding="async"
        className={cn(
          "object-contain object-left transition-transform duration-500 ease-premium group-hover:brightness-110",
          preset.img
        )}
      />
    </a>
  );
}
