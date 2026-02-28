import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductGrid } from "@/components/product-grid";
import { DEMO_COLLECTIONS } from "@/lib/commerce/demo-data";
import { SITE_NAME } from "@/lib/constants";

interface CollectionPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { handle } = await params;
  const collection = DEMO_COLLECTIONS.find((c) => c.handle === handle);
  if (!collection) return { title: "Collection Not Found" };

  return {
    title: `${collection.title} | ${SITE_NAME}`,
    description: collection.description,
  };
}

export async function generateStaticParams() {
  return DEMO_COLLECTIONS.map((c) => ({ handle: c.handle }));
}

export default async function CollectionPage({
  params,
}: CollectionPageProps) {
  const { handle } = await params;

  // In production, this would call getCollectionByHandle(handle) from Shopify
  const collection = DEMO_COLLECTIONS.find((c) => c.handle === handle);
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
