import { Linkedin, Instagram, Facebook, Youtube, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { Container } from "@/components/shared/Container";
import { Logo } from "@/components/layout/Logo";
import { navLinks, exportDestinations } from "@/lib/constants";
import { premiumProducts } from "@/lib/premiumProducts";
import { site } from "@/lib/config";
import { useScrollTo } from "@/providers/SmoothScrollProvider";
import { easePremium, fadeUp, fadeUpReduced, motionSafe, viewportOnce } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

const iconMap = { Linkedin, Instagram, Facebook, Youtube };

/** Platform brand colors for footer icons (fixed — not theme tokens). */
const SOCIAL_BRAND = {
  Instagram: "#E4405F",
  Facebook: "#1877F2",
  Linkedin: "#0A66C2",
  Youtube: "#FF0000",
};

/** Display order matching the centered social band (hrefs unchanged from site.socials). */
const SOCIAL_ORDER = ["Instagram", "Facebook", "Linkedin", "Youtube"];

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.06 },
  },
};

const chipVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.92 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, delay: 0.12 + i * 0.05, ease: easePremium },
  }),
};

const chipVariantsReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

export function Footer() {
  const scrollTo = useScrollTo();
  const year = new Date().getFullYear();
  const reduced = usePrefersReducedMotion();
  const variants = motionSafe(reduced, fadeUp, fadeUpReduced);
  const chips = motionSafe(reduced, chipVariants, chipVariantsReduced);

  const socials = SOCIAL_ORDER.map((icon) => site.socials.find((s) => s.icon === icon)).filter(
    Boolean
  );

  return (
    <footer className="relative overflow-x-clip border-t border-border bg-surface">
      {/* Atmosphere — soft brand wash, no hard cards */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-red/[0.07] blur-3xl dark:bg-brand-red/[0.12]" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-brand-gold/[0.08] blur-3xl dark:bg-brand-gold/[0.1]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-red/40 to-transparent" />
        {!reduced ? (
          <motion.div
            className="absolute inset-x-[15%] top-0 h-px origin-left bg-gradient-to-r from-brand-red via-brand-orange-bright to-brand-gold"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 1.2, ease: easePremium }}
          />
        ) : null}
      </div>

      <Container className="relative py-16 md:py-20">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid gap-12 md:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div variants={variants} custom={0} className="md:col-span-2 lg:col-span-2">
            <Logo size="footer" />
            <p className="mt-6 max-w-md text-lead text-muted-foreground">{site.tagline}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Rooted in {site.heritage} · {site.experience} · {site.location}
            </p>
          </motion.div>

          <motion.nav variants={variants} custom={1} aria-label="Footer quick links">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Explore
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(link.href);
                    }}
                    className="group inline-flex items-center gap-1 text-foreground transition-colors duration-300 hover:text-brand-red"
                  >
                    {link.label}
                    <ArrowUpRight className="h-4 w-4 translate-y-0 opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>

          <motion.nav variants={variants} custom={2} aria-label="Premium export guides">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Premium exports
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {premiumProducts.map((item) => (
                <li key={item.path}>
                  <a
                    href={item.path}
                    className="group inline-flex items-center gap-1 text-foreground transition-colors duration-300 hover:text-brand-red"
                  >
                    {item.title}
                    <ArrowUpRight className="h-4 w-4 translate-y-0 opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={variants}
          custom={1}
          className="mt-12 flex w-full items-center gap-4 sm:mt-14 sm:gap-6"
          aria-label="Social profiles"
        >
          {/* Left hairline: transparent at outer edge → solid near icons */}
          <div
            className="h-px min-w-[2.5rem] flex-1 self-center"
            style={{
              backgroundImage:
                "linear-gradient(to right, hsl(var(--foreground) / 0), hsl(var(--foreground) / 0.28))",
            }}
            aria-hidden="true"
          />
          <ul className="flex shrink-0 items-center gap-5 sm:gap-7">
            {socials.map((social) => {
              const Icon = iconMap[social.icon];
              const color = SOCIAL_BRAND[social.icon];
              return (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    style={color ? { color } : undefined}
                    className={cn(
                      "grid place-items-center transition-transform duration-300 ease-premium hover:scale-110",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                    )}
                  >
                    {Icon ? (
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
          {/* Right hairline: solid near icons → transparent at outer edge */}
          <div
            className="h-px min-w-[2.5rem] flex-1 self-center"
            style={{
              backgroundImage:
                "linear-gradient(to left, hsl(var(--foreground) / 0), hsl(var(--foreground) / 0.28))",
            }}
            aria-hidden="true"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={variants}
          custom={1}
          className="relative mt-12 pt-12 pb-6"
        >
          {/* Soft red bloom — no rectangular fill, edges dissolve into footer */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div
              className={cn(
                "absolute left-1/2 top-1/2 aspect-[2/1] w-[min(120%,52rem)] -translate-x-1/2 -translate-y-1/2 rounded-[50%]",
                "bg-brand-red/0 blur-3xl dark:bg-brand-red/0",
                "motion-reduce:blur-2xl"
              )}
            />
            <div
              className={cn(
                "absolute left-1/2 top-[45%] h-[85%] w-[95%] -translate-x-1/2 -translate-y-1/2 rounded-[50%]",
                "bg-[radial-gradient(ellipse_at_center,rgba(239,35,60,0.1)_0%,rgba(239,35,60,0.04)_42%,transparent_72%)]",
                "dark:bg-[radial-gradient(ellipse_at_center,rgba(239,35,60,0.14)_0%,rgba(239,35,60,0.05)_40%,transparent_72%)]"
              )}
            />
          </div>

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-red">
                Serving the Gulf
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Active reefer programmes across GCC ports.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Active GCC export markets">
                {exportDestinations.map((d, i) => (
                  <motion.li key={d.code} custom={i} variants={chips} initial="hidden" whileInView="visible" viewport={viewportOnce}>
                    <span
                      title={d.name}
                      className={cn(
                        "inline-flex min-h-9 items-center rounded-full border border-border bg-surface-2/80 px-3.5 text-xs font-bold tracking-[0.12em] text-foreground backdrop-blur-sm",
                        "transition-[color,border-color,transform,box-shadow,background-color] duration-300 ease-premium",
                        "hover:-translate-y-0.5 hover:border-brand-red/50 hover:bg-brand-red/[0.06] hover:text-brand-red hover:shadow-soft"
                      )}
                    >
                      {d.code}
                    </span>
                  </motion.li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-brand-gold align-middle" aria-hidden="true" />
                Expanding beyond the Gulf
              </p>
            </div>

            <a
              href="#markets"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#markets");
              }}
              className={cn(
                "group relative inline-flex shrink-0 items-center gap-2 overflow-hidden rounded-full border border-brand-red/30 bg-brand-red/5 px-5 py-2.5",
                "text-sm font-semibold text-brand-red transition-[transform,background-color,border-color] duration-300 ease-premium",
                "hover:-translate-y-0.5 hover:border-brand-red/55 hover:bg-brand-red/10",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              {!reduced ? (
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full dark:via-white/10"
                  aria-hidden="true"
                />
              ) : null}
              <span className="relative">View trade routes</span>
              <ArrowUpRight className="relative h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={variants}
          custom={2}
          className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center"
        >
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <a href="/privacy" className="font-medium text-foreground transition-colors hover:text-brand-red">
              Privacy Policy
            </a>
            <p>Crafted with care · {site.location}</p>
          </div>
        </motion.div>
      </Container>
    </footer>
  );
}
