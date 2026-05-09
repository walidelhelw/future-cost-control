"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Toaster } from "sonner";
import { Keyboard, Radio, ShieldCheck, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "./CommandPalette";
import { FutureAssistant } from "./FutureAssistant";
import { V2Navigation } from "./V2Navigation";
import type { V2Locale } from "./localize";

type V2ShellProps = {
  children: ReactNode;
  locale: V2Locale;
};

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

export function V2Shell({ children, locale }: V2ShellProps) {
  const t = useTranslations("v2.shell");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((current) => !current);
        return;
      }

      if (event.key === "/" && !isTypingTarget(event.target)) {
        event.preventDefault();
        setAssistantOpen(true);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[80] flex overflow-hidden bg-[#05070d] text-slate-100"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(0,212,212,0.18),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(245,158,11,0.12),transparent_26%),linear-gradient(135deg,#05070d_0%,#07111f_48%,#03040a_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:44px_44px]" />
      </div>

      <V2Navigation locale={locale} />

      <section className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="flex min-h-16 items-center gap-3 border-b border-white/10 bg-black/20 px-4 backdrop-blur-xl lg:px-6">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded border border-cyan-300/30 bg-cyan-300/10 px-2 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-cyan-100">
                {t("ceoEdition")}
              </span>
              <span className="rounded border border-emerald-300/20 bg-emerald-300/10 px-2 py-1 text-[11px] text-emerald-100">
                {t("demoData")}
              </span>
            </div>
            <p className="mt-1 truncate text-xs text-slate-500">
              {t("tagline")}
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300 md:flex">
            <Keyboard className="h-4 w-4 text-cyan-200" />
            <span>⌘K</span>
            <span className="text-slate-600">/</span>
          </div>

          <div className="hidden items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300 sm:flex">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            <span>{t("openDemo")}</span>
          </div>

          <div className="hidden items-center -space-x-2 rtl:space-x-reverse sm:flex">
            {["WE", "AM", "NO"].map((name, index) => (
              <motion.span
                animate={{ y: [0, -2, 0] }}
                className="grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-slate-900 text-[10px] font-semibold text-white"
                key={name}
                transition={{ delay: index * 0.2, duration: 2, repeat: Infinity }}
              >
                {name}
              </motion.span>
            ))}
            <span className="grid h-8 w-8 place-items-center rounded-full border border-cyan-300/30 bg-cyan-300/10">
              <Users className="h-4 w-4 text-cyan-100" />
            </span>
          </div>

          <Button
            className="h-9 border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
            onClick={() => setPaletteOpen(true)}
            size="sm"
            variant="outline"
          >
            <Radio className="me-2 h-4 w-4 text-cyan-200" />
            {t("command")}
          </Button>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto p-3 pb-24 sm:p-4 lg:p-5">
          {children}
        </main>
      </section>

      <CommandPalette
        locale={locale}
        onAskFuture={() => setAssistantOpen(true)}
        onOpenChange={setPaletteOpen}
        open={paletteOpen}
      />
      <FutureAssistant
        locale={locale}
        onOpenChange={setAssistantOpen}
        open={assistantOpen}
      />
      <Toaster richColors position={locale === "ar" ? "bottom-left" : "bottom-right"} />
    </div>
  );
}
