import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SourceBadge } from "@/components/source-badge";
import { DEMO_PRODUCTS } from "@/lib/commerce/demo-data";
import { SITE_NAME } from "@/lib/constants";
import { AddToCartButton } from "./add-to-cart-button";

/** Fallback gradient for product images */
const PLACEHOLDER_GRADIENT =
  "linear-gradient(135deg, #0A192F 0%, #00D4AA 50%, #FF6B6B 100%)";

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = DEMO_PRODUCTS.find((p) => p.handle === handle);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.title} | ${SITE_NAME}`,
    description: product.description,
  };
}

export async function generateStaticParams() {
  return DEMO_PRODUCTS.filter((p) => p.source === "shopify").map((p) => ({
    handle: p.handle,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;

  // In production, this would call getProductByHandle(handle) from Shopify
  const product = DEMO_PRODUCTS.find((p) => p.handle === handle);
  if (!product) notFound();

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.price.currencyCode,
  }).format(Number(product.price.amount));

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
              className="object-cover"
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
            <div className="flex items-center gap-2">
              <SourceBadge
                source={product.source}
                vendorLabel={product.sourceLabel}
              />
              {product.automationCompatible && (
                <Badge className="bg-deep-blue/80 text-aqua border-aqua/30">
                  HA Compatible
                </Badge>
              )}
              {product.waterType && (
                <Badge variant="secondary" className="capitalize">
                  {product.waterType}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold">{product.title}</h1>

            <p className="text-3xl font-bold text-aqua">{formattedPrice}</p>
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          {/* Variants */}
          {product.variants.length > 1 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Options</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <Badge
                    key={variant.id}
                    variant="outline"
                    className="cursor-pointer hover:border-aqua/50"
                  >
                    {variant.title}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <AddToCartButton product={product} />

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
    </div>
  );
}
