// app/[slug]/page.tsx
import { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { fetchPageBySlug, renderPageContent, generatePageMetadata } from "@/lib/render-page";
import PreviewPage from "@/components/PreviewPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "home") return {};
  const { page } = await fetchPageBySlug(slug);
  return generatePageMetadata(page, slug);
}

export default async function SlugPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  if (slug === "home") redirect("/");

  const { page, sections, settings } = await fetchPageBySlug(slug);
  if (!page) notFound();

  const { preview } = await searchParams;
  if (preview === "true") {
    return <PreviewPage initialSections={sections} settings={settings} />;
  }

  return renderPageContent(sections, settings, { showSideDots: false });
}
