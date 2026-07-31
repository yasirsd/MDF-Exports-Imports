import { useState } from "react";
import { motion } from "motion/react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { EnquireActions } from "@/components/shared/EnquireActions";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { brandHello, site } from "@/lib/config";
import { gmailComposeUrl, openEmailCompose, telUrl, cn } from "@/lib/utils";
import { products } from "@/lib/constants";
import { fadeUp, fadeUpReduced, motionSafe, viewportOnce } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const START_IMPORTING = brandHello("I'd like to start importing.");

const inputCls =
  "w-full min-h-[3rem] rounded-2xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-brand-red focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

function ContactRow({ icon: Icon, label, value, href }) {
  const content = (
    <div className="flex items-start gap-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-red/10 text-brand-red">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
  return href ? (
    <a
      href={href}
      className="block rounded-2xl transition-colors hover:text-brand-red"
      target={href.startsWith("https://mail.google.com") ? "_blank" : undefined}
      rel={href.startsWith("https://mail.google.com") ? "noopener noreferrer" : undefined}
      onClick={(e) => {
        if (href.startsWith("https://mail.google.com") || href.startsWith("mailto:")) {
          e.preventDefault();
          openEmailCompose(site.email, { subject: "Export Enquiry — MDF" });
          return;
        }
        if (href.startsWith("tel:")) {
          e.preventDefault();
          window.location.assign(href);
        }
      }}
    >
      {content}
    </a>
  ) : (
    content
  );
}

function validateForm(form) {
  const errors = {};
  const name = form.name.trim();
  const email = form.email.trim();
  const message = form.message.trim();

  if (name.length < 2) errors.name = "Please enter your name (at least 2 characters).";
  if (name.length > 80) errors.name = "Name is too long.";
  if (!email) errors.email = "Email is required so we can follow up.";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";
  if (form.company.trim().length > 120) errors.company = "Company name is too long.";
  if (!form.product) errors.product = "Select a product category.";
  if (message.length < 10) {
    errors.message = "Add a short note about volumes, destination, or timing.";
  } else if (message.length > 1200) {
    errors.message = "Message is too long (max 1200 characters).";
  }

  return errors;
}

export function Contact() {
  const reduced = usePrefersReducedMotion();
  const variants = motionSafe(reduced, fadeUp, fadeUpReduced);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    product: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const update = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    if (touched[key]) {
      setErrors((prev) => {
        const next = validateForm({ ...form, [key]: value });
        return { ...prev, [key]: next[key] };
      });
    }
  };

  const markTouched = (key) => () => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors((prev) => {
      const next = validateForm(form);
      return { ...prev, [key]: next[key] };
    });
  };

  const buildMessage = () => {
    const lines = [
      brandHello("I'd like to enquire about exporting."),
      "",
      form.name.trim() && `Name: ${form.name.trim()}`,
      form.company.trim() && `Company: ${form.company.trim()}`,
      form.email.trim() && `Email: ${form.email.trim()}`,
      form.product && `Product of interest: ${form.product}`,
      form.message.trim() && `Details: ${form.message.trim()}`,
    ].filter(Boolean);
    return lines.join("\n");
  };

  const markFormTouched = () => {
    setTouched({
      name: true,
      company: true,
      email: true,
      product: true,
      message: true,
    });
  };

  const validateBeforeSend = () => {
    const nextErrors = validateForm(form);
    setErrors(nextErrors);
    markFormTouched();
    return Object.keys(nextErrors).length === 0;
  };

  const enquiryMessage = buildMessage();

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&z=16&output=embed`;

  return (
    <section aria-label="Contact" className="section-py bg-background">
      <Container>
        <SectionHeading
          contained={false}
          annotate
          eyebrow="Let's Trade"
          title="Start importing with us."
          description="Tell us what you need and where. Our team responds fast. Usually within one business day."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <motion.div
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-6 rounded-3xl border border-border bg-surface p-8 shadow-soft sm:grid-cols-2">
              <ContactRow icon={Phone} label="Call us" value={site.phone} href={telUrl(site.phone)} />
              <ContactRow
                icon={Mail}
                label="Email"
                value={site.email}
                href={gmailComposeUrl(site.email, { subject: "Export Enquiry — MDF" })}
              />
              <ContactRow icon={MapPin} label="Location" value={site.location} />
              <ContactRow icon={Clock} label="Business hours" value={site.hours} />
            </div>

            <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft sm:p-8">
              <p className="text-lg font-extrabold">Reach the export desk</p>
              <p className="mt-1 text-sm text-muted-foreground">
                WhatsApp, email, or a quick call — pick what works for you.
              </p>
              <EnquireActions
                className="mt-5"
                label="Contact us"
                whatsappMessage={START_IMPORTING}
                emailSubject="Export Enquiry — MDF"
                emailBody={START_IMPORTING}
              />
            </div>

            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-border shadow-soft">
              <iframe
                title={`Map of ${site.location}`}
                src={mapSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full grayscale-[0.2]"
                allowFullScreen
              />
            </div>
          </motion.div>

          <motion.form
            onSubmit={(e) => e.preventDefault()}
            noValidate
            variants={variants}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-8 shadow-soft"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={update("name")}
                  onBlur={markTouched("name")}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={cn(inputCls, errors.name && "border-brand-red")}
                  placeholder="Your full name"
                />
                {errors.name ? (
                  <p id="name-error" className="mt-1.5 text-xs text-brand-red">
                    {errors.name}
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor="company" className="mb-1.5 block text-sm font-medium">
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  autoComplete="organization"
                  value={form.company}
                  onChange={update("company")}
                  onBlur={markTouched("company")}
                  aria-invalid={Boolean(errors.company)}
                  aria-describedby={errors.company ? "company-error" : undefined}
                  className={cn(inputCls, errors.company && "border-brand-red")}
                  placeholder="Company name"
                />
                {errors.company ? (
                  <p id="company-error" className="mt-1.5 text-xs text-brand-red">
                    {errors.company}
                  </p>
                ) : null}
              </div>
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={update("email")}
                onBlur={markTouched("email")}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={cn(inputCls, errors.email && "border-brand-red")}
                placeholder="you@company.com"
              />
              {errors.email ? (
                <p id="email-error" className="mt-1.5 text-xs text-brand-red">
                  {errors.email}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="product" className="mb-1.5 block text-sm font-medium">
                Product of interest
              </label>
              <select
                id="product"
                name="product"
                required
                value={form.product}
                onChange={update("product")}
                onBlur={markTouched("product")}
                aria-invalid={Boolean(errors.product)}
                aria-describedby={errors.product ? "product-error" : undefined}
                className={cn(inputCls, "appearance-none", errors.product && "border-brand-red")}
              >
                <option value="">Select a product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
                <option value="Other">Other / Mixed consignment</option>
              </select>
              {errors.product ? (
                <p id="product-error" className="mt-1.5 text-xs text-brand-red">
                  {errors.product}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
                Requirement details
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                value={form.message}
                onChange={update("message")}
                onBlur={markTouched("message")}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "message-error" : undefined}
                className={cn(inputCls, "resize-none", errors.message && "border-brand-red")}
                placeholder="Volumes, destination port, timelines…"
              />
              {errors.message ? (
                <p id="message-error" className="mt-1.5 text-xs text-brand-red">
                  {errors.message}
                </p>
              ) : null}
            </div>

            <EnquireActions
              className="mt-2 w-full"
              density="stack"
              label="Send enquiry"
              channels={["whatsapp", "email"]}
              whatsappMessage={enquiryMessage}
              emailSubject="Export Enquiry — MDF"
              emailBody={enquiryMessage}
              onBeforeChannel={validateBeforeSend}
            />
            <p className="text-center text-xs text-muted-foreground">
              Choose WhatsApp or email — your form details are included either way.
            </p>
          </motion.form>
        </div>
      </Container>
    </section>
  );
}
