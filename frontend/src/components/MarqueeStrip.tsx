import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useGetSiteSettings } from "@/api-client";
import { useLanguage } from "@/lib/i18n";

export function MarqueeStrip() {
  const { data: settings } = useGetSiteSettings();
  const { t } = useLanguage();
  const text = t(settings?.marqueeText) || "BLIND KISS // DEIXA-TE IR // SENTE O CAOS // PORTO // ";
  // Duplicate enough times to ensure smooth scrolling
  const repeatedText = Array(10).fill(text).join("");

  return (
    <div className="w-full bg-primary text-primary-foreground py-3 border-y-4 border-border overflow-hidden flex whitespace-nowrap">
      <motion.div
        className="font-display text-2xl tracking-widest uppercase flex-shrink-0"
        animate={{ x: [0, -1000] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 20, // Adjust speed here
        }}
      >
        {repeatedText}
      </motion.div>
      <motion.div
        className="font-display text-2xl tracking-widest uppercase flex-shrink-0"
        animate={{ x: [0, -1000] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 20,
        }}
      >
        {repeatedText}
      </motion.div>
    </div>
  );
}
