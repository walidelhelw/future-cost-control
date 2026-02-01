"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Users,
  Calculator,
  AlertTriangle,
  TrendingUp,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    key: "dashboard",
    href: "",
    icon: LayoutDashboard,
  },
  {
    key: "suppliers",
    href: "/suppliers",
    icon: Users,
  },
  {
    key: "boq",
    href: "/boq",
    icon: Calculator,
  },
  {
    key: "risks",
    href: "/risks",
    icon: AlertTriangle,
  },
  {
    key: "cashflow",
    href: "/cashflow",
    icon: TrendingUp,
  },
];

export function Sidebar() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <aside className="fixed top-0 right-0 z-40 h-screen w-64 border-l bg-card transition-transform rtl:right-0 rtl:border-l rtl:border-r-0 ltr:left-0 ltr:border-r ltr:border-l-0">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold">{t("appName")}</span>
            <span className="text-xs text-muted-foreground">
              {t("appDescription")}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const href = `/${locale}${item.href}`;
            const isActive =
              item.href === ""
                ? pathname === `/${locale}` || pathname === `/${locale}/`
                : pathname.startsWith(href);

            return (
              <Link
                key={item.key}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{t(item.key)}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <p className="text-xs text-muted-foreground text-center">
            v1.0.0 - MVP
          </p>
        </div>
      </div>
    </aside>
  );
}
