"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  Check,
  ExternalLink,
  Fish,
  Info,
  Minus,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SPECIES_PROFILES } from "@/lib/aquarium/compatibility-data";
import { SPECIES_CARE } from "@/lib/aquarium/species-care";
import { getCompatibility, PRODUCT_TYPE_TO_SPECIES } from "@/lib/aquarium/match-species";
import {
  groupFishByType,
  getTankMateRecommendations,
} from "@/lib/aquarium/fish-type-groups";
import { isFishProductType } from "@/lib/commerce/wizard-product-types";
import { AMAZON_PRODUCTS } from "@/lib/commerce/amazon-catalog";
import type { NormalizedProduct } from "@/lib/commerce/types";
import type { Compatibility } from "@/lib/aquarium/tank-mates";
import {
  MAX_CALCULATOR_RECOMMENDATIONS,
  SPECIES_PICKER_THUMB_SIZE,
} from "@/lib/constants";

/** Standard tank sizes in gallons */
const STANDARD_TANK_SIZES = [5, 10, 20, 29, 30, 40, 55, 75, 90, 125] as const;

/** Minimum group size for schooling species — used as default quantity */
const DEFAULT_SCHOOL_SIZE = 6;

/** Species that should be kept solo (only 1) */
const SOLO_SPECIES = new Set(["Betta", "Knifefish"]);

/** Approximate adult fish size in inches — used for bioload calculation */
const SPECIES_ADULT_SIZE_INCHES: Record<string, number> = {
  "Neon Tetra": 1.2,
  Guppy: 2,
  Betta: 3,
  Corydoras: 2.5,
  Angelfish: 6,
  Molly: 4,
  Platy: 2.5,
  Swordtail: 5,
  "Cherry Barb": 2,
  "Harlequin Rasbora": 2,
  "Dwarf Gourami": 3,
  "Bristlenose Pleco": 5,
  Otocinclus: 1.5,
  "Cherry Shrimp": 1,
  "Amano Shrimp": 2,
  "Nerite Snail": 1,
  "Mystery Snail": 2,
  "Tiger Barb": 3,
  Danio: 2,
  Rainbowfish: 4,
  "Clown Loach": 12,
  "African Cichlid": 5,
  "American Cichlid": 8,
  Knifefish: 18,
  Goldfish: 8,
  Puffer: 3,
  Catfish: 5,
};

/** Fallback adult size when species isn't in the lookup */
const DEFAULT_ADULT_SIZE_INCHES = 3;

/** Gallons per inch of adult fish — conservative stocking rule */
const GALLONS_PER_INCH = 1;

/** Tank products from the Amazon catalog for direct linking */
const TANK_PRODUCTS = AMAZON_PRODUCTS.filter(
  (p) => p.productType === "TANK"
);

/** Thumbnail size for selected-fish cards */
const SELECTED_FISH_THUMB_SIZE = 32;

interface SelectedSpecies {
  species: string;
  count: number;
}

const COMPAT_COLORS: Record<Compatibility, string> = {
  compatible: "text-green-400",
  caution: "text-amber-400",
  incompatible: "text-red-400",
};

const COMPAT_BADGE_COLORS: Record<Compatibility, string> = {
  compatible: "bg-green-500/10 text-green-400 border-green-500/20",
  caution: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  incompatible: "bg-red-500/10 text-red-400 border-red-500/20",
};

interface TankCalculatorProps {
  products: NormalizedProduct[];
}

/**
 * Build a map from species name → matching products with price info.
 * Reverse-lookups PRODUCT_TYPE_TO_SPECIES so each species name maps
 * to all products with a matching productType.
 */
function buildSpeciesProductMap(
  fishProducts: NormalizedProduct[],
): Record<string, NormalizedProduct[]> {
  /* Invert the type→species map to species→types */
  const speciesToTypes = new Map<string, string[]>();
  for (const [type, species] of Object.entries(PRODUCT_TYPE_TO_SPECIES)) {
    const arr = speciesToTypes.get(species) || [];
    arr.push(type);
    speciesToTypes.set(species, arr);
  }

  const map: Record<string, NormalizedProduct[]> = {};
  for (const product of fishProducts) {
    const pType = (product.productType || "").toUpperCase();
    const species = PRODUCT_TYPE_TO_SPECIES[pType];
    if (!species) continue;
    const arr = map[species] || [];
    arr.push(product);
    map[species] = arr;
  }
  return map;
}

