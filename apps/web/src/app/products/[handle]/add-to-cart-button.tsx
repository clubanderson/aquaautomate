"use client";

import { ShoppingCart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-context";
import type { NormalizedProduct } from "@/lib/commerce/types";

interface AddToCartButtonProps {
  product: NormalizedProduct;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const isAmazon = product.source === "amazon";

  if (isAmazon) {
    return (
      <Button
        size="lg"
        className="w-full border-coral/30 text-coral hover:bg-coral/10"
        variant="outline"
        asChild
      >
        <a
          href={product.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Buy on Amazon
        </a>
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      className="w-full bg-aqua text-deep-blue hover:bg-aqua-dim"
      onClick={() => addItem(product)}
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      Add to Cart
    </Button>
  );
}
