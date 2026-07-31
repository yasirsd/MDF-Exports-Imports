import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Logo } from "@/components/layout/Logo";
import { site } from "@/lib/config";

const updated = "27 July 2026";

/**
 * Lightweight privacy notice for the marketing site (enquiry / WhatsApp leads).
 * Crawlable at /privacy; legacy in-app hash #privacy still works.
 */
export function PrivacyPolicy() {
  const backHome = () => {
    const path = window.location.pathname.replace(/\/+$/, "") || "/";
    if (path === "/privacy") {
      window.location.href = "/";
      return;
    }
    // Leave #privacy for the home experience (any non-privacy hash works).
    window.location.hash = "top";
  };

  return (
    <div className="min-h-[100svh] bg-background text-foreground">
      <header className="border-b border-border">
        <Container className="flex items-center justify-between gap-4 py-5">
          <Logo
            size="nav"
            onClick={(e) => {
              e.preventDefault();
              backHome();
            }}
          />
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              backHome();
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-brand-red hover:text-brand-red"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to site
          </a>
        </Container>
      </header>

      <main>
        <Container className="max-w-3xl py-14 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Legal
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-muted-foreground">
            Last updated {updated}. This notice explains how {site.name} handles information
            when you use {site.url.replace(/^https?:\/\//, "")}.
          </p>

          <div className="prose-mdf mt-12 space-y-10 text-[1.05rem] leading-relaxed text-foreground/90">
            <section>
              <h2 className="text-xl font-bold tracking-tight">Who we are</h2>
              <p className="mt-3 text-muted-foreground">
                {site.name} (“we”, “us”) is an agricultural export business based in{" "}
                {site.location}. General contact:{" "}
                <a className="font-medium text-brand-red hover:underline" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
                . For privacy, data-access, or support inquiries:{" "}
                <a
                  className="font-medium text-brand-red hover:underline"
                  href="mailto:support@mdfexport.com"
                >
                  support@mdfexport.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold tracking-tight">Information we collect</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
                <li>
                  Enquiry details you voluntarily submit (name, company, email, product interest,
                  and message) when using the contact form.
                </li>
                <li>
                  Messages you send via WhatsApp or email when you choose those channels.
                </li>
                <li>
                  Basic technical data typical of website visits (browser type, approximate region,
                  and pages viewed) if our hosting provider logs requests.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold tracking-tight">How we use information</h2>
              <p className="mt-3 text-muted-foreground">
                We use enquiry information solely to respond to trade requests, prepare quotations,
                and maintain business communications. We do not sell personal data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold tracking-tight">WhatsApp and third parties</h2>
              <p className="mt-3 text-muted-foreground">
                Choosing WhatsApp from an enquire or send control opens WhatsApp (Meta Platforms)
                with a pre-filled message. That interaction is governed by WhatsApp’s own terms and
                privacy policy. Choosing Email opens Gmail (Google) — the Gmail website on desktop,
                or the Gmail app when available on mobile — with a pre-filled message to us.
                Embedded maps are provided by Google and are subject to Google’s privacy terms.
                Some product imagery may be delivered from third-party CDNs when not self-hosted.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold tracking-tight">Retention</h2>
              <p className="mt-3 text-muted-foreground">
                Business correspondence is retained as long as needed for the enquiry, ongoing
                trade relationship, or applicable legal requirements, then deleted or archived
                according to our internal records practice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold tracking-tight">Your choices</h2>
              <p className="mt-3 text-muted-foreground">
                You may email{" "}
                <a
                  className="font-medium text-brand-red hover:underline"
                  href="mailto:support@mdfexport.com"
                >
                  support@mdfexport.com
                </a>{" "}
                to request access, correction, or deletion of enquiry records we hold, subject to
                legitimate business and legal retention needs.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold tracking-tight">Updates</h2>
              <p className="mt-3 text-muted-foreground">
                We may update this notice as our site or practices change. The “Last updated” date
                at the top reflects the latest revision.
              </p>
            </section>
          </div>
        </Container>
      </main>
    </div>
  );
}
