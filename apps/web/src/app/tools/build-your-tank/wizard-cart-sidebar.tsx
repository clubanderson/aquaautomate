"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Check,
  ExternalLink,
  Package,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Store,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/components/cart/cart-context";
import type { NormalizedProduct } from "@/lib/commerce/types";

/** How long the "Added to cart" confirmation shows (ms) */
const CONFIRMATION_DISPLAY_MS = 3000;

/** A selected product tied to a wizard step */
export interface WizardCartItem {
  stepId: string;
  stepLabel: string;
  product: NormalizedProduct;
  /** Quantity for this item (fish can have > 1) */
  quantity: number;
}

/** Related automation guide */
interface StepGuide {
  slug: string;
  title: string;
  description: string;
}

export interface WizardCartSidebarProps {
  items: WizardCartItem[];
  recommendations: NormalizedProduct[];
  stepGuides: StepGuide[];
  onRemoveItem: (stepId: string, productId?: string) => void;
  onSelectStep: (stepId: string) => void;
}

/** Format a price string as currency */
function formatPrice(amount: string): string {
  return `$${Number(amount).toFixed(2)}`;
}

/** Get the appropriate link for a product based on its source */
function getProductLink(product: NormalizedProduct): {
  href: string;
  external: boolean;
} {
  if (product.source === "amazon" && product.externalUrl) {
    return { href: product.externalUrl, external: true };
  }
  return { href: `/products/${product.handle}`, external: false };
}

/**
 * Persistent right-side cart panel showing selections, totals,
 * recommendations, and step-specific automation guides.
 * Each item shows its vendor/source for multi-vendor attribution.
 */
