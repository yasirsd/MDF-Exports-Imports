import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ProductStage } from "./ProductStage";
import { ProductPill } from "./ProductPill";

/**
 * FAQ accordion on quieter charcoal stage.
 * faqs: { q, a }[]
 */
export function ProductFaq({ atmosphere, faqs, title = "Frequently asked questions", step = "FAQ" }) {
  return (
    <ProductStage atmosphere={atmosphere} step={step} id="faq" containerClassName="max-w-3xl">
      <ProductPill>Questions</ProductPill>
      <h2 className="mt-5 text-[clamp(1.6rem,3.5vw,2.35rem)] font-extrabold tracking-[-0.03em] text-white">
        {title}
      </h2>
      <Accordion type="single" collapsible className="mt-8 flex w-full flex-col gap-3">
        {faqs.map((f, i) => (
          <AccordionItem
            key={f.q}
            value={`faq-${i}`}
            className="border-white/12 bg-white/[0.04] shadow-none"
          >
            <AccordionTrigger className="text-left text-base text-white hover:text-white/90 hover:no-underline sm:text-lg">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-white/55">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ProductStage>
  );
}
