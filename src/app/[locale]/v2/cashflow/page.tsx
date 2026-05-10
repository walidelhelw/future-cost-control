import { V2ParityModulePage } from "@/components/v2/V2ParityModulePage";
import { normalizeLocale } from "@/components/v2/localize";

export const dynamic = "force-dynamic";

type CashflowPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CashflowPage({ params }: CashflowPageProps) {
  const { locale } = await params;

  return <V2ParityModulePage locale={normalizeLocale(locale)} moduleKey="cashflow" />;
}
