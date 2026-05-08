import { CommandCenter } from "@/components/v2/CommandCenter";

export const dynamic = "force-dynamic";
import { normalizeLocale } from "@/components/v2/localize";

type V2PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function V2Page({ params }: V2PageProps) {
  const { locale } = await params;

  return <CommandCenter locale={normalizeLocale(locale)} />;
}
