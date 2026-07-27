/** Shared Framer Motion variants and easing presets. */

export const easePremium = [0.16, 1, 0.3, 1];
export const easePremiumIn = [0.7, 0, 0.84, 0];

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.08, ease: easePremium },
  }),
};

/** Instant / near-instant reveal for prefers-reduced-motion. */
export const fadeUpReduced = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.01 },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.9, ease: easePremium } },
};

export const fadeInReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.01 } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: easePremium } },
};

export const staggerContainer = (stagger = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});

export const maskReveal = {
  hidden: { clipPath: "inset(0 0 100% 0)", opacity: 0 },
  visible: {
    clipPath: "inset(0 0 0% 0)",
    opacity: 1,
    transition: { duration: 1, ease: easePremium },
  },
};

/** Pick full or reduced variants based on the user's motion preference. */
export function motionSafe(reduced, full, reducedVariant = fadeUpReduced) {
  return reduced ? reducedVariant : full;
}

/** Default viewport options for whileInView. */
export const viewportOnce = { once: true, amount: 0.3 };
