import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { MessageCircle, ArrowUp } from "lucide-react";
import { site } from "@/lib/config";
import { whatsappUrl } from "@/lib/utils";
import { useScrollTo } from "@/providers/SmoothScrollProvider";

/** Floating WhatsApp + back-to-top actions. */
export function FloatingActions() {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();
  const scrollTo = useScrollTo();

  useMotionValueEvent(scrollY, "change", (v) => setVisible(v > 600));

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      <motion.button
        type="button"
        aria-label="Back to top"
        onClick={() => scrollTo(0)}
        initial={false}
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.6, pointerEvents: visible ? "auto" : "none" }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="grid h-12 w-12 place-items-center rounded-full border border-border bg-surface text-foreground shadow-soft transition-colors hover:bg-surface-2"
      >
        <ArrowUp className="h-5 w-5" />
      </motion.button>

      <motion.a
        href={whatsappUrl(site.whatsapp, "Hello Universal Traders, I have an export enquiry.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="group relative grid h-14 w-14 place-items-center rounded-full bg-success text-white shadow-soft-lg transition-transform hover:scale-105"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-success/40 [animation-duration:2.5s]" aria-hidden="true" />
        <MessageCircle className="relative h-6 w-6" />
      </motion.a>
    </div>
  );
}
