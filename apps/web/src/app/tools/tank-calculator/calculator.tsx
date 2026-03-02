"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Check, Fish, Minus, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SPECIES_PROFILES } from "@/lib/aquarium/compatibility-data";
import { SPECIES_CARE } from "@/lib/aquarium/species-care";
import { getCompatibility } from "@/lib/aquarium/match-species";
import type { Compatibility } from "@/lib/aquarium/tank-mates";

/** Standard tank sizes in gallons */
const STANDARD_TANK_SIZES = [5, 10, 20, 29, 30, 40, 55, 75, 90, 125] as const;

/** Minimum group size for schooling species — used as default quantity */
const DEFAULT_SCHOOL_SIZE = 6;

/** Species that should be kept solo (only 1) */
const SOLO_SPECIES = new Set(["Betta", "Knifefish"]);

interface SelectedSpecies {
  species: string;
  count: number;
}

const COMPAT_COLORS: Record<Compatibility, string> = {
  compatible: "text-green-400",
  caution: "text-amber-400",
  incompatible: "text-red-400",
};

export function TankCalculator() {
  const [selected, setSelected] = useState<SelectedSpecies[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  /* Calculate requirements */
  const minTankSize = selected.reduce((max, s) => {
    const profile = SPECIES_PROFILES.find((p) => p.species === s.species);
    return Math.max(max, profile?.minTankGallons ?? 0);
  }, 0);

  /* Find compatible tank size */
  const recommendedSize =
    STANDARD_TANK_SIZES.find((size) => size >= minTankSize) ??
    STANDARD_TANK_SIZES[STANDARD_TANK_SIZES.length - 1];

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

  /* Filter species list */
  const filteredSpecies = SPECIES_PROFILES.filter(
    (p) =>
      !selected.some((s) => s.species === p.species) &&
      (searchQuery === "" ||
        p.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.scientificName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
        <div className="flex max-h-48 flex-wrap gap-1.5 overflow-y-auto">
          {filteredSpecies.map((sp) => (
            <button
              key={sp.species}
              onClick={() => addSpecies(sp.species)}
              className="rounded-md border border-border/50 bg-card/30 px-2.5 py-1 text-xs transition-colors hover:border-aqua/50 hover:text-aqua"
            >
              {sp.species}
            </button>
          ))}
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
              return (
                <div
                  key={s.species}
                  className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/30 p-3"
                >
                  <Fish className="h-4 w-4 shrink-0 text-aqua" />
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
            <p className="mt-1 text-sm text-muted-foreground">
              Minimum required: {minTankSize} gallons (based on the
              largest species in your selection)
            </p>
            <div className="mt-3">
              <Link
                href={`/collections?q=aquarium+tank+${recommendedSize}+gallon`}
                className="text-sm text-aqua hover:underline"
              >
                Shop {recommendedSize}-gallon tanks &rarr;
              </Link>
            </div>
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
                Tank size:{" "}
                <span className="font-medium text-foreground">
                  {recommendedSize}+ gallons
                </span>
              </p>
            </div>
          </div>

          <Button variant="outline" className="border-aqua/30 text-aqua" asChild>
            <Link href="/tools/build-your-tank">
              Build a complete setup with these fish &rarr;
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
