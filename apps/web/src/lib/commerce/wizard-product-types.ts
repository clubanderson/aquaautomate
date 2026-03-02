/**
 * Shared product type classification for the tank wizard.
 *
 * Fish types use exclusion-based matching: any product type not in the
 * NON_FISH set (and not empty) is classified as fish. This is future-proof —
 * new species types from vendors automatically appear in the fish step.
 *
 * Plants, hardscape, and equipment use explicit type lists with
 * case-insensitive matching.
 */

/** Wizard steps that have product selections (excludes review) */
export type WizardSelectableStep =
  | "fish"
  | "tank"
  | "plants"
  | "hardscape"
  | "filter"
  | "heater"
  | "light"
  | "substrate";

/** All selectable steps in order */
export const SELECTABLE_STEPS: WizardSelectableStep[] = [
  "fish",
  "tank",
  "plants",
  "hardscape",
  "filter",
  "heater",
  "light",
  "substrate",
];

/**
 * Product types that are NOT fish/livestock — lowercase for case-insensitive matching.
 * Any product type not in this set (and not empty) is classified as fish.
 * This covers equipment, plants, hardscape, and non-wizard categories.
 */
const NON_FISH_PRODUCT_TYPES = new Set([
  /* Plants & hardscape */
  "live plants",
  "plants",
  "plant",
  "hardscape",
  "driftwood",
  /* Equipment (Amazon affiliate products) */
  "tank",
  "filter",
  "heater",
  "uv light",
  "gravel",
  /* Non-wizard categories */
  "gift card",
  "shipping",
  "fish food",
  "miscellaneous",
  "air distribution",
  "air pump",
  "air stone",
  "aquarium controls",
  "auto feeder",
  "awc system",
  "background",
  "camera",
  "dry goods",
  "pex plumbing",
  "salt system",
  "stand",
]);

/**
 * Explicit product type lists for non-fish steps (all lowercase).
 * Fish step is null because it uses exclusion-based matching instead.
 */
const STEP_TYPE_LISTS: Record<WizardSelectableStep, string[] | null> = {
  fish: null,
  tank: ["tank"],
  plants: ["live plants", "plants", "plant"],
  hardscape: ["hardscape", "driftwood"],
  filter: ["filter"],
  heater: ["heater"],
  light: ["uv light"],
  substrate: ["gravel"],
};

/** Check if a product type is a fish/livestock type (exclusion-based) */
export function isFishProductType(
  productType: string | undefined,
): boolean {
  if (!productType) return false;
  return !NON_FISH_PRODUCT_TYPES.has(productType.toLowerCase());
}

/**
 * Check if a product type belongs to the given wizard step.
 * Fish step uses exclusion-based matching; all others use explicit type lists.
 */
export function isProductForStep(
  productType: string | undefined,
  step: WizardSelectableStep | "review",
): boolean {
  if (step === "review" || !productType) return false;
  if (step === "fish") return isFishProductType(productType);
  const types = STEP_TYPE_LISTS[step];
  if (!types) return false;
  return types.includes(productType.toLowerCase());
}
