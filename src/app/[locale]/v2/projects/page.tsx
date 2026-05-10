import { V2ParityModulePage } from "@/components/v2/V2ParityModulePage";
import { normalizeLocale } from "@/components/v2/localize";

export const dynamic = "force-dynamic";

type ProjectsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;

  return <V2ParityModulePage locale={normalizeLocale(locale)} moduleKey="projects" />;
}
