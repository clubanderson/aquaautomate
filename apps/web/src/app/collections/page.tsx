/** Revalidate collections every 60 seconds to pick up new Shopify products */
export const revalidate = 60;

import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { DEMO_COLLECTIONS } from "@/lib/commerce/demo-data";
import { getAllProducts, getCollections } from "@/lib/shopify";
import { normalizeShopifyCollection, normalizeShopifyProduct } from "@/lib/commerce/adapters/shopify";
import { ProductGrid } from "@/components/product-grid";
import { parseFilters, applyFilters, extractFacets } from "@/lib/commerce/filters";
import { FilterSidebar } from "@/components/filters/filter-sidebar";
import { ActiveFilters } from "@/components/filters/active-filters";
import { MobileFilterTrigger } from "@/components/filters/mobile-filter-trigger";
import type { NormalizedProduct, NormalizedCollection } from "@/lib/commerce/types";

export const metadata: Metadata = {
  title: "Shop All Collections",
  description:
    "Browse aquarium fish, plants, hardscape, and automation gear from local shops and Amazon.",
};

/** Max collections to fetch from Shopify */
const MAX_COLLECTIONS = 20;

/** Friendly display names for Shopify product types (keyed by UPPERCASE) */
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
  /* Plants, Driftwood & other H2O Plants types */
  DRIFTWOOD: "Driftwood",
  "LIVE PLANTS": "Live Plants",
  PLANT: "Plants",
  PLANTS: "Plants",
  "LIVE PLANT": "Live Plants",
  "GARDEN PLANTS": "Garden Plants",
  "AQUATIC PLANTS": "Aquatic Plants",
  "PACKING MATERIALS": "Packing Materials",
  "DRY GOODS": "Dry Goods",
  "LIVE STOCK": "Live Stock",
  SHIPPING: "Shipping",
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
    /* Normalize to uppercase so mixed-case types (e.g. "Plant" from H2O
       Plants) merge with uppercase types (e.g. "PLANTS" from Danaqua) */
    const type = (product.productType || "MISCELLANEOUS").toUpperCase();
    const existing = groups.get(type) || [];
    existing.push(product);
    groups.set(type, existing);
  }

  return Array.from(groups.entries())
    .filter(([, prods]) => prods.length >= MIN_PRODUCTS_PER_GROUP)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([type, prods]) => {
      const vendors = [...new Set(prods.map((p) => p.vendor).filter(Boolean))];
      const vendorText = vendors.length > 0 ? vendors.join(", ") : "our suppliers";
      return {
        id: `auto-${type.toLowerCase().replace(/\s+/g, "-")}`,
        handle: type.toLowerCase().replace(/\s+/g, "-"),
        title: PRODUCT_TYPE_LABELS[type] || type.charAt(0) + type.slice(1).toLowerCase(),
        description: `${prods.length} products available from ${vendorText}`,
        products: prods,
      };
    });
}

interface CollectionsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CollectionsPage({ searchParams }: CollectionsPageProps) {
  const rawParams = await searchParams;
  const filters = parseFilters(rawParams);
  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.waterTypes.length > 0 ||
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined ||
    filters.availability !== "all" ||
    filters.sort !== "relevance" ||
    !!filters.q;

  let collections: NormalizedCollection[] = DEMO_COLLECTIONS;
  let allProducts: NormalizedProduct[] = [];

  try {
    /* Try real Shopify collections first */
    const shopifyCollections = await getCollections(MAX_COLLECTIONS);
    const filtered = shopifyCollections.filter((c) => c.handle !== "frontpage");

    if (filtered.length > 0) {
      collections = filtered.map(normalizeShopifyCollection);
    } else {
      /* No real collections — auto-group all products by type */
      const shopifyProducts = await getAllProducts();
      if (shopifyProducts.length > 0) {
        const normalized = shopifyProducts.map(normalizeShopifyProduct);
        collections = groupProductsByType(normalized);
        allProducts = normalized;
      }
    }

    /* Collect all products for filtering */
    if (allProducts.length === 0) {
      allProducts = collections.flatMap((c) => c.products);
    }
  } catch {
    /* Shopify unavailable — use demo data */
    allProducts = collections.flatMap((c) => c.products);
  }

  /* Deduplicate products */
  const seen = new Set<string>();
  const uniqueProducts: NormalizedProduct[] = [];
  for (const p of allProducts) {
    if (!seen.has(p.id)) {
      seen.add(p.id);
      uniqueProducts.push(p);
    }
  }

  const filteredProducts = applyFilters(uniqueProducts, filters);
  const facets = extractFacets(uniqueProducts);

  /* If filters active, show flat filtered grid instead of grouped sections */
  if (hasActiveFilters) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Shop All Collections</h1>
            <p className="mt-2 text-muted-foreground">
              {filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"} found
            </p>
          </div>
          <Suspense>
            <MobileFilterTrigger
              filters={filters}
              categoryFacets={facets.categories}
              waterTypeFacets={facets.waterTypes}
              totalResults={filteredProducts.length}
            />
          </Suspense>
        </div>

        <Suspense>
          <ActiveFilters filters={filters} />
        </Suspense>

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
          <div className="hidden lg:block">
            <Suspense>
              <FilterSidebar
                filters={filters}
                categoryFacets={facets.categories}
                waterTypeFacets={facets.waterTypes}
                totalResults={filteredProducts.length}
              />
            </Suspense>
          </div>
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    );
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
              href={`/collections?cat=${encodeURIComponent(collection.products[0]?.productType || collection.handle)}`}
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
