import { ModuleStubPage } from "@/components/v2/ModuleStubPage";

export const dynamic = "force-dynamic";
import { normalizeLocale } from "@/components/v2/localize";

type FieldPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function FieldPage({ params }: FieldPageProps) {
  const { locale } = await params;

  return <ModuleStubPage locale={normalizeLocale(locale)} pageKey="field" />;
}
