"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  ShoppingCart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AMAZON_PRODUCTS } from "@/lib/commerce/amazon-catalog";
import type { NormalizedProduct } from "@/lib/commerce/types";

/** Wizard step identifiers */
type WizardStep = "tank" | "filter" | "heater" | "light" | "substrate" | "review";

/** Step order and labels */
const STEPS: { id: WizardStep; label: string }[] = [
  { id: "tank", label: "Tank" },
  { id: "filter", label: "Filter" },
  { id: "heater", label: "Heater" },
  { id: "light", label: "Light" },
  { id: "substrate", label: "Substrate" },
  { id: "review", label: "Review" },
];

/** Map product types to wizard steps */
const STEP_PRODUCT_TYPES: Record<WizardStep, string[]> = {
  tank: ["TANK"],
  filter: ["FILTER"],
  heater: ["HEATER"],
  light: ["UV LIGHT"],
  substrate: ["GRAVEL"],
  review: [],
};

function productHref(p: NormalizedProduct): string {
  return p.source === "amazon" ? (p.externalUrl ?? "#") : `/products/${p.handle}`;
}

export function TankWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<WizardStep, NormalizedProduct | null>>({
    tank: null,
    filter: null,
    heater: null,
    light: null,
    substrate: null,
    review: null,
  });

  const step = STEPS[currentStep];
  const isReview = step.id === "review";

  const selectProduct = (product: NormalizedProduct) => {
    setSelections((prev) => ({ ...prev, [step.id]: product }));
  };

  const goNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep((p) => p + 1);
  };

  const goBack = () => {
    if (currentStep > 0) setCurrentStep((p) => p - 1);
  };

  /* Get products for current step */
  const stepProducts = AMAZON_PRODUCTS.filter((p) =>
    (STEP_PRODUCT_TYPES[step.id] || []).includes(p.productType || "")
  );

  /* Calculate total cost */
  const selectedProducts = Object.entries(selections)
    .filter(([key, val]) => key !== "review" && val !== null)
    .map(([, val]) => val!);
  const totalCost = selectedProducts.reduce(
    (sum, p) => sum + Number(p.price.amount),
    0
  );

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setCurrentStep(i)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              i === currentStep
                ? "bg-aqua/20 text-aqua"
                : i < currentStep
                  ? "bg-green-600/20 text-green-400"
                  : "bg-card/50 text-muted-foreground"
            }`}
          >
            {i < currentStep ? (
              <Check className="h-3 w-3" />
            ) : (
              <span>{i + 1}</span>
            )}
            {s.label}
          </button>
        ))}
      </div>

      {/* Review step */}
      {isReview ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-aqua/30 bg-card/50 p-6">
            <h2 className="mb-4 text-xl font-bold">
              <ShoppingCart className="mr-2 inline h-5 w-5 text-aqua" />
              Your Shopping List
            </h2>

            {selectedProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No products selected. Go back and pick your equipment.
              </p>
            ) : (
              <div className="space-y-3">
                {selectedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-card/30 p-3"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{p.title}</p>
                      <Badge
                        variant="secondary"
                        className="mt-1 text-[10px] capitalize"
                      >
                        {(p.productType || "").toLowerCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-aqua">
                        ${p.price.amount}
                      </span>
                      <a
                        href={productHref(p)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md border border-border/50 p-1.5 text-muted-foreground hover:border-aqua/30 hover:text-aqua"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                ))}

                <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
                  <span className="text-lg font-semibold">Estimated Total</span>
                  <span className="text-2xl font-bold text-aqua">
                    ${totalCost.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={goBack}
              className="border-border/50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button className="bg-aqua text-deep-blue hover:bg-aqua-dim" asChild>
              <Link href="/tools/tank-calculator">
                Check compatibility with the Tank Calculator
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        /* Product selection step */
        <div className="space-y-4">
          <h2 className="text-xl font-bold capitalize">
            Choose a {step.label}
          </h2>

          {selections[step.id] && (
            <div className="rounded-lg border border-aqua/30 bg-aqua/5 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Selected:</p>
                  <p className="text-sm font-medium text-aqua">
                    {selections[step.id]!.title}
                  </p>
                </div>
                <span className="text-sm font-medium text-aqua">
                  ${selections[step.id]!.price.amount}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {stepProducts.map((p) => {
              const isSelected = selections[step.id]?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => selectProduct(p)}
                  className={`rounded-lg border p-4 text-left transition-all ${
                    isSelected
                      ? "border-aqua/50 bg-aqua/5"
                      : "border-border/50 bg-card/50 hover:border-aqua/30"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{p.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {p.description}
                      </p>
                    </div>
                    {isSelected && (
                      <Check className="ml-2 mt-0.5 h-4 w-4 shrink-0 text-aqua" />
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-aqua">
                      ${p.price.amount}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {p.vendor}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>

          {stepProducts.length === 0 && (
            <p className="rounded-lg border border-border/50 bg-card/50 p-6 text-center text-sm text-muted-foreground">
              No products in this category yet. You can skip this step.
            </p>
          )}

          <div className="flex items-center gap-3">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={goBack}
                className="border-border/50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            <Button
              onClick={goNext}
              className="bg-aqua text-deep-blue hover:bg-aqua-dim"
            >
              {selections[step.id] ? "Next" : "Skip"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
