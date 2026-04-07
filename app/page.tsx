// app/page.tsx
import { Metadata } from "next";
import { fetchPageBySlug, renderPageContent, generatePageMetadata } from "@/lib/render-page";
import PreviewPage from "@/components/PreviewPage";

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await fetchPageBySlug("home");
  return generatePageMetadata(page);
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { sections, settings } = await fetchPageBySlug("home");
  const { preview } = await searchParams;
  const isPreview = preview === "true";

  if (isPreview) {
    return <PreviewPage initialSections={sections} settings={settings} />;
  }

  return renderPageContent(sections, settings, { showSideDots: true });
}
