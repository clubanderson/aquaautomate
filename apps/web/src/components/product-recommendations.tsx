import { getRecommendations } from "@/lib/commerce/recommendations";
import { ProductGrid } from "@/components/product-grid";
import type { NormalizedProduct } from "@/lib/commerce/types";

interface ProductRecommendationsProps {
  product: NormalizedProduct;
  allProducts: NormalizedProduct[];
}

/** "You Might Also Like" section on product pages */
export function ProductRecommendations({
  product,
  allProducts,
}: ProductRecommendationsProps) {
  const recommendations = getRecommendations(product, allProducts);

  if (recommendations.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="mb-6 text-2xl font-bold">You Might Also Like</h2>
      <ProductGrid products={recommendations} />
    </section>
  );
}
