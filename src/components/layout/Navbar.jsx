import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, MessageCircle } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { navLinks } from "@/lib/constants";
import { site } from "@/lib/config";
import { useScrollTo } from "@/providers/SmoothScrollProvider";
import { whatsappUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const scrollTo = useScrollTo();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "auto";
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
              "flex items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 ease-premium sm:px-5",
              scrolled
                ? "glass shadow-soft"
                : "border border-transparent bg-transparent"
            )}
          >
            <Logo onClick={(e) => handleNav(e, "#top")} inverted={!scrolled} />

            <ul className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNav(e, link.href)}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      scrolled
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
                  scrolled ? "" : "border-white/25 bg-white/10 text-white hover:bg-white/20"
                )}
              />
              <Button
                asChild
                variant="primary"
                size="md"
                className="hidden sm:inline-flex"
              >
                <a
                  href={whatsappUrl(site.whatsapp, "Hello Universal Traders, I'd like to start importing.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" />
                  Start Importing
                </a>
              </Button>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                className={cn(
                  "grid h-12 w-12 place-items-center rounded-full border transition-colors lg:hidden",
                  scrolled
                    ? "border-border bg-surface text-foreground hover:bg-surface-2"
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
