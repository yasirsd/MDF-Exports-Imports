import { motion } from "motion/react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { faqs } from "@/lib/constants";
import { brandHello, site } from "@/lib/config";
import { whatsappUrl } from "@/lib/utils";
import { fadeUp, fadeUpReduced, motionSafe, viewportOnce } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function FAQ() {
  const reduced = usePrefersReducedMotion();
  const variants = motionSafe(reduced, fadeUp, fadeUpReduced);
  const askHref = whatsappUrl(site.whatsapp, brandHello("I have a question about exporting."));

  return (
    <section className="section-py bg-surface-2">
      <Container className="max-w-4xl">
        <SectionHeading
          contained={false}
          align="center"
          eyebrow="Answers"
          title="Frequently asked questions."
        />

        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} className="mt-12">
          <Accordion type="single" collapsible className="flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <motion.div key={faq.q} variants={variants} custom={i}>
                <AccordionItem value={`item-${i}`}>
                  <AccordionTrigger>{faq.q}</AccordionTrigger>
                  <AccordionContent>{faq.a}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl border border-border bg-surface p-8 text-center shadow-soft">
          <p className="text-lg font-semibold">Still have questions?</p>
          <p className="text-muted-foreground">Our export team is a message away.</p>
          <Button asChild variant="primary" size="lg">
            <a href={askHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp
            </a>
          </Button>
        </div>
      </Container>
    </section>
  );
}
