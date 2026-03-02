export type BlogCategory = "care" | "equipment" | "diy" | "news";

export interface BlogFrontmatter {
  title: string;
  slug: string;
  description: string;
  category: BlogCategory;
  author: string;
  date: string;
  tags: string[];
  /** Cover image URL */
  image?: string;
  /** Estimated reading time in minutes */
  readingTime?: number;
}

export interface BlogPost extends BlogFrontmatter {
  content: string;
}
