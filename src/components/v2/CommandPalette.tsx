"use client";

import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import type { ComponentType } from "react";
import {
  AlertTriangle,
  Bot,
  Calculator,
  Database,
  FileClock,
  FileSpreadsheet,
  FolderKanban,
  Gauge,
  GitBranch,
  HardHat,
  Search,
  Settings2,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { navItems, type V2NavKey } from "./data";
import { pickText, type V2Locale } from "./localize";

const iconMap: Partial<Record<V2NavKey, ComponentType<{ className?: string }>>> = {
  admin: Settings2,
  ask: Bot,
  boq: Calculator,
  cashflow: TrendingUp,
  change: GitBranch,
  cost: Gauge,
  estimate: Calculator,
  estimates: FileSpreadsheet,
  field: HardHat,
  flow: Sparkles,
  home: Sparkles,
  productivity: Zap,
  projects: FolderKanban,
  rates: Database,
  rfq: FileClock,
  risks: AlertTriangle,
  suppliers: Users,
};

type CommandPaletteProps = {
  locale: V2Locale;
  onAskFuture: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export function CommandPalette({
  locale,
  onAskFuture,
  onOpenChange,
  open,
}: CommandPaletteProps) {
  const router = useRouter();

  return (
    <Command.Dialog
      className="fixed start-1/2 top-24 z-[120] w-[min(92vw,720px)] -translate-x-1/2 overflow-hidden rounded-md border border-cyan-200 bg-white/95 text-slate-950 shadow-[0_24px_80px_rgba(15,23,42,0.2)] backdrop-blur-2xl"
      label="Future command palette"
      onOpenChange={onOpenChange}
      open={open}
    >
      <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
        <Search className="h-4 w-4 text-cyan-700" />
        <Command.Input
          autoFocus
          className="h-9 flex-1 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-500"
          placeholder={
            locale === "ar"
              ? "ابحث أو اكتب أمرا تنفيذيا..."
              : "Search or run an executive command..."
          }
        />
      </div>
      <Command.List className="max-h-[420px] overflow-y-auto p-2">
        <Command.Empty className="px-3 py-8 text-center text-sm text-slate-500">
          {locale === "ar" ? "لا توجد نتائج" : "No results"}
        </Command.Empty>
        <Command.Group
          className="text-xs text-slate-500"
          heading={locale === "ar" ? "الأوامر" : "Commands"}
        >
          <Command.Item
            className="flex cursor-pointer items-center gap-3 rounded px-3 py-3 text-sm text-slate-700 data-[selected=true]:bg-cyan-50 data-[selected=true]:text-cyan-950"
            onSelect={() => {
              onAskFuture();
              onOpenChange(false);
            }}
          >
            <Sparkles className="h-4 w-4 text-cyan-700" />
            <span>{locale === "ar" ? "افتح مساعد Future" : "Open Future assistant"}</span>
            <kbd className="ms-auto rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] text-slate-500">
              /
            </kbd>
          </Command.Item>
        </Command.Group>
        <Command.Group
          className="text-xs text-slate-500"
          heading={locale === "ar" ? "الصفحات" : "Pages"}
        >
          {navItems.map((item) => {
            const Icon = iconMap[item.key] ?? Sparkles;
            return (
              <Command.Item
                key={item.key}
                className="flex cursor-pointer items-center gap-3 rounded px-3 py-3 text-sm text-slate-700 data-[selected=true]:bg-cyan-50 data-[selected=true]:text-cyan-950"
                onSelect={() => {
                  router.push(`/${locale}${item.href}`);
                  onOpenChange(false);
                }}
              >
                <Icon className="h-4 w-4 text-cyan-700" />
                <span>{pickText(item.label, locale)}</span>
                <span className="ms-auto text-xs text-slate-500">
                  {pickText(item.metric, locale)}
                </span>
              </Command.Item>
            );
          })}
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
