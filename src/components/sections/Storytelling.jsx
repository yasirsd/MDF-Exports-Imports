import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ChapterCounter,
  ChapterRail,
  ScrollHint,
} from "@/components/sections/story/StoryChrome";
import { CHAPTER_ATMOSPHERES } from "@/components/sections/story/chapterAtmospheres";
import { ChapterOrigin } from "@/components/sections/story/chapters/ChapterOrigin";
import { ChapterPeople } from "@/components/sections/story/chapters/ChapterPeople";
import { ChapterHarvest } from "@/components/sections/story/chapters/ChapterHarvest";
import { ChapterCare } from "@/components/sections/story/chapters/ChapterCare";
import { ChapterJourney } from "@/components/sections/story/chapters/ChapterJourney";
import { ChapterArrival } from "@/components/sections/story/chapters/ChapterArrival";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useLenis } from "@/providers/SmoothScrollProvider";
import { storyChapters } from "@/lib/constants";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, Observer);

const LAYOUTS = {
  scrapbook: ChapterOrigin,
  quote: ChapterPeople,
  circleGrid: ChapterHarvest,
  dual: ChapterCare,
  routeMap: ChapterJourney,
  world: ChapterArrival,
};

function ReducedStory() {
  return (
    <section id="story" className="bg-[#140e0a]">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-16 px-5 py-20 sm:px-8">
        {storyChapters.map((c, i) => {
          const Comp = LAYOUTS[c.layout];
          const atm = CHAPTER_ATMOSPHERES[i];
          return (
            <div
              key={c.id}
              className="relative min-h-[85svh] overflow-hidden rounded-[1.75rem] border border-white/5"
              style={{ backgroundColor: atm.base }}
            >
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: atm.glow }}
                aria-hidden="true"
              />
              <div className="relative z-10 h-full">
                <Comp chapter={c} active />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Cinematic storytelling stage.
 *
 * One intentional wheel/swipe = one full-viewport chapter.
 * GSAP Observer pages chapters while pinned; Lenis is paused so inertia
 * cannot skip. Same behavior on desktop and mobile.
 */
export function Storytelling() {
  const prefersReduced = usePrefersReducedMotion();
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  const rootRef = useRef(null);
  const apiRef = useRef(null);
  const [active, setActive] = useState(0);
  const total = storyChapters.length;
  const atmosphere = CHAPTER_ATMOSPHERES[active] || CHAPTER_ATMOSPHERES[0];

  useLayoutEffect(() => {
    if (prefersReduced) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;

    const panels = gsap.utils.toArray(".story-panel", root);
    gsap.set(panels, { autoAlpha: 0, pointerEvents: "none" });
    gsap.set(panels[0], { autoAlpha: 1, pointerEvents: "auto" });

    let current = 0;
    let animating = false;
    let exiting = false;
    let pinST = null;
    let intentObserver = null;
    let exitTimer = null;

    const getLenis = () => lenisRef.current;

    const setChapter = (index, { instant = false } = {}) => {
      const next = Math.max(0, Math.min(total - 1, index));
      if (next === current && !instant) return;

      const prev = current;
      current = next;
      setActive(next);

      if (instant || prev === next) {
        gsap.set(panels, { autoAlpha: 0, pointerEvents: "none" });
        gsap.set(panels[next], { autoAlpha: 1, pointerEvents: "auto" });
        animating = false;
        return;
      }

      animating = true;
      gsap
        .timeline({
          defaults: { overwrite: "auto" },
          onComplete: () => {
            animating = false;
          },
        })
        .to(
          panels[prev],
          {
            autoAlpha: 0,
            pointerEvents: "none",
            duration: 0.4,
            ease: "power2.inOut",
          },
          0
        )
        .to(
          panels[next],
          {
            autoAlpha: 1,
            pointerEvents: "auto",
            duration: 0.5,
            ease: "power2.out",
          },
          0.05
        );
    };

    const lockPageScroll = () => {
      const y = pinST ? pinST.start + 1 : window.scrollY;
      const lenisInst = getLenis();
      if (lenisInst) {
        lenisInst.stop();
        lenisInst.scrollTo(y, { immediate: true });
      } else {
        window.scrollTo(0, y);
      }
      root.style.touchAction = "none";
    };

    const unlockPageScroll = () => {
      root.style.touchAction = "";
      getLenis()?.start();
    };

    const exitStory = (direction) => {
      if (!pinST || !intentObserver || exiting) return;
      exiting = true;
      intentObserver.disable();
      unlockPageScroll();

      const target =
        direction === "down" ? pinST.end + 8 : Math.max(0, pinST.start - 8);

      requestAnimationFrame(() => {
        const lenisInst = getLenis();
        if (lenisInst) lenisInst.scrollTo(target, { immediate: true });
        else window.scrollTo(0, target);
      });

      clearTimeout(exitTimer);
      exitTimer = setTimeout(() => {
        exiting = false;
      }, 450);
    };

    const goNext = () => {
      if (animating || exiting) return;
      if (current >= total - 1) {
        exitStory("down");
        return;
      }
      setChapter(current + 1);
    };

    const goPrev = () => {
      if (animating || exiting) return;
      if (current <= 0) {
        exitStory("up");
        return;
      }
      setChapter(current - 1);
    };

    const enterStory = (fromBottom) => {
      if (exiting || intentObserver?.isEnabled) return;
      setChapter(fromBottom ? total - 1 : 0, { instant: true });
      lockPageScroll();
      intentObserver.enable();
    };

    const ctx = gsap.context(() => {
      // Short pin — chapters advance via Observer, not scrub distance.
      pinST = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "+=160",
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onEnter: (self) => {
          if (exiting || intentObserver?.isEnabled) return;
          self.scroll(self.start + 1);
          enterStory(false);
        },
        onEnterBack: (self) => {
          if (exiting || intentObserver?.isEnabled) return;
          self.scroll(self.end - 1);
          enterStory(true);
        },
      });

      intentObserver = Observer.create({
        target: window,
        type: "wheel,touch",
        wheelSpeed: -1,
        tolerance: 18,
        preventDefault: true,
        onUp: () => goNext(),
        onDown: () => goPrev(),
      });
      intentObserver.disable();
    }, root);

    apiRef.current = {
      goTo: (i) => {
        if (!intentObserver?.isEnabled && pinST) {
          const lenisInst = getLenis();
          if (lenisInst) lenisInst.scrollTo(pinST.start + 1, { immediate: true });
          else window.scrollTo(0, pinST.start + 1);
          enterStory(false);
        }
        setChapter(i);
      },
    };

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("ut:media-loaded", refresh);

    return () => {
      clearTimeout(exitTimer);
      window.removeEventListener("ut:media-loaded", refresh);
      apiRef.current = null;
      intentObserver?.kill();
      unlockPageScroll();
      ctx.revert();
    };
  }, [prefersReduced, total]);

  const scrollToChapter = useCallback((i) => {
    apiRef.current?.goTo(i);
  }, []);

  if (prefersReduced) return <ReducedStory />;

  const stepLabel = String(active + 1).padStart(2, "0");

  return (
    <section
      ref={rootRef}
      id="story"
      aria-label="The export journey"
      className="relative h-[100svh] overflow-hidden transition-[background-color] duration-700 ease-premium"
      style={{ backgroundColor: atmosphere.base }}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{ background: atmosphere.glow }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 3px)",
        }}
        aria-hidden="true"
      />

      {storyChapters.map((c, i) => {
        const Comp = LAYOUTS[c.layout];
        return (
          <div
            key={c.id}
            className={cn(
              "story-panel absolute inset-0 overflow-hidden",
              i === 0 ? "z-[1]" : "z-0"
            )}
            style={{ zIndex: i === active ? 2 : 1 }}
            aria-hidden={i !== active}
          >
            <Comp chapter={c} active={i === active} />
          </div>
        );
      })}

      <ChapterRail
        chapters={storyChapters}
        active={active}
        onSelect={scrollToChapter}
      />
      <ScrollHint
        step={stepLabel}
        total={total}
        progress={(active + 1) / total}
      />
      <ChapterCounter step={stepLabel} total={total} />
    </section>
  );
}
