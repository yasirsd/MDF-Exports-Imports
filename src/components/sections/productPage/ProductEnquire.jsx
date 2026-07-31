import { Check } from "lucide-react";
import { motion } from "motion/react";
import { EnquireActions } from "@/components/shared/EnquireActions";
import { ProductPill } from "./ProductPill";
import { ProductStage } from "./ProductStage";
import { useInViewMotion } from "./useInViewMotion";
import { cn } from "@/lib/utils";

/**
 * Warm Arrival-style CTA stage + WhatsApp/email + checklist.
 */
export function ProductEnquire({
  atmosphere,
  title = "Enquire for this programme",
  lead,
  enquireMessage,
  emailSubject = "Export Enquiry — MDF",
  checklist = [],
  step = "Enquire",
}) {
  const { container, item } = useInViewMotion();

  return (
    <ProductStage atmosphere={atmosphere} step={step} id="enquire">
      <motion.div className="mx-auto max-w-3xl text-center" {...container}>
        <ProductPill className="border-brand-orange/40 text-brand-orange-bright">
          Ready when you are
        </ProductPill>
        <motion.h2
          className="mt-5 text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-white"
          {...item}
        >
          {title}
        </motion.h2>
        {lead ? (
          <motion.p
            className="mx-auto mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-white/60"
            {...item}
          >
            {lead}
          </motion.p>
        ) : null}

        <motion.div className="mt-8 flex justify-center" {...item}>
          <EnquireActions
            tone="dark"
            magnetic
            label="Enquire now"
            whatsappMessage={enquireMessage}
            emailSubject={emailSubject}
            emailBody={enquireMessage}
            whatsappClassName="shadow-glow"
            className="items-center"
          />
        </motion.div>

        {checklist.length > 0 ? (
          <motion.ul
            className="mx-auto mt-10 grid max-w-xl gap-2 text-left sm:grid-cols-2"
            {...item}
          >
            {checklist.map((c) => (
              <li
                key={c}
                className={cn(
                  "flex items-start gap-2.5 rounded-xl border border-brand-orange/20 bg-brand-orange/[0.06] px-3.5 py-3"
                )}
              >
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange-bright"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span className="text-sm text-white/70">{c}</span>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </motion.div>
    </ProductStage>
  );
}
