import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getPostBySlug, getAllPostSlugs } from "@/lib/blog";
import { GuideContent } from "@/app/guides/[slug]/guide-content";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `https://aquaautomate.com/blog/${slug}`,
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.description,
    },
  };
}

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-aqua"
      >
        <ArrowLeft className="h-3 w-3" />
        All Posts
      </Link>

      {/* Header */}
      <header className="mb-8 space-y-4">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="capitalize text-muted-foreground"
          >
            {post.category}
          </Badge>
          {post.readingTime && (
            <span className="text-sm text-muted-foreground">
              {post.readingTime} min read
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold sm:text-4xl">{post.title}</h1>

        <p className="text-lg text-muted-foreground">{post.description}</p>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>By {post.author}</span>
          <span>&middot;</span>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </header>

      {/* Content — reuses the same markdown renderer as guides */}
      <GuideContent content={post.content} />

      {/* Tags */}
      <footer className="mt-12 border-t border-border/50 pt-6">
        <div className="flex flex-wrap gap-1">
          {(post.tags || []).map((tag) => (
            <Badge key={tag} variant="secondary" className="capitalize">
              {tag}
            </Badge>
          ))}
        </div>
      </footer>
    </article>
  );
}
