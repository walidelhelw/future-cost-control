"use client";

import { motion } from "framer-motion";
import { AlertTriangle, MapPin } from "lucide-react";
import { projectPins } from "./data";
import { formatV2Money, pickText, type V2Locale } from "./localize";

type EgyptProjectMapProps = {
  locale: V2Locale;
};

export function EgyptProjectMap({ locale }: EgyptProjectMapProps) {
  return (
    <section className="relative min-h-[430px] overflow-hidden rounded-md border border-white/10 bg-[#07111d]/80 p-4 shadow-[inset_0_0_80px_rgba(0,212,212,0.08)]">
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">
            {locale === "ar" ? "خريطة المشاريع" : "Egypt project map"}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {locale === "ar" ? "تكلفة حية عبر مصر" : "Live cost pulse across Egypt"}
          </h2>
        </div>
        <div className="rounded-md border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs text-amber-100">
          {locale === "ar" ? "2 إنذارات تكلفة" : "2 cost alerts"}
        </div>
      </div>

      <div className="absolute inset-0 opacity-60">
        <svg className="h-full w-full" viewBox="0 0 900 560" role="img">
          <defs>
            <linearGradient id="egypt-v2" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#00d4d4" stopOpacity="0.26" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.14" />
            </linearGradient>
          </defs>
          <path
            d="M392 56 516 66 534 147 505 238 536 335 502 486 376 504 340 392 298 306 328 206 304 112Z"
            fill="url(#egypt-v2)"
            stroke="#67e8f9"
            strokeOpacity="0.42"
            strokeWidth="2"
          />
          <path
            d="M536 150 686 242 626 356 536 335 506 238Z"
            fill="rgba(0,212,212,0.12)"
            stroke="#67e8f9"
            strokeOpacity="0.22"
            strokeWidth="2"
          />
          <path d="M505 85 C475 180 472 260 500 358" stroke="#f8fafc" strokeDasharray="6 8" strokeOpacity="0.15" strokeWidth="2" />
          <path d="M300 220 C394 232 460 226 538 238" stroke="#f8fafc" strokeDasharray="6 8" strokeOpacity="0.12" strokeWidth="2" />
        </svg>
      </div>

      {projectPins.map((pin, index) => (
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          className="group absolute z-20"
          initial={{ opacity: 0, y: 12 }}
          key={pin.name.en}
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          transition={{ delay: 0.1 + index * 0.12, duration: 2.4, repeat: Infinity }}
        >
          <button className="relative grid h-10 w-10 place-items-center rounded-full border border-cyan-200/50 bg-cyan-300/15 text-cyan-100 shadow-[0_0_28px_rgba(0,212,212,0.36)]">
            {pin.alert ? (
              <span className="absolute h-10 w-10 animate-ping rounded-full bg-amber-300/30" />
            ) : null}
            <MapPin className="relative h-5 w-5" />
          </button>
          <div className="pointer-events-none absolute top-12 w-56 rounded-md border border-white/10 bg-black/90 p-3 text-start opacity-0 shadow-xl transition group-hover:opacity-100 rtl:end-0 ltr:start-0">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              {pin.alert ? <AlertTriangle className="h-3.5 w-3.5 text-amber-300" /> : null}
              <span>{pickText(pin.city, locale)}</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-white">
              {pickText(pin.name, locale)}
            </p>
            <p className="mt-2 text-xs text-cyan-100" dir="ltr">
              {formatV2Money(pin.value * 1_000_000, locale)}
            </p>
          </div>
        </motion.div>
      ))}

      <div className="absolute bottom-4 start-4 z-10 grid gap-2 sm:grid-cols-3">
        {[
          ["PV", "EGP 192M"],
          ["EV", "EGP 176M"],
          ["AC", "EGP 184M"],
        ].map(([label, value]) => (
          <div className="rounded-md border border-white/10 bg-black/45 px-3 py-2" key={label}>
            <p className="text-[10px] text-slate-500">{label}</p>
            <p className="text-sm font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
