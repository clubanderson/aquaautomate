"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SourceBadge } from "@/components/source-badge";
import type { NormalizedProduct } from "@/lib/commerce/types";
import { useCart } from "@/components/cart/cart-context";

interface InlineProductProps {
  product: NormalizedProduct;
}

/**
 * Shoppable product card designed to embed inline within guide/article content.
 * Smaller than the full ProductCard — sits naturally between paragraphs.
 */
export function InlineProduct({ product }: InlineProductProps) {
  const { addItem } = useCart();
  const isAmazon = product.source === "amazon";

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.price.currencyCode,
  }).format(Number(product.price.amount));

  return (
    <div className="my-4 flex items-center gap-4 rounded-lg border border-border/50 bg-card/50 p-3 transition-colors hover:border-aqua/20">
      {/* Thumbnail */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <Link
            href={
              isAmazon
                ? product.externalUrl ?? "#"
                : `/products/${product.handle}`
            }
            className="text-sm font-medium text-foreground hover:text-aqua"
            {...(isAmazon
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {product.title}
          </Link>
          <SourceBadge source={product.source} />
        </div>
        <p className="line-clamp-1 text-xs text-muted-foreground">
          {product.description}
        </p>
      </div>

      {/* Price + Action */}
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-sm font-bold text-aqua">{formattedPrice}</span>

        {isAmazon ? (
          <Button size="sm" variant="outline" className="h-8" asChild>
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
            className="h-8 bg-aqua text-deep-blue hover:bg-aqua-dim"
            onClick={() => addItem(product)}
          >
            <ShoppingCart className="mr-1 h-3 w-3" />
            Add
          </Button>
        )}
      </div>
    </div>
  );
}
