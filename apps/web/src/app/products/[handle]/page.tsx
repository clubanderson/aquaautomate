/** Revalidate product pages every 60 seconds */
export const revalidate = 60;

import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SourceBadge } from "@/components/source-badge";
import { ProductBadges } from "@/components/product-badges";
import { DEMO_PRODUCTS } from "@/lib/commerce/demo-data";
import { getProductByHandle, getProducts, getAllProducts } from "@/lib/shopify";
import { normalizeShopifyProduct } from "@/lib/commerce/adapters/shopify";
import type { NormalizedProduct } from "@/lib/commerce/types";
import { AddToCartButton } from "./add-to-cart-button";
import { VariantSelector } from "./variant-selector";
import { VariantPrice } from "./variant-price";
import { ProductRecommendations } from "@/components/product-recommendations";
import { TankMates } from "@/components/tank-mates";
import { ProductReviews } from "@/components/product-reviews";
import { PriceAlertButton } from "@/components/price-alert-button";
import { WishlistButton } from "@/components/wishlist-button";

/** Fallback gradient for product images */
const PLACEHOLDER_GRADIENT =
  "linear-gradient(135deg, #0A192F 0%, #00D4AA 50%, #FF6B6B 100%)";

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

async function findProduct(handle: string): Promise<NormalizedProduct | undefined> {
  try {
    const shopifyProduct = await getProductByHandle(handle);
    if (shopifyProduct) {
      return normalizeShopifyProduct(shopifyProduct);
    }
  } catch {
    /* Shopify unavailable */
  }

  return DEMO_PRODUCTS.find((p) => p.handle === handle);
}

async function fetchAllProducts(): Promise<NormalizedProduct[]> {
  try {
    const shopifyProducts = await getAllProducts();
    if (shopifyProducts.length > 0) {
      return shopifyProducts.map(normalizeShopifyProduct);
    }
  } catch {
    /* Shopify unavailable */
  }
  return DEMO_PRODUCTS;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await findProduct(handle);
  if (!product) return { title: "Product Not Found" };

  const ogImage = product.featuredImage?.url;
  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      type: "website",
      url: `https://aquaautomate.com/products/${handle}`,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: product.title,
      description: product.description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export async function generateStaticParams() {
  try {
    const shopifyProducts = await getProducts();
    if (shopifyProducts.length > 0) {
      return shopifyProducts.map((p) => ({ handle: p.handle }));
    }
  } catch {
    /* Fall back to demo products */
  }
  return DEMO_PRODUCTS.filter((p) => p.source === "shopify").map((p) => ({
    handle: p.handle,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;

  const product = await findProduct(handle);
  if (!product) notFound();

  const isSoldOut = product.inventoryStatus === "sold-out";
  const allProducts = await fetchAllProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <Link
        href="/collections"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-aqua"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText}
              fill
              className={`object-cover ${isSoldOut ? "opacity-60 grayscale" : ""}`}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div
              className="h-full w-full"
              style={{ background: PLACEHOLDER_GRADIENT }}
            />
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <SourceBadge
                source={product.source}
                vendorLabel={product.sourceLabel}
              />
              <ProductBadges product={product} variant="inline" />
              {product.waterType && (
                <Badge variant="secondary" className="capitalize">
                  {product.waterType}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold">{product.title}</h1>

            <Suspense>
              <VariantPrice variants={product.variants} isSoldOut={isSoldOut} />
            </Suspense>

            {/* Stock status text */}
            {product.inventoryStatus === "low-stock" && (
              <p className="text-sm font-medium text-amber-500">
                Hurry — limited stock remaining
              </p>
            )}
            {isSoldOut && (
              <p className="text-sm font-medium text-red-500">
                This product is currently out of stock
              </p>
            )}
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          {/* Variants */}
          <Suspense>
            <VariantSelector variants={product.variants} />
          </Suspense>

          {/* Add to Cart + Wishlist */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Suspense>
                <AddToCartButton product={product} />
              </Suspense>
            </div>
            <WishlistButton productId={product.id} className="border border-border/50 rounded-lg p-2.5" />
          </div>

          {/* Price Alert */}
          <PriceAlertButton
            productId={product.id}
            currentPrice={product.price.amount}
          />

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs capitalize"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tank-Mate Compatibility */}
      <TankMates product={product} allProducts={allProducts} />

      {/* Customer Reviews */}
      <div className="mt-12">
        <ProductReviews productId={product.id} />
      </div>

      {/* Product Recommendations */}
      <ProductRecommendations product={product} allProducts={allProducts} />
    </div>
  );
}
