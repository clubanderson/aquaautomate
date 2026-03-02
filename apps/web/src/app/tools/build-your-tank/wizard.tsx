"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ExternalLink,
  Info,
  Store,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getWizardRecommendations } from "@/lib/commerce/wizard-recommendations";
import type { NormalizedProduct } from "@/lib/commerce/types";
import {
  WizardCartSidebar,
  type WizardCartItem,
} from "./wizard-cart-sidebar";
import { WizardMobileCart } from "./wizard-mobile-cart";

/* ── Step types and ordering ─────────────────────────────────────────── */

/** Wizard step identifiers — fish first, then equipment, then review */
type WizardStep =
  | "fish"
  | "tank"
  | "plants"
  | "hardscape"
  | "filter"
  | "heater"
  | "light"
  | "substrate"
  | "review";

/** Step order and labels */
const STEPS: { id: WizardStep; label: string }[] = [
  { id: "fish", label: "Fish" },
  { id: "tank", label: "Tank" },
  { id: "plants", label: "Plants" },
  { id: "hardscape", label: "Hardscape" },
  { id: "filter", label: "Filter" },
  { id: "heater", label: "Heater" },
  { id: "light", label: "Light" },
  { id: "substrate", label: "Substrate" },
  { id: "review", label: "Review" },
];

/**
 * Map wizard steps to product types from both Shopify and Amazon catalogs.
 * Shopify types: "Fish & Livestock", "Live Plants", "Hardscape"
 * Amazon types: "TANK", "FILTER", "HEATER", "UV LIGHT", "GRAVEL", "DRIFTWOOD", "PLANTS"
 */
const STEP_PRODUCT_TYPES: Record<WizardStep, string[]> = {
  fish: ["Fish & Livestock"],
  tank: ["TANK"],
  plants: ["Live Plants", "PLANTS"],
  hardscape: ["Hardscape", "DRIFTWOOD"],
  filter: ["FILTER"],
  heater: ["HEATER"],
  light: ["UV LIGHT"],
  substrate: ["GRAVEL"],
  review: [],
};

/** Steps where fish is multi-select (can pick multiple products) */
const MULTI_SELECT_STEPS = new Set<WizardStep>(["fish"]);

/** Steps that have product selections (excludes review) */
const SELECTABLE_STEPS = STEPS.filter((s) => s.id !== "review");

/* ── Step guides ─────────────────────────────────────────────────────── */

interface StepGuide {
  slug: string;
  title: string;
  description: string;
}

