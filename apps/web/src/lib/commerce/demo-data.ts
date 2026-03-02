import type { NormalizedProduct, NormalizedCollection } from "./types";
import { AMAZON_PRODUCTS } from "./amazon-catalog";

/**
 * Demo Shopify products for development before a real Shopify store is connected.
 * Amazon affiliate products are sourced from the curated amazon-catalog.
 */
export const DEMO_PRODUCTS: NormalizedProduct[] = [
  {
    id: "demo-1",
    handle: "neon-tetra-school-6",
    title: "Neon Tetra (School of 6)",
    description:
      "Vibrant schooling fish perfect for community tanks. These captive-bred neon tetras display stunning iridescent blue and red coloring.",
    source: "shopify",
    fulfillment: "shopify-checkout",
    vendor: "Danbury Aquarium",
    productType: "Fish & Livestock",
    tags: ["freshwater", "community", "beginner-friendly", "schooling"],
    images: [
      {
        url: "/images/demo/neon-tetra.jpg",
        altText: "Neon Tetra school swimming in planted tank",
      },
    ],
    featuredImage: {
      url: "/images/demo/neon-tetra.jpg",
      altText: "Neon Tetra school swimming in planted tank",
    },
    variants: [
      {
        id: "demo-1-v1",
        title: "School of 6",
        availableForSale: true,
        price: { amount: "11.99", currencyCode: "USD" },
      },
    ],
    price: { amount: "11.99", currencyCode: "USD" },
    compareAtPrice: { amount: "15.99", currencyCode: "USD" },
    availableForSale: true,
    sourceLabel: "From Danbury Aquarium",
    waterType: "freshwater",
    totalQuantity: 24,
    inventoryStatus: "in-stock",
  },
  {
    id: "demo-2",
    handle: "spider-driftwood-medium",
    title: "Spider Driftwood (Medium)",
    description:
      "Natural spider driftwood piece, 8-12 inches. Each piece is unique — perfect centerpiece for aquascaping.",
    source: "shopify",
    fulfillment: "shopify-checkout",
    vendor: "Danbury Aquarium",
    productType: "Hardscape",
    tags: ["hardscape", "driftwood", "aquascaping"],
    images: [
      {
        url: "/images/demo/spider-driftwood.jpg",
        altText: "Spider driftwood piece for aquarium aquascaping",
      },
    ],
    featuredImage: {
      url: "/images/demo/spider-driftwood.jpg",
      altText: "Spider driftwood piece for aquarium aquascaping",
    },
    variants: [
      {
        id: "demo-2-v1",
        title: "Medium (8-12 in)",
        availableForSale: true,
        price: { amount: "24.99", currencyCode: "USD" },
      },
    ],
    price: { amount: "24.99", currencyCode: "USD" },
    availableForSale: true,
    sourceLabel: "From Danbury Aquarium",
    totalQuantity: 3,
    inventoryStatus: "low-stock",
  },
  {
    id: "demo-5",
    handle: "java-fern",
    title: "Java Fern (Microsorum pteropus)",
    description:
      "Hardy, low-light aquarium plant. Attach to driftwood or rocks — do not bury the rhizome. Perfect for beginners.",
    source: "shopify",
    fulfillment: "shopify-checkout",
    vendor: "Danbury Aquarium",
    productType: "Live Plants",
    tags: ["freshwater", "plants", "low-light", "beginner-friendly"],
    images: [
      {
        url: "/images/demo/java-fern.jpg",
        altText: "Java Fern aquarium plant attached to driftwood",
      },
    ],
    featuredImage: {
      url: "/images/demo/java-fern.jpg",
      altText: "Java Fern aquarium plant attached to driftwood",
    },
    variants: [
      {
        id: "demo-5-v1",
        title: "Single Plant",
        availableForSale: false,
        price: { amount: "7.99", currencyCode: "USD" },
      },
    ],
    price: { amount: "7.99", currencyCode: "USD" },
    availableForSale: false,
    sourceLabel: "From Danbury Aquarium",
    waterType: "freshwater",
    totalQuantity: 0,
    inventoryStatus: "sold-out",
  },
  /* Real Amazon affiliate products from the curated catalog */
  ...AMAZON_PRODUCTS,
];

/** Demo collections for development */
export const DEMO_COLLECTIONS: NormalizedCollection[] = [
  {
    id: "col-1",
    handle: "freshwater-fish",
    title: "Freshwater Fish",
    description:
      "Community fish, schooling species, and centerpiece fish for freshwater tanks.",
    products: DEMO_PRODUCTS.filter(
      (p) => p.waterType === "freshwater" && p.productType === "Fish & Livestock"
    ),
  },
  {
    id: "col-2",
    handle: "automation-gear",
    title: "Automation & Smart Gear",
    description:
      "Smart plugs, controllers, sensors, and Home Assistant hardware for tank automation.",
    products: DEMO_PRODUCTS.filter((p) => p.automationCompatible),
  },
  {
    id: "col-3",
    handle: "live-plants",
    title: "Live Plants",
    description:
      "Easy-to-grow aquarium plants for beginners and experts alike.",
    products: DEMO_PRODUCTS.filter((p) =>
      (p.tags || []).includes("plants")
    ),
  },
  {
    id: "col-4",
    handle: "hardscape",
    title: "Hardscape",
    description:
      "Driftwood, rocks, and substrate for stunning aquascapes.",
    products: DEMO_PRODUCTS.filter(
      (p) => p.productType === "Hardscape"
    ),
  },
];
