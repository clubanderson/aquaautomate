"use server";

import { createCart } from "@/lib/shopify";

/**
 * Server action: creates a Shopify cart and returns the checkout URL.
 * Called when the user clicks "Checkout" in the cart drawer.
 */
export async function createCheckout(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<{ checkoutUrl: string } | { error: string }> {
  try {
    const cart = await createCart(lines);
    return { checkoutUrl: cart.checkoutUrl };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create checkout";
    return { error: message };
  }
}
