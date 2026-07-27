import { useState } from "react";
import { motion, useMotionValueEvent } from "motion/react";
import { MessageCircle, ArrowUp } from "lucide-react";
import { brandHello, site } from "@/lib/config";
import { whatsappUrl } from "@/lib/utils";
import { useScrollTo } from "@/providers/SmoothScrollProvider";
import { useDocumentScroll } from "@/hooks/useDocumentScroll";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { easePremium } from "@/lib/motion";

/** Floating WhatsApp + back-to-top actions. */
export function FloatingActions() {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useDocumentScroll();
  const scrollTo = useScrollTo();
  const reduced = usePrefersReducedMotion();

  useMotionValueEvent(scrollY, "change", (v) => {
    const next = v > 600;
    setVisible((prev) => (prev === next ? prev : next));
  });

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      <motion.button
        type="button"
        aria-label="Back to top"
        aria-hidden={!visible}
        tabIndex={visible ? 0 : -1}
        onClick={() => scrollTo(0)}
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          scale: visible ? 1 : 0.6,
          pointerEvents: visible ? "auto" : "none",
        }}
        transition={{ duration: 0.3, ease: easePremium }}
        className="grid h-12 w-12 place-items-center rounded-full border border-border bg-surface/80 text-foreground shadow-soft glass transition-colors hover:bg-surface-2"
      >
        <ArrowUp className="h-5 w-5" />
      </motion.button>

      <motion.a
        href={whatsappUrl(site.whatsapp, brandHello("I have an export enquiry."))}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        initial={reduced ? false : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: reduced ? 0 : 1, duration: 0.5, ease: easePremium }}
        className="group relative grid h-14 w-14 place-items-center rounded-full bg-success text-white shadow-soft-lg transition-transform hover:scale-105"
      >
        {!reduced ? (
          <span
            className="absolute inset-0 animate-ping rounded-full bg-success/40 [animation-duration:2.5s]"
            aria-hidden="true"
          />
        ) : null}
        <MessageCircle className="relative h-6 w-6" />
      </motion.a>
    </div>
  );
}
