import { OperationalModulePage } from "@/components/v2/OperationalModulePage";

export const dynamic = "force-dynamic";
import { normalizeLocale } from "@/components/v2/localize";

type RfqPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function RfqPage({ params }: RfqPageProps) {
  const { locale } = await params;

  return <OperationalModulePage locale={normalizeLocale(locale)} pageKey="rfq" />;
}
