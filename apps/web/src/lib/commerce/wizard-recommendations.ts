import type { NormalizedProduct } from "./types";
import { WIZARD_RECOMMENDATION_COUNT } from "@/lib/constants";

/** Wizard step identifiers (must match wizard.tsx) */
type WizardStep = "tank" | "filter" | "heater" | "light" | "substrate";

/** Map wizard steps to product types for recommendation lookup */
const STEP_PRODUCT_TYPES: Record<WizardStep, string[]> = {
  tank: ["TANK"],
  filter: ["FILTER"],
  heater: ["HEATER"],
  light: ["UV LIGHT"],
  substrate: ["GRAVEL"],
};

/** All selectable steps in order */
const SELECTABLE_STEPS: WizardStep[] = [
  "tank",
  "filter",
  "heater",
  "light",
  "substrate",
];

/**
 * Get product recommendations for incomplete wizard steps.
 * Returns the top automation-compatible product from each unselected step,
 * excluding the current step and the review step.
 */
export function getWizardRecommendations(
  selections: Partial<Record<WizardStep, NormalizedProduct | null>>,
  allProducts: NormalizedProduct[],
  currentStep: string,
  count: number = WIZARD_RECOMMENDATION_COUNT,
): NormalizedProduct[] {
  const recommendations: NormalizedProduct[] = [];

  for (const step of SELECTABLE_STEPS) {
    if (recommendations.length >= count) break;
    /* Skip steps that already have a selection or are the current step */
    if (selections[step] || step === currentStep) continue;

    const types = STEP_PRODUCT_TYPES[step];
    /* Find the best product: automation-compatible first, then cheapest */
    const candidate = allProducts
      .filter((p) => types.includes(p.productType || ""))
      .sort((a, b) => {
        const aAuto = a.automationCompatible ? 0 : 1;
        const bAuto = b.automationCompatible ? 0 : 1;
        if (aAuto !== bAuto) return aAuto - bAuto;
        return Number(a.price.amount) - Number(b.price.amount);
      })[0];

    if (candidate) {
      recommendations.push(candidate);
    }
  }

  return recommendations;
}
