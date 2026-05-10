"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, CircleDollarSign, Sparkles } from "lucide-react";
import { moduleMetrics } from "./data";
import { CommandCenterCharts } from "./CommandCenterCharts";
import { EgyptProjectMap } from "./EgyptProjectMap";
import { LiveActivityFeed } from "./LiveActivityFeed";
import { V2Ticker } from "./V2Ticker";
import { pickText, type V2Locale } from "./localize";

type CommandCenterProps = {
  locale: V2Locale;
};

export function CommandCenter({ locale }: CommandCenterProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex max-w-[1800px] flex-col gap-3"
      initial={{ opacity: 0, y: 14 }}
      transition={{ duration: 0.35 }}
    >
      <V2Ticker locale={locale} />

      <section className="grid gap-3 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        <div className="grid max-h-[680px] gap-3 overflow-y-auto pe-1 md:grid-cols-2 xl:grid-cols-1">
          {moduleMetrics.map((metric, index) => (
            <Link
              className="group rounded-md border border-slate-200 bg-white/90 p-4 shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50/70"
              href={`/${locale}/v2/${metric.key === "estimate" ? "estimate" : metric.key}`}
              key={metric.key}
              prefetch={false}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500">{pickText(metric.label, locale)}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950" dir="ltr">
                    {metric.value}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500 transition group-hover:text-cyan-700 rtl:rotate-[-90deg]" />
              </div>
              <p className="mt-3 text-xs text-slate-400">
                {pickText(metric.delta, locale)}
              </p>
              <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-200">
                <motion.div
                  animate={{ width: `${58 + index * 8}%` }}
                  className="h-full rounded-full bg-cyan-500"
                  initial={{ width: 0 }}
                  transition={{ delay: 0.2 + index * 0.08, duration: 0.6 }}
                />
              </div>
            </Link>
          ))}
        </div>

        <EgyptProjectMap locale={locale} />
        <LiveActivityFeed locale={locale} />
      </section>

      <section className="grid gap-3 lg:grid-cols-[1fr_320px]">
        <CommandCenterCharts locale={locale} />
        <div className="rounded-md border border-cyan-200 bg-cyan-50 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-md bg-cyan-600 text-white">
              <CircleDollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-cyan-700">
                {locale === "ar" ? "شفافية تكلفة AI" : "AI spend transparency"}
              </p>
              <p className="text-2xl font-semibold text-slate-950">$37.50</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            {locale === "ar"
              ? "كل استدعاء نموذج يعرض الرموز، التكلفة، وزمن الاستجابة في واجهة العرض."
              : "Every model call surfaces tokens, cost, and latency in the demo UI."}
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-md border border-cyan-200 bg-white px-3 py-2 text-xs text-slate-600">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span>{locale === "ar" ? "حارس ميزانية يومية: $25" : "Daily budget guard: $25"}</span>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
