import type { NormalizedProduct, NormalizedCollection } from "./types";

/**
 * Demo products for development before Shopify/Amazon are connected.
 * These showcase the mixed-source product grid.
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
    availableForSale: true,
    sourceLabel: "From Danbury Aquarium",
    waterType: "freshwater",
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
  },
  {
    id: "demo-3",
    handle: "hygger-full-spectrum-light-24",
    title: 'Hygger Full Spectrum Aquarium Light 24"',
    description:
      "Programmable LED aquarium light with sunrise/sunset mode. Works great with Tuya smart plugs for Home Assistant automation.",
    source: "amazon",
    fulfillment: "amazon-affiliate",
    tags: ["lighting", "automation-compatible", "freshwater", "planted-tank"],
    images: [
      {
        url: "/images/demo/hygger-light.jpg",
        altText: "Hygger full spectrum LED aquarium light",
      },
    ],
    featuredImage: {
      url: "/images/demo/hygger-light.jpg",
      altText: "Hygger full spectrum LED aquarium light",
    },
    variants: [
      {
        id: "demo-3-v1",
        title: '24" (18-24 gal)',
        availableForSale: true,
        price: { amount: "32.99", currencyCode: "USD" },
      },
    ],
    price: { amount: "32.99", currencyCode: "USD" },
    availableForSale: true,
    externalUrl: "https://www.amazon.com/dp/B07XAMPLE?tag=aquaautomate-20",
    sourceLabel: "Available on Amazon",
    automationCompatible: true,
    waterType: "freshwater",
  },
  {
    id: "demo-4",
    handle: "tuya-smart-plug-4pack",
    title: "Tuya Smart Plug (4-Pack)",
    description:
      "WiFi smart plugs with energy monitoring. Flashes with Tuya-Local firmware for full Home Assistant local control — no cloud required.",
    source: "amazon",
    fulfillment: "amazon-affiliate",
    tags: ["automation", "smart-home", "home-assistant", "tuya"],
    images: [
      {
        url: "/images/demo/tuya-plug.jpg",
        altText: "Tuya smart plug 4-pack for aquarium automation",
      },
    ],
    featuredImage: {
      url: "/images/demo/tuya-plug.jpg",
      altText: "Tuya smart plug 4-pack for aquarium automation",
    },
    variants: [
      {
        id: "demo-4-v1",
        title: "4-Pack",
        availableForSale: true,
        price: { amount: "24.99", currencyCode: "USD" },
      },
    ],
    price: { amount: "24.99", currencyCode: "USD" },
    availableForSale: true,
    externalUrl: "https://www.amazon.com/dp/B08XAMPLE?tag=aquaautomate-20",
    sourceLabel: "Available on Amazon",
    automationCompatible: true,
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
        availableForSale: true,
        price: { amount: "7.99", currencyCode: "USD" },
      },
    ],
    price: { amount: "7.99", currencyCode: "USD" },
    availableForSale: true,
    sourceLabel: "From Danbury Aquarium",
    waterType: "freshwater",
  },
  {
    id: "demo-6",
    handle: "lutron-pico-remote",
    title: "Lutron Pico Remote (5-Button)",
    description:
      "Wireless scene controller. Pair with Lutron Caseta bridge for Home Assistant tank scene control — one button for day, night, feeding modes.",
    source: "amazon",
    fulfillment: "amazon-affiliate",
    tags: ["automation", "smart-home", "home-assistant", "lutron", "scenes"],
    images: [
      {
        url: "/images/demo/lutron-pico.jpg",
        altText: "Lutron Pico 5-button wireless remote for tank scenes",
      },
    ],
    featuredImage: {
      url: "/images/demo/lutron-pico.jpg",
      altText: "Lutron Pico 5-button wireless remote for tank scenes",
    },
    variants: [
      {
        id: "demo-6-v1",
        title: "Single Remote",
        availableForSale: true,
        price: { amount: "16.95", currencyCode: "USD" },
      },
    ],
    price: { amount: "16.95", currencyCode: "USD" },
    availableForSale: true,
    externalUrl: "https://www.amazon.com/dp/B00XAMPLE?tag=aquaautomate-20",
    sourceLabel: "Available on Amazon",
    automationCompatible: true,
  },
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
