import { V2ParityModulePage } from "@/components/v2/V2ParityModulePage";
import { normalizeLocale } from "@/components/v2/localize";

export const dynamic = "force-dynamic";

type BoqPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function BoqPage({ params }: BoqPageProps) {
  const { locale } = await params;

  return <V2ParityModulePage locale={normalizeLocale(locale)} moduleKey="boq" />;
}
