"use client";

import { useTranslations } from "next-intl";
import { LanguageToggle } from "./LanguageToggle";

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const t = useTranslations("common");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">
          {title || t("dashboard")}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <LanguageToggle />
      </div>
    </header>
  );
}
