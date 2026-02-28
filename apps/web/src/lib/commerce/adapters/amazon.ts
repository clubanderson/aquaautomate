import { AMAZON_ASSOCIATE_TAG } from "@/lib/constants";
import type { NormalizedProduct } from "../types";

/**
 * Amazon product adapter (stub for Phase 3).
 *
 * When the Amazon Creators API integration is ready, this will fetch
 * products and normalize them. For now it provides a helper to create
 * manual affiliate product entries.
 */
export function createAmazonProduct(params: {
  asin: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  tags?: string[];
  automationCompatible?: boolean;
  waterType?: "freshwater" | "saltwater" | "both";
}): NormalizedProduct {
  const affiliateUrl = `https://www.amazon.com/dp/${params.asin}?tag=${AMAZON_ASSOCIATE_TAG}`;

  return {
    id: `amazon-${params.asin}`,
    handle: `amazon-${params.asin}`,
    title: params.title,
    description: params.description,
    source: "amazon",
    fulfillment: "amazon-affiliate",
    tags: params.tags ?? [],
    images: [
      {
        url: params.imageUrl,
        altText: params.title,
      },
    ],
    featuredImage: {
      url: params.imageUrl,
      altText: params.title,
    },
    variants: [
      {
        id: `amazon-${params.asin}-default`,
        title: "Default",
        availableForSale: true,
        price: { amount: params.price, currencyCode: "USD" },
      },
    ],
    price: { amount: params.price, currencyCode: "USD" },
    availableForSale: true,
    externalUrl: affiliateUrl,
    sourceLabel: "Available on Amazon",
    automationCompatible: params.automationCompatible,
    waterType: params.waterType,
  };
}