export function WizardCartSidebar({
  items,
  recommendations,
  stepGuides,
  onRemoveItem,
  onSelectStep,
}: WizardCartSidebarProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price.amount) * item.quantity,
    0,
  );

  const savings = items.reduce((sum, item) => {
    const compare = item.product.compareAtPrice
      ? Number(item.product.compareAtPrice.amount)
      : 0;
    const price = Number(item.product.price.amount);
    return sum + Math.max(0, compare - price) * item.quantity;
  }, 0);

  const { addItem } = useCart();
  const [confirmation, setConfirmation] = useState<string | null>(null);

  /* Clear confirmation after timeout */
  useEffect(() => {
    if (!confirmation) return;
    const timer = setTimeout(() => setConfirmation(null), CONFIRMATION_DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [confirmation]);

  /* Split items by vendor source */
  const shopifyItems = items.filter((i) => i.product.source !== "amazon");
  const amazonItems = items.filter((i) => i.product.source === "amazon");
  const hasAmazon = amazonItems.length > 0;
  const hasShopify = shopifyItems.length > 0;

  /** Add Shopify items to cart, open Amazon items in new tabs */
  const handleAddToCart = useCallback(() => {
    /* Add Shopify products to the site cart */
    for (const item of shopifyItems) {
      addItem(item.product, item.quantity);
    }

    /* Open Amazon products in new tabs */
    for (const item of amazonItems) {
      const link = getProductLink(item.product);
      window.open(link.href, "_blank", "noopener,noreferrer");
    }

    /* Build confirmation message */
    const parts: string[] = [];
    if (shopifyItems.length > 0) {
      parts.push(`Added ${shopifyItems.length} ${shopifyItems.length === 1 ? "item" : "items"} to cart`);
    }
    if (amazonItems.length > 0) {
      parts.push(`${amazonItems.length} Amazon ${amazonItems.length === 1 ? "item" : "items"} opened`);
    }
    setConfirmation(parts.join(" · "));
  }, [shopifyItems, amazonItems, addItem]);

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <ShoppingBag className="h-4 w-4 text-aqua" />
            Your Build
          </h3>
          {items.length > 0 && (
            <Badge className="bg-aqua/20 text-aqua text-[10px]">
              {items.length} {items.length === 1 ? "item" : "items"}
            </Badge>
          )}
        </div>

        {/* Empty state */}
        {items.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-border/30 bg-card/30 py-8 text-center">
            <Package className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-xs text-muted-foreground">
              Select products to build your list
            </p>
          </div>
        )}

        {/* Equipment list */}
        {items.length > 0 && (
          <div className="space-y-2">
            {items.map((item) => {
              const link = getProductLink(item.product);
              return (
                <div
                  key={`${item.stepId}-${item.product.id}`}
                  className="group rounded-lg border border-border/50 bg-card/30 p-2.5"
                >
                  <div className="flex items-start gap-2">
                    <button
                      onClick={() => onSelectStep(item.stepId)}
                      className="flex-1 text-left"
                      title="Click to change selection"
                    >
                      <Badge
                        variant="secondary"
                        className="mb-1 text-[10px] capitalize"
                      >
                        {item.stepLabel}
                      </Badge>
                      <p className="line-clamp-2 text-xs font-medium leading-snug">
                        {item.quantity > 1 && (
                          <span className="mr-1 text-aqua">{item.quantity}×</span>
                        )}
                        {item.product.title}
                      </p>
                      {/* Vendor attribution */}
                      <div className="mt-1 flex items-center gap-1.5">
                        <Store className="h-2.5 w-2.5 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">
                          {item.product.vendor || item.product.source}
                        </span>
                        {item.product.source === "amazon" && (
                          <Badge
                            variant="outline"
                            className="h-3.5 px-1 text-[8px]"
                          >
                            Amazon
                          </Badge>
                        )}
                      </div>
                    </button>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="text-xs font-medium text-aqua">
                        {item.quantity > 1
                          ? `$${(Number(item.product.price.amount) * item.quantity).toFixed(2)}`
                          : formatPrice(item.product.price.amount)}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-[10px] text-muted-foreground">
                          {formatPrice(item.product.price.amount)} ea
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        {/* Per-item external link */}
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-aqua group-hover:opacity-100"
                          title={link.external ? "View on Amazon" : "View product"}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <button
                          onClick={() =>
                            onRemoveItem(item.stepId, item.product.id)
                          }
                          className="rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                          title="Remove"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Subtotal + savings + tax note */}
        {items.length > 0 && (
          <div className="space-y-1 border-t border-border/50 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Subtotal</span>
              <span className="text-sm font-semibold text-aqua">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            {savings > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-400">You save</span>
                <span className="text-xs font-medium text-green-400">
                  -${savings.toFixed(2)}
                </span>
              </div>
            )}
            <p className="text-[10px] text-muted-foreground">
              Taxes and shipping calculated at checkout.
              {hasAmazon && " Amazon items purchased separately."}
            </p>
          </div>
        )}

        {/* Add to Cart / Open Amazon */}
        {items.length > 0 && (
          <div className="space-y-1.5">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-aqua text-deep-blue hover:bg-aqua-dim"
              size="sm"
            >
              {hasShopify ? (
                <>
                  <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                  {hasAmazon ? "Add to Cart & Open Amazon" : "Add to Cart"}
                </>
              ) : (
                <>
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                  Open on Amazon
                </>
              )}
            </Button>
            {confirmation && (
              <p className="flex items-center gap-1 text-[10px] text-green-400">
                <Check className="h-3 w-3 shrink-0" />
                {confirmation}
              </p>
            )}
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-2 border-t border-border/50 pt-3">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              Suggested
            </p>
            {recommendations.map((product) => (
              <button
                key={product.id}
                onClick={() => {
                  /* Find which step this product belongs to and navigate there */
                  const stepMap: Record<string, string> = {
                    "Fish & Livestock": "fish",
                    TANK: "tank",
                    "Live Plants": "plants",
                    PLANTS: "plants",
                    Hardscape: "hardscape",
                    DRIFTWOOD: "hardscape",
                    FILTER: "filter",
                    HEATER: "heater",
                    "UV LIGHT": "light",
                    GRAVEL: "substrate",
                  };
                  const stepId = stepMap[product.productType || ""];
                  if (stepId) onSelectStep(stepId);
                }}
                className="w-full rounded-lg border border-border/30 bg-card/30 p-2 text-left transition-colors hover:border-aqua/30"
              >
                <p className="line-clamp-1 text-xs font-medium">
                  {product.title}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className="text-[10px] capitalize"
                  >
                    {(product.productType || "").toLowerCase()}
                  </Badge>
                  <span className="text-xs text-aqua">
                    {formatPrice(product.price.amount)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step guides */}
        {stepGuides.length > 0 && (
          <div className="space-y-2 border-t border-border/50 pt-3">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5" />
              Automation Guides
            </p>
            {stepGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group block rounded-md border border-border/30 bg-card/50 p-2 transition-colors hover:border-aqua/30 hover:bg-aqua/5"
              >
                <p className="text-xs font-medium group-hover:text-aqua">
                  {guide.title}
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {guide.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
