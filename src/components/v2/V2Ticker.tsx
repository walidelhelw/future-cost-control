"use client";

import { motion } from "framer-motion";
import { tickerItems } from "./data";
import { pickText, type V2Locale } from "./localize";

type V2TickerProps = {
  locale: V2Locale;
};

export function V2Ticker({ locale }: V2TickerProps) {
  const items = [...tickerItems, ...tickerItems];

  return (
    <div className="overflow-hidden rounded-md border border-cyan-200 bg-white/85 py-2 text-xs text-slate-600 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
      <motion.div
        animate={{ x: locale === "ar" ? ["0%", "50%"] : ["0%", "-50%"] }}
        className="flex w-max items-center gap-8 whitespace-nowrap px-4"
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {items.map((item, index) => (
          <span className="flex items-center gap-3" key={`${item.en}-${index}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.5)]" />
            <span>{pickText(item, locale)}</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
