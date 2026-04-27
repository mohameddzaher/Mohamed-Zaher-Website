"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function PageLoader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("mz-loaded")) {
      setDone(true);
      return;
    }
    const t = setTimeout(() => {
      sessionStorage.setItem("mz-loaded", "1");
      setDone(true);
    }, 1100);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg)]"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-24px] rounded-full border border-[var(--color-gold-300)]/40"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-44px] rounded-full border border-[var(--color-violet-500)]/30"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[var(--color-gold-300)] to-[var(--color-violet-500)] flex items-center justify-center font-display text-3xl font-black text-[#050507] shadow-[0_0_60px_-10px_var(--color-gold-300)]"
            >
              MZ
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
