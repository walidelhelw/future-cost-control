import type { ReactNode } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { V2AuthGate } from "@/components/v2/V2AuthGate";
import { V2Shell } from "@/components/v2/V2Shell";
import { normalizeLocale } from "@/components/v2/localize";
import { createV2ServerClient } from "@/lib/v2/supabase/server";

type V2LayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";

export default async function V2Layout({ children, params }: V2LayoutProps) {
  noStore();
  const { locale } = await params;
  const normalizedLocale = normalizeLocale(locale);
  const supabase = createV2ServerClient();
  const { data } = await supabase.auth.getUser();

  return (
    <V2Shell
      authState={{ authenticated: Boolean(data.user), email: data.user?.email }}
      locale={normalizedLocale}
    >
      {data.user ? children : <V2AuthGate locale={normalizedLocale} />}
    </V2Shell>
  );
}
