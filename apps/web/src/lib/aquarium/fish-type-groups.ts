/**
 * Fish type grouping and tank-mate recommendation utilities for the wizard.
 *
 * Groups fish products by productType (GUPPY, TETRA, CORY, etc.),
 * enriches each group with species metadata (temperament, swim level),
 * and generates tank-mate recommendations using existing compatibility data.
 */

import type { NormalizedProduct } from "@/lib/commerce/types";
import type { SpeciesProfile, Compatibility } from "./tank-mates";
import {
  matchProductToSpecies,
  getCompatibility,
  PRODUCT_TYPE_TO_SPECIES,
} from "./match-species";
import { SPECIES_PROFILES } from "./compatibility-data";
import { MAX_TANK_MATE_RECOMMENDATIONS } from "@/lib/constants";

/* ── Types ─────────────────────────────────────────────────────────────── */

export interface FishTypeGroup {
  /** Raw productType string (e.g., "GUPPY") */
  productType: string;
  /** Human-readable display name (e.g., "Guppies") */
  displayName: string;
  /** Products belonging to this type */
  products: NormalizedProduct[];
  /** Number of available (non-sold-out) varieties */
  availableCount: number;
  /** Matched species profile (null if unknown type) */
  profile: SpeciesProfile | null;
  /** Formatted price range (e.g., "$3.99 – $12.99") */
  priceRange: string;
  /** Count of already-selected products from this type */
  selectedCount: number;
}

export interface TankMateRecommendation {
  /** The product type to recommend */
  productType: string;
  /** Human-readable name */
  displayName: string;
  /** Species profile */
  profile: SpeciesProfile;
  /** Why this species is recommended */
  reason: string;
  /** Compatibility level with all currently selected species */
  compatibility: Compatibility;
  /** Number of available products in this type */
  availableCount: number;
}

export interface CompatibilityNote {
  /** Species name that has the compatibility concern */
  species: string;
  /** Compatibility level */
  compatibility: Compatibility;
  /** Explanation */
  note: string;
}

/* ── Display name mapping ──────────────────────────────────────────────── */

/** Human-readable plural names for known fish product types */
const PRODUCT_TYPE_DISPLAY_NAMES: Record<string, string> = {
  TETRA: "Tetras",
  GUPPY: "Guppies",
  CORY: "Corydoras",
  BETTA: "Bettas",
  MOLLY: "Mollies",
  PLATY: "Platies",
  SWORDTAIL: "Swordtails",
  BARB: "Barbs",
  GOURAMI: "Gouramis",
  PLECO: "Plecos",
  SHRIMP: "Shrimp",
  SNAIL: "Snails",
  DANIO: "Danios",
  RAINBOW: "Rainbowfish",
  LOACH: "Loaches",
  CATFISH: "Catfish",
  ANGELFISH: "Angelfish",
  KNIFEFISH: "Knifefish",
  "AFRICAN CICHLIDS": "African Cichlids",
  "AMERICAN CICHLID": "American Cichlids",
  GOLDFISH: "Goldfish",
  DISCUS: "Discus",
  AROWANA: "Arowanas",
  KOI: "Koi",
  SHARK: "Sharks",
  CRAYFISH: "Crayfish",
  NIGERIAN: "Nigerian Cichlids",
  "Live Stock": "Other Livestock",
  Dottyback: "Dottybacks",
  Killifish: "Killifish",
  Puffer: "Puffers",
  stingray: "Stingrays",
};

/** Convert a product type to a human-readable display name */
export function humanizeProductType(productType: string): string {
  /* Check exact match first, then uppercase version */
  return (
    PRODUCT_TYPE_DISPLAY_NAMES[productType] ??
    PRODUCT_TYPE_DISPLAY_NAMES[productType.toUpperCase()] ??
    titleCase(productType)
  );
}

/** Title-case fallback for unknown product types */
function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

/* ── Swim level labels ─────────────────────────────────────────────────── */

/** Human-readable swim level labels */
export const SWIM_LEVEL_LABELS: Record<string, string> = {
  top: "Top",
  mid: "Mid",
  bottom: "Bottom",
  all: "All levels",
};

/* ── Grouping ──────────────────────────────────────────────────────────── */

/** Minimum products in a type to show it as a group (types with fewer go into "Other") */
const MIN_GROUP_SIZE = 1;

/**
 * Group fish products by productType and enrich with species metadata.
 * Sorts: types with selections first, then alphabetical by display name.
 */
export function groupFishByType(
  fishProducts: NormalizedProduct[],
  selectedFish: NormalizedProduct[],
): FishTypeGroup[] {
  /* Step 1: Group products by productType */
  const typeMap = new Map<string, NormalizedProduct[]>();
  for (const product of fishProducts) {
    const type = product.productType || "Other";
    const arr = typeMap.get(type) || [];
    arr.push(product);
    typeMap.set(type, arr);
  }

  /* Step 2: Build groups with metadata */
  const selectedIds = new Set(selectedFish.map((f) => f.id));
  const groups: FishTypeGroup[] = [];

  for (const [productType, products] of typeMap) {
    if (products.length < MIN_GROUP_SIZE) continue;

    /* Match species profile via PRODUCT_TYPE_TO_SPECIES, fallback to first product */
    const speciesName = PRODUCT_TYPE_TO_SPECIES[productType.toUpperCase()];
    let profile: SpeciesProfile | null = null;
    if (speciesName) {
      profile = SPECIES_PROFILES.find((p) => p.species === speciesName) ?? null;
    }
    if (!profile) {
      profile = matchProductToSpecies(products[0]);
    }

    /* Compute price range */
    const prices = products
      .map((p) => Number(p.price.amount))
      .filter((n) => !Number.isNaN(n))
      .sort((a, b) => a - b);
    const priceRange =
      prices.length === 0
        ? ""
        : prices.length === 1 || prices[0] === prices[prices.length - 1]
          ? `$${prices[0].toFixed(2)}`
          : `$${prices[0].toFixed(2)} – $${prices[prices.length - 1].toFixed(2)}`;

    /* Counts */
    const selectedCount = products.filter((p) => selectedIds.has(p.id)).length;
    const availableCount = products.filter((p) => p.availableForSale !== false).length;

    groups.push({
      productType,
      displayName: humanizeProductType(productType),
      products,
      availableCount,
      profile,
      priceRange,
      selectedCount,
    });
  }

  /* Step 3: Sort — types with selections first, then alphabetical */
  return groups.sort((a, b) => {
    if (a.selectedCount > 0 && b.selectedCount === 0) return -1;
    if (b.selectedCount > 0 && a.selectedCount === 0) return 1;
    return a.displayName.localeCompare(b.displayName);
  });
}

