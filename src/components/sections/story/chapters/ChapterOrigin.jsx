import { LazyImage } from "@/components/shared/LazyImage";
import { ChapterPill } from "@/components/sections/story/StoryChrome";
import { StoryDoodle } from "@/components/sections/story/StoryDoodle";
import { StoryStage } from "@/components/sections/story/StoryStage";
import { unsplash, unsplashLQ, unsplashSrcSet } from "@/lib/images";
import { cn } from "@/lib/utils";

/** Chapter 01. Smaller polaroid; Since seal beside the year block. */
export function ChapterOrigin({ chapter, active }) {
  return (
    <StoryStage className={cn(!active && "pointer-events-none")}>
      <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 xl:gap-16">
        <div className="relative">
          <ChapterPill>{chapter.pill}</ChapterPill>
          <h2 className="mt-5 text-[clamp(2.2rem,4.6vw,3.85rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-white">
            {chapter.title}
          </h2>
          <p className="mt-5 max-w-md text-[clamp(0.95rem,1.1vw,1.125rem)] leading-relaxed text-white/65">
            {chapter.copy}
          </p>

          <div className="mt-10 flex flex-wrap items-end gap-6 border-t border-white/10 pt-6">
            {/* Since seal. Beside the year, not colliding with navbar */}
            <div
              className="grid h-[4.25rem] w-[4.25rem] shrink-0 place-items-center rounded-full border border-brand-orange-bright/55 bg-brand-orange-bright/10 text-center shadow-[0_0_28px_rgba(255,122,26,0.25)]"
              aria-hidden="true"
            >
              <div>
                <p className="text-[0.55rem] font-bold uppercase tracking-[0.18em] text-brand-orange-bright">
                  Since
                </p>
                <p className="text-sm font-extrabold text-white">{chapter.year}</p>
              </div>
            </div>
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white/40">
                {chapter.yearCaption}
              </p>
              <p
                className="mt-1 text-[clamp(3.5rem,9vw,6.5rem)] font-extrabold leading-none tracking-[-0.05em] text-transparent"
                style={{ WebkitTextStroke: "1.75px rgba(255,122,26,0.9)" }}
              >
                {chapter.year}
              </p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xs sm:max-w-sm lg:mx-0 lg:justify-self-end">
          <StoryDoodle
            id={chapter.doodle}
            seed={3}
            tone="ghost"
            className="absolute -left-12 top-[22%] hidden h-32 w-32 lg:block"
          />

          {/* Smaller polaroid */}
          <div className="relative mx-auto w-[min(100%,17.5rem)] rotate-[-3deg] sm:w-[min(100%,19rem)] lg:rotate-[-4deg]">
            <div className="rounded-[2px] bg-[#f4f0e6] p-2.5 pb-9 shadow-[0_20px_60px_rgba(0,0,0,0.5)] sm:p-3 sm:pb-10">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#ddd]">
                <LazyImage
                  src={unsplash(chapter.image, 800)}
                  srcSet={unsplashSrcSet(chapter.image)}
                  sizes="(min-width:1024px) 20vw, 70vw"
                  lqip={unsplashLQ(chapter.image)}
                  alt={chapter.title}
                  fallbackLabel={chapter.eyebrow}
                  eager={active}
                  className="h-full w-full"
                  imgClassName="grayscale-[20%] contrast-[1.05]"
                />
              </div>
              <p className="mt-2.5 text-center text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#3a3a3a]">
                {chapter.location}
              </p>
            </div>

            <div className="absolute -bottom-1.5 -right-2 rotate-[7deg] rounded-sm border border-[#e8dfc8] bg-[#fffdf6] px-3 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] sm:-bottom-2 sm:-right-3">
              <p className="text-[0.55rem] font-bold uppercase tracking-[0.18em] text-[#9a7a3a]">
                {chapter.scrapLabel}
              </p>
              <p className="mt-0.5 text-xs font-semibold tracking-tight text-[#1a1a1a]">
                {chapter.scrapMeta}
              </p>
              <p className="mt-0.5 text-[0.6rem] text-[#777]">Entry No. {chapter.step}</p>
            </div>
          </div>
        </div>
      </div>
    </StoryStage>
  );
}
