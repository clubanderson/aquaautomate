import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Aquarium Tips & News",
  description:
    "Articles on aquarium care, equipment reviews, DIY projects, and hobby news from AquaAutomate.",
};

const CATEGORY_COLORS: Record<string, string> = {
  care: "bg-green-600/20 text-green-400",
  equipment: "bg-blue-600/20 text-blue-400",
  diy: "bg-amber-600/20 text-amber-400",
  news: "bg-purple-600/20 text-purple-400",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">
          <span className="text-aqua">Blog</span>
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Tips, reviews, and deep dives into the aquarium hobby.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="rounded-lg border border-border/50 bg-card/50 p-8 text-center text-muted-foreground">
          No posts yet. Check back soon!
        </p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-lg border border-border/50 bg-card/50 p-5 transition-colors hover:border-aqua/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge
                      className={`text-[10px] capitalize ${CATEGORY_COLORS[post.category] || ""}`}
                    >
                      {post.category}
                    </Badge>
                    {post.readingTime && (
                      <span className="text-xs text-muted-foreground">
                        {post.readingTime} min read
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-semibold group-hover:text-aqua">
                    {post.title}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {post.description}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{post.author}</span>
                    <span>&middot;</span>
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
