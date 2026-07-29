import { ArrowUpRight } from "lucide-react";
import { LazyImage } from "@/components/shared/LazyImage";
import { premiumProducts } from "@/lib/premiumProducts";
import { unsplash, unsplashLQ, unsplashSrcSet } from "@/lib/images";

/**
 * Premium Exports stage — three primary landing guides as full crawlable tiles.
 */
export function PremiumExports() {
  return (
    <div className="mt-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-orange-bright">
            Premium exports
          </p>
          <h3 className="mt-2 text-[clamp(1.5rem,3vw,2rem)] font-extrabold tracking-tight text-foreground">
            Our primary export guides
          </h3>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Dedicated pages for the three lines we export most — specs, origin, and how to enquire.
          </p>
        </div>
      </div>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {premiumProducts.map((item, i) => (
          <li key={item.id}>
            <a
              href={item.path}
              className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-border bg-surface shadow-soft transition-[box-shadow,border-color,transform] duration-500 ease-premium hover:-translate-y-1 hover:border-brand-orange-bright/35 hover:shadow-[0_24px_55px_rgba(20,14,10,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange-bright focus-visible:ring-offset-2"
            >
              <div className="relative aspect-[16/11] overflow-hidden bg-[#140e0a]">
                <LazyImage
                  src={unsplash(item.image, 900, 88)}
                  srcSet={unsplashSrcSet(item.image, [384, 480, 640, 800], 88)}
                  sizes="(min-width:1024px) 28vw, (min-width:640px) 45vw, 90vw"
                  lqip={unsplashLQ(item.image)}
                  alt={`${item.title} — export guide`}
                  fallbackLabel={item.title}
                  eager={i < 3}
                  className="h-full w-full"
                  imgClassName="transition-transform duration-700 ease-premium group-hover:scale-[1.04]"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent"
                  aria-hidden="true"
                />
                <span className="absolute left-3 top-3 inline-flex rounded-full border border-white/25 bg-black/70 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-white">
                  {item.badge}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
                    {item.title}
                  </h4>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-orange-bright text-[#1a0e06] shadow-soft transition-transform duration-500 ease-premium group-hover:scale-105">
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.blurb}</p>
                <p className="mt-4 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-brand-red">
                  {item.cta}
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
