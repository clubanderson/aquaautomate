import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/shopify";
import { normalizeShopifyProduct } from "@/lib/commerce/adapters/shopify";
import { DEMO_PRODUCTS } from "@/lib/commerce/demo-data";
import { AMAZON_PRODUCTS } from "@/lib/commerce/amazon-catalog";
import type { NormalizedProduct } from "@/lib/commerce/types";

/** ISR revalidation — cache the search index for 5 minutes */
export const revalidate = 300;

/** Maximum description snippet length in the index to keep payload small */
const DESCRIPTION_SNIPPET_LENGTH = 120;

export interface SearchIndexEntry {
  handle: string;
  title: string;
  description: string;
  tags: string[];
  productType: string;
  price: string;
  currencyCode: string;
  image: string | null;
  imageAlt: string;
  inventoryStatus: string;
  source: string;
  externalUrl?: string;
}

function buildIndex(products: NormalizedProduct[]): SearchIndexEntry[] {
  return products.map((p) => ({
    handle: p.handle,
    title: p.title,
    description: p.description.slice(0, DESCRIPTION_SNIPPET_LENGTH),
    tags: p.tags || [],
    productType: p.productType || "",
    price: p.price.amount,
    currencyCode: p.price.currencyCode,
    image: p.featuredImage?.url ?? null,
    imageAlt: p.featuredImage?.altText ?? p.title,
    inventoryStatus: p.inventoryStatus ?? "in-stock",
    source: p.source,
    externalUrl: p.externalUrl,
  }));
}

export async function GET() {
  let products: NormalizedProduct[] = DEMO_PRODUCTS;

  try {
    const shopifyProducts = await getAllProducts();
    if (shopifyProducts.length > 0) {
      products = shopifyProducts.map(normalizeShopifyProduct);
    }
  } catch {
    /* Shopify unavailable — use demo data */
  }

  /* Merge Amazon affiliate products into the search index */
  const allProducts = [...products, ...AMAZON_PRODUCTS];
  const index = buildIndex(allProducts);
  return NextResponse.json(index);
}
