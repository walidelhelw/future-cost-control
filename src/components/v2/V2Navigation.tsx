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
      <aside className="relative z-10 hidden w-72 shrink-0 flex-col border-white/10 bg-black/35 backdrop-blur-2xl lg:flex rtl:order-last rtl:border-s ltr:border-e">
        <div className="border-b border-white/10 p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-md border border-cyan-300/40 bg-cyan-300/10 text-cyan-200 shadow-[0_0_26px_rgba(0,212,212,0.22)]">
              <RadioTower className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-cyan-200/70">
                Future
              </p>
              <h1 className="text-lg font-semibold text-white">
                {locale === "ar" ? "مركز V2" : "V2 Center"}
              </h1>
            </div>
          </div>
          <div className="mt-5 rounded-md border border-emerald-300/20 bg-emerald-300/10 p-3">
            <div className="flex items-center justify-between gap-3 text-xs text-emerald-100">
              <span>{locale === "ar" ? "وضع العرض التنفيذي" : "CEO demo mode"}</span>
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_16px_#6ee7b7]" />
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
                    ? "border-cyan-300/40 bg-cyan-300/15 text-white"
                    : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.06] hover:text-white"
                )}
              >
                <Icon className="h-4 w-4 shrink-0 text-cyan-200/80" />
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

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-md bg-white/[0.04] p-3">
            <Activity className="h-4 w-4 text-amber-300" />
            <div className="min-w-0">
              <p className="truncate text-xs text-white">
                {locale === "ar" ? "مراقبة التكلفة مباشرة" : "Live cost telemetry"}
              </p>
              <p className="text-[11px] text-slate-500">
                {locale === "ar" ? "آخر تحديث قبل 12 ثانية" : "Updated 12s ago"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 gap-1 rounded-md border border-white/10 bg-black/80 p-1 backdrop-blur-2xl lg:hidden">
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
                isActive ? "bg-cyan-300/15 text-cyan-100" : "text-slate-400"
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
