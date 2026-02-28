import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/guide/difficulty-badge";
import { getGuideBySlug, getAllGuideSlugs } from "@/lib/guides";
import { SITE_NAME } from "@/lib/constants";
import { GuideContent } from "./guide-content";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Guide Not Found" };

  return {
    title: `${guide.title} | ${SITE_NAME}`,
    description: guide.description,
  };
}

export async function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <Link
        href="/guides"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-aqua"
      >
        <ArrowLeft className="h-3 w-3" />
        All Guides
      </Link>

      {/* Header */}
      <header className="mb-8 space-y-4">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="capitalize text-muted-foreground"
          >
            {guide.category}
          </Badge>
          <DifficultyBadge level={guide.difficulty} />
        </div>

        <h1 className="text-3xl font-bold sm:text-4xl">{guide.title}</h1>

        <p className="text-lg text-muted-foreground">{guide.description}</p>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>By {guide.author}</span>
          <span>&middot;</span>
          <time dateTime={guide.date}>
            {new Date(guide.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </header>

      {/* Content */}
      <GuideContent content={guide.content} />

      {/* Tags */}
      <footer className="mt-12 border-t border-border/50 pt-6">
        <div className="flex flex-wrap gap-1">
          {(guide.tags || []).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="capitalize"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </footer>
    </article>
  );
}
