import type { NormalizedProduct } from "@/lib/commerce/types";

/** Safe wrapper — only fires if gtag is loaded */
function gtag(
  command: "event",
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag(command, eventName, params);
  }
}

/** GA4 view_item event — fires when a user views a product page */
export function trackViewItem(product: NormalizedProduct) {
  gtag("event", "view_item", {
    currency: product.price.currencyCode,
    value: Number(product.price.amount),
    items_id: product.id,
    items_name: product.title,
    items_brand: product.vendor,
    items_category: product.productType,
  });
}

/** GA4 add_to_cart event */
export function trackAddToCart(product: NormalizedProduct, quantity: number = 1) {
  gtag("event", "add_to_cart", {
    currency: product.price.currencyCode,
    value: Number(product.price.amount) * quantity,
    items_id: product.id,
    items_name: product.title,
    items_quantity: quantity,
  });
}

/** GA4 begin_checkout event */
export function trackBeginCheckout(
  value: number,
  currency: string = "USD"
) {
  gtag("event", "begin_checkout", {
    currency,
    value,
  });
}

/** GA4 search event */
export function trackSearch(searchTerm: string) {
  gtag("event", "search", {
    search_term: searchTerm,
  });
}
