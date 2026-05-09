import type { ReactNode } from "react";
import { V2Shell } from "@/components/v2/V2Shell";
import { normalizeLocale } from "@/components/v2/localize";

type V2LayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function V2Layout({ children, params }: V2LayoutProps) {
  const { locale } = await params;
  const normalizedLocale = normalizeLocale(locale);

  return <V2Shell locale={normalizedLocale}>{children}</V2Shell>;
}
