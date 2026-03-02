import type { Metadata } from "next";
import { getAllProducts } from "@/lib/shopify";
import { normalizeShopifyProduct } from "@/lib/commerce/adapters/shopify";
import { DEMO_PRODUCTS } from "@/lib/commerce/demo-data";
import { AMAZON_PRODUCTS } from "@/lib/commerce/amazon-catalog";
import type { NormalizedProduct } from "@/lib/commerce/types";
import { TankCalculator } from "./calculator";

export const metadata: Metadata = {
  title: "Tank Size Calculator",
  description:
    "Calculate the right tank size for your fish. Select species, see minimum tank requirements, stocking levels, and compatibility warnings.",
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

export default async function TankCalculatorPage() {
  const products = await fetchAllProducts();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Tank Size <span className="text-aqua">Calculator</span>
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Select the fish you want to keep and we&apos;ll calculate the minimum
          tank size, check compatibility, and flag any issues.
        </p>
      </div>
      <TankCalculator products={products} />
    </div>
  );
}
