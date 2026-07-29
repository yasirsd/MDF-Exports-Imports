import { Linkedin, Instagram, Facebook, Youtube, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Logo } from "@/components/layout/Logo";
import { navLinks, markets } from "@/lib/constants";
import { premiumProducts } from "@/lib/premiumProducts";
import { site } from "@/lib/config";
import { useScrollTo } from "@/providers/SmoothScrollProvider";

const iconMap = { Linkedin, Instagram, Facebook, Youtube };

export function Footer() {
  const scrollTo = useScrollTo();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-border bg-surface">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo size="footer" />
            <p className="mt-6 max-w-md text-lead text-muted-foreground">{site.tagline}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Rooted in {site.heritage} · {site.experience} · {site.location}
            </p>
            <div className="mt-6 flex gap-2">
              {site.socials.map((social) => {
                const Icon = iconMap[social.icon];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="grid h-12 w-12 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand-red hover:text-brand-red"
                  >
                    {Icon ? <Icon className="h-5 w-5" /> : null}
                  </a>
                );
              })}
            </div>
          </div>

          <nav aria-label="Footer quick links">
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
                    className="group inline-flex items-center gap-1 text-foreground transition-colors hover:text-brand-red"
                  >
                    {link.label}
                    <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Premium export guides">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Premium exports
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {premiumProducts.map((item) => (
                <li key={item.path}>
                  <a
                    href={item.path}
                    className="group inline-flex items-center gap-1 text-foreground transition-colors hover:text-brand-red"
                  >
                    {item.title}
                    <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Export Regions
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {markets.map((m) => (
                <li key={m.name} className="flex items-center gap-2 text-foreground">
                  <span
                    className={
                      m.status === "future"
                        ? "h-1.5 w-1.5 rounded-full bg-brand-gold"
                        : "h-1.5 w-1.5 rounded-full bg-success"
                    }
                    aria-hidden="true"
                  />
                  {m.name}
                  <span className="text-sm text-muted-foreground">· {m.country}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <a href="/privacy" className="font-medium text-foreground transition-colors hover:text-brand-red">
              Privacy Policy
            </a>
            <p>Crafted with care · {site.location}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
