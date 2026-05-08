import { ModuleStubPage } from "@/components/v2/ModuleStubPage";

export const dynamic = "force-dynamic";
import { normalizeLocale } from "@/components/v2/localize";

type FlowPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function FlowPage({ params }: FlowPageProps) {
  const { locale } = await params;

  return <ModuleStubPage locale={normalizeLocale(locale)} pageKey="flow" />;
}
