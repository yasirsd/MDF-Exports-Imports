import { useState } from "react";
import { motion } from "motion/react";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { brandHello, site } from "@/lib/config";
import { whatsappUrl } from "@/lib/utils";
import { products } from "@/lib/constants";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full min-h-[3rem] rounded-2xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-brand-red focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

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
    <a href={href} className="block rounded-2xl transition-colors hover:text-brand-red">
      {content}
    </a>
  ) : (
    content
  );
}

export function Contact() {
  const [form, setForm] = useState({ name: "", company: "", email: "", product: "", message: "" });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const buildMessage = () => {
    const lines = [
      brandHello("I'd like to enquire about exporting."),
      "",
      form.name && `Name: ${form.name}`,
      form.company && `Company: ${form.company}`,
      form.email && `Email: ${form.email}`,
      form.product && `Product of interest: ${form.product}`,
      form.message && `Details: ${form.message}`,
    ].filter(Boolean);
    return lines.join("\n");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    window.open(whatsappUrl(site.whatsapp, buildMessage()), "_blank", "noopener,noreferrer");
  };

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&z=10&output=embed`;

  return (
    <section id="contact" className="section-py bg-background">
      <Container>
        <SectionHeading
          contained={false}
          annotate
          eyebrow="Let's Trade"
          title="Start importing with us."
          description="Tell us what you need and where. Our team responds fast — usually within one business day."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* Left: details + map */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-6 rounded-3xl border border-border bg-surface p-8 shadow-soft sm:grid-cols-2">
              <ContactRow icon={Phone} label="Call us" value={site.phone} href={`tel:${site.phone}`} />
              <ContactRow icon={Mail} label="Email" value={site.email} href={`mailto:${site.email}`} />
              <ContactRow icon={MapPin} label="Location" value={site.location} />
              <ContactRow icon={Clock} label="Business hours" value={site.hours} />
            </div>

            <a
              href={whatsappUrl(site.whatsapp, brandHello("I'd like to start importing."))}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-3xl bg-success p-6 text-white shadow-soft transition-transform hover:scale-[1.01]"
            >
              <div className="flex items-center gap-4">
                <MessageCircle className="h-8 w-8" />
                <div>
                  <p className="text-lg font-extrabold">Chat on WhatsApp</p>
                  <p className="text-sm text-white/80">Fastest way to reach our export desk</p>
                </div>
              </div>
              <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>

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

          {/* Right: inquiry form */}
          <motion.form
            onSubmit={handleSubmit}
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-8 shadow-soft"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium">Name</label>
                <input id="name" name="name" required value={form.name} onChange={update("name")} className={inputCls} placeholder="Your full name" />
              </div>
              <div>
                <label htmlFor="company" className="mb-1.5 block text-sm font-medium">Company</label>
                <input id="company" name="company" value={form.company} onChange={update("company")} className={inputCls} placeholder="Company name" />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={update("email")} className={inputCls} placeholder="you@company.com" />
            </div>
            <div>
              <label htmlFor="product" className="mb-1.5 block text-sm font-medium">Product of interest</label>
              <select id="product" name="product" value={form.product} onChange={update("product")} className={cn(inputCls, "appearance-none")}>
                <option value="">Select a category</option>
                {products.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
                <option value="Other">Other / Mixed consignment</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium">Requirement details</label>
              <textarea id="message" name="message" rows={4} value={form.message} onChange={update("message")} className={cn(inputCls, "resize-none")} placeholder="Volumes, destination port, timelinesâ¦" />
            </div>

            <Button type="submit" variant="primary" size="lg" className="mt-2 w-full">
              <MessageCircle className="h-5 w-5" />
              Send via WhatsApp
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Prefer email? Write to{" "}
              <a href={`mailto:${site.email}`} className="font-semibold text-brand-red hover:underline">
                {site.email}
              </a>
            </p>
          </motion.form>
        </div>
      </Container>
    </section>
  );
}
