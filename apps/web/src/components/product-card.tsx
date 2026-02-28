"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SourceBadge } from "@/components/source-badge";
import type { NormalizedProduct } from "@/lib/commerce/types";

/** Fallback gradient shown when no product image is available */
const PLACEHOLDER_GRADIENT =
  "linear-gradient(135deg, #0A192F 0%, #00D4AA 50%, #FF6B6B 100%)";

interface ProductCardProps {
  product: NormalizedProduct;
  onAddToCart?: (product: NormalizedProduct) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.price.currencyCode,
  }).format(Number(product.price.amount));

  const isAmazon = product.source === "amazon";
  const href = isAmazon
    ? product.externalUrl ?? "#"
    : `/products/${product.handle}`;

  return (
    <Card className="group overflow-hidden border-border/50 bg-card transition-all hover:border-aqua/30 hover:shadow-lg hover:shadow-aqua/5">
      {/* Image */}
      <Link
        href={href}
        {...(isAmazon ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div
              className="h-full w-full"
              style={{ background: PLACEHOLDER_GRADIENT }}
            />
          )}

          {/* Source badge overlay */}
          <div className="absolute left-2 top-2">
            <SourceBadge
              source={product.source}
              vendorLabel={product.sourceLabel}
            />
          </div>

          {/* Automation badge */}
          {product.automationCompatible && (
            <div className="absolute right-2 top-2">
              <Badge className="bg-deep-blue/80 text-aqua border-aqua/30">
                HA Compatible
              </Badge>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <CardContent className="space-y-2 p-4">
        <Link
          href={href}
          {...(isAmazon
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          <h3 className="line-clamp-2 text-sm font-medium leading-tight text-foreground transition-colors group-hover:text-aqua">
            {product.title}
          </h3>
        </Link>

        <p className="line-clamp-2 text-xs text-muted-foreground">
          {product.description}
        </p>

        {/* Tags */}
        {product.waterType && (
          <Badge variant="secondary" className="text-[10px]">
            {product.waterType}
          </Badge>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-bold text-aqua">{formattedPrice}</span>

          {isAmazon ? (
            <Button
              size="sm"
              variant="outline"
              className="border-coral/30 text-coral hover:bg-coral/10"
              asChild
            >
              <a
                href={product.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-1 h-3 w-3" />
                Buy
              </a>
            </Button>
          ) : (
            <Button
              size="sm"
              className="bg-aqua text-deep-blue hover:bg-aqua-dim"
              onClick={(e) => {
                e.preventDefault();
                onAddToCart?.(product);
              }}
            >
              <ShoppingCart className="mr-1 h-3 w-3" />
              Add
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
