import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Phone } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { EnquireActions } from "@/components/shared/EnquireActions";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { navLinks } from "@/lib/constants";
import { premiumProducts } from "@/lib/premiumProducts";
import { brandHello, site } from "@/lib/config";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { easePremium } from "@/lib/motion";
import { telUrl } from "@/lib/utils";

const START_IMPORTING = brandHello("I'd like to start importing.");

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: easePremium } },
};

/**
 * Apple-style fullscreen mobile navigation.
 * - Full-viewport blurred panel with large, thumb-friendly targets.
 * - Staggered slide-in of nav items.
 * - Swipe-right-to-close gesture.
 * - Body scroll lock + focus trap handled by the underlying Radix dialog.
 */
export function MobileMenu({ open, onOpenChange, onNavigate }) {
  const prefersReduced = usePrefersReducedMotion();
  const startX = useRef(null);
  const startY = useRef(null);
  const navTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (navTimer.current) clearTimeout(navTimer.current);
    };
  }, []);

  const go = (href) => {
    onOpenChange(false);
    // wait for the close animation before scrolling
    if (navTimer.current) clearTimeout(navTimer.current);
    navTimer.current = setTimeout(() => onNavigate(href), 260);
  };

  const handleTouchStart = (e) => {
    const t = e.touches[0];
    startX.current = t.clientX;
    startY.current = t.clientY;
  };

  const handleTouchEnd = (e) => {
    if (startX.current == null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - startX.current;
    const dy = t.clientY - startY.current;
    // Swipe right (toward the edge it slides from) closes the menu.
    if (dx > 70 && Math.abs(dx) > Math.abs(dy) * 1.4) onOpenChange(false);
    startX.current = null;
    startY.current = null;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="glass w-full max-w-none border-l-0 bg-background/75 px-[clamp(1.5rem,6vw,2.5rem)] py-8 sm:max-w-md sm:border-l"
      >
        <div className="flex min-h-0 flex-1 flex-col gap-8">
          <div>
            <SheetTitle className="text-2xl">{site.name}</SheetTitle>
            <SheetDescription>{site.tagline}</SheetDescription>
          </div>

          <nav id="mobile-navigation" aria-label="Mobile" className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
            <motion.ul
              variants={listVariants}
              initial={prefersReduced ? false : "hidden"}
              animate="visible"
              className="flex flex-col gap-1.5"
            >
              {navLinks.map((link) => (
                <motion.li key={link.href} variants={itemVariants}>
                  <button
                    type="button"
                    onClick={() => go(link.href)}
                    className="tap-target flex w-full items-center rounded-2xl px-4 py-4 text-left text-2xl font-extrabold tracking-tight transition-colors hover:bg-surface-2 active:bg-surface-2"
                  >
                    {link.label}
                  </button>
                </motion.li>
              ))}
            </motion.ul>

            <div className="mt-8 border-t border-border pt-6">
              <p className="px-4 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Premium exports
              </p>
              <ul className="mt-3 flex flex-col gap-1">
                {premiumProducts.map((item) => (
                  <li key={item.path}>
                    <a
                      href={item.path}
                      className="tap-target flex w-full items-center rounded-2xl px-4 py-3 text-left text-base font-semibold text-foreground transition-colors hover:bg-surface-2 active:bg-surface-2"
                      onClick={() => onOpenChange(false)}
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between rounded-2xl border border-border p-3">
            <span className="text-sm font-medium text-muted-foreground">Appearance</span>
            <ThemeToggle />
          </div>
          <EnquireActions
            density="stack"
            label="Start Importing"
            whatsappMessage={START_IMPORTING}
            emailSubject="Export Enquiry — MDF"
            emailBody={START_IMPORTING}
          />
          <Button asChild variant="secondary" size="lg" className="w-full">
            <a
              href={telUrl(site.phone)}
              aria-label={`Call ${site.phone}`}
              onClick={(e) => {
                e.preventDefault();
                window.location.assign(telUrl(site.phone));
              }}
            >
              <Phone className="h-5 w-5" />
              Call Us
            </a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
