import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllProducts } from "@/lib/shopify";
import { normalizeShopifyProduct } from "@/lib/commerce/adapters/shopify";
import { DEMO_PRODUCTS } from "@/lib/commerce/demo-data";
import { AMAZON_PRODUCTS } from "@/lib/commerce/amazon-catalog";
import type { NormalizedProduct } from "@/lib/commerce/types";
import { TankWizard } from "./wizard";

export const metadata: Metadata = {
  title: "Build Your Tank — Shopping List Generator",
  description:
    "Step-by-step aquarium setup wizard. Pick your tank size, equipment, and fish — get a complete shopping list with prices.",
};

/** ISR revalidation — refresh Shopify data every 5 minutes */
export const revalidate = 300;

async function fetchAllProducts(): Promise<NormalizedProduct[]> {
  let shopifyProducts: NormalizedProduct[] = DEMO_PRODUCTS;
  try {
    const raw = await getAllProducts();
    if (raw.length > 0) {
      shopifyProducts = raw.map(normalizeShopifyProduct);
    }
  } catch {
    /* Shopify unavailable — fall back to demo data */
  }
  return [...shopifyProducts, ...AMAZON_PRODUCTS];
}

export default async function BuildYourTankPage() {
  const products = await fetchAllProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Build Your <span className="text-aqua">Tank</span>
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Walk through each step to build your ideal aquarium setup. We&apos;ll
          generate a shopping list with everything you need.
        </p>
      </div>
      <Suspense>
        <TankWizard products={products} />
      </Suspense>
    </div>
  );
}
