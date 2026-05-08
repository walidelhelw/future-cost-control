"use client";

import { DragEvent, useMemo, useState } from "react";
import type { ComponentType } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock3,
  FileJson,
  FileUp,
  Gauge,
  ScanLine,
  Sparkles,
  Timer,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { extractedBoqRows, pipelineSteps } from "./data";
import { formatV2Number, pickText, type V2Locale } from "./localize";

type SmartEstimatePageProps = {
  locale: V2Locale;
};

export function SmartEstimatePage({ locale }: SmartEstimatePageProps) {
  const [dragging, setDragging] = useState(false);
  const [hasFile, setHasFile] = useState(true);
  const completedSteps = hasFile ? 6 : 2;
  const avgConfidence = useMemo(
    () =>
      extractedBoqRows.reduce((total, row) => total + row.confidence, 0) /
      extractedBoqRows.length,
    []
  );

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    setHasFile(true);
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto grid max-w-[1700px] gap-3 xl:grid-cols-[minmax(0,1fr)_460px]"
      initial={{ opacity: 0, y: 12 }}
    >
      <section className="space-y-3">
        <div className="rounded-md border border-white/10 bg-black/35 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge className="border-cyan-300/30 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/10">
                {locale === "ar" ? "Gemini pipeline" : "Gemini pipeline"}
              </Badge>
              <h1 className="mt-4 text-3xl font-semibold text-white">
                {locale === "ar" ? "حوّل المناقصة إلى BOQ قابل للمراجعة" : "Turn a tender into a reviewable BOQ"}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                {locale === "ar"
                  ? "واجهة العرض توضّح كل خطوة: رفع، قراءة، استخراج، مطابقة، تحقق، ثم مراجعة بشرية قبل الحفظ."
                  : "The demo shell exposes every step: upload, parse, extract, match, validate, then human review before commit."}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Metric icon={Gauge} label={locale === "ar" ? "الثقة" : "Confidence"} value={`${formatV2Number(avgConfidence, locale)}%`} />
              <Metric icon={Timer} label={locale === "ar" ? "الزمن" : "Latency"} value="18.6s" />
            </div>
          </div>
        </div>

        <div
          className={cn(
            "relative grid min-h-[300px] place-items-center overflow-hidden rounded-md border border-dashed p-8 text-center transition",
            dragging
              ? "border-cyan-300 bg-cyan-300/10"
              : "border-cyan-300/25 bg-[#07111d]/80"
          )}
          onDragLeave={() => setDragging(false)}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDrop={handleDrop}
        >
          <motion.div
            animate={{ rotate: [0, 2, -2, 0], scale: [1, 1.02, 1] }}
            className="absolute inset-6 rounded-md border border-cyan-300/10"
            transition={{ duration: 5, repeat: Infinity }}
          />
          <div className="relative z-10 max-w-xl">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-md border border-cyan-300/40 bg-cyan-300/10 text-cyan-100 shadow-[0_0_42px_rgba(0,212,212,0.28)]">
              <FileUp className="h-9 w-9" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-white">
              {locale === "ar" ? "اسحب ملف PDF أو صورة مخطط هنا" : "Drop tender PDF or drawing image here"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {locale === "ar"
                ? "يتم حساب البصمة، تتبع الوظيفة، وإظهار التكلفة قبل تحويل البنود إلى مسودة تقدير."
                : "File fingerprinting, job tracking, and spend visibility run before BOQ lines become a draft estimate."}
            </p>
            <Button
              className="mt-5 bg-cyan-300 text-black hover:bg-cyan-200"
              onClick={() => setHasFile(true)}
            >
              <ScanLine className="me-2 h-4 w-4" />
              {locale === "ar" ? "تشغيل عرض الاستخراج" : "Run extraction demo"}
            </Button>
          </div>
        </div>

        <section className="rounded-md border border-white/10 bg-black/35 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">
              {locale === "ar" ? "مراجعة البنود المستخرجة" : "Extracted BOQ review"}
            </h2>
            <Badge className="bg-emerald-400/15 text-emerald-100 hover:bg-emerald-400/15">
              {locale === "ar" ? "مسودة فقط" : "Draft only"}
            </Badge>
          </div>
          <div className="overflow-hidden rounded-md border border-white/10">
            <div className="grid grid-cols-[90px_1fr_90px_90px_110px] bg-white/[0.04] px-3 py-2 text-xs text-slate-500">
              <span>{locale === "ar" ? "الكود" : "Code"}</span>
              <span>{locale === "ar" ? "البند" : "Item"}</span>
              <span>{locale === "ar" ? "الوحدة" : "Unit"}</span>
              <span>{locale === "ar" ? "الكمية" : "Qty"}</span>
              <span>{locale === "ar" ? "الثقة" : "Confidence"}</span>
            </div>
            {extractedBoqRows.map((row) => (
              <div
                className="grid grid-cols-[90px_1fr_90px_90px_110px] items-center border-t border-white/10 px-3 py-3 text-sm text-slate-200"
                key={row.item}
              >
                <span dir="ltr">{row.item}</span>
                <span>{locale === "ar" ? row.ar : row.en}</span>
                <span>{row.unit}</span>
                <span dir="ltr">{row.qty.toLocaleString()}</span>
                <span className="text-cyan-100">{row.confidence}%</span>
              </div>
            ))}
          </div>
        </section>
      </section>

      <aside className="space-y-3">
        <section className="rounded-md border border-white/10 bg-black/35 p-4">
          <div className="mb-4 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-cyan-200" />
            <h2 className="text-lg font-semibold text-white">
              {locale === "ar" ? "خطوات وظيفة AI" : "AI job pipeline"}
            </h2>
          </div>
          <div className="space-y-3">
            {pipelineSteps.map((step, index) => {
              const complete = index < completedSteps;
              const active = index === completedSteps;
              return (
                <div className="flex items-center gap-3" key={step.en}>
                  <div
                    className={cn(
                      "grid h-9 w-9 place-items-center rounded-full border",
                      complete
                        ? "border-emerald-300/40 bg-emerald-300/15 text-emerald-100"
                        : active
                          ? "border-cyan-300/50 bg-cyan-300/15 text-cyan-100"
                          : "border-white/10 text-slate-600"
                    )}
                  >
                    {complete ? <CheckCircle2 className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white">{pickText(step, locale)}</p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        animate={{ width: complete ? "100%" : active ? "62%" : "0%" }}
                        className="h-full rounded-full bg-cyan-300"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-md border border-amber-300/20 bg-amber-300/10 p-4">
          <div className="flex items-center gap-3">
            <FileJson className="h-5 w-5 text-amber-200" />
            <h2 className="text-lg font-semibold text-white">
              {locale === "ar" ? "تكلفة وشفافية الاستدعاء" : "Cost and latency"}
            </h2>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Metric icon={Sparkles} label={locale === "ar" ? "الرموز" : "Tokens"} value="18.4K" />
            <Metric icon={Timer} label={locale === "ar" ? "التكلفة" : "Cost"} value="$0.42" />
          </div>
          <p className="mt-4 text-sm leading-6 text-amber-50/80">
            {locale === "ar"
              ? "كل وظيفة تعرض التكلفة قبل الحفظ حتى يفهم الرئيس أين يذهب إنفاق AI."
              : "Every job shows spend before commit so the CEO sees where AI budget goes."}
          </p>
        </section>
      </aside>
    </motion.div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Icon className="h-4 w-4 text-cyan-200" />
        <span>{label}</span>
      </div>
      <p className="mt-2 text-lg font-semibold text-white" dir="ltr">
        {value}
      </p>
    </div>
  );
}
