"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, easeInOut } from "motion/react";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Artificial delay to allow the page and background to fully render
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
          transition={{ duration: 0.8, ease: easeInOut }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#09090b]"
        >
          <div className="flex flex-col items-center">
            <div className="overflow-hidden pb-2">
              <motion.h1
                initial={{ y: "100%", opacity: 0, filter: "blur(10px)" }}
                animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter"
              >
                Mono.
              </motion.h1>
            </div>
            
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 120, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
              className="h-[2px] bg-purple-500 mt-4 rounded-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
