/** Site-wide constants */
export const SITE_NAME = "AquaAutomate";
export const SITE_DESCRIPTION =
  "Aquarium hobby meets home automation. Shop fish, plants, equipment — and automate your tank with Home Assistant.";
export const SITE_URL = "https://aquaautomate.com";

/** Shopify Storefront API version */
export const SHOPIFY_API_VERSION = "2024-10";

/** Product grid defaults */
export const PRODUCTS_PER_PAGE = 12;

/** Inventory thresholds */
/** Show "Low Stock" badge when total quantity is at or below this value */
export const LOW_STOCK_THRESHOLD = 5;
/** Show exact "Only X left" count when total quantity is at or below this value */
export const SHOW_EXACT_COUNT_THRESHOLD = 3;

/** Tag used to identify best-selling products */
export const BEST_SELLER_TAG = "best-seller";

/** Number of recommended products to show on product pages */
export const RECOMMENDATION_COUNT = 4;
/** Scoring weights for product recommendations */
export const RECOMMENDATION_SAME_TYPE_SCORE = 3;
export const RECOMMENDATION_SHARED_TAG_SCORE = 1;
export const RECOMMENDATION_SAME_WATER_TYPE_SCORE = 2;
export const RECOMMENDATION_SAME_VENDOR_SCORE = 1;

/** Amazon affiliate tag */
export const AMAZON_ASSOCIATE_TAG =
  process.env.AMAZON_ASSOCIATE_TAG ?? "aquaautomate-20";

/** Price cache TTL in milliseconds (Amazon TOS: 1 hour minimum) */
export const AMAZON_PRICE_CACHE_TTL_MS = 3_600_000;

/** ISR revalidation interval in seconds (5 minutes) */
export const REVALIDATE_SECONDS = 300;

/** Number of product recommendations to show in the wizard cart sidebar */
export const WIZARD_RECOMMENDATION_COUNT = 3;

/** Maximum tank mate recommendations shown in the fish type grid */
export const MAX_TANK_MATE_RECOMMENDATIONS = 6;

/** Default quantity when manually selecting a fish in the wizard */
export const DEFAULT_FISH_QUANTITY = 1;
/** Minimum fish quantity per species in the wizard */
export const MIN_FISH_QUANTITY = 1;
/** Maximum fish quantity per species in the wizard */
export const MAX_FISH_QUANTITY = 50;

/** Navigation links */
export const NAV_LINKS = [
  { label: "Shop", href: "/collections" },
  { label: "Species", href: "/species" },
  { label: "Tools", href: "/tools/tank-calculator" },
  { label: "Automation", href: "/automation" },
  { label: "Blog", href: "/blog" },
  { label: "Live Cams", href: "/live" },
] as const;

/** Product categories */
export const PRODUCT_CATEGORIES = [
  "Fish & Livestock",
  "Hardscape",
  "Equipment",
  "Automation & Smart Gear",
] as const;