const STEP_GUIDES: Partial<Record<WizardStep, StepGuide[]>> = {
  fish: [
    {
      slug: "automate-feeding",
      title: "Automated Fish Feeding",
      description: "Schedule feedings with a smart auto-feeder and HA.",
    },
  ],
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
  plants: [
    {
      slug: "automate-tank-lighting",
      title: "Automate Tank Lighting for Plants",
      description: "Sunrise/sunset schedules with Hygger lights for healthy plant growth.",
    },
  ],
  hardscape: [
    {
      slug: "automate-water-changes",
      title: "Automated Water Changes",
      description: "Full AWC automation with dosing pumps and HA.",
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
  review: [
    {
      slug: "automate-dashboard",
      title: "Build Your Aquarium Dashboard",
      description: "Single-tank Lovelace dashboard with gauges and scenes.",
    },
    {
      slug: "dashboard-multi-tank",
      title: "Multi-Tank Command Center",
      description: "Aggregate all tanks into one HA dashboard with alerts.",
    },
    {
      slug: "dashboard-custom-cards",
      title: "Advanced Dashboard with Custom Cards",
      description: "Mushroom, mini-graph, and apexcharts for a polished look.",
    },
    {
      slug: "dashboard-kiosk",
      title: "Wall-Mounted Kiosk Display",
      description: "Turn a cheap tablet into a dedicated fish room display.",
    },
  ],
};

/* ── Size-matching utilities ─────────────────────────────────────────── */

/** Regex to extract gallon size from a tank title (e.g. "29 Gallon") */
const GALLON_REGEX = /(\d+)\s*gallon/i;

/** Regex: "X to Y Gallon" — rated range filters/heaters */
const RANGE_GALLON_REGEX = /(\d+)\s*to\s*(\d+)\s*gallon/i;

/** Regex: "Up to Y Gallon" — max-rated filters/heaters */
const UPTO_GALLON_REGEX = /up\s*to\s*(\d+)\s*gallon/i;

/** Steps that should be filtered by the selected tank size */
const SIZE_FILTERED_STEPS: WizardStep[] = ["filter", "heater"];

/** Radix for parseInt */
const PARSE_INT_RADIX = 10;

/** Parse gallon size from a tank product title */
function extractGallons(title: string): number | null {
  const match = title.match(GALLON_REGEX);
  return match ? parseInt(match[1], PARSE_INT_RADIX) : null;
}

/**
 * Extract the gallon rating range from a filter/heater title.
 * Returns [min, max] or null if no rating found.
 */
function extractGallonRange(title: string): [number, number] | null {
  const rangeMatch = title.match(RANGE_GALLON_REGEX);
  if (rangeMatch) {
    return [
      parseInt(rangeMatch[1], PARSE_INT_RADIX),
      parseInt(rangeMatch[2], PARSE_INT_RADIX),
    ];
  }
  const uptoMatch = title.match(UPTO_GALLON_REGEX);
  if (uptoMatch) {
    return [0, parseInt(uptoMatch[1], PARSE_INT_RADIX)];
  }
  return null;
}

/**
 * Check if an accessory product is compatible with the given tank size.
 * A product is compatible when the tank gallons fall within its rated range.
 * Products without a gallon rating in the title are always shown.
 */
function isAccessoryCompatible(
  product: NormalizedProduct,
  tankGallons: number,
): boolean {
  const range = extractGallonRange(product.title);
  if (!range) return true; /* no rating info — always show */
  const [min, max] = range;
  return tankGallons >= min && tankGallons <= max;
}

/* ── Wizard selections type ──────────────────────────────────────────── */

/** Fish step is multi-select (array), all other steps are single-select (or null) */
interface WizardSelections {
  fish: NormalizedProduct[];
  tank: NormalizedProduct | null;
  plants: NormalizedProduct | null;
  hardscape: NormalizedProduct | null;
  filter: NormalizedProduct | null;
  heater: NormalizedProduct | null;
  light: NormalizedProduct | null;
  substrate: NormalizedProduct | null;
  review: null;
}

const INITIAL_SELECTIONS: WizardSelections = {
  fish: [],
  tank: null,
  plants: null,
  hardscape: null,
  filter: null,
  heater: null,
  light: null,
  substrate: null,
  review: null,
};

/* ── Fish URL param matching ──────────────────────────────────────────── */

/** Radix for parseInt in fish param parsing */
const FISH_PARSE_RADIX = 10;

/** Index of the tank step — wizard skips to here when fish are pre-selected */
const TANK_STEP_INDEX = 1;

/**
 * Match species names from the calculator URL param to real fish products.
 * URL format: "Neon+Tetra:6,Guppy:3"
 * Matches by checking if the product title contains the species name (case-insensitive).
 */
function matchFishFromParam(
  fishParam: string | null,
  allProducts: NormalizedProduct[],
): NormalizedProduct[] {
  if (!fishParam) return [];

  const fishProducts = allProducts.filter(
    (p) => (p.productType || "") === "Fish & Livestock" && p.availableForSale !== false,
  );

  const matched: NormalizedProduct[] = [];
  const entries = fishParam.split(",");

  for (const entry of entries) {
    const colonIdx = entry.lastIndexOf(":");
    if (colonIdx <= 0) continue;
    const species = decodeURIComponent(entry.slice(0, colonIdx)).trim();
    const count = parseInt(entry.slice(colonIdx + 1), FISH_PARSE_RADIX);
    if (!species || Number.isNaN(count) || count <= 0) continue;

    /* Find a fish product whose title contains the species name */
    const speciesLower = species.toLowerCase();
    const match = fishProducts.find(
      (p) => p.title.toLowerCase().includes(speciesLower),
    );
    if (match && !matched.some((m) => m.id === match.id)) {
      matched.push(match);
    }
  }

  return matched;
}

/* ── Component props ─────────────────────────────────────────────────── */

interface TankWizardProps {
  products: NormalizedProduct[];
}

/* ── Component ───────────────────────────────────────────────────────── */

export function TankWizard({ products }: TankWizardProps) {
  const searchParams = useSearchParams();

  /** Minimum tank size in gallons — passed from the tank calculator */
  const minGallons = searchParams.get("minGallons")
    ? Number(searchParams.get("minGallons"))
    : null;

  /** Fish pre-selected from calculator URL param — matched to real products */
  const preselectedFish = useMemo(
    () => matchFishFromParam(searchParams.get("fish"), products),
    [searchParams, products],
  );

  const hasPreselectedFish = preselectedFish.length > 0;

  /** Compute initial selections and step — only once via lazy initializer */
  const buildInitialSelections = useCallback((): WizardSelections => ({
    ...INITIAL_SELECTIONS,
    fish: preselectedFish,
  }), [preselectedFish]);

  const [currentStep, setCurrentStep] = useState(
    () => hasPreselectedFish ? TANK_STEP_INDEX : 0,
  );
  const [selections, setSelections] = useState<WizardSelections>(buildInitialSelections);

  const step = STEPS[currentStep];
  const isReview = step.id === "review";
  const isMultiSelect = MULTI_SELECT_STEPS.has(step.id);

  /* ── Selection handlers ────────────────────────────────────────────── */

  /** Toggle a product in a multi-select step (fish) */
  const toggleMultiSelectProduct = (product: NormalizedProduct) => {
    setSelections((prev) => {
      const stepId = step.id as "fish";
      const current = prev[stepId];
      const exists = current.some((p) => p.id === product.id);
      return {
        ...prev,
        [stepId]: exists
          ? current.filter((p) => p.id !== product.id)
          : [...current, product],
      };
    });
  };

  /** Select a product for a single-select step */
  const selectSingleProduct = (product: NormalizedProduct) => {
    setSelections((prev) => ({ ...prev, [step.id]: product }));
  };

  const selectProduct = (product: NormalizedProduct) => {
    if (isMultiSelect) {
      toggleMultiSelectProduct(product);
    } else {
      selectSingleProduct(product);
    }
  };

  const goNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep((p) => p + 1);
  };

  const goBack = () => {
    if (currentStep > 0) setCurrentStep((p) => p - 1);
  };

  /** Remove a selection — for fish (multi-select), remove by productId; for others, clear */
  const removeSelection = (stepId: string, productId?: string) => {
    setSelections((prev) => {
      if (stepId === "fish" && productId) {
        return {
          ...prev,
          fish: prev.fish.filter((p) => p.id !== productId),
        };
      }
      return { ...prev, [stepId]: MULTI_SELECT_STEPS.has(stepId as WizardStep) ? [] : null };
    });
  };

  /** Jump to a specific step by its ID */
  const goToStep = (stepId: string) => {
    const idx = STEPS.findIndex((s) => s.id === stepId);
    if (idx >= 0) setCurrentStep(idx);
  };

  /* ── Derived state ─────────────────────────────────────────────────── */

  /** Selected tank size (used to filter accessories) */
  const selectedTankGallons = selections.tank
    ? extractGallons(selections.tank.title)
    : null;

  /** Products for the current step — filter by type, size, availability */
  const stepProducts = useMemo(() => {
    const types = STEP_PRODUCT_TYPES[step.id] || [];
    if (types.length === 0) return [];

    const filtered = products.filter((p) => {
      if (!types.includes(p.productType || "")) return false;

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

    /* Sort: available first, then HA-compatible, then by price ascending */
    return [...filtered].sort((a, b) => {
      /* Sold-out items go to bottom */
      const aSoldOut = a.availableForSale === false ? 1 : 0;
      const bSoldOut = b.availableForSale === false ? 1 : 0;
      if (aSoldOut !== bSoldOut) return aSoldOut - bSoldOut;

      const aAuto = a.automationCompatible ? 0 : 1;
      const bAuto = b.automationCompatible ? 0 : 1;
      if (aAuto !== bAuto) return aAuto - bAuto;
      return Number(a.price.amount) - Number(b.price.amount);
    });
  }, [products, step.id, minGallons, selectedTankGallons]);

  /** Check if a product is currently selected */
  const isProductSelected = (product: NormalizedProduct): boolean => {
    const selection = selections[step.id];
    if (Array.isArray(selection)) {
      return selection.some((p) => p.id === product.id);
    }
    return selection?.id === product.id;
  };

  /** Check if the current step has any selection */
  const hasStepSelection = (stepId: WizardStep): boolean => {
    const selection = selections[stepId];
    if (Array.isArray(selection)) return selection.length > 0;
    return selection !== null;
  };

  /* ── Cart items derived from all selections ────────────────────────── */

  const cartItems: WizardCartItem[] = useMemo(
    () =>
      SELECTABLE_STEPS.reduce<WizardCartItem[]>((acc, s) => {
        const selection = selections[s.id];
        if (Array.isArray(selection)) {
          /* Multi-select (fish) — each product is a separate cart item */
          for (const product of selection) {
            acc.push({ stepId: s.id, stepLabel: s.label, product });
          }
        } else if (selection) {
          acc.push({ stepId: s.id, stepLabel: s.label, product: selection });
        }
        return acc;
      }, []),
    [selections],
  );

  /* Recommendations for empty steps */
  const recommendations = useMemo(
    () => getWizardRecommendations({ ...selections }, products, step.id),
    [selections, products, step.id],
  );

  /* Automation guides for the current step */
  const currentStepGuides = useMemo(
    () => STEP_GUIDES[step.id] || [],
    [step.id],
  );

  /* Collect all relevant guides for the review step (deduped) */
  const reviewGuides = useMemo(() => {
    if (!isReview) return [];
    return Array.from(
      new Map(
        (Object.keys(selections) as WizardStep[])
          .filter((key) => key !== "review" && hasStepSelection(key))
          .flatMap((key) => STEP_GUIDES[key] || [])
          .concat(STEP_GUIDES.review || [])
          .map((g) => [g.slug, g] as const),
      ).values(),
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReview, selections]);

  /* Guides to pass to sidebar: step-specific during selection, all during review */
  const sidebarGuides = isReview ? reviewGuides : currentStepGuides;

  /** Open all product links in new tabs */
  const handleOpenAllLinks = () => {
    for (const item of cartItems) {
      if (item.product.externalUrl) {
        window.open(item.product.externalUrl, "_blank", "noopener,noreferrer");
      } else {
        window.open(`/products/${item.product.handle}`, "_blank");
      }
    }
  };

  /* ── Render ────────────────────────────────────────────────────────── */

  return (
    <>
      <div className="flex gap-6">
        {/* Left: Wizard steps */}
        <div className="min-w-0 flex-1 space-y-6">
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
              {/* Automate Your Setup — guides */}
              {cartItems.length > 0 && (
                <div className="rounded-lg border border-border/50 bg-card/30 p-4">
                  <div className="mb-3 flex items-center gap-1.5 text-sm font-medium">
                    <BookOpen className="h-4 w-4 text-aqua" />
                    Automate Your Setup
                  </div>
                  <p className="mb-3 text-xs text-muted-foreground">
                    These guides show you how to automate the equipment you
                    selected with Home Assistant, Tuya smart plugs, and Shelly
                    power monitors.
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {reviewGuides.map((guide) => (
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

              {/* Open All Links — prominent CTA */}
              {cartItems.length > 0 && (
                <Button
                  onClick={handleOpenAllLinks}
                  className="w-full bg-aqua text-deep-blue hover:bg-aqua-dim sm:w-auto"
                  size="lg"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open All Product Links
                </Button>
              )}

              {cartItems.length === 0 && (
                <div className="rounded-lg border border-border/50 bg-card/50 p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No products selected. Go back and pick your equipment.
                  </p>
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
                <Button
                  className="bg-aqua text-deep-blue hover:bg-aqua-dim"
                  asChild
                >
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
                {isMultiSelect ? `Choose Your ${step.label}` : `Choose a ${step.label}`}
              </h2>

              {/* Info: fish pre-selected from calculator */}
              {step.id === "fish" && hasPreselectedFish && (
                <div className="flex items-center gap-2 rounded-md border border-green-600/30 bg-green-600/5 px-3 py-2 text-xs text-muted-foreground">
                  <Check className="h-3.5 w-3.5 shrink-0 text-green-400" />
                  <span>
                    <span className="font-medium text-green-400">
                      {preselectedFish.length} fish
                    </span>{" "}
                    pre-selected from the Tank Calculator. You can adjust your
                    selections below.
                  </span>
                </div>
              )}

              {/* Info: multi-select hint for fish */}
              {isMultiSelect && (
                <div className="flex items-center gap-2 rounded-md border border-aqua/20 bg-aqua/5 px-3 py-2 text-xs text-muted-foreground">
                  <Info className="h-3.5 w-3.5 shrink-0 text-aqua" />
                  <span>
                    Select as many as you like. Tap to toggle.
                  </span>
                </div>
              )}

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
              {SIZE_FILTERED_STEPS.includes(step.id) &&
                selectedTankGallons && (
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

              {/* Current selection banner (single-select steps only) */}
              {!isMultiSelect && selections[step.id] && (
                <div className="rounded-lg border border-aqua/30 bg-aqua/5 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Selected:</p>
                      <p className="text-sm font-medium text-aqua">
                        {(selections[step.id] as NormalizedProduct).title}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-aqua">
                      ${(selections[step.id] as NormalizedProduct).price.amount}
                    </span>
                  </div>
                </div>
              )}

              {/* Product grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {stepProducts.map((p) => {
                  const selected = isProductSelected(p);
                  const soldOut = p.availableForSale === false;
                  return (
                    <button
                      key={p.id}
                      onClick={() => !soldOut && selectProduct(p)}
                      disabled={soldOut}
                      className={`rounded-lg border p-4 text-left transition-all ${
                        soldOut
                          ? "cursor-not-allowed border-border/30 bg-card/20 opacity-60"
                          : selected
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
                        {selected && (
                          <Check className="ml-2 mt-0.5 h-4 w-4 shrink-0 text-aqua" />
                        )}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-aqua">
                          ${p.price.amount}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {soldOut && (
                            <Badge className="border-red-600/30 bg-red-600/20 text-[10px] text-red-400">
                              Sold Out
                            </Badge>
                          )}
                          {p.automationCompatible && (
                            <Badge className="border-green-600/30 bg-green-600/20 text-[10px] text-green-400">
                              HA Ready
                            </Badge>
                          )}
                          {p.vendor && (
                            <Badge
                              variant="secondary"
                              className="gap-1 text-[10px]"
                            >
                              <Store className="h-2.5 w-2.5" />
                              {p.vendor}
                            </Badge>
                          )}
                          {p.source === "amazon" && (
                            <Badge
                              variant="outline"
                              className="text-[10px]"
                            >
                              Amazon
                            </Badge>
                          )}
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
                  {hasStepSelection(step.id) ? "Next" : "Skip"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Cart sidebar (desktop only) */}
        <div className="hidden w-80 shrink-0 lg:block">
          <div className="sticky top-24 rounded-lg border border-border/50 bg-card/50">
            <WizardCartSidebar
              items={cartItems}
              recommendations={recommendations}
              stepGuides={sidebarGuides}
              onRemoveItem={removeSelection}
              onSelectStep={goToStep}
            />
          </div>
        </div>
      </div>

      {/* Mobile: Sticky bottom cart bar */}
      <WizardMobileCart
        items={cartItems}
        recommendations={recommendations}
        stepGuides={sidebarGuides}
        onRemoveItem={removeSelection}
        onSelectStep={goToStep}
      />
    </>
  );
}
