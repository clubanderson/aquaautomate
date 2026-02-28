/** Commerce source where a product originates */
export type ProductSource = "shopify" | "amazon";

/** How the product gets fulfilled */
export type FulfillmentType = "shopify-checkout" | "amazon-affiliate";

/** Price information */
export interface ProductPrice {
  amount: string;
  currencyCode: string;
}

/** Product image */
export interface ProductImage {
  url: string;
  altText: string;
  width?: number;
  height?: number;
}

/** Product variant (size, color, etc.) */
export interface NormalizedVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ProductPrice;
  compareAtPrice?: ProductPrice;
  image?: ProductImage;
}

/**
 * Unified product interface across all commerce sources.
 * Shopify products go through Shopify checkout;
 * Amazon products link out with affiliate tags.
 */
export interface NormalizedProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  source: ProductSource;
  fulfillment: FulfillmentType;
  vendor?: string;
  productType?: string;
  tags: string[];
  images: ProductImage[];
  featuredImage?: ProductImage;
  variants: NormalizedVariant[];
  price: ProductPrice;
  compareAtPrice?: ProductPrice;
  availableForSale: boolean;

  /** For Amazon products: the affiliate link */
  externalUrl?: string;
  /** Display label like "From Danbury Aquarium" or "Available on Amazon" */
  sourceLabel?: string;
  /** Automation-related flag */
  automationCompatible?: boolean;
  /** Freshwater / Saltwater / Both */
  waterType?: "freshwater" | "saltwater" | "both";
}

/** Cart line item */
export interface CartItem {
  id: string;
  variantId: string;
  product: NormalizedProduct;
  quantity: number;
}

/** Shopping cart */
export interface Cart {
  id: string;
  checkoutUrl: string;
  lines: CartItem[];
  totalQuantity: number;
  cost: {
    subtotalAmount: ProductPrice;
    totalAmount: ProductPrice;
  };
}

/** Collection of products */
export interface NormalizedCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: ProductImage;
  products: NormalizedProduct[];
}
