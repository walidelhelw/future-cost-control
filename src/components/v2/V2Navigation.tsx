"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import {
  Activity,
  Bot,
  Calculator,
  ClipboardCheck,
  Command,
  FileClock,
  Gauge,
  GitBranch,
  HardHat,
  RadioTower,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems, type V2NavKey } from "./data";
import { pickText, type V2Locale } from "./localize";

const iconMap: Record<V2NavKey, ComponentType<{ className?: string }>> = {
  admin: Settings2,
  ask: Bot,
  change: GitBranch,
  cost: Gauge,
  estimate: Calculator,
  field: HardHat,
  flow: ClipboardCheck,
  home: Command,
  rfq: FileClock,
};

type V2NavigationProps = {
  locale: V2Locale;
};

export function V2Navigation({ locale }: V2NavigationProps) {
  const pathname = usePathname();

  return (
    <>
      <aside className="relative z-10 hidden w-72 shrink-0 flex-col border-e border-slate-200/80 bg-white/85 shadow-[0_16px_38px_rgba(15,23,42,0.06)] backdrop-blur-2xl lg:flex">
        <div className="border-b border-slate-200/80 p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-md border border-cyan-200 bg-cyan-50 text-cyan-700 shadow-[0_12px_24px_rgba(14,165,233,0.14)]">
              <RadioTower className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-cyan-700">
                Future
              </p>
              <h1 className="text-lg font-semibold text-slate-950">
                {locale === "ar" ? "مركز V2" : "V2 Center"}
              </h1>
            </div>
          </div>
          <div className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 p-3">
            <div className="flex items-center justify-between gap-3 text-xs text-emerald-700">
              <span>{locale === "ar" ? "وضع العرض التنفيذي" : "CEO demo mode"}</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.36)]" />
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const href = `/${locale}${item.href}`;
            const isActive =
              item.key === "home" ? pathname === href : pathname.startsWith(href);
            const Icon = iconMap[item.key];

            return (
              <Link
                key={item.key}
                href={href}
                className={cn(
                  "group flex items-center gap-3 rounded-md border px-3 py-3 text-sm transition",
                  isActive
                    ? "border-cyan-300 bg-cyan-50 text-cyan-950 shadow-sm"
                    : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950"
                )}
              >
                <Icon className="h-4 w-4 shrink-0 text-cyan-700" />
                <span className="min-w-0 flex-1 truncate">
                  {pickText(item.label, locale)}
                </span>
                <span className="hidden truncate text-[10px] text-slate-500 xl:inline">
                  {pickText(item.metric, locale)}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200/80 p-4">
          <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
            <Activity className="h-4 w-4 text-amber-600" />
            <div className="min-w-0">
              <p className="truncate text-xs text-slate-900">
                {locale === "ar" ? "مراقبة التكلفة مباشرة" : "Live cost telemetry"}
              </p>
              <p className="text-[11px] text-slate-500">
                {locale === "ar" ? "آخر تحديث قبل 12 ثانية" : "Updated 12s ago"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 gap-1 rounded-md border border-slate-200 bg-white/95 p-1 shadow-[0_18px_46px_rgba(15,23,42,0.16)] backdrop-blur-2xl lg:hidden">
        {navItems.slice(0, 5).map((item) => {
          const href = `/${locale}${item.href}`;
          const isActive =
            item.key === "home" ? pathname === href : pathname.startsWith(href);
          const Icon = iconMap[item.key];

          return (
            <Link
              key={item.key}
              href={href}
              className={cn(
                "flex min-h-12 flex-col items-center justify-center gap-1 rounded text-[10px]",
                isActive ? "bg-cyan-50 text-cyan-800" : "text-slate-500"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="max-w-full truncate">{pickText(item.label, locale)}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
