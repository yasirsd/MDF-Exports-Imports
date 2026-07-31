import { useEffect, useState } from "react";
import { motion, useMotionValueEvent } from "motion/react";
import { Menu } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { EnquireActions } from "@/components/shared/EnquireActions";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { navLinks } from "@/lib/constants";
import { brandHello } from "@/lib/config";
import { useScrollTo } from "@/providers/SmoothScrollProvider";
import { useDocumentScroll } from "@/hooks/useDocumentScroll";
import { cn } from "@/lib/utils";

const START_IMPORTING = brandHello("I'd like to start importing.");

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useDocumentScroll();
  const scrollTo = useScrollTo();

  // Frosted chrome always on mobile; desktop stays clear until scroll.
  const frosted = scrolled || mobileNav;

  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = latest > 24;
    setScrolled((prev) => (prev === next ? prev : next));
  });

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "auto";
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const sync = () => setMobileNav(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const handleNav = (e, href) => {
    e.preventDefault();
    scrollTo(href);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <Container className="pt-3 sm:pt-4">
          <nav
            aria-label="Primary"
            className={cn(
              "flex items-center justify-between gap-3 rounded-full px-4 py-2 transition-all duration-500 ease-premium sm:gap-4 sm:px-5 sm:py-2.5",
              frosted
                ? "glass-nav shadow-soft"
                : "border border-transparent bg-transparent"
            )}
          >
            <Logo size="nav" onClick={(e) => handleNav(e, "#top")} inverted={!frosted} />

            <ul className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNav(e, link.href)}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      frosted
                        ? "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <ThemeToggle
                className={cn(
                  "hidden sm:grid",
                  frosted ? "" : "border-white/25 bg-white/10 text-white hover:bg-white/20"
                )}
              />
              <EnquireActions
                density="compact"
                label="Start Importing"
                whatsappMessage={START_IMPORTING}
                emailSubject="Export Enquiry — MDF"
                emailBody={START_IMPORTING}
                className="hidden sm:inline-flex"
                tone={frosted ? "light" : "dark"}
                whatsappClassName={
                  frosted
                    ? undefined
                    : "border border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                }
                whatsappVariant={frosted ? "primary" : "glass"}
              />
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-navigation"
                className={cn(
                  "grid h-12 w-12 place-items-center rounded-full border transition-colors lg:hidden",
                  frosted
                    ? "border-border bg-surface/70 text-foreground hover:bg-surface-2"
                    : "border-white/25 bg-white/10 text-white hover:bg-white/20"
                )}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </nav>
        </Container>
      </motion.header>

      <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} onNavigate={scrollTo} />
    </>
  );
}