/* ── Tank mate recommendations ─────────────────────────────────────────── */

/** Swim level labels for recommendation reasons */
const SWIM_REASON_LABELS: Record<string, string> = {
  top: "Top swimmer",
  mid: "Mid-level swimmer",
  bottom: "Bottom dweller",
  all: "All-level swimmer",
};

/**
 * Generate tank mate recommendations based on currently selected fish.
 * For each unselected type with a species profile, checks compatibility
 * against all selected species and builds a reason string.
 */
export function getTankMateRecommendations(
  selectedFish: NormalizedProduct[],
  allGroups: FishTypeGroup[],
): TankMateRecommendation[] {
  /* Get unique species names for all selected fish */
  const selectedSpeciesSet = new Set<string>();
  for (const fish of selectedFish) {
    const profile = matchProductToSpecies(fish);
    if (profile) selectedSpeciesSet.add(profile.species);
  }

  if (selectedSpeciesSet.size === 0) return [];
  const selectedSpecies = Array.from(selectedSpeciesSet);

  /* Get swim levels of selected fish */
  const selectedSwimLevels = new Set<string>();
  for (const species of selectedSpecies) {
    const p = SPECIES_PROFILES.find((sp) => sp.species === species);
    if (p) selectedSwimLevels.add(p.swimLevel);
  }

  const recommendations: TankMateRecommendation[] = [];

  for (const group of allGroups) {
    if (!group.profile) continue;
    /* Skip types already selected or with no available products */
    if (selectedSpeciesSet.has(group.profile.species)) continue;
    if (group.selectedCount > 0) continue;
    if (group.availableCount === 0) continue;

    /* Check compatibility against every selected species */
    let worstCompat: Compatibility = "compatible";
    let anyIncompatible = false;

    for (const species of selectedSpecies) {
      const { compatibility } = getCompatibility(species, group.profile.species);
      if (compatibility === "incompatible") {
        anyIncompatible = true;
        break;
      }
      if (compatibility === "caution") worstCompat = "caution";
    }

    /* Skip incompatible types */
    if (anyIncompatible) continue;

    /* Build reason string */
    let reason: string;
    if (!selectedSwimLevels.has(group.profile.swimLevel)) {
      reason = `${SWIM_REASON_LABELS[group.profile.swimLevel]} — fills a different swim level`;
    } else if (group.profile.temperament === "peaceful") {
      reason = "Peaceful community fish — safe with your selections";
    } else {
      reason = "Compatible with your selected fish";
    }

    recommendations.push({
      productType: group.productType,
      displayName: group.displayName,
      profile: group.profile,
      reason,
      compatibility: worstCompat,
      availableCount: group.availableCount,
    });
  }

  /* Sort: compatible before caution, then by "fills different swim level" first */
  return recommendations
    .sort((a, b) => {
      if (a.compatibility === "compatible" && b.compatibility !== "compatible") return -1;
      if (b.compatibility === "compatible" && a.compatibility !== "compatible") return 1;
      return 0;
    })
    .slice(0, MAX_TANK_MATE_RECOMMENDATIONS);
}

/* ── Per-product compatibility notes (drill-down view) ─────────────────── */

/** Maximum compatibility notes to show per product card */
const MAX_NOTES_PER_PRODUCT = 3;

/**
 * Get compatibility notes for a product against all currently selected fish
 * from OTHER types. Used in the drill-down view to show inline warnings.
 * Only returns notes for "caution" or "incompatible" pairings.
 */
export function getVarietyCompatibilityNotes(
  product: NormalizedProduct,
  selectedFish: NormalizedProduct[],
): CompatibilityNote[] {
  const productProfile = matchProductToSpecies(product);
  if (!productProfile) return [];

  const notes: CompatibilityNote[] = [];
  const seenSpecies = new Set<string>();

  for (const fish of selectedFish) {
    /* Skip fish of the same type (same drill-down category) */
    if (fish.productType === product.productType) continue;

    const fishProfile = matchProductToSpecies(fish);
    if (!fishProfile) continue;
    /* Avoid duplicate notes for the same species */
    if (seenSpecies.has(fishProfile.species)) continue;
    seenSpecies.add(fishProfile.species);

    const { compatibility, note } = getCompatibility(
      productProfile.species,
      fishProfile.species,
    );

    /* Only show caution/incompatible notes — compatible is implied */
    if (compatibility !== "compatible") {
      notes.push({ species: fishProfile.species, compatibility, note });
    }

    if (notes.length >= MAX_NOTES_PER_PRODUCT) break;
  }

  return notes;
}
