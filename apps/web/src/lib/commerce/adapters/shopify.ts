import type { ShopifyProduct, ShopifyCollection } from "@/lib/shopify/types";
import type { NormalizedProduct, NormalizedCollection } from "../types";

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
  }));

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
    compareAtPrice:
      product.compareAtPriceRange?.minVariantPrice?.amount !== "0.0"
        ? product.compareAtPriceRange.minVariantPrice
        : undefined,
    availableForSale: product.availableForSale,
    sourceLabel: product.vendor
      ? `From ${product.vendor}`
      : "Shopify Store",
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
