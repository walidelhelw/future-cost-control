"use client";

import { motion } from "framer-motion";
import { Activity, CircleDot } from "lucide-react";
import { activityItems } from "./data";
import { pickText, type V2Locale } from "./localize";

type LiveActivityFeedProps = {
  locale: V2Locale;
};

const toneClass: Record<string, string> = {
  amber: "bg-amber-300",
  green: "bg-emerald-300",
  rose: "bg-rose-300",
  teal: "bg-cyan-300",
};

export function LiveActivityFeed({ locale }: LiveActivityFeedProps) {
  return (
    <aside className="rounded-md border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            {locale === "ar" ? "البث الحي" : "Live feed"}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-950">
            {locale === "ar" ? "نشاط آخر 24 ساعة" : "Last 24h activity"}
          </h3>
        </div>
        <Activity className="h-5 w-5 text-cyan-700" />
      </div>

      <div className="space-y-3">
        {activityItems.map((item, index) => (
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="rounded-md border border-slate-200 bg-slate-50/80 p-3"
            initial={{ opacity: 0, x: locale === "ar" ? -12 : 12 }}
            key={item.title.en}
            transition={{ delay: index * 0.08 }}
          >
            <div className="flex items-start gap-3">
              <CircleDot className={`mt-0.5 h-4 w-4 ${toneClass[item.tone] ?? "bg-cyan-300"} rounded-full text-slate-700`} />
              <div className="min-w-0">
                <p className="text-sm leading-6 text-slate-800">
                  {pickText(item.title, locale)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {pickText(item.meta, locale)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 rounded-md border border-cyan-200 bg-cyan-50 p-3">
        <p className="text-xs text-cyan-800">
          {locale === "ar"
            ? "Future يراقب الانحرافات، الموافقات، وتكلفة الذكاء الاصطناعي."
            : "Future is watching variance, approvals, and AI spend."}
        </p>
      </div>
    </aside>
  );
}
