import type { NormalizedProduct } from "./types";
import { WIZARD_RECOMMENDATION_COUNT } from "@/lib/constants";
import { isProductForStep, SELECTABLE_STEPS } from "./wizard-product-types";

/**
 * Get product recommendations for incomplete wizard steps.
 * For single-select steps, recommends when selection is null.
 * For multi-select steps (fish), recommends when array is empty.
 * Returns the top automation-compatible product from each unselected step,
 * excluding the current step and the review step.
 */
export function getWizardRecommendations(
  selections: { [key: string]: NormalizedProduct | NormalizedProduct[] | null },
  allProducts: NormalizedProduct[],
  currentStep: string,
  count: number = WIZARD_RECOMMENDATION_COUNT,
): NormalizedProduct[] {
  const recommendations: NormalizedProduct[] = [];

  for (const step of SELECTABLE_STEPS) {
    if (recommendations.length >= count) break;
    /* Skip current step */
    if (step === currentStep) continue;

    /* Skip steps that already have selections */
    const selection = selections[step];
    if (selection !== null && selection !== undefined) {
      /* For arrays (fish), skip if non-empty */
      if (Array.isArray(selection) && selection.length > 0) continue;
      /* For single products, skip if truthy */
      if (!Array.isArray(selection)) continue;
    }

    /* Find the best product: automation-compatible first, then cheapest */
    const candidate = allProducts
      .filter(
        (p) =>
          isProductForStep(p.productType, step) &&
          p.availableForSale !== false,
      )
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
