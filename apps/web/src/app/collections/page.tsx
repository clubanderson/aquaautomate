/** Revalidate collections every 60 seconds to pick up new Shopify products */
export const revalidate = 60;

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DEMO_COLLECTIONS } from "@/lib/commerce/demo-data";
import { getProducts, getCollections } from "@/lib/shopify";
import { normalizeShopifyCollection, normalizeShopifyProduct } from "@/lib/commerce/adapters/shopify";
import { ProductGrid } from "@/components/product-grid";
import type { NormalizedProduct, NormalizedCollection } from "@/lib/commerce/types";

export const metadata: Metadata = {
  title: "Shop All Collections",
  description:
    "Browse aquarium fish, plants, hardscape, and automation gear from local shops and Amazon.",
};

/** Max products to fetch for auto-grouping */
const MAX_PRODUCTS = 250;
/** Max collections to fetch from Shopify */
const MAX_COLLECTIONS = 20;

/** Friendly display names for Shopify product types */
const PRODUCT_TYPE_LABELS: Record<string, string> = {
  "AMERICAN CICHLID": "American Cichlids",
  "AFRICAN CICHLIDS": "African Cichlids",
  TETRA: "Tetras",
  CATFISH: "Catfish",
  BARB: "Barbs",
  PLECO: "Plecos",
  DISCUS: "Discus",
  SHRIMP: "Shrimp",
  MOLLY: "Mollies",
  GOURAMI: "Gouramis",
  CORY: "Corydoras",
  BETTA: "Bettas",
  SWORDTAIL: "Swordtails",
  ANGELFISH: "Angelfish",
  GOLDFISH: "Goldfish",
  LOACH: "Loaches",
  SHARK: "Sharks",
  PLATY: "Platies",
  RAINBOW: "Rainbowfish",
  DANIO: "Danios",
  GUPPY: "Guppies",
  SNAIL: "Snails",
  CRAYFISH: "Crayfish",
  KNIFEFISH: "Knifefish",
  KOI: "Koi",
  AROWANA: "Arowanas",
  MISCELLANEOUS: "Miscellaneous",
};

/** Minimum products in a type to show as its own section */
const MIN_PRODUCTS_PER_GROUP = 2;

/**
 * Auto-group products by productType into virtual collections.
 * Used when the Shopify store has no real collections set up.
 */
function groupProductsByType(products: NormalizedProduct[]): NormalizedCollection[] {
  const groups = new Map<string, NormalizedProduct[]>();

  for (const product of products) {
    const type = product.productType || "MISCELLANEOUS";
    const existing = groups.get(type) || [];
    existing.push(product);
    groups.set(type, existing);
  }

  return Array.from(groups.entries())
    .filter(([, prods]) => prods.length >= MIN_PRODUCTS_PER_GROUP)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([type, prods]) => ({
      id: `auto-${type.toLowerCase().replace(/\s+/g, "-")}`,
      handle: type.toLowerCase().replace(/\s+/g, "-"),
      title: PRODUCT_TYPE_LABELS[type] || type.charAt(0) + type.slice(1).toLowerCase(),
      description: `${prods.length} products available from Danaqua Live Fish & More`,
      products: prods,
    }));
}

export default async function CollectionsPage() {
  let collections: NormalizedCollection[] = DEMO_COLLECTIONS;

  try {
    /* Try real Shopify collections first */
    const shopifyCollections = await getCollections(MAX_COLLECTIONS);
    const filtered = shopifyCollections.filter((c) => c.handle !== "frontpage");

    if (filtered.length > 0) {
      collections = filtered.map(normalizeShopifyCollection);
    } else {
      /* No real collections — auto-group products by type */
      const shopifyProducts = await getProducts(MAX_PRODUCTS);
      if (shopifyProducts.length > 0) {
        const normalized = shopifyProducts.map(normalizeShopifyProduct);
        collections = groupProductsByType(normalized);
      }
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
