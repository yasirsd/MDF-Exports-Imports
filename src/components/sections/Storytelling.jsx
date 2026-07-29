import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
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
import { isPrerender } from "@/lib/prerender";
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

/** Memoized chapter shell — skips reconcile when inactive and props stable. */
const StoryChapter = memo(function StoryChapter({ chapter, active, warm }) {
  const Comp = LAYOUTS[chapter.layout];
  // Keep adjacent/visited chapters mounted for instant GSAP flips; skip cold ones.
  if (!warm) {
    return <div className="h-full w-full" aria-hidden="true" />;
  }
  return <Comp chapter={chapter} active={active} />;
});

function ReducedStory() {
  return (
    <section aria-label="The export journey" className="bg-[#140e0a]">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-16 px-5 py-20 sm:px-8">
        {storyChapters.map((c, i) => {
          const Comp = LAYOUTS[c.layout];
          const atm = CHAPTER_ATMOSPHERES[i];
          return (
            <article
              key={c.id}
              className="relative min-h-[85svh] overflow-hidden rounded-[1.75rem] border border-white/5"
              style={{ backgroundColor: atm.base }}
              aria-labelledby={`story-reduced-${c.id}`}
            >
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: atm.glow }}
                aria-hidden="true"
              />
              <div className="relative z-10 h-full">
                <h2 id={`story-reduced-${c.id}`} className="sr-only">
                  {c.rail}: {c.title}
                </h2>
                <Comp chapter={c} active />
              </div>
            </article>
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
 *
 * P1: panel shells always exist for GSAP; heavy chapter trees stay warm only
 * for active ± 1 (and visited). Visibility is driven by GSAP autoAlpha only.
 *
 * Build-time prerender: SmoothScrollProvider skips Lenis/GSAP, and the live
 * path only warms ~2 chapters — so we render ReducedStory (all chapter copy,
 * no pin/Observer) the same way WorldMap skips R3F during capture.
 */
export function Storytelling() {
  const prefersReduced = usePrefersReducedMotion();

  // Static full-copy capture path — do not initialize ScrollTrigger pin.
  if (isPrerender() || prefersReduced) return <ReducedStory />;

  return <StorytellingLive />;
}

function StorytellingLive() {
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  const rootRef = useRef(null);
  const apiRef = useRef(null);
  const [active, setActive] = useState(0);
  const [warm, setWarm] = useState(() => new Set([0, 1]));
  const total = storyChapters.length;
  const atmosphere = CHAPTER_ATMOSPHERES[active] || CHAPTER_ATMOSPHERES[0];

  // Keep active chapter + neighbors mounted for instant flips.
  useEffect(() => {
    setWarm((prev) => {
      const next = new Set(prev);
      next.add(active);
      if (active + 1 < total) next.add(active + 1);
      if (active - 1 >= 0) next.add(active - 1);
      return next;
    });
  }, [active, total]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const panels = gsap.utils.toArray(".story-panel", root);
    gsap.set(panels, { autoAlpha: 0, pointerEvents: "none" });
    gsap.set(panels[0], { autoAlpha: 1, pointerEvents: "auto" });
    panels.forEach((p, i) => {
      p.style.contentVisibility = i === 0 ? "visible" : "hidden";
    });

    let current = 0;
    let animating = false;
    let exiting = false;
    let pinST = null;
    let intentObserver = null;
    let exitTimer = null;

    const getLenis = () => lenisRef.current;

    const paintActive = (index) => {
      panels.forEach((p, i) => {
        p.style.contentVisibility = i === index ? "visible" : "hidden";
        p.style.zIndex = i === index ? "2" : "1";
      });
    };

    const setChapter = (index, { instant = false } = {}) => {
      const next = Math.max(0, Math.min(total - 1, index));
      if (next === current && !instant) return;

      const prev = current;
      current = next;

      // Mount incoming (+ neighbors) before GSAP reads the panel DOM.
      flushSync(() => {
        setActive(next);
        setWarm((prevWarm) => {
          const n = new Set(prevWarm);
          n.add(next);
          if (next + 1 < total) n.add(next + 1);
          if (next - 1 >= 0) n.add(next - 1);
          return n;
        });
      });

      // Ensure incoming panel can paint before the fade.
      panels[next].style.contentVisibility = "visible";
      panels[next].style.zIndex = "2";

      if (instant || prev === next) {
        gsap.set(panels, { autoAlpha: 0, pointerEvents: "none" });
        gsap.set(panels[next], { autoAlpha: 1, pointerEvents: "auto" });
        paintActive(next);
        animating = false;
        return;
      }

      animating = true;
      gsap
        .timeline({
          defaults: { overwrite: "auto" },
          onComplete: () => {
            paintActive(next);
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

    const armExitingGuard = (ms = 600) => {
      exiting = true;
      clearTimeout(exitTimer);
      exitTimer = setTimeout(() => {
        exiting = false;
      }, ms);
    };

    const setStoryLocked = (locked) => {
      window.dispatchEvent(
        new CustomEvent("ut:story-scroll-lock", { detail: { locked } })
      );
    };

    const lockPageScroll = () => {
      const y = pinST ? pinST.start + 1 : window.scrollY;
      const lenisInst = getLenis();
      if (lenisInst) {
        lenisInst.stop();
        lenisInst.scrollTo(y, { immediate: true, force: true });
      } else {
        window.scrollTo(0, y);
      }
      root.style.touchAction = "none";
      setStoryLocked(true);
    };

    const unlockPageScroll = () => {
      root.style.touchAction = "";
      getLenis()?.start();
      setStoryLocked(false);
    };

    /** Navbar / programmatic scroll — release Observer + Lenis without paging chapters. */
    const releaseStoryScroll = (event) => {
      const navTarget = event?.detail?.target;
      const goingToStory = navTarget === "#story" || navTarget === "story";

      if (intentObserver?.isEnabled) intentObserver.disable();
      unlockPageScroll();

      if (goingToStory) {
        clearTimeout(exitTimer);
        exiting = false;
        requestAnimationFrame(() => {
          if (!pinST || intentObserver?.isEnabled) return;
          enterStory(false);
        });
        return;
      }

      armExitingGuard(600);
    };

    const exitStory = (direction) => {
      if (!pinST || !intentObserver || exiting) return;
      intentObserver.disable();
      unlockPageScroll();
      armExitingGuard(450);

      const target =
        direction === "down" ? pinST.end + 8 : Math.max(0, pinST.start - 8);

      requestAnimationFrame(() => {
        const lenisInst = getLenis();
        if (lenisInst) lenisInst.scrollTo(target, { immediate: true, force: true });
        else window.scrollTo(0, target);
      });
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

    const onKeyDown = (event) => {
      if (!intentObserver?.isEnabled) return;
      const tag = event.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || event.target?.isContentEditable) {
        return;
      }

      switch (event.key) {
        case "ArrowDown":
        case "PageDown":
        case " ":
        case "Spacebar":
          event.preventDefault();
          goNext();
          break;
        case "ArrowUp":
        case "PageUp":
          event.preventDefault();
          goPrev();
          break;
        case "Home":
          event.preventDefault();
          setChapter(0);
          break;
        case "End":
          event.preventDefault();
          setChapter(total - 1);
          break;
        case "Escape":
          event.preventDefault();
          exitStory("down");
          break;
        default:
          break;
      }
    };

    apiRef.current = {
      goTo: (i) => {
        if (!intentObserver?.isEnabled && pinST) {
          const lenisInst = getLenis();
          if (lenisInst) {
            lenisInst.scrollTo(pinST.start + 1, { immediate: true, force: true });
          } else {
            window.scrollTo(0, pinST.start + 1);
          }
          enterStory(false);
        }
        setChapter(i);
      },
      next: () => goNext(),
      prev: () => goPrev(),
    };

    const refresh = () => ScrollTrigger.refresh();
    const onReleaseStory = (event) => releaseStoryScroll(event);
    window.addEventListener("ut:media-loaded", refresh);
    window.addEventListener("ut:release-story-scroll", onReleaseStory);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      clearTimeout(exitTimer);
      window.removeEventListener("ut:media-loaded", refresh);
      window.removeEventListener("ut:release-story-scroll", onReleaseStory);
      window.removeEventListener("keydown", onKeyDown);
      apiRef.current = null;
      intentObserver?.kill();
      unlockPageScroll();
      ctx.revert();
    };
  }, [total]);

  const scrollToChapter = useCallback((i) => {
    apiRef.current?.goTo(i);
  }, []);

  const stepLabel = String(active + 1).padStart(2, "0");
  const activeChapter = storyChapters[active];

  return (
    <section
      ref={rootRef}
      aria-label="The export journey"
      aria-roledescription="carousel"
      tabIndex={0}
      className="relative h-[100svh] overflow-hidden transition-[background-color] duration-700 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange-bright focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      style={{ backgroundColor: atmosphere.base }}
    >
      <p className="sr-only" aria-live="polite">
        Chapter {stepLabel} of {String(total).padStart(2, "0")}: {activeChapter?.rail}.{" "}
        {activeChapter?.title}. Use arrow keys or page up and page down to change chapters.
      </p>
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

      {storyChapters.map((c, i) => (
        <div
          key={c.id}
          className={cn(
            "story-panel absolute inset-0 overflow-hidden",
            i === 0 ? "z-[1]" : "z-0"
          )}
          aria-hidden={i !== active}
        >
          <StoryChapter chapter={c} active={i === active} warm={warm.has(i)} />
        </div>
      ))}

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
