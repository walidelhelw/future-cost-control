import { normalizeLocale } from "@/components/v2/localize";

export const dynamic = "force-dynamic";
import { SmartEstimateMvpPage } from "@/components/v2/SmartEstimateMvpPage";

type EstimatePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function EstimatePage({ params }: EstimatePageProps) {
  const { locale } = await params;

  return <SmartEstimateMvpPage locale={normalizeLocale(locale)} />;
}
