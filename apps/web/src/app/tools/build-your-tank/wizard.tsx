"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ExternalLink,
  Info,
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

/** Related automation guides for each wizard step */
interface StepGuide {
  slug: string;
  title: string;
  description: string;
}

const STEP_GUIDES: Partial<Record<WizardStep, StepGuide[]>> = {
  tank: [
    {
      slug: "getting-started",
      title: "Getting Started with AquaAutomate",
      description: "New to aquariums? Start here for budget build recommendations.",
    },
    {
      slug: "ha-getting-started",
      title: "Setting Up Home Assistant",
      description: "Set up HA to automate all your tank equipment.",
    },
  ],
  filter: [
    {
      slug: "automate-filtration",
      title: "Smart Filter Monitoring & Alerts",
      description: "Track filter health with Shelly plugs and get clog alerts.",
    },
    {
      slug: "automate-power-management",
      title: "Smart Power Management",
      description: "Control filters, heaters, and pumps with smart plugs.",
    },
  ],
  heater: [
    {
      slug: "automate-heater-sizing",
      title: "Heater Sizing & Smart Plug Automation",
      description: "Pick the right wattage and automate with failsafe control.",
    },
    {
      slug: "automate-temperature",
      title: "Temperature Monitoring & Alerts",
      description: "Real-time monitoring with Inkbird + backup heater automation.",
    },
  ],
  light: [
    {
      slug: "automate-tank-lighting",
      title: "Automate Tank Lighting",
      description: "Sunrise/sunset schedules with Hygger lights and Tuya plugs.",
    },
    {
      slug: "automate-scenes",
      title: "Scene Control with Lutron Pico",
      description: "One-button Day/Night/Feeding/Movie modes for your tank.",
    },
  ],
  substrate: [
    {
      slug: "automate-water-changes",
      title: "Automated Water Changes",
      description: "Full AWC automation with dosing pumps and HA.",
    },
  ],
};

/** Regex to extract gallon size from a tank title (e.g. "29 Gallon") */
const GALLON_REGEX = /(\d+)\s*gallon/i;

/** Regex: "X to Y Gallon" — rated range filters/heaters */
const RANGE_GALLON_REGEX = /(\d+)\s*to\s*(\d+)\s*gallon/i;

/** Regex: "Up to Y Gallon" — max-rated filters/heaters */
const UPTO_GALLON_REGEX = /up\s*to\s*(\d+)\s*gallon/i;

/** Steps that should be filtered by the selected tank size */
const SIZE_FILTERED_STEPS: WizardStep[] = ["filter", "heater"];

