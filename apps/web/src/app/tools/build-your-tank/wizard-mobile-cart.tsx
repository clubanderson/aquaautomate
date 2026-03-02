"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  WizardCartSidebar,
  type WizardCartItem,
  type WizardFishSelection,
} from "./wizard-cart-sidebar";
import type { NormalizedProduct } from "@/lib/commerce/types";

interface StepGuide {
  slug: string;
  title: string;
  description: string;
}

interface WizardMobileCartProps {
  items: WizardCartItem[];
  fishSelections: WizardFishSelection[];
  recommendations: NormalizedProduct[];
  stepGuides: StepGuide[];
  onRemoveItem: (stepId: string) => void;
  onSelectStep: (stepId: string) => void;
}

/**
 * Mobile-only sticky bottom bar that shows item count + subtotal.
 * Tapping "View Build" opens a Sheet with the full sidebar content.
 * Only renders when there are items selected.
 */
export function WizardMobileCart({
  items,
  fishSelections,
  recommendations,
  stepGuides,
  onRemoveItem,
  onSelectStep,
}: WizardMobileCartProps) {
  const [open, setOpen] = useState(false);

  if (items.length === 0) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price.amount),
    0,
  );

  const handleSelectStep = (stepId: string) => {
    setOpen(false);
    onSelectStep(stepId);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/50 bg-background/95 p-3 backdrop-blur-sm lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between border-aqua/30"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-aqua" />
              <span className="text-sm">
                {items.length} {items.length === 1 ? "item" : "items"} &middot;{" "}
                <span className="font-semibold text-aqua">
                  ${subtotal.toFixed(2)}
                </span>
              </span>
            </span>
            <span className="text-xs text-muted-foreground">View Build</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>Your Build</SheetTitle>
            <SheetDescription>
              {items.length} {items.length === 1 ? "item" : "items"} selected
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            <WizardCartSidebar
              items={items}
              fishSelections={fishSelections}
              recommendations={recommendations}
              stepGuides={stepGuides}
              onRemoveItem={onRemoveItem}
              onSelectStep={handleSelectStep}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