/** Compute price range string from a list of products */
function getPriceRange(products: NormalizedProduct[]): string {
  const prices = products
    .map((p) => Number(p.price.amount))
    .filter((n) => !Number.isNaN(n) && n > 0)
    .sort((a, b) => a - b);
  if (prices.length === 0) return "";
  if (prices.length === 1 || prices[0] === prices[prices.length - 1]) {
    return `$${prices[0].toFixed(2)}`;
  }
  return `$${prices[0].toFixed(2)} – $${prices[prices.length - 1].toFixed(2)}`;
}


export function TankCalculator({ products }: TankCalculatorProps) {
  const [selected, setSelected] = useState<SelectedSpecies[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  /* Compute fish products and species→product map once */
  const fishProducts = useMemo(
    () => products.filter((p) => isFishProductType(p.productType)),
    [products],
  );

  const speciesProductMap = useMemo(
    () => buildSpeciesProductMap(fishProducts),
    [fishProducts],
  );

  const addSpecies = (species: string) => {
    if (selected.some((s) => s.species === species)) return;
    const defaultCount = SOLO_SPECIES.has(species)
      ? 1
      : DEFAULT_SCHOOL_SIZE;
    setSelected((prev) => [...prev, { species, count: defaultCount }]);
    setSearchQuery("");
  };

  const removeSpecies = (species: string) => {
    setSelected((prev) => prev.filter((s) => s.species !== species));
  };

  const updateCount = (species: string, delta: number) => {
    setSelected((prev) =>
      prev.map((s) =>
        s.species === species
          ? { ...s, count: Math.max(1, s.count + delta) }
          : s
      )
    );
  };

  /* Determine the dominant temperament from selected species */
  const selectedTemperament = selected.length > 0
    ? SPECIES_PROFILES.find((p) => p.species === selected[0].species)?.temperament ?? null
    : null;

  /* Calculate requirements — use BOTH species minimum AND bioload */
  const speciesMinTankSize = selected.reduce((max, s) => {
    const profile = SPECIES_PROFILES.find((p) => p.species === s.species);
    return Math.max(max, profile?.minTankGallons ?? 0);
  }, 0);

  const totalBioloadInches = selected.reduce((total, s) => {
    const sizeInches =
      SPECIES_ADULT_SIZE_INCHES[s.species] ?? DEFAULT_ADULT_SIZE_INCHES;
    return total + s.count * sizeInches;
  }, 0);

  const bioloadTankSize = Math.ceil(totalBioloadInches * GALLONS_PER_INCH);

  /* Use whichever is larger: species minimum or bioload-based size */
  const minTankSize = Math.max(speciesMinTankSize, bioloadTankSize);

  /* Find compatible tank size */
  const recommendedSize =
    STANDARD_TANK_SIZES.find((size) => size >= minTankSize) ??
    STANDARD_TANK_SIZES[STANDARD_TANK_SIZES.length - 1];

  /* Find tank products closest to the recommended size */
  const matchingTanks = TANK_PRODUCTS.filter((t) => {
    const sizeMatch = t.title.match(/(\d+)\s*gallon/i);
    if (!sizeMatch) return false;
    const gallons = parseInt(sizeMatch[1], 10);
    return gallons >= recommendedSize;
  }).slice(0, 2);

  /* Check compatibility between all selected pairs */
  const issues: { speciesA: string; speciesB: string; level: Compatibility; note: string }[] = [];
  for (let i = 0; i < selected.length; i++) {
    for (let j = i + 1; j < selected.length; j++) {
      const result = getCompatibility(
        selected[i].species,
        selected[j].species
      );
      if (result.compatibility !== "compatible") {
        issues.push({
          speciesA: selected[i].species,
          speciesB: selected[j].species,
          level: result.compatibility,
          note: result.note,
        });
      }
    }
  }

  /* Tank mate recommendations — build from product catalog */
  const recommendations = useMemo(() => {
    if (selected.length === 0) return [];

    /* Build fake "selectedFish" products for the recommendations engine */
    const selectedFishProducts: NormalizedProduct[] = [];
    for (const s of selected) {
      const prods = speciesProductMap[s.species];
      if (prods && prods.length > 0) {
        selectedFishProducts.push(prods[0]);
      }
    }

    const allGroups = groupFishByType(fishProducts, selectedFishProducts);
    const recs = getTankMateRecommendations(selectedFishProducts, allGroups);
    return recs.slice(0, MAX_CALCULATOR_RECOMMENDATIONS);
  }, [selected, fishProducts, speciesProductMap]);

  /* Estimated cost calculation */
  const estimatedCost = useMemo(() => {
    let minTotal = 0;
    let maxTotal = 0;
    let hasPrice = false;

    for (const s of selected) {
      const prods = speciesProductMap[s.species] || [];
      if (prods.length === 0) continue;

      const prices = prods
        .map((p) => Number(p.price.amount))
        .filter((n) => !Number.isNaN(n) && n > 0)
        .sort((a, b) => a - b);

      if (prices.length === 0) continue;
      hasPrice = true;
      minTotal += prices[0] * s.count;
      maxTotal += prices[prices.length - 1] * s.count;
    }

    if (!hasPrice) return null;
    if (minTotal === maxTotal) return `$${minTotal.toFixed(2)}`;
    return `$${minTotal.toFixed(2)} – $${maxTotal.toFixed(2)}`;
  }, [selected, speciesProductMap]);

  /* Filter species list — exclude already-selected and incompatible temperaments */
  const filteredSpecies = SPECIES_PROFILES.filter((p) => {
    /* Already selected */
    if (selected.some((s) => s.species === p.species)) return false;

    /* Search query filter */
    if (
      searchQuery !== "" &&
      !p.species.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    /* Temperament filter — only show species matching the group temperament */
    if (selectedTemperament && p.temperament !== selectedTemperament) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Species picker */}
      <div className="rounded-lg border border-border/50 bg-card/50 p-4">
        <h2 className="mb-3 text-lg font-semibold">Select Your Fish</h2>
        <input
          type="text"
          placeholder="Search species..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-3 w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-aqua/50 focus:outline-none"
        />
        {selectedTemperament && (
          <div className="mb-3 flex items-center gap-2 rounded-md border border-aqua/20 bg-aqua/5 px-3 py-2 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5 shrink-0 text-aqua" />
            <span>
              Showing only{" "}
              <span className="font-medium capitalize text-foreground">
                {selectedTemperament}
              </span>{" "}
              species to avoid temperament conflicts.{" "}
              <button
                onClick={() => setSelected([])}
                className="text-aqua hover:underline"
              >
                Clear all
              </button>{" "}
              to start over.
            </span>
          </div>
        )}
        <div className="flex max-h-48 flex-wrap gap-1.5 overflow-y-auto">
          {filteredSpecies.map((sp) => {
            const prods = speciesProductMap[sp.species] || [];
            const thumb = prods[0]?.featuredImage?.url;
            const priceRange = prods.length > 0 ? getPriceRange(prods) : "";

            return (
              <button
                key={sp.species}
                onClick={() => addSpecies(sp.species)}
                className="flex items-center gap-1.5 rounded-md border border-border/50 bg-card/30 px-2.5 py-1 text-xs transition-colors hover:border-aqua/50 hover:text-aqua"
              >
                {thumb ? (
                  <Image
                    src={thumb}
                    alt={sp.species}
                    width={SPECIES_PICKER_THUMB_SIZE}
                    height={SPECIES_PICKER_THUMB_SIZE}
                    className="rounded-sm object-cover"
                    style={{
                      width: SPECIES_PICKER_THUMB_SIZE,
                      height: SPECIES_PICKER_THUMB_SIZE,
                    }}
                  />
                ) : (
                  <Fish className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <span className="flex flex-col items-start leading-tight">
                  <span>{sp.species}</span>
                  {priceRange && (
                    <span className="text-[10px] text-muted-foreground">
                      {priceRange}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected species with counts */}
      {selected.length > 0 && (
        <div className="rounded-lg border border-border/50 bg-card/50 p-4">
          <h2 className="mb-3 text-lg font-semibold">Your Fish</h2>
          <div className="space-y-2">
            {selected.map((s) => {
              const profile = SPECIES_PROFILES.find(
                (p) => p.species === s.species
              );
              const care = SPECIES_CARE[s.species];
              const prods = speciesProductMap[s.species] || [];
              const thumb = prods[0]?.featuredImage?.url;
              const priceRange = prods.length > 0 ? getPriceRange(prods) : "";

              return (
                <div
                  key={s.species}
                  className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/30 p-3"
                >
                  {thumb ? (
                    <Image
                      src={thumb}
                      alt={s.species}
                      width={SELECTED_FISH_THUMB_SIZE}
                      height={SELECTED_FISH_THUMB_SIZE}
                      className="shrink-0 rounded-sm object-cover"
                      style={{
                        width: SELECTED_FISH_THUMB_SIZE,
                        height: SELECTED_FISH_THUMB_SIZE,
                      }}
                    />
                  ) : (
                    <Fish className="h-4 w-4 shrink-0 text-aqua" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {care ? (
                        <Link
                          href={`/species/${care.slug}`}
                          className="text-sm font-medium hover:text-aqua"
                        >
                          {s.species}
                        </Link>
                      ) : (
                        <span className="text-sm font-medium">
                          {s.species}
                        </span>
                      )}
                      <Badge variant="secondary" className="text-[10px] capitalize">
                        {profile?.temperament}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Min {profile?.minTankGallons} gal &middot;{" "}
                      {profile?.waterParams.tempMinF}&ndash;
                      {profile?.waterParams.tempMaxF}&deg;F
                    </p>
                    {(priceRange || prods.length > 1) && (
                      <p className="text-[10px] text-muted-foreground">
                        {priceRange && <span>{priceRange}</span>}
                        {prods.length > 1 && (
                          <span>
                            {priceRange ? " · " : ""}
                            {prods.length} varieties available
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateCount(s.species, -1)}
                      className="rounded p-1 text-muted-foreground hover:text-foreground"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">
                      {s.count}
                    </span>
                    <button
                      onClick={() => updateCount(s.species, 1)}
                      className="rounded p-1 text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeSpecies(s.species)}
                    className="rounded p-1 text-muted-foreground hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Results */}
      {selected.length > 0 && (
        <div className="space-y-4">
          {/* Tank size recommendation */}
          <div className="rounded-lg border border-aqua/30 bg-card/50 p-4">
            <h2 className="mb-2 text-lg font-semibold">
              Recommended Tank Size
            </h2>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-aqua">
                {recommendedSize}
              </span>
              <span className="text-lg text-muted-foreground">gallons</span>
            </div>
            <div className="mt-1 space-y-0.5 text-sm text-muted-foreground">
              <p>
                Largest species needs: {speciesMinTankSize} gal &middot;
                Total bioload ({totalBioloadInches.toFixed(0)}&Prime; of fish):
                {" "}{bioloadTankSize} gal
              </p>
              <p className="text-xs">
                Based on the 1&Prime;-per-gallon rule. Actual needs vary by species.
              </p>
            </div>
            {matchingTanks.length > 0 && (
              <div className="mt-3 space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">
                  Shop Tanks
                </p>
                {matchingTanks.map((tank) => (
                  <Link
                    key={tank.id}
                    href={tank.externalUrl ?? `/products/${tank.handle}`}
                    target={tank.externalUrl ? "_blank" : undefined}
                    rel={tank.externalUrl ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-2 text-sm text-aqua hover:underline"
                  >
                    {tank.title}
                    {tank.externalUrl && (
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Compatibility check */}
          <div className="rounded-lg border border-border/50 bg-card/50 p-4">
            <h2 className="mb-3 text-lg font-semibold">
              Compatibility Check
            </h2>
            {issues.length === 0 ? (
              <div className="flex items-center gap-2 text-green-400">
                <Check className="h-5 w-5" />
                <p className="text-sm">
                  All selected species are compatible with each other.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {issues.map((issue) => (
                  <div
                    key={`${issue.speciesA}-${issue.speciesB}`}
                    className="flex items-start gap-2"
                  >
                    <AlertTriangle
                      className={`mt-0.5 h-4 w-4 shrink-0 ${COMPAT_COLORS[issue.level]}`}
                    />
                    <div>
                      <p
                        className={`text-sm font-medium ${COMPAT_COLORS[issue.level]}`}
                      >
                        {issue.speciesA} + {issue.speciesB}
                        {issue.level === "incompatible"
                          ? " — NOT compatible"
                          : " — Use caution"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {issue.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tank Mate Recommendations */}
          {recommendations.length > 0 && (
            <div className="rounded-lg border border-border/50 bg-card/50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-aqua" />
                <h2 className="text-lg font-semibold">
                  Tank Mate Recommendations
                </h2>
              </div>
              <p className="mb-3 text-xs text-muted-foreground">
                Compatible species that would work well with your selection.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {recommendations.map((rec) => {
                  /* Find products for the recommended species */
                  const speciesName = rec.profile.species;
                  const recProducts = speciesProductMap[speciesName] || [];
                  const thumb = recProducts[0]?.featuredImage?.url;
                  const priceRange = recProducts.length > 0 ? getPriceRange(recProducts) : "";
                  const alreadySelected = selected.some(
                    (s) => s.species === speciesName,
                  );

                  return (
                    <div
                      key={rec.productType}
                      className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/30 p-3"
                    >
                      {thumb ? (
                        <Image
                          src={thumb}
                          alt={speciesName}
                          width={SELECTED_FISH_THUMB_SIZE}
                          height={SELECTED_FISH_THUMB_SIZE}
                          className="mt-0.5 shrink-0 rounded-sm object-cover"
                          style={{
                            width: SELECTED_FISH_THUMB_SIZE,
                            height: SELECTED_FISH_THUMB_SIZE,
                          }}
                        />
                      ) : (
                        <Fish className="mt-0.5 h-5 w-5 shrink-0 text-aqua" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {rec.displayName}
                          </span>
                          <span
                            className={`rounded-full border px-1.5 py-0.5 text-[10px] ${COMPAT_BADGE_COLORS[rec.compatibility]}`}
                          >
                            {rec.compatibility === "compatible"
                              ? "Compatible"
                              : "Caution"}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          {rec.reason}
                        </p>
                        {priceRange && (
                          <p className="text-[10px] text-muted-foreground">
                            {priceRange}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => addSpecies(speciesName)}
                        disabled={alreadySelected}
                        className="shrink-0 rounded-md border border-aqua/30 px-2 py-1 text-xs text-aqua transition-colors hover:bg-aqua/10 disabled:cursor-default disabled:opacity-40"
                      >
                        {alreadySelected ? "Added" : "Add"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="rounded-lg border border-border/50 bg-card/50 p-4">
            <h2 className="mb-3 text-lg font-semibold">Stocking Summary</h2>
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground">
                Total fish:{" "}
                <span className="font-medium text-foreground">
                  {selected.reduce((sum, s) => sum + s.count, 0)}
                </span>
              </p>
              <p className="text-muted-foreground">
                Species:{" "}
                <span className="font-medium text-foreground">
                  {selected.length}
                </span>
              </p>
              <p className="text-muted-foreground">
                Total bioload:{" "}
                <span className="font-medium text-foreground">
                  {totalBioloadInches.toFixed(0)}&Prime; of fish
                </span>
              </p>
              <p className="text-muted-foreground">
                Tank size:{" "}
                <span className="font-medium text-foreground">
                  {recommendedSize}+ gallons
                </span>
              </p>
              {estimatedCost && (
                <p className="text-muted-foreground">
                  Estimated fish cost:{" "}
                  <span className="font-medium text-foreground">
                    {estimatedCost}
                  </span>
                </p>
              )}
            </div>
          </div>

          <Button variant="outline" className="border-aqua/30 text-aqua" asChild>
            <Link
              href={`/tools/build-your-tank?minGallons=${recommendedSize}&fish=${selected
                .map((s) => `${encodeURIComponent(s.species)}:${s.count}`)
                .join(",")}`}
            >
              Build a complete setup with these fish &rarr;
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
