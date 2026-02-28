import type { DifficultyLevel } from "@/components/guide/difficulty-badge";

export type GuideCategory = "automation" | "species" | "getting-started";

export interface GuideFrontmatter {
  title: string;
  slug: string;
  description: string;
  category: GuideCategory;
  difficulty: DifficultyLevel;
  author: string;
  date: string;
  tags: string[];
  /** Product handles/IDs referenced in this guide */
  products?: string[];
  /** Cover image path */
  image?: string;
}

export interface Guide extends GuideFrontmatter {
  content: string;
}
