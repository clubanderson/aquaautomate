import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DEMO_COLLECTIONS } from "@/lib/commerce/demo-data";
import { getCollections } from "@/lib/shopify";
import { normalizeShopifyCollection } from "@/lib/commerce/adapters/shopify";
import { ProductGrid } from "@/components/product-grid";

export const metadata: Metadata = {
  title: "Shop All Collections",
  description:
    "Browse aquarium fish, plants, hardscape, and automation gear from local shops and Amazon.",
};

/** Max collections to fetch from Shopify */
const MAX_COLLECTIONS = 20;

export default async function CollectionsPage() {
  let collections = DEMO_COLLECTIONS;

  try {
    const shopifyCollections = await getCollections(MAX_COLLECTIONS);
    const filtered = shopifyCollections.filter((c) => c.handle !== "frontpage");
    if (filtered.length > 0) {
      collections = filtered.map(normalizeShopifyCollection);
    }
  } catch {
    /* Shopify unavailable — use demo data */
  }

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold">Shop All Collections</h1>
        <p className="mt-2 text-muted-foreground">
          Browse aquarium products and automation gear from local shops and
          Amazon.
        </p>
      </div>

      {collections.map((collection) => (
        <section key={collection.id}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">{collection.title}</h2>
            <Link
              href={`/collections/${collection.handle}`}
              className="inline-flex items-center text-sm text-aqua hover:underline"
            >
              View all
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            {collection.description}
          </p>
          <ProductGrid products={collection.products} />
        </section>
      ))}
    </div>
  );
}
