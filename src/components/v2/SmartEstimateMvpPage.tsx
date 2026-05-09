"use client";

import { DragEvent, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Clock3, FileJson, FileUp, ScanLine, Sparkles, Timer } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { EstimateDraft } from "@/lib/v2/mvp-store";
import { extractedBoqRows, pipelineSteps } from "./data";
import { type V2Locale } from "./localize";
import { useV2MvpState } from "./useV2MvpState";

type SmartEstimateMvpPageProps = {
  locale: V2Locale;
};

export function SmartEstimateMvpPage({ locale }: SmartEstimateMvpPageProps) {
  const t = useTranslations("v2.estimateMvp");
  const { state, actions } = useV2MvpState();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [running, setRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [readyDraft, setReadyDraft] = useState<EstimateDraft | null>(null);

  async function processFile(file: File | { name: string; hash: string }) {
    if (running) return;
    setRunning(true);
    setReadyDraft(null);
    setCompletedSteps(0);

    const hash = "hash" in file ? file.hash : await hashFile(file);
    const existing = state.estimateDrafts.find((draft) => draft.hash === hash);
    if (existing) {
      setReadyDraft(existing);
      setCompletedSteps(pipelineSteps.length);
      setRunning(false);
      toast(t("idempotent"));
      return;
    }

    for (let step = 1; step <= pipelineSteps.length; step += 1) {
      await delay(180);
      setCompletedSteps(step);
    }

    setReadyDraft({
      id: crypto.randomUUID(),
      fileName: file.name,
      hash,
      total: 84_200_000,
      confidence: 89,
      createdAt: new Date().toISOString(),
    });
    setRunning(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files.item(0);
    if (file) void processFile(file);
  }

  function commitDraft() {
    if (!readyDraft) return;
    actions.commitEstimate(readyDraft);
    toast(t("committed"));
  }

  return (
    <div className="mx-auto grid max-w-[1700px] gap-3 xl:grid-cols-[minmax(0,1fr)_460px]">
      <section className="space-y-3">
        <div className="rounded-md border border-slate-200 bg-white/90 p-5 shadow-sm">
          <Badge className="border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-50">
            {t("badge")}
          </Badge>
          <h1 className="mt-4 text-3xl font-semibold text-slate-950">{t("title")}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{t("subtitle")}</p>
        </div>

        <div
          className={cn(
            "relative grid min-h-[300px] place-items-center overflow-hidden rounded-md border border-dashed p-8 text-center transition",
            dragging ? "border-cyan-500 bg-cyan-50" : "border-cyan-200 bg-white/90 shadow-sm",
          )}
          onDragLeave={() => setDragging(false)}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDrop={handleDrop}
        >
          <input
            accept="application/pdf,image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.item(0);
              if (file) void processFile(file);
            }}
            ref={inputRef}
            type="file"
          />
          <div className="relative z-10 max-w-xl">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-md border border-cyan-200 bg-cyan-50 text-cyan-700">
              <FileUp className="h-9 w-9" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-slate-950">{t("dropTitle")}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{t("dropSubtitle")}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button className="bg-cyan-600 text-white hover:bg-cyan-500" onClick={() => inputRef.current?.click()}>
                <FileUp className="me-2 h-4 w-4" /> {t("chooseFile")}
              </Button>
              <Button className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50" onClick={() => void processFile({ name: "future-sample-tender.pdf", hash: "sample-tender-v2" })} variant="outline">
                <ScanLine className="me-2 h-4 w-4" /> {t("sample")}
              </Button>
            </div>
          </div>
        </div>

        {readyDraft ? (
          <section className="rounded-md border border-slate-200 bg-white/90 p-4 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">{t("review")}</h2>
                <p className="mt-1 text-xs text-slate-500" dir="ltr">{readyDraft.fileName}</p>
              </div>
              <Button className="bg-emerald-600 text-white hover:bg-emerald-500" onClick={commitDraft}>
                <CheckCircle2 className="me-2 h-4 w-4" /> {t("commit")}
              </Button>
            </div>
            <div className="overflow-hidden rounded-md border border-slate-200">
              {extractedBoqRows.map((row) => (
                <div className="grid grid-cols-[90px_1fr_80px_90px_100px] items-center border-t border-slate-200 px-3 py-3 text-sm text-slate-700 first:border-t-0" key={row.item}>
                  <span dir="ltr">{row.item}</span>
                  <span>{locale === "ar" ? row.ar : row.en}</span>
                  <span>{row.unit}</span>
                  <span dir="ltr">{row.qty.toLocaleString()}</span>
                  <span className="text-cyan-700">{row.confidence}%</span>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </section>

      <aside className="space-y-3">
        <section className="rounded-md border border-slate-200 bg-white/90 p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-cyan-700" />
            <h2 className="text-lg font-semibold text-slate-950">{t("pipeline")}</h2>
          </div>
          <div className="space-y-3">
            {pipelineSteps.map((step, index) => {
              const complete = index < completedSteps;
              const active = running && index === completedSteps;
              return (
                <div className="flex items-center gap-3" key={step.en}>
                  <div className={cn("grid h-9 w-9 place-items-center rounded-full border", complete ? "border-emerald-200 bg-emerald-50 text-emerald-700" : active ? "border-cyan-300 bg-cyan-50 text-cyan-700" : "border-slate-200 text-slate-400")}>
                    {complete ? <CheckCircle2 className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-800">{locale === "ar" ? step.ar : step.en}</p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                      <div className={cn("h-full rounded-full bg-cyan-500 transition-all", complete ? "w-full" : active ? "w-2/3" : "w-0")} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-md border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <FileJson className="h-5 w-5 text-amber-700" />
            <h2 className="text-lg font-semibold text-slate-950">{t("costTitle")}</h2>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Metric label={t("latency")} value={running ? "running" : "1.4s"} />
            <Metric label={t("cost")} value="$0.00" />
            <Metric label={t("confidence")} value={readyDraft ? `${readyDraft.confidence}%` : "--"} />
            <Metric label={t("drafts")} value={String(state.estimateDrafts.length)} />
          </div>
          <p className="mt-4 text-sm leading-6 text-amber-800">{t("costNote")}</p>
        </section>
      </aside>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-amber-200 bg-white p-3">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Timer className="h-4 w-4 text-cyan-700" />
        <span>{label}</span>
      </div>
      <p className="mt-2 text-lg font-semibold text-slate-950" dir="ltr">{value}</p>
    </div>
  );
}

async function hashFile(file: File) {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
