/** Force dynamic rendering — page depends on searchParams for filters */
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductGrid } from "@/components/product-grid";
import { DEMO_COLLECTIONS } from "@/lib/commerce/demo-data";
import { getCollectionByHandle } from "@/lib/shopify";
import { normalizeShopifyCollection } from "@/lib/commerce/adapters/shopify";
import { SITE_NAME } from "@/lib/constants";
import { parseFilters, applyFilters, extractFacets } from "@/lib/commerce/filters";
import { FilterSidebar } from "@/components/filters/filter-sidebar";
import { ActiveFilters } from "@/components/filters/active-filters";
import { MobileFilterTrigger } from "@/components/filters/mobile-filter-trigger";
import type { NormalizedCollection } from "@/lib/commerce/types";

interface CollectionPageProps {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function findCollection(handle: string): Promise<NormalizedCollection | undefined> {
  try {
    const shopifyCollection = await getCollectionByHandle(handle);
    if (shopifyCollection) {
      return normalizeShopifyCollection(shopifyCollection);
    }
  } catch {
    /* Shopify unavailable */
  }

  return DEMO_COLLECTIONS.find((c) => c.handle === handle);
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { handle } = await params;
  const collection = await findCollection(handle);
  if (!collection) return { title: "Collection Not Found" };

  return {
    title: `${collection.title} | ${SITE_NAME}`,
    description: collection.description,
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: CollectionPageProps) {
  const { handle } = await params;
  const rawParams = await searchParams;

  const collection = await findCollection(handle);
  if (!collection) notFound();

  const filters = parseFilters(rawParams);
  const allProducts = collection.products;
  const filtered = applyFilters(allProducts, filters);
  const facets = extractFacets(allProducts);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/collections"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-aqua"
      >
        <ArrowLeft className="h-3 w-3" />
        All Collections
      </Link>

      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{collection.title}</h1>
          <p className="mt-2 text-muted-foreground">{collection.description}</p>
        </div>
        <Suspense>
          <MobileFilterTrigger
            filters={filters}
            categoryFacets={facets.categories}
            waterTypeFacets={facets.waterTypes}
            totalResults={filtered.length}
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
              totalResults={filtered.length}
            />
          </Suspense>
        </div>
        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}
