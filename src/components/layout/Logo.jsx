import { site } from "@/lib/config";
import { cn } from "@/lib/utils";

/** UT monogram logomark + wordmark. `inverted` renders for dark backgrounds. */
export function Logo({ className, showWordmark = true, onClick, inverted = false }) {
  return (
    <a
      href="#top"
      onClick={onClick}
      className={cn("group flex items-center gap-3 focus-visible:outline-none", className)}
      aria-label={`${site.name} — home`}
    >
      <span
        className={cn(
          "relative grid h-11 w-11 place-items-center overflow-hidden rounded-2xl shadow-soft transition-transform duration-500 ease-premium group-hover:scale-[1.04]",
          inverted
            ? "bg-white text-[#111]"
            : "bg-[#111] text-white dark:bg-white dark:text-[#111]"
        )}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "linear-gradient(135deg,#ef233c,#fdc500)" }}
        />
        <span className="relative text-sm font-extrabold tracking-tight">{site.logo}</span>
      </span>
      {showWordmark ? (
        <span className="flex flex-col leading-none">
          <span className={cn("text-base font-extrabold tracking-tight", inverted && "text-white")}>
            {site.name}
          </span>
          <span
            className={cn(
              "text-[10px] font-medium uppercase tracking-[0.18em]",
              inverted ? "text-white/60" : "text-muted-foreground"
            )}
          >
            Global Exports
          </span>
        </span>
      ) : null}
    </a>
  );
}
