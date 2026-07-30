import { LazyImage } from "@/components/shared/LazyImage";
import { TiltCard } from "@/components/shared/TiltCard";
import { unsplash, unsplashLQ, unsplashSrcSet } from "@/lib/images";
import { cn } from "@/lib/utils";

/** Compact labels for the leveled filmstrip rail. */
const SHORT_LABELS = {
  mangoes: "Mango",
  "dry-red-chilli": "Chilli",
  "indian-apple": "Apple",
  pomegranate: "Pomegranate",
};

/**
 * Equal-height filmstrip tab. Active underline is owned by the parent rail.
 */
export function ProductSelectorCard({
  product,
  selected = false,
  onSelect,
  id,
  controls,
  tabIndex = -1,
}) {
  const label = SHORT_LABELS[product.id] || product.name;

  return (
    <div className={cn("relative shrink-0", selected && "z-[1]")}>
      <div className="[perspective:700px]">
        <TiltCard className="group/tilt rounded-[1.1rem]" max={14} perspective={700} glare>
          <button
            type="button"
            role="tab"
            id={id}
            aria-selected={selected}
            aria-controls={controls}
            tabIndex={tabIndex}
            onClick={() => onSelect?.(product.id)}
            className={cn(
              "relative block w-[4.75rem] overflow-hidden rounded-[1.1rem] text-left transition-[opacity,box-shadow,ring-color] duration-500 ease-premium sm:w-[5.75rem] lg:w-[6.25rem]",
              "ring-1 ring-inset ring-white/25",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange-bright/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30",
              selected
                ? "opacity-100 shadow-[0_16px_32px_rgba(0,0,0,0.5)] ring-2 ring-brand-orange-bright/80"
                : "opacity-90 hover:opacity-100 hover:ring-white/40"
            )}
          >
            <span className="relative block aspect-[3/4] w-full bg-[#120e0b]">
              <LazyImage
                src={unsplash(product.image, 280, 80)}
                srcSet={unsplashSrcSet(product.image, [180, 280, 360], 80)}
                sizes="(min-width:1024px) 6.25rem, (min-width:640px) 5.75rem, 4.75rem"
                lqip={unsplashLQ(product.image)}
                alt=""
                fallbackLabel={label}
                className="absolute inset-0 h-full w-full"
                imgClassName={cn(
                  "object-cover object-center transition-transform duration-700 ease-premium",
                  selected ? "scale-[1.06]" : "group-hover/tilt:scale-[1.05]"
                )}
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-1.5 sm:p-2.5">
                <span className="block truncate text-[0.68rem] font-semibold tracking-tight text-white sm:text-[0.78rem]">
                  {label}
                </span>
              </span>
            </span>
          </button>
        </TiltCard>
      </div>
    </div>
  );
}

export default ProductSelectorCard;
