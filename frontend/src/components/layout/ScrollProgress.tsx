"use client";

import { motion, useScroll } from "framer-motion";

/**
 * Scroll progress bar synced 1:1 with native scroll.
 *
 * No spring/damping — those add a perceived "lag" that feels juddery
 * when paired with the Header's background transition. The bar should
 * track the scroll exactly so the eye reads it as a continuous motion
 * rather than a second animation chasing the first.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="fixed top-0 left-0 right-0 h-px origin-left z-[60] bg-gradient-to-r from-transparent via-[var(--color-gold-300)] to-transparent will-change-transform"
    />
  );
}
