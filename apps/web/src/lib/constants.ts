/** Site-wide constants */
export const SITE_NAME = "AquaAutomate";
export const SITE_DESCRIPTION =
  "Aquarium hobby meets home automation. Shop fish, plants, equipment — and automate your tank with Home Assistant.";
export const SITE_URL = "https://aquaautomate.com";

/** Shopify Storefront API version */
export const SHOPIFY_API_VERSION = "2024-10";

/** Product grid defaults */
export const PRODUCTS_PER_PAGE = 12;

/** Amazon affiliate tag */
export const AMAZON_ASSOCIATE_TAG =
  process.env.AMAZON_ASSOCIATE_TAG ?? "aquaautomate-20";

/** Price cache TTL in milliseconds (Amazon TOS: 1 hour minimum) */
export const AMAZON_PRICE_CACHE_TTL_MS = 3_600_000;

/** ISR revalidation interval in seconds (5 minutes) */
export const REVALIDATE_SECONDS = 300;

/** Navigation links */
export const NAV_LINKS = [
  { label: "Shop", href: "/collections" },
  { label: "Guides", href: "/guides" },
  { label: "Automation", href: "/guides?category=automation" },
  { label: "Species", href: "/guides?category=species" },
] as const;

/** Product categories */
export const PRODUCT_CATEGORIES = [
  "Fish & Livestock",
  "Hardscape",
  "Equipment",
  "Automation & Smart Gear",
] as const;
