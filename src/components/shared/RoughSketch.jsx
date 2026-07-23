import { useLayoutEffect, useRef } from "react";
import rough from "roughjs";

const SVG_NS = "http://www.w3.org/2000/svg";

/**
 * Hand-drawn sketch primitive built on rough.js, with the signature "draws
 * itself" effect: after rough generates its stroke <path>s we animate each
 * path's stroke-dashoffset from its full length to 0 (WAAPI), so the lines
 * appear to be drawn live. Dashed and filled ops fade in instead (dashoffset
 * would clobber their look). An optional second seed cross-fades on a loop to
 * make the ink gently "boil". Fully static under reduced motion.
 *
 * Ops: { t:'p', d, dash?, fill? } | { t:'c', x, y, d, fill? }
 *      | { t:'e', x, y, w, h } | { t:'l', x1, y1, x2, y2 }
 */
export function RoughSketch({
  ops,
  viewBox,
  className,
  strokeWidth = 1.6,
  roughness = 1.4,
  bowing = 1.1,
  seed = 1,
  draw = true,
  drawDuration = 900,
  stagger = 120,
  drawDelay = 0,
  boil = false,
  trigger = "inview",
  reduced = false,
  preserve = "xMidYMid meet",
}) {
  const svgRef = useRef(null);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    let anims = [];
    let boilTimer = null;
    let boilAnim = null;
    let io = null;

    const makeGroup = (s) => {
      const g = document.createElementNS(SVG_NS, "g");
      for (const op of ops) {
        const base = { roughness, bowing, stroke: "currentColor", strokeWidth, seed: s };
        let node = null;
        if (op.t === "p") {
          node = rc.path(op.d, {
            ...base,
            ...(op.dash ? { strokeLineDash: [3, 7] } : {}),
            ...(op.fill ? { fill: "currentColor", fillStyle: "solid" } : {}),
          });
        } else if (op.t === "c") {
          node = rc.circle(op.x, op.y, op.d, {
            ...base,
            ...(op.fill ? { fill: "currentColor", fillStyle: "solid" } : {}),
          });
        } else if (op.t === "e") {
          node = rc.ellipse(op.x, op.y, op.w, op.h, base);
        } else if (op.t === "l") {
          node = rc.line(op.x1, op.y1, op.x2, op.y2, base);
        }
        if (!node) continue;
        node.querySelectorAll("path").forEach((p) => {
          p.setAttribute("vector-effect", "non-scaling-stroke");
          p.setAttribute("stroke-linecap", "round");
          p.setAttribute("stroke-linejoin", "round");
        });
        g.appendChild(node);
      }
      return g;
    };

    const groupA = makeGroup(seed);
    svg.appendChild(groupA);

    let groupB = null;
    if (boil && !reduced) {
      groupB = makeGroup(seed + 7);
      groupB.style.opacity = "0";
      svg.appendChild(groupB);
    }

    const startBoil = () => {
      if (!groupB) return;
      boilAnim = groupB.animate(
        [{ opacity: 0 }, { opacity: 0 }, { opacity: 1 }, { opacity: 1 }, { opacity: 0 }],
        { duration: 1600, iterations: Infinity, easing: "linear" }
      );
    };

    // Classify: stroke-drawable vs fade-in (dashed / filled).
    const drawPaths = [];
    const fadePaths = [];
    groupA.querySelectorAll("path").forEach((p) => {
      const fill = p.getAttribute("fill");
      const hasDash = p.style.strokeDasharray || p.getAttribute("stroke-dasharray");
      if ((fill && fill !== "none") || hasDash) fadePaths.push(p);
      else drawPaths.push(p);
    });

    if (reduced || !draw) {
      startBoil();
      return () => {
        if (boilAnim) boilAnim.cancel();
      };
    }

    const lengths = drawPaths.map((p) => {
      let len = 0;
      try {
        len = p.getTotalLength();
      } catch {
        len = 0;
      }
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
      return len;
    });
    fadePaths.forEach((p) => {
      p.style.opacity = "0";
    });

    let started = false;
    const run = () => {
      if (started) return;
      started = true;
      let maxEnd = 0;
      drawPaths.forEach((p, i) => {
        const delay = drawDelay + i * stagger;
        anims.push(
          p.animate([{ strokeDashoffset: lengths[i] }, { strokeDashoffset: 0 }], {
            duration: drawDuration,
            delay,
            easing: "ease-in-out",
            fill: "forwards",
          })
        );
        maxEnd = Math.max(maxEnd, delay + drawDuration);
      });
      fadePaths.forEach((p, i) => {
        const delay = drawDelay + drawPaths.length * stagger * 0.4 + i * (stagger * 0.6);
        anims.push(
          p.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 420,
            delay,
            easing: "ease-out",
            fill: "forwards",
          })
        );
        maxEnd = Math.max(maxEnd, delay + 420);
      });
      if (groupB) boilTimer = setTimeout(startBoil, maxEnd + 250);
    };

    if (trigger === "mount") {
      run();
    } else {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              run();
              io.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );
      io.observe(svg);
    }

    return () => {
      anims.forEach((a) => a.cancel());
      if (boilTimer) clearTimeout(boilTimer);
      if (boilAnim) boilAnim.cancel();
      if (io) io.disconnect();
    };
  }, [ops, viewBox, strokeWidth, roughness, bowing, seed, draw, drawDuration, stagger, drawDelay, boil, trigger, reduced]);

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      fill="none"
      preserveAspectRatio={preserve}
      className={className}
      width="100%"
      height="100%"
    />
  );
}
