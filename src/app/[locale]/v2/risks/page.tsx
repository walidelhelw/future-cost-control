import { V2ParityModulePage } from "@/components/v2/V2ParityModulePage";
import { normalizeLocale } from "@/components/v2/localize";

export const dynamic = "force-dynamic";

type RisksPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function RisksPage({ params }: RisksPageProps) {
  const { locale } = await params;

  return <V2ParityModulePage locale={normalizeLocale(locale)} moduleKey="risks" />;
}
