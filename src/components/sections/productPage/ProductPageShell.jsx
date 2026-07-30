import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

/**
 * Dark root shell for product landings. Film grain + sticky header.
 * Matches Export Journey chapter surface language.
 */
export function ProductPageShell({ children, className }) {
  const backHome = () => {
    window.location.href = "/#products";
  };

  return (
    <div
      className={cn(
        "relative min-h-[100svh] overflow-x-clip bg-[#0a0a0c] text-white",
        className
      )}
    >
      {/* Film grain. ~3.5% like Story stages */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <header className="sticky top-0 z-[3] border-b border-white/10 bg-[#0a0a0c]/75 backdrop-blur-md">
        <Container className="flex items-center justify-between gap-4 py-4 sm:py-5">
          <Logo
            size="nav"
            inverted
            onClick={(e) => {
              e.preventDefault();
              backHome();
            }}
          />
          <a
            href="/#products"
            onClick={(e) => {
              e.preventDefault();
              backHome();
            }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:border-brand-orange hover:text-brand-orange-bright"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </a>
        </Container>
      </header>

      <main className="relative z-[2]">{children}</main>
    </div>
  );
}
