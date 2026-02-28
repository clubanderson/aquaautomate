import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Guide, GuideFrontmatter, GuideCategory } from "./types";

const GUIDES_DIR = path.join(process.cwd(), "..", "..", "content", "guides");

/** Read all guide MDX files from the content directory */
export function getAllGuides(): Guide[] {
  if (!fs.existsSync(GUIDES_DIR)) return [];

  const files = fs
    .readdirSync(GUIDES_DIR)
    .filter((f) => f.endsWith(".mdx"));

  return files
    .map((filename) => {
      const filePath = path.join(GUIDES_DIR, filename);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      return {
        ...(data as GuideFrontmatter),
        slug: data.slug ?? filename.replace(/\.mdx$/, ""),
        content,
      };
    })
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

/** Get a single guide by slug */
export function getGuideBySlug(slug: string): Guide | null {
  const guides = getAllGuides();
  return guides.find((g) => g.slug === slug) ?? null;
}

/** Get guides filtered by category */
export function getGuidesByCategory(category: GuideCategory): Guide[] {
  return getAllGuides().filter((g) => g.category === category);
}

/** Get all unique guide slugs (for static generation) */
export function getAllGuideSlugs(): string[] {
  return getAllGuides().map((g) => g.slug);
}
