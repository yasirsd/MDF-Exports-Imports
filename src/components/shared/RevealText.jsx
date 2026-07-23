import { motion } from "motion/react";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Reveal a block of text/word-by-word on scroll into view.
 * When `split` is true the children string is animated per word.
 */
export function RevealText({
  as: Comp = "p",
  children,
  className,
  split = false,
  delay = 0,
  ...props
}) {
  const MotionComp = motion.create(Comp);

  if (split && typeof children === "string") {
    const words = children.split(" ");
    return (
      <MotionComp
        className={cn(className)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        {...props}
      >
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: "110%" },
                visible: {
                  y: "0%",
                  transition: { duration: 0.8, delay: delay + i * 0.04, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              {word}
              {i < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        ))}
      </MotionComp>
    );
  }

  return (
    <MotionComp
      className={cn(className)}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      {...props}
    >
      {children}
    </MotionComp>
  );
}
