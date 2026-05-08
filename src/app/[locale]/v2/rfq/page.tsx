import { ModuleStubPage } from "@/components/v2/ModuleStubPage";

export const dynamic = "force-dynamic";
import { normalizeLocale } from "@/components/v2/localize";

type RfqPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function RfqPage({ params }: RfqPageProps) {
  const { locale } = await params;

  return <ModuleStubPage locale={normalizeLocale(locale)} pageKey="rfq" />;
}
