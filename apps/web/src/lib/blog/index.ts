import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { BlogPost, BlogFrontmatter, BlogCategory } from "./types";

const BLOG_DIR = path.join(process.cwd(), "..", "..", "content", "blog");

/** Average words per minute for reading time estimate */
const WORDS_PER_MINUTE = 200;

/** Read all blog MDX files from the content directory */
export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"));

  return files
    .map((filename) => {
      const filePath = path.join(BLOG_DIR, filename);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      const wordCount = content.split(/\s+/).length;
      return {
        ...(data as BlogFrontmatter),
        slug: data.slug ?? filename.replace(/\.mdx$/, ""),
        readingTime: data.readingTime ?? Math.ceil(wordCount / WORDS_PER_MINUTE),
        content,
      };
    })
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

/** Get a single post by slug */
export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

/** Get posts filtered by category */
export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  return getAllPosts().filter((p) => p.category === category);
}

/** Get all unique post slugs (for static generation) */
export function getAllPostSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}
