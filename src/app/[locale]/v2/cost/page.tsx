import { OperationalModulePage } from "@/components/v2/OperationalModulePage";

export const dynamic = "force-dynamic";
import { normalizeLocale } from "@/components/v2/localize";

type CostPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CostPage({ params }: CostPageProps) {
  const { locale } = await params;

  return <OperationalModulePage locale={normalizeLocale(locale)} pageKey="cost" />;
}
