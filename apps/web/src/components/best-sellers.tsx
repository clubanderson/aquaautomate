import { getBestSellers } from "@/lib/shopify";
import { normalizeShopifyProduct } from "@/lib/commerce/adapters/shopify";
import { ProductGrid } from "@/components/product-grid";
import { DEMO_PRODUCTS } from "@/lib/commerce/demo-data";

/** Number of best sellers to display */
const BEST_SELLERS_DISPLAY_COUNT = 4;

/** Best Sellers section for the homepage. Uses Shopify's BEST_SELLING sort. */
export async function BestSellers() {
  let products = DEMO_PRODUCTS.slice(0, BEST_SELLERS_DISPLAY_COUNT);

  try {
    const shopifyBest = await getBestSellers(BEST_SELLERS_DISPLAY_COUNT);
    if (shopifyBest.length > 0) {
      products = shopifyBest.map(normalizeShopifyProduct);
    }
  } catch {
    /* Shopify unavailable — use demo data */
  }

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 className="mb-6 text-2xl font-bold">Best Sellers</h2>
      <ProductGrid products={products} />
    </section>
  );
}
