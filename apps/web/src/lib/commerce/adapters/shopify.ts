import type { ShopifyProduct, ShopifyCollection } from "@/lib/shopify/types";
import type { NormalizedProduct, NormalizedCollection, InventoryStatus } from "../types";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";

/** Convert a Shopify product to the unified NormalizedProduct shape */
export function normalizeShopifyProduct(
  product: ShopifyProduct
): NormalizedProduct {
  const images = (product.images?.edges ?? []).map((e) => ({
    url: e.node.url,
    altText: e.node.altText ?? product.title,
    width: e.node.width,
    height: e.node.height,
  }));

  const variants = (product.variants?.edges ?? []).map((e) => ({
    id: e.node.id,
    title: e.node.title,
    availableForSale: e.node.availableForSale,
    price: e.node.price,
    compareAtPrice: e.node.compareAtPrice ?? undefined,
    image: e.node.image
      ? {
          url: e.node.image.url,
          altText: e.node.image.altText ?? product.title,
          width: e.node.image.width,
          height: e.node.image.height,
        }
      : undefined,
    quantityAvailable: e.node.quantityAvailable,
  }));

  /* Compute aggregate inventory from variant quantities */
  const hasQuantityData = variants.some((v) => v.quantityAvailable != null);
  const totalQuantity = hasQuantityData
    ? variants.reduce((sum, v) => sum + (v.quantityAvailable ?? 0), 0)
    : null;

  /* availableForSale is the authoritative sold-out signal from Shopify.
     quantityAvailable may be 0 or null for Collective products where
     inventory tracking isn't synced — only use it for low-stock hints
     when Shopify confirms the product is actually available. */
  let inventoryStatus: InventoryStatus = "in-stock";
  if (!product.availableForSale) {
    inventoryStatus = "sold-out";
  } else if (
    totalQuantity !== null &&
    totalQuantity > 0 &&
    totalQuantity <= LOW_STOCK_THRESHOLD
  ) {
    inventoryStatus = "low-stock";
  }

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    descriptionHtml: product.descriptionHtml,
    source: "shopify",
    fulfillment: "shopify-checkout",
    vendor: product.vendor,
    productType: product.productType,
    tags: product.tags,
    images,
    featuredImage: product.featuredImage
      ? {
          url: product.featuredImage.url,
          altText: product.featuredImage.altText ?? product.title,
          width: product.featuredImage.width,
          height: product.featuredImage.height,
        }
      : images[0],
    variants,
    price: product.priceRange.minVariantPrice,
    compareAtPrice: (() => {
      const compareAmt = parseFloat(
        product.compareAtPriceRange?.minVariantPrice?.amount ?? "0"
      );
      const priceAmt = parseFloat(product.priceRange.minVariantPrice.amount);
      /* Only set compareAtPrice when it's non-zero AND higher than the current price */
      return compareAmt > 0 && compareAmt > priceAmt
        ? product.compareAtPriceRange.minVariantPrice
        : undefined;
    })(),
    availableForSale: product.availableForSale,
    sourceLabel: product.vendor
      ? `From ${product.vendor}`
      : "Shopify Store",
    totalQuantity,
    inventoryStatus,
  };
}

/** Convert a Shopify collection to the unified NormalizedCollection shape */
export function normalizeShopifyCollection(
  collection: ShopifyCollection
): NormalizedCollection {
  return {
    id: collection.id,
    handle: collection.handle,
    title: collection.title,
    description: collection.description,
    image: collection.image
      ? {
          url: collection.image.url,
          altText: collection.image.altText ?? collection.title,
          width: collection.image.width,
          height: collection.image.height,
        }
      : undefined,
    products: (collection.products?.edges ?? []).map((e) =>
      normalizeShopifyProduct(e.node)
    ),
  };
}
