import { normalizeLocale } from "@/components/v2/localize";

export const dynamic = "force-dynamic";
import { SmartEstimatePage } from "@/components/v2/SmartEstimatePage";

type EstimatePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function EstimatePage({ params }: EstimatePageProps) {
  const { locale } = await params;

  return <SmartEstimatePage locale={normalizeLocale(locale)} />;
}
