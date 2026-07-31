import { motion } from "motion/react";
import { Container } from "@/components/shared/Container";
import { EnquireActions } from "@/components/shared/EnquireActions";
import { SectionHeading } from "@/components/shared/SectionHeading";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/constants";
import { brandHello } from "@/lib/config";
import { fadeUp, viewportOnce } from "@/lib/motion";

const FAQ_MESSAGE = brandHello("I have a question about exporting.");

export function FAQ() {
  return (
    <section id="faq" className="section-py bg-surface-2" aria-label="Frequently asked questions">
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
              <motion.div key={faq.q} variants={fadeUp} custom={i}>
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
          <EnquireActions
            label="Ask a question"
            whatsappMessage={FAQ_MESSAGE}
            emailSubject="Export Question - MDF"
            emailBody={FAQ_MESSAGE}
            className="items-center"
          />
        </div>
      </Container>
    </section>
  );
}
