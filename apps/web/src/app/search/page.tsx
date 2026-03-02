/** Revalidate search results page every 60 seconds */
export const revalidate = 60;

import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductGrid } from "@/components/product-grid";
import { SearchInput } from "@/components/search/search-input";
import { getAllProducts } from "@/lib/shopify";
import { normalizeShopifyProduct } from "@/lib/commerce/adapters/shopify";
import { DEMO_PRODUCTS } from "@/lib/commerce/demo-data";
import type { NormalizedProduct } from "@/lib/commerce/types";

export const metadata: Metadata = {
  title: "Search Results",
  description: "Search for aquarium products, fish, plants, and automation gear.",
};

/** Scoring weights for server-side search (mirrors client-side hook) */
const TITLE_MATCH_SCORE = 10;
const TAG_MATCH_SCORE = 5;
const TYPE_MATCH_SCORE = 3;
const DESCRIPTION_MATCH_SCORE = 1;

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  let products: NormalizedProduct[] = DEMO_PRODUCTS;
  try {
    const shopify = await getAllProducts();
    if (shopify.length > 0) {
      products = shopify.map(normalizeShopifyProduct);
    }
  } catch {
    /* Shopify unavailable */
  }

  let filtered: NormalizedProduct[] = [];

  if (query.length > 0) {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

    filtered = products
      .map((p) => {
        let score = 0;
        const titleLower = p.title.toLowerCase();
        const descLower = p.description.toLowerCase();
        const typeLower = (p.productType || "").toLowerCase();
        const tagsLower = (p.tags || []).map((t) => t.toLowerCase());

        for (const term of terms) {
          if (titleLower.includes(term)) score += TITLE_MATCH_SCORE;
          if (tagsLower.some((t) => t.includes(term))) score += TAG_MATCH_SCORE;
          if (typeLower.includes(term)) score += TYPE_MATCH_SCORE;
          if (descLower.includes(term)) score += DESCRIPTION_MATCH_SCORE;
        }

        return { product: p, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.product);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {query ? `Search: "${query}"` : "Search"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {query
            ? `${filtered.length} product${filtered.length === 1 ? "" : "s"} found`
            : "Enter a search term to find products."}
        </p>
        <Suspense>
          <SearchInput initialQuery={query} />
        </Suspense>
      </div>

      {query && <ProductGrid products={filtered} />}
    </div>
  );
}
