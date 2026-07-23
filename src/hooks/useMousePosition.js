import { useEffect, useRef, useState } from "react";

/**
 * Track normalised pointer position (-0.5 .. 0.5) relative to the viewport
 * or a target element. Skips work on touch / coarse pointers.
 * @param {{ target?: React.RefObject<HTMLElement> }} [opts]
 */
export function useMousePosition({ target } = {}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const frame = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    // Scope the listener to the target element when provided so we don't run
    // a global mousemove handler while the user is elsewhere on the page.
    const el = target?.current;
    const node = el ?? window;

    const handle = (e) => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        if (el) {
          const r = el.getBoundingClientRect();
          setPos({
            x: (e.clientX - r.left) / r.width - 0.5,
            y: (e.clientY - r.top) / r.height - 0.5,
          });
        } else {
          setPos({
            x: e.clientX / window.innerWidth - 0.5,
            y: e.clientY / window.innerHeight - 0.5,
          });
        }
      });
    };

    node.addEventListener("mousemove", handle, { passive: true });
    return () => {
      node.removeEventListener("mousemove", handle);
      cancelAnimationFrame(frame.current);
    };
  }, [target]);

  return pos;
}
