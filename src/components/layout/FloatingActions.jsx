import { useState } from "react";
import { motion, useMotionValueEvent } from "motion/react";
import { ArrowUp } from "lucide-react";
import { EnquireActions } from "@/components/shared/EnquireActions";
import { brandHello } from "@/lib/config";
import { useScrollTo } from "@/providers/SmoothScrollProvider";
import { useDocumentScroll } from "@/hooks/useDocumentScroll";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { easePremium } from "@/lib/motion";

const FLOAT_MESSAGE = brandHello("I have an export enquiry.");

/** Floating enquire (expandable WA + email) + back-to-top. */
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

      <motion.div
        initial={reduced ? false : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: reduced ? 0 : 1, duration: 0.5, ease: easePremium }}
      >
        <EnquireActions
          density="fab"
          whatsappMessage={FLOAT_MESSAGE}
          emailSubject="Export Enquiry — MDF"
          emailBody={FLOAT_MESSAGE}
        />
      </motion.div>
    </div>
  );
}
