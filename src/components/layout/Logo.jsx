import logoLight from "@/images/LightPNG.png";
import logoDark from "@/images/DarkPNG.png";
import { site } from "@/lib/config";
import { useTheme } from "@/providers/ThemeProvider";
import { cn } from "@/lib/utils";

/** Cropped wordmark aspect ≈ 2.5:1 (LightPNG 1039×413 / DarkPNG 935×378). */
const SIZE = {
  /** Fills nav row height without growing the bar. */
  nav: {
    width: 250,
    height: 100,
    img: "h-10 w-auto max-w-[min(50vw,16rem)] origin-left sm:max-w-[18rem]",
  },
  /** Extra-large brand presence for the footer. */
  footer: {
    width: 420,
    height: 168,
    img: "h-[4.5rem] w-auto max-w-[min(88vw,22rem)] sm:h-24 sm:max-w-[26rem] md:h-28 md:max-w-[30rem] lg:h-32 lg:max-w-[34rem]",
  },
};

/**
 * MDF brand mark (PNG). Theme-aware:
 * Light mark on dark surfaces; dark mark on light surfaces.
 * `inverted` forces the light mark (transparent nav over a dark hero).
 */
export function Logo({ className, onClick, inverted = false, size = "nav" }) {
  const { theme } = useTheme();
  const onDarkSurface = inverted || theme === "dark";
  // LightPNG = white mark for dark backgrounds; DarkPNG = dark mark for light backgrounds
  const src = onDarkSurface ? logoLight : logoDark;
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
      aria-label={`${site.name}. Home`}
    >
      <img
        src={src}
        alt={site.name}
        width={preset.width}
        height={preset.height}
        decoding="async"
        className={cn(
          // Source is ~4× nav CSS size so browser downscale stays sharp
          "object-contain object-left transition-[filter] duration-500 ease-premium group-hover:brightness-110",
          preset.img
        )}
      />
    </a>
  );
}
