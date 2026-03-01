import type { NormalizedProduct } from "@/lib/commerce/types";
import type { SpeciesProfile, Compatibility } from "./tank-mates";
import {
  SPECIES_PROFILES,
  COMPATIBILITY_RULES,
  NON_FISH_COMPATIBILITY,
} from "./compatibility-data";

/** Match a product to a species profile by checking title and tags against keywords */
export function matchProductToSpecies(
  product: NormalizedProduct
): SpeciesProfile | null {
  const searchText = [
    product.title.toLowerCase(),
    ...(product.tags || []).map((t) => t.toLowerCase()),
  ].join(" ");

  for (const profile of SPECIES_PROFILES) {
    for (const keyword of profile.matchKeywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        return profile;
      }
    }
  }
  return null;
}

/** Get compatibility info between two species */
export function getCompatibility(
  speciesA: string,
  speciesB: string
): { compatibility: Compatibility; note: string } {
  /* Check explicit rules in both directions */
  const rule = COMPATIBILITY_RULES.find(
    (r) =>
      (r.speciesA === speciesA && r.speciesB === speciesB) ||
      (r.speciesA === speciesB && r.speciesB === speciesA)
  );

  if (rule) {
    return { compatibility: rule.compatibility, note: rule.note };
  }

  /* Default: peaceful + peaceful = compatible; anything with semi-aggressive = caution */
  const profileA = SPECIES_PROFILES.find((p) => p.species === speciesA);
  const profileB = SPECIES_PROFILES.find((p) => p.species === speciesB);

  if (profileA?.temperament === "semi-aggressive" || profileB?.temperament === "semi-aggressive") {
    return { compatibility: "caution", note: "Semi-aggressive species — monitor for aggression." };
  }

  return { compatibility: "compatible", note: "Both peaceful species, generally compatible." };
}

/**
 * Get all compatible species for a given species,
 * along with compatibility level and notes.
 */
export function getCompatibleSpecies(
  species: string
): { profile: SpeciesProfile; compatibility: Compatibility; note: string }[] {
  return SPECIES_PROFILES.filter((p) => p.species !== species).map((p) => {
    const result = getCompatibility(species, p.species);
    return { profile: p, ...result };
  });
}

/**
 * Cross-reference compatible species with the store catalog to find
 * products the customer might also want to buy.
 */
export function findTankMateProducts(
  species: string,
  allProducts: NormalizedProduct[],
  currentProductId: string
): { product: NormalizedProduct; compatibility: Compatibility; note: string }[] {
  const mates: { product: NormalizedProduct; compatibility: Compatibility; note: string }[] = [];

  for (const product of allProducts) {
    if (product.id === currentProductId) continue;

    const matched = matchProductToSpecies(product);
    if (!matched) continue;

    const { compatibility, note } = getCompatibility(species, matched.species);
    mates.push({ product, compatibility, note });
  }

  return mates;
}

/**
 * Get a contextual compatibility note for non-fish products
 * (driftwood, plants, equipment, etc.).
 */
export function getNonFishCompatibilityNote(
  product: NormalizedProduct
): { note: string; relatedSpecies: string[] } | null {
  const searchText = [
    product.title.toLowerCase(),
    product.description.toLowerCase(),
    ...(product.tags || []).map((t) => t.toLowerCase()),
    (product.productType || "").toLowerCase(),
  ].join(" ");

  for (const entry of NON_FISH_COMPATIBILITY) {
    for (const keyword of entry.keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        return { note: entry.note, relatedSpecies: entry.relatedSpecies };
      }
    }
  }

  return null;
}
