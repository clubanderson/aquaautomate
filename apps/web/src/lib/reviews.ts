/** Star rating value (1-5) */
export type StarRating = 1 | 2 | 3 | 4 | 5;

/** A product review */
export interface ProductReview {
  id: string;
  productId: string;
  author: string;
  rating: StarRating;
  title: string;
  body: string;
  date: string;
  verified: boolean;
}

/** Aggregate review stats for a product */
export interface ReviewSummary {
  productId: string;
  averageRating: number;
  totalReviews: number;
  distribution: Record<StarRating, number>;
}

/**
 * Curated reviews for products in our catalog.
 * In production, these would come from an API or database.
 */
const REVIEWS: ProductReview[] = [
  {
    id: "r1",
    productId: "amazon-fluval-307",
    author: "TankEnthusiast",
    rating: 5,
    title: "Best canister filter I've owned",
    body: "Super quiet, easy to prime, and the media baskets make maintenance a breeze. Running on my 55-gallon community tank for 6 months with zero issues.",
    date: "2025-01-15",
    verified: true,
  },
  {
    id: "r2",
    productId: "amazon-fluval-307",
    author: "PlantedTankPro",
    rating: 4,
    title: "Great filter, minor complaints",
    body: "Flow rate is excellent and it handles my planted tank well. Only downside is the intake strainer could be finer — I had to add a sponge prefilter to protect shrimp fry.",
    date: "2025-01-20",
    verified: true,
  },
  {
    id: "r3",
    productId: "amazon-fluval-307",
    author: "ReefNewbie",
    rating: 5,
    title: "Whisper quiet",
    body: "I can't even tell it's running. My previous HOB filter was so loud I couldn't sleep. This canister is silent and moves way more water.",
    date: "2024-12-10",
    verified: false,
  },
  {
    id: "r4",
    productId: "amazon-inkbird-308",
    author: "BreederMike",
    rating: 5,
    title: "Essential for any serious keeper",
    body: "WiFi monitoring is a game changer. I get alerts on my phone if temperature drifts. The probe is accurate and the app is straightforward. Worth every penny.",
    date: "2025-02-01",
    verified: true,
  },
  {
    id: "r5",
    productId: "amazon-inkbird-308",
    author: "SaltwaterSam",
    rating: 4,
    title: "Reliable temp controller",
    body: "Using this with a 200W heater on my 40-gallon reef. Keeps temp rock solid at 78°F. WiFi setup was a bit finicky but once connected it's been reliable.",
    date: "2025-01-28",
    verified: true,
  },
  {
    id: "r6",
    productId: "amazon-hygger-light",
    author: "AquascapeAndy",
    rating: 4,
    title: "Great value planted tank light",
    body: "Good spectrum for plant growth, timer built in, and the sunrise/sunset mode is a nice touch. Not as powerful as a Fluval Plant 3.0 but at a third of the price.",
    date: "2025-02-10",
    verified: true,
  },
  {
    id: "r7",
    productId: "amazon-hygger-light",
    author: "BettaBabe",
    rating: 5,
    title: "My betta loves the moonlight mode",
    body: "The blue moonlight setting is gorgeous. During the day the plants pearl and at night the tank glows. Perfect for a bedroom tank.",
    date: "2025-01-05",
    verified: false,
  },
  {
    id: "r8",
    productId: "amazon-tuya-plug-4pk",
    author: "HomeAssistantFan",
    rating: 5,
    title: "Perfect for aquarium automation",
    body: "Flashed to Tuya local control, connected to Home Assistant, and now all my tank equipment is automated. Four plugs for under $20 — can't beat it.",
    date: "2025-02-15",
    verified: true,
  },
  {
    id: "r9",
    productId: "amazon-tuya-plug-4pk",
    author: "NanoTankNerd",
    rating: 4,
    title: "Compact and reliable",
    body: "These don't block adjacent outlets and the app scheduling works well even without a smart home hub. Using three for my nano tank setup.",
    date: "2025-01-18",
    verified: true,
  },
  {
    id: "r10",
    productId: "amazon-shelly-plug-s",
    author: "PowerUser",
    rating: 5,
    title: "Local control + energy monitoring",
    body: "The Shelly Plug S is the best smart plug for aquariums. 12A capacity handles any heater, energy monitoring shows exactly what each device draws, and local API means no cloud dependency.",
    date: "2025-02-05",
    verified: true,
  },
];

/** Get reviews for a specific product */
export function getProductReviews(productId: string): ProductReview[] {
  return REVIEWS.filter((r) => r.productId === productId).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/** Get aggregate review summary for a product */
export function getReviewSummary(productId: string): ReviewSummary | null {
  const reviews = getProductReviews(productId);
  if (reviews.length === 0) return null;

  const distribution: Record<StarRating, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalRating = 0;

  for (const review of reviews) {
    distribution[review.rating]++;
    totalRating += review.rating;
  }

  return {
    productId,
    averageRating: totalRating / reviews.length,
    totalReviews: reviews.length,
    distribution,
  };
}

/** Get all product IDs that have reviews */
export function getReviewedProductIds(): string[] {
  const ids = new Set<string>();
  for (const review of REVIEWS) {
    ids.add(review.productId);
  }
  return Array.from(ids);
}