/** Parse gallon size from a tank product title */
function extractGallons(title: string): number | null {
  const match = title.match(GALLON_REGEX);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Extract the gallon rating range from a filter/heater title.
 * Returns [min, max] or null if no rating found.
 *
 * Examples:
 *   "AquaClear 50 Power Filter — 20 to 50 Gallon" → [20, 50]
 *   "Fluval 207 Canister Filter — Up to 45 Gallon" → [0, 45]
 */
function extractGallonRange(title: string): [number, number] | null {
  const rangeMatch = title.match(RANGE_GALLON_REGEX);
  if (rangeMatch) {
    return [parseInt(rangeMatch[1], 10), parseInt(rangeMatch[2], 10)];
  }
  const uptoMatch = title.match(UPTO_GALLON_REGEX);
  if (uptoMatch) {
    return [0, parseInt(uptoMatch[1], 10)];
  }
  return null;
}

/**
 * Check if an accessory product is compatible with the given tank size.
 * A product is compatible when the tank gallons fall within its rated range.
 * Products without a gallon rating in the title are always shown.
 */
function isAccessoryCompatible(product: NormalizedProduct, tankGallons: number): boolean {
  const range = extractGallonRange(product.title);
  if (!range) return true; /* no rating info — always show */
  const [min, max] = range;
  return tankGallons >= min && tankGallons <= max;
}

function productHref(p: NormalizedProduct): string {
  return p.source === "amazon" ? (p.externalUrl ?? "#") : `/products/${p.handle}`;
}

export function TankWizard() {
  const searchParams = useSearchParams();
  /** Minimum tank size in gallons — passed from the tank calculator */
  const minGallons = searchParams.get("minGallons")
    ? Number(searchParams.get("minGallons"))
    : null;

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

  /* Derive the selected tank size (used to filter accessories) */
  const selectedTankGallons = selections.tank
    ? extractGallons(selections.tank.title)
    : null;

  /* Get products for current step — filter by type and tank size compatibility */
  const stepProducts = AMAZON_PRODUCTS.filter((p) => {
    if (!(STEP_PRODUCT_TYPES[step.id] || []).includes(p.productType || "")) {
      return false;
    }
    /* When a minimum gallon size was provided, only show tanks that meet it */
    if (step.id === "tank" && minGallons) {
      const gallons = extractGallons(p.title);
      if (gallons !== null && gallons < minGallons) return false;
    }
    /* Filter accessories by selected tank size */
    if (
      SIZE_FILTERED_STEPS.includes(step.id) &&
      selectedTankGallons !== null
    ) {
      return isAccessoryCompatible(p, selectedTankGallons);
    }
    return true;
  });

  /* Sort: HA-automation-compatible products first, then by price ascending */
  stepProducts.sort((a, b) => {
    const aAuto = a.automationCompatible ? 0 : 1;
    const bAuto = b.automationCompatible ? 0 : 1;
    if (aAuto !== bAuto) return aAuto - bAuto;
    return Number(a.price.amount) - Number(b.price.amount);
  });

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

          {/* Recommended guides based on selected products */}
          {selectedProducts.length > 0 && (
            <div className="rounded-lg border border-border/50 bg-card/30 p-4">
              <div className="mb-3 flex items-center gap-1.5 text-sm font-medium">
                <BookOpen className="h-4 w-4 text-aqua" />
                Automate Your Setup
              </div>
              <p className="mb-3 text-xs text-muted-foreground">
                These guides show you how to automate the equipment you selected with Home Assistant, Tuya smart plugs, and Shelly power monitors.
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {/* Deduplicate guides across all selected steps */}
                {Array.from(
                  new Map(
                    Object.keys(selections)
                      .filter((key) => key !== "review" && selections[key as WizardStep] !== null)
                      .flatMap((key) => STEP_GUIDES[key as WizardStep] || [])
                      .map((g) => [g.slug, g])
                  ).values()
                ).map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="group flex items-start gap-2 rounded-md border border-border/30 bg-card/50 p-2.5 transition-colors hover:border-aqua/30 hover:bg-aqua/5"
                  >
                    <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-aqua" />
                    <div>
                      <p className="text-xs font-medium group-hover:text-aqua">
                        {guide.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {guide.description}
                      </p>
                    </div>
                  </Link>
                ))}
                {/* Always show dashboard guide on review */}
                <Link
                  href="/guides/automate-dashboard"
                  className="group flex items-start gap-2 rounded-md border border-border/30 bg-card/50 p-2.5 transition-colors hover:border-aqua/30 hover:bg-aqua/5"
                >
                  <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-aqua" />
                  <div>
                    <p className="text-xs font-medium group-hover:text-aqua">
                      Build Your Aquarium Dashboard
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Combine all your sensors and controls into one HA dashboard.
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          )}

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

          {/* Info banner when filtering tanks by minimum size */}
          {step.id === "tank" && minGallons && (
            <div className="flex items-center gap-2 rounded-md border border-aqua/20 bg-aqua/5 px-3 py-2 text-xs text-muted-foreground">
              <Info className="h-3.5 w-3.5 shrink-0 text-aqua" />
              <span>
                Showing tanks{" "}
                <span className="font-medium text-foreground">
                  {minGallons}+ gallons
                </span>{" "}
                based on your stocking calculator results.
              </span>
            </div>
          )}

          {/* Info banner when filtering accessories by selected tank size */}
          {SIZE_FILTERED_STEPS.includes(step.id) && selectedTankGallons && (
            <div className="flex items-center gap-2 rounded-md border border-aqua/20 bg-aqua/5 px-3 py-2 text-xs text-muted-foreground">
              <Info className="h-3.5 w-3.5 shrink-0 text-aqua" />
              <span>
                Showing {step.label.toLowerCase()}s rated for your{" "}
                <span className="font-medium text-foreground">
                  {selectedTankGallons}-gallon
                </span>{" "}
                tank.
              </span>
            </div>
          )}

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
                    <div className="flex items-center gap-1.5">
                      {p.automationCompatible && (
                        <Badge className="bg-green-600/20 text-green-400 text-[10px] border-green-600/30">
                          HA Ready
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-[10px]">
                        {p.vendor}
                      </Badge>
                    </div>
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

          {/* Related automation guides for this step */}
          {(STEP_GUIDES[step.id] || []).length > 0 && (
            <div className="rounded-lg border border-border/50 bg-card/30 p-4">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" />
                Automation Guides
              </div>
              <div className="space-y-2">
                {(STEP_GUIDES[step.id] || []).map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="group flex items-start gap-2 rounded-md border border-border/30 bg-card/50 p-2.5 transition-colors hover:border-aqua/30 hover:bg-aqua/5"
                  >
                    <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-aqua" />
                    <div>
                      <p className="text-xs font-medium group-hover:text-aqua">
                        {guide.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {guide.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
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
