import { OperationalModulePage } from "@/components/v2/OperationalModulePage";

export const dynamic = "force-dynamic";
import { normalizeLocale } from "@/components/v2/localize";

type ChangePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ChangePage({ params }: ChangePageProps) {
  const { locale } = await params;

  return <OperationalModulePage locale={normalizeLocale(locale)} pageKey="change" />;
}
