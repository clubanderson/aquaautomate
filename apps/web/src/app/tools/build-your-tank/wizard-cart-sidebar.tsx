"use client";

import Link from "next/link";
import {
  BookOpen,
  ExternalLink,
  Fish,
  Package,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { NormalizedProduct } from "@/lib/commerce/types";

/** A selected product tied to a wizard step */
export interface WizardCartItem {
  stepId: string;
  stepLabel: string;
  product: NormalizedProduct;
}

/** Fish selection carried from the tank calculator */
export interface WizardFishSelection {
  species: string;
  count: number;
}

/** Related automation guide */
interface StepGuide {
  slug: string;
  title: string;
  description: string;
}

export interface WizardCartSidebarProps {
  items: WizardCartItem[];
  fishSelections: WizardFishSelection[];
  recommendations: NormalizedProduct[];
  stepGuides: StepGuide[];
  onRemoveItem: (stepId: string) => void;
  onSelectStep: (stepId: string) => void;
}

/** Format a price string as currency */
function formatPrice(amount: string): string {
  return `$${Number(amount).toFixed(2)}`;
}

/**
 * Persistent right-side cart panel showing selections, fish, totals,
 * recommendations, and step-specific automation guides.
 */
export function WizardCartSidebar({
  items,
  fishSelections,
  recommendations,
  stepGuides,
  onRemoveItem,
  onSelectStep,
}: WizardCartSidebarProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price.amount),
    0,
  );

  const savings = items.reduce((sum, item) => {
    const compare = item.product.compareAtPrice
      ? Number(item.product.compareAtPrice.amount)
      : 0;
    const price = Number(item.product.price.amount);
    return sum + Math.max(0, compare - price);
  }, 0);

  const handleOpenAllOnAmazon = () => {
    for (const item of items) {
      if (item.product.externalUrl) {
        window.open(item.product.externalUrl, "_blank", "noopener,noreferrer");
      }
    }
  };

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
        {items.length === 0 && fishSelections.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-border/30 bg-card/30 py-8 text-center">
            <Package className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-xs text-muted-foreground">
              Select equipment to build your list
            </p>
          </div>
        )}

        {/* Equipment list */}
        {items.length > 0 && (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.stepId}
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
                      {item.product.title}
                    </p>
                  </button>
                  <div className="flex shrink-0 items-center gap-1">
                    <span className="text-xs font-medium text-aqua">
                      {formatPrice(item.product.price.amount)}
                    </span>
                    <button
                      onClick={() => onRemoveItem(item.stepId)}
                      className="rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                      title="Remove"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fish section */}
        {fishSelections.length > 0 && (
          <div className="space-y-1.5">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Fish className="h-3.5 w-3.5" />
              Fish from Calculator
            </p>
            <div className="flex flex-wrap gap-1.5">
              {fishSelections.map((fish) => (
                <Badge
                  key={fish.species}
                  variant="outline"
                  className="gap-1 text-[10px]"
                >
                  {fish.species}
                  <span className="rounded-full bg-aqua/20 px-1 text-aqua">
                    {fish.count}
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Subtotal + savings */}
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
          </div>
        )}

        {/* Open All on Amazon */}
        {items.length > 0 && (
          <Button
            onClick={handleOpenAllOnAmazon}
            className="w-full bg-aqua text-deep-blue hover:bg-aqua-dim"
            size="sm"
          >
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
            Open All on Amazon
          </Button>
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
                    TANK: "tank",
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

