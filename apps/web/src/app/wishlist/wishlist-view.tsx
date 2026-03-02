"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AMAZON_PRODUCTS } from "@/lib/commerce/amazon-catalog";
import type { NormalizedProduct } from "@/lib/commerce/types";
import { clearWishlist, getWishlist, removeFromWishlist } from "@/lib/wishlist";

/** Image dimensions for product thumbnails */
const THUMB_SIZE = 96;

function productHref(p: NormalizedProduct): string {
  return p.source === "amazon" ? (p.externalUrl ?? "#") : `/products/${p.handle}`;
}

function subscribeWishlist(callback: () => void) {
  window.addEventListener("wishlist-change", callback);
  return () => window.removeEventListener("wishlist-change", callback);
}

/** Snapshot function that returns a serialized wishlist for change detection */
function getWishlistSnapshot(): string {
  return JSON.stringify(getWishlist());
}

function getServerSnapshot(): string {
  return "[]";
}

export function WishlistView() {
  const wishlistJson = useSyncExternalStore(
    subscribeWishlist,
    getWishlistSnapshot,
    getServerSnapshot
  );
  const wishlistIds: string[] = JSON.parse(wishlistJson);

  const products = wishlistIds
    .map((id) => AMAZON_PRODUCTS.find((p) => p.id === id))
    .filter((p): p is NormalizedProduct => p !== undefined);

  const totalCost = products.reduce(
    (sum, p) => sum + Number(p.price.amount),
    0
  );

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId);
  };

  const handleClearAll = () => {
    clearWishlist();
  };

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-border/50 bg-card/50 p-12 text-center">
        <Heart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="mb-2 text-xl font-semibold">Your wishlist is empty</h2>
        <p className="mb-6 text-muted-foreground">
          Browse products and tap the heart icon to save items here.
        </p>
        <Button className="bg-aqua text-deep-blue hover:bg-aqua-dim" asChild>
          <Link href="/collections">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center justify-between rounded-lg border border-aqua/30 bg-card/50 p-4">
        <div className="flex items-center gap-3">
          <ShoppingCart className="h-5 w-5 text-aqua" />
          <div>
            <p className="text-sm text-muted-foreground">
              {products.length} {products.length === 1 ? "item" : "items"}
            </p>
            <p className="text-lg font-bold text-aqua">
              ${totalCost.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-border/50 text-xs"
            asChild
          >
            <Link href="/tools/compare">Compare</Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-xs text-muted-foreground hover:text-red-400"
          >
            <Trash2 className="mr-1 h-3 w-3" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Product list */}
      <div className="space-y-2">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 rounded-lg border border-border/50 bg-card/50 p-4 transition-colors hover:border-border"
          >
            {p.featuredImage && (
              <Image
                src={p.featuredImage.url}
                alt={p.featuredImage.altText}
                width={THUMB_SIZE}
                height={THUMB_SIZE}
                className="h-16 w-16 shrink-0 rounded object-contain"
              />
            )}
            <div className="flex-1 overflow-hidden">
              <p className="font-medium">{p.title}</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px] capitalize">
                  {(p.productType || "").toLowerCase()}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {p.vendor}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-medium text-aqua">
                ${p.price.amount}
              </span>
              <a
                href={productHref(p)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-border/50 p-2 text-muted-foreground transition-colors hover:border-aqua/30 hover:text-aqua"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              <button
                onClick={() => handleRemove(p.id)}
                className="rounded-md border border-border/50 p-2 text-muted-foreground transition-colors hover:border-red-400/30 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
