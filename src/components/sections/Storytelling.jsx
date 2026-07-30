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

/** Memoized chapter shell. Skips reconcile when inactive and props stable. */
const StoryChapter = memo(function StoryChapter({ chapter, active, warm }) {
  const Comp = LAYOUTS[chapter.layout];
  // Keep adjacent/visited chapters mounted for instant GSAP flips; skip cold ones.
  if (!warm) {
    return <div className="h-full w-full" aria-hidden="true" />;
  }
  if (!Comp) {
    // eslint-disable-next-line no-console
    console.error(`[StoryChapter] Unknown layout "${chapter.layout}" for chapter "${chapter.id}"`);
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
          if (!Comp) return null;
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

/** Scroll runway beyond the sticky viewport. Keeps enter/exit traps without GSAP pin. */
const STORY_RUNWAY_PX = 160;

/**
 * Cinematic storytelling stage.
 *
 * One intentional wheel/swipe = one full-viewport chapter.
 * CSS sticky holds the stage; GSAP Observer pages chapters; Lenis is paused
 * so inertia cannot skip. ScrollTrigger only observes enter/exit. It does
 * NOT pin (pin-spacer reparenting races React removeChild and trips the
 * section error boundary).
 *
 * P1: panel shells always exist for GSAP; heavy chapter trees stay warm only
 * for active ± 1 (and visited). Visibility is driven by GSAP autoAlpha only.
 *
 * Build-time prerender: SmoothScrollProvider skips Lenis/GSAP, and the live
 * path only warms ~2 chapters. So we render ReducedStory (all chapter copy,
 * no Observer) the same way WorldMap skips R3F during capture.
 *
 * Mode is frozen on first commit. Live ↔ Reduced swaps after setup are unsafe.
 */
export function Storytelling() {
  const prefersReduced = usePrefersReducedMotion();
  const modeRef = useRef(null);
  if (modeRef.current === null) {
    modeRef.current = isPrerender() || prefersReduced ? "reduced" : "live";
  }

  if (modeRef.current === "reduced") return <ReducedStory />;
  return <StorytellingLive />;
}

function safeKillObserver(observer) {
  if (!observer) return;
  try {
    observer.disable?.();
  } catch {
    /* already dead */
  }
  try {
    observer.kill?.();
  } catch {
    /* already dead */
  }
}

function safeRevertContext(ctx) {
  try {
    ctx?.revert?.();
  } catch (err) {
    const name = err?.name || "";
    const msg = String(err?.message || err || "");
    if (name === "NotFoundError" || /removeChild|NotFoundError/i.test(msg)) return;
    throw err;
  }
}

function StorytellingLive() {
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  const outerRef = useRef(null);
  const stageRef = useRef(null);
  const apiRef = useRef(null);
  const [active, setActive] = useState(0);
  const [warm, setWarm] = useState(() => new Set([0, 1]));
  const [stageFailed, setStageFailed] = useState(false);
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
    if (stageFailed) return undefined;

    const outer = outerRef.current;
    const stage = stageRef.current;
    if (!outer || !stage) return undefined;

    const panels = gsap.utils.toArray(".story-panel", stage);
    if (!panels.length || panels.length < total) {
      // eslint-disable-next-line no-console
      console.error("[StorytellingLive] Missing story panels", {
        found: panels.length,
        expected: total,
      });
      setStageFailed(true);
      return undefined;
    }

    let current = 0;
    let animating = false;
    let exiting = false;
    let zoneST = null;
    let intentObserver = null;
    let exitTimer = null;
    let ctx = null;

    try {
      gsap.set(panels, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(panels[0], { autoAlpha: 1, pointerEvents: "auto" });
      panels.forEach((p, i) => {
        p.style.contentVisibility = i === 0 ? "visible" : "hidden";
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[StorytellingLive] panel init failed", err);
      setStageFailed(true);
      return undefined;
    }

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
      if (!panels[next]) return;

      const prev = current;
      current = next;

      // Mount incoming (+ neighbors) before GSAP reads the panel DOM.
      try {
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
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[StorytellingLive] setChapter flushSync failed", err);
        setStageFailed(true);
        return;
      }

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
      const y = zoneST ? zoneST.start + 1 : window.scrollY;
      const lenisInst = getLenis();
      if (lenisInst) {
        lenisInst.stop();
        lenisInst.scrollTo(y, { immediate: true, force: true });
      } else {
        window.scrollTo(0, y);
      }
      stage.style.touchAction = "none";
      setStoryLocked(true);
    };

    const unlockPageScroll = () => {
      stage.style.touchAction = "";
      getLenis()?.start();
      setStoryLocked(false);
    };

    /** Navbar / programmatic scroll. Release Observer + Lenis without paging chapters. */
    const releaseStoryScroll = (event) => {
      const navTarget = event?.detail?.target;
      const goingToStory = navTarget === "#story" || navTarget === "story";

      if (intentObserver?.isEnabled) intentObserver.disable();
      unlockPageScroll();

      if (goingToStory) {
        clearTimeout(exitTimer);
        exiting = false;
        requestAnimationFrame(() => {
          if (!zoneST || intentObserver?.isEnabled) return;
          enterStory(false);
        });
        return;
      }

      armExitingGuard(600);
    };

    const exitStory = (direction) => {
      if (!zoneST || !intentObserver || exiting) return;
      intentObserver.disable();
      unlockPageScroll();
      armExitingGuard(450);

      const target =
        direction === "down" ? zoneST.end + 8 : Math.max(0, zoneST.start - 8);

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

    try {
      // Drop any legacy pin from older builds / HMR before creating the zone trigger.
      ScrollTrigger.getAll().forEach((st) => {
        if (
          st.trigger === stage ||
          st.trigger === outer ||
          st.vars?.id === "mdf-story-pin" ||
          st.vars?.id === "mdf-story-zone"
        ) {
          try {
            st.kill(true);
          } catch {
            /* already gone */
          }
        }
      });

      ctx = gsap.context(() => {
        // Observe the runway only. Never pin. Sticky CSS keeps the stage fixed
        // without inserting a pin-spacer React does not own.
        zoneST = ScrollTrigger.create({
          id: "mdf-story-zone",
          trigger: outer,
          start: "top top",
          end: () => `+=${STORY_RUNWAY_PX}`,
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
      }, outer);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[StorytellingLive] zone/Observer setup failed", err);
      safeKillObserver(intentObserver);
      try {
        zoneST?.kill?.(true);
      } catch {
        /* ignore */
      }
      safeRevertContext(ctx);
      setStageFailed(true);
      return undefined;
    }

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
        if (!intentObserver?.isEnabled && zoneST) {
          const lenisInst = getLenis();
          if (lenisInst) {
            lenisInst.scrollTo(zoneST.start + 1, { immediate: true, force: true });
          } else {
            window.scrollTo(0, zoneST.start + 1);
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
      safeKillObserver(intentObserver);
      intentObserver = null;
      try {
        unlockPageScroll();
      } catch {
        /* stage may already be gone */
      }
      try {
        zoneST?.kill?.(true);
      } catch {
        /* already gone */
      }
      zoneST = null;
      safeRevertContext(ctx);
    };
  }, [total, stageFailed]);

  const scrollToChapter = useCallback((i) => {
    apiRef.current?.goTo(i);
  }, []);

  // Keep the same outer host mounted. Swapping to <ReducedStory /> while a
  // prior trigger existed used to race React removeChild. Fallback stays inside.
  if (stageFailed) {
    return (
      <div ref={outerRef}>
        <ReducedStory />
      </div>
    );
  }

  const stepLabel = String(active + 1).padStart(2, "0");
  const activeChapter = storyChapters[active];

  return (
    <div
      ref={outerRef}
      className="relative"
      style={{ height: `calc(100svh + ${STORY_RUNWAY_PX}px)` }}
    >
      <section
        ref={stageRef}
        aria-label="The export journey"
        aria-roledescription="carousel"
        tabIndex={0}
        className="sticky top-0 h-[100svh] overflow-hidden transition-[background-color] duration-700 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange-bright focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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
    </div>
  );
}
