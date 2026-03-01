/** Revalidate collection pages every 60 seconds */
export const revalidate = 60;

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductGrid } from "@/components/product-grid";
import { DEMO_COLLECTIONS } from "@/lib/commerce/demo-data";
import { getCollectionByHandle, getCollections } from "@/lib/shopify";
import { normalizeShopifyCollection } from "@/lib/commerce/adapters/shopify";
import { SITE_NAME } from "@/lib/constants";
import type { NormalizedCollection } from "@/lib/commerce/types";

interface CollectionPageProps {
  params: Promise<{ handle: string }>;
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

export async function generateStaticParams() {
  try {
    const shopifyCollections = await getCollections();
    if (shopifyCollections.length > 0) {
      return shopifyCollections
        .filter((c) => c.handle !== "frontpage")
        .map((c) => ({ handle: c.handle }));
    }
  } catch {
    /* Fall back to demo collections */
  }
  return DEMO_COLLECTIONS.map((c) => ({ handle: c.handle }));
}

export default async function CollectionPage({
  params,
}: CollectionPageProps) {
  const { handle } = await params;

  const collection = await findCollection(handle);
  if (!collection) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/collections"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-aqua"
      >
        <ArrowLeft className="h-3 w-3" />
        All Collections
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{collection.title}</h1>
        <p className="mt-2 text-muted-foreground">{collection.description}</p>
      </div>

      <ProductGrid products={collection.products} />
    </div>
  );
}
