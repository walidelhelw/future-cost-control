"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BellRing,
  Bot,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  DatabaseZap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { stubPages } from "./data";
import { pickText, type V2Locale } from "./localize";

type StubKey = keyof typeof stubPages;

type ModuleStubPageProps = {
  locale: V2Locale;
  pageKey: StubKey;
};

const cards = [
  { icon: DatabaseZap, ar: "مصدر بيانات مصرح", en: "Authorized data source" },
  { icon: ClipboardList, ar: "سير عمل قابل للتنفيذ", en: "Executable workflow" },
  { icon: BellRing, ar: "تنبيهات داخلية وبريد", en: "In-app and email alerts" },
  { icon: CheckCircle2, ar: "سجل تدقيق كامل", en: "Full audit trail" },
];

export function ModuleStubPage({ locale, pageKey }: ModuleStubPageProps) {
  const page = stubPages[pageKey];

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto grid max-w-[1500px] gap-3 xl:grid-cols-[minmax(0,1fr)_360px]"
      initial={{ opacity: 0, y: 12 }}
    >
      <section className="overflow-hidden rounded-md border border-white/10 bg-black/35">
        <div className="relative min-h-[420px] p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(0,212,212,0.18),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(245,158,11,0.14),transparent_26%)]" />
          <div className="relative z-10 flex h-full min-h-[360px] flex-col justify-between">
            <div>
              <Badge className="border-cyan-300/30 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/10">
                {locale === "ar" ? "لوحة تشغيل V2" : "V2 operations board"}
              </Badge>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight text-white md:text-6xl">
                {pickText(page.title, locale)}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
                {pickText(page.subtitle, locale)}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              {cards.map((card) => (
                <div className="rounded-md border border-white/10 bg-white/[0.05] p-4" key={card.en}>
                  <card.icon className="h-5 w-5 text-cyan-200" />
                  <p className="mt-3 text-sm text-slate-200">
                    {locale === "ar" ? card.ar : card.en}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <aside className="space-y-3">
        <div className="rounded-md border border-cyan-300/20 bg-cyan-300/10 p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-md bg-cyan-300 text-black">
              <CircleDollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-cyan-100">
                {locale === "ar" ? "مؤشر العرض" : "Demo metric"}
              </p>
              <p className="text-3xl font-semibold text-white" dir="ltr">
                {page.stat}
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-300">
            {locale === "ar"
              ? "تعرض المؤشر التنفيذي والحالات الحرجة وسجل الحركة المرتبط بهذا المسار."
              : "Shows the executive metric, critical states, and activity trail for this workflow."}
          </p>
        </div>

        <div className="rounded-md border border-white/10 bg-black/35 p-4">
          <h2 className="text-lg font-semibold text-white">
            {locale === "ar" ? "حالة التشغيل" : "Operating status"}
          </h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            {[
              locale === "ar" ? "قراءات مصرح بها حسب الدور" : "Role-scoped reads",
              locale === "ar" ? "حالات حرجة واضحة" : "Clear critical states",
              locale === "ar" ? "تكلفة وتدقيق ظاهران" : "Visible cost and audit trails",
            ].map((item) => (
              <div className="flex items-center gap-2" key={item}>
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <Button asChild className="w-full bg-cyan-300 text-black hover:bg-cyan-200">
          <Link href={`/${locale}/v2`}>
            <Bot className="me-2 h-4 w-4" />
            {locale === "ar" ? "العودة لمركز القيادة" : "Back to Command Center"}
            <ArrowUpRight className="ms-2 h-4 w-4 rtl:rotate-[-90deg]" />
          </Link>
        </Button>
      </aside>
    </motion.div>
  );
}
