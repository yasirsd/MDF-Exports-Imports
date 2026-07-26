import { useEffect } from "react";
import { MessageCircle, Snowflake, Package, CalendarDays, MapPinned } from "lucide-react";
import { LazyImage } from "@/components/shared/LazyImage";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { brandHello, site } from "@/lib/config";
import { unsplash, unsplashLQ, unsplashSrcSet } from "@/lib/images";
import { useLenis } from "@/providers/SmoothScrollProvider";
import { whatsappUrl } from "@/lib/utils";

/**
 * Product spec drawer — scrollable body + sticky enquire.
 * Uses data-lenis-prevent so trackpad/wheel can scroll natively inside
 * (Lenis.stop() alone preventDefaults wheel and blocks nested scroll).
 */
export function ProductDrawer({ product, open, onOpenChange }) {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return undefined;
    if (open) lenis.stop();
    else lenis.start();
    return () => {
      lenis.start();
    };
  }, [open, lenis]);

  if (!product) return null;

  const enquireHref = whatsappUrl(
    site.whatsapp,
    brandHello(`I'd like export specs and pricing for ${product.name}.`)
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        // Critical: Lenis skips preventDefault on this subtree → trackpad works
        data-lenis-prevent=""
        data-lenis-prevent-wheel=""
        data-lenis-prevent-touch=""
        className="flex h-full max-h-[100dvh] w-full max-w-md flex-col gap-0 overflow-hidden p-0 sm:max-w-lg"
      >
        <div
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain touch-pan-y"
          data-lenis-prevent=""
          data-lenis-prevent-wheel=""
          data-lenis-prevent-touch=""
        >
          <div className="relative aspect-[16/11] overflow-hidden bg-[#140e0a]">
            <LazyImage
              src={unsplash(product.image, 1000, 88)}
              srcSet={unsplashSrcSet(product.image, [480, 640, 800, 1000], 88)}
              sizes="(min-width:640px) 32rem, 100vw"
              lqip={unsplashLQ(product.image)}
              alt={product.name}
              fallbackLabel={product.name}
              eager
              className="absolute inset-0 h-full w-full"
              imgClassName="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#140e0a]/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-5 right-14">
              <span className="inline-flex rounded-full border border-white/20 bg-black/35 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                {product.category}
              </span>
              <SheetTitle className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
                {product.name}
              </SheetTitle>
            </div>
          </div>

          <div className="flex flex-col gap-6 p-5 pb-8 sm:p-6">
            <SheetDescription className="text-[0.95rem] leading-relaxed text-muted-foreground">
              {product.copy || product.blurb}
            </SheetDescription>

            {product.varieties?.length ? (
              <div>
                <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Varieties
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {product.varieties.map((v) => (
                    <li
                      key={v}
                      className="rounded-full border border-border bg-surface-2 px-3 py-1.5 text-xs font-semibold text-foreground"
                    >
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="grid gap-3">
              <SpecRow icon={CalendarDays} label="Season" value={product.season} />
              <SpecRow icon={Package} label="Pack" value={product.pack} />
              <SpecRow icon={Snowflake} label="Cold chain" value={product.coldChain} />
              <SpecRow
                icon={MapPinned}
                label="Markets"
                value={(product.markets || []).join(" · ")}
              />
            </div>

            {product.highlights?.length ? (
              <div>
                <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Highlights
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {product.highlights.map((h) => (
                    <li
                      key={h}
                      className="rounded-full border border-brand-orange-bright/30 bg-brand-orange-bright/[0.07] px-3 py-1.5 text-xs font-semibold text-foreground/85"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        <div className="shrink-0 border-t border-border bg-surface/95 px-5 py-4 backdrop-blur-md sm:px-6">
          <Button
            asChild
            size="lg"
            className="w-full bg-brand-orange-bright text-[#1a0e06] hover:bg-[#ff8a2a] hover:brightness-100"
          >
            <a href={enquireHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
              Enquire on WhatsApp
            </a>
          </Button>
          <p className="mt-2 text-center text-[0.65rem] text-muted-foreground">
            Specs, volumes and destination — we reply with a tailored quote.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SpecRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex gap-3 rounded-2xl border border-border bg-surface-2/60 px-3.5 py-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-orange-bright/10 text-brand-orange-bright">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[0.55rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-semibold leading-snug text-foreground">{value}</p>
      </div>
    </div>
  );
}
