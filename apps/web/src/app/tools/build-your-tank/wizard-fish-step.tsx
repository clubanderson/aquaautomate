"use client";

import { useMemo } from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Info,
  Waves,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { NormalizedProduct } from "@/lib/commerce/types";
import type { Compatibility } from "@/lib/aquarium/tank-mates";
import {
  groupFishByType,
  getTankMateRecommendations,
  getVarietyCompatibilityNotes,
  SWIM_LEVEL_LABELS,
  type FishTypeGroup,
  type TankMateRecommendation,
} from "@/lib/aquarium/fish-type-groups";

/* ── Styling constants (match species pages) ───────────────────────────── */

const TEMPERAMENT_COLORS: Record<string, string> = {
  peaceful: "bg-green-600/20 text-green-400 border-green-600/30",
  "semi-aggressive": "bg-amber-600/20 text-amber-400 border-amber-600/30",
  aggressive: "bg-red-600/20 text-red-400 border-red-600/30",
};

const COMPAT_COLORS: Record<Compatibility, string> = {
  compatible: "bg-green-600/20 text-green-400 border-green-600/30",
  caution: "bg-amber-600/20 text-amber-400 border-amber-600/30",
  incompatible: "bg-red-600/20 text-red-400 border-red-600/30",
};

/* ── Props ─────────────────────────────────────────────────────────────── */

interface WizardFishStepProps {
  /** All fish products (already filtered by isFishProductType) */
  fishProducts: NormalizedProduct[];
  /** Currently selected fish products */
  selectedFish: NormalizedProduct[];
  /** Whether fish were pre-selected from calculator */
  hasPreselectedFish: boolean;
  /** Number of pre-selected fish */
  preselectedCount: number;
  /** Toggle a fish product selection */
  onToggleFish: (product: NormalizedProduct) => void;
  /** Active drill-down type, or null for grid view */
  activeFishType: string | null;
  /** Set the active drill-down type */
  onSetFishType: (type: string | null) => void;
}

/* ── Component ─────────────────────────────────────────────────────────── */

export function WizardFishStep({
  fishProducts,
  selectedFish,
  hasPreselectedFish,
  preselectedCount,
  onToggleFish,
  activeFishType,
  onSetFishType,
}: WizardFishStepProps) {
  /* Group fish products by type */
  const typeGroups = useMemo(
    () => groupFishByType(fishProducts, selectedFish),
    [fishProducts, selectedFish],
  );

  /* Tank mate recommendations (only when fish are selected) */
  const recommendations = useMemo(
    () => getTankMateRecommendations(selectedFish, typeGroups),
    [selectedFish, typeGroups],
  );

  /* Find the active group for drill-down view */
  const activeGroup = activeFishType
    ? typeGroups.find((g) => g.productType === activeFishType) ?? null
    : null;

  if (activeFishType && activeGroup) {
    return (
      <FishVarietyDrilldown
        group={activeGroup}
        selectedFish={selectedFish}
        onToggleFish={onToggleFish}
        onBack={() => onSetFishType(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Choose Your Fish</h2>

      {/* Pre-selection banner */}
      {hasPreselectedFish && (
        <div className="flex items-center gap-2 rounded-md border border-green-600/30 bg-green-600/5 px-3 py-2 text-xs text-muted-foreground">
          <Check className="h-3.5 w-3.5 shrink-0 text-green-400" />
          <span>
            <span className="font-medium text-green-400">
              {preselectedCount} fish
            </span>{" "}
            pre-selected from the Tank Calculator. Tap a category below to
            adjust.
          </span>
        </div>
      )}

      {/* Hint */}
      <div className="flex items-center gap-2 rounded-md border border-aqua/20 bg-aqua/5 px-3 py-2 text-xs text-muted-foreground">
        <Info className="h-3.5 w-3.5 shrink-0 text-aqua" />
        <span>
          Pick a fish type to browse varieties. You can select from
          multiple types.
        </span>
      </div>

      {/* Fish type cards grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {typeGroups.map((group) => (
          <FishTypeCard
            key={group.productType}
            group={group}
            onClick={() => onSetFishType(group.productType)}
          />
        ))}
      </div>

      {typeGroups.length === 0 && (
        <p className="rounded-lg border border-border/50 bg-card/50 p-6 text-center text-sm text-muted-foreground">
          No fish products available yet.
        </p>
      )}

      {/* Tank mate recommendations */}
      {recommendations.length > 0 && (
        <TankMateRecommendations
          recommendations={recommendations}
          onBrowseType={onSetFishType}
        />
      )}
    </div>
  );
}

/* ── Fish type card ────────────────────────────────────────────────────── */

function FishTypeCard({
  group,
  onClick,
}: {
  group: FishTypeGroup;
  onClick: () => void;
}) {
  const allSoldOut = group.availableCount === 0;

  return (
    <button
      onClick={onClick}
      className={`group rounded-lg border p-4 text-left transition-all ${
        allSoldOut
          ? "cursor-not-allowed border-border/30 bg-card/20 opacity-60"
          : group.selectedCount > 0
            ? "border-aqua/50 bg-aqua/5"
            : "border-border/50 bg-card/50 hover:border-aqua/30"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{group.displayName}</p>
            {group.selectedCount > 0 && (
              <Badge className="border-aqua/30 bg-aqua/20 text-[10px] text-aqua">
                {group.selectedCount} selected
              </Badge>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {group.availableCount}{" "}
            {group.availableCount === 1 ? "variety" : "varieties"} available
          </p>
        </div>
        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>

      {/* Species metadata badges */}
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {group.profile && (
          <>
            <Badge
              className={`text-[10px] ${TEMPERAMENT_COLORS[group.profile.temperament] ?? ""}`}
            >
              {group.profile.temperament}
            </Badge>
            <Badge variant="secondary" className="text-[10px]">
              {SWIM_LEVEL_LABELS[group.profile.swimLevel] ?? group.profile.swimLevel}
            </Badge>
            <Badge variant="secondary" className="text-[10px]">
              {group.profile.minTankGallons}+ gal
            </Badge>
          </>
        )}
        {allSoldOut && (
          <Badge className="border-red-600/30 bg-red-600/20 text-[10px] text-red-400">
            Sold Out
          </Badge>
        )}
      </div>

      {/* Price range */}
      {group.priceRange && (
        <p className="mt-2 text-xs text-aqua">{group.priceRange}</p>
      )}
    </button>
  );
}

/* ── Variety drill-down ────────────────────────────────────────────────── */

function FishVarietyDrilldown({
  group,
  selectedFish,
  onToggleFish,
  onBack,
}: {
  group: FishTypeGroup;
  selectedFish: NormalizedProduct[];
  onToggleFish: (product: NormalizedProduct) => void;
  onBack: () => void;
}) {
  const selectedIds = useMemo(
    () => new Set(selectedFish.map((f) => f.id)),
    [selectedFish],
  );

  /* Sort products: available first, then by price */
  const sortedProducts = useMemo(
    () =>
      [...group.products].sort((a, b) => {
        const aSoldOut = a.availableForSale === false ? 1 : 0;
        const bSoldOut = b.availableForSale === false ? 1 : 0;
        if (aSoldOut !== bSoldOut) return aSoldOut - bSoldOut;
        return Number(a.price.amount) - Number(b.price.amount);
      }),
    [group.products],
  );

  return (
    <div className="space-y-4">
      {/* Back + header */}
      <div>
        <button
          onClick={onBack}
          className="mb-2 flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to all fish types
        </button>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">{group.displayName}</h2>
          {group.profile && (
            <div className="flex items-center gap-1.5">
              <Badge
                className={`text-[10px] ${TEMPERAMENT_COLORS[group.profile.temperament] ?? ""}`}
              >
                {group.profile.temperament}
              </Badge>
              <Badge variant="secondary" className="text-[10px]">
                {SWIM_LEVEL_LABELS[group.profile.swimLevel] ?? group.profile.swimLevel}
              </Badge>
              <Badge variant="secondary" className="text-[10px]">
                {group.profile.minTankGallons}+ gal
              </Badge>
            </div>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Select as many as you like. Tap to toggle.
        </p>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sortedProducts.map((p) => {
          const selected = selectedIds.has(p.id);
          const soldOut = p.availableForSale === false;
          const compatNotes = getVarietyCompatibilityNotes(p, selectedFish);

          return (
            <button
              key={p.id}
              onClick={() => !soldOut && onToggleFish(p)}
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
                  {p.vendor && (
                    <Badge variant="secondary" className="gap-1 text-[10px]">
                      {p.vendor}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Compatibility notes with already-selected fish */}
              {compatNotes.length > 0 && (
                <div className="mt-2 space-y-1">
                  {compatNotes.map((note) => (
                    <div
                      key={note.species}
                      className="flex items-center gap-1.5 text-[10px]"
                    >
                      <Badge className={`px-1.5 py-0 text-[9px] ${COMPAT_COLORS[note.compatibility]}`}>
                        {note.compatibility === "caution" ? "⚠" : "✕"}
                      </Badge>
                      <span className="text-muted-foreground">
                        {note.note}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Tank mate recommendations ─────────────────────────────────────────── */

function TankMateRecommendations({
  recommendations,
  onBrowseType,
}: {
  recommendations: TankMateRecommendation[];
  onBrowseType: (type: string) => void;
}) {
  return (
    <div className="rounded-lg border border-border/50 bg-card/30 p-4">
      <div className="mb-3 flex items-center gap-1.5 text-sm font-medium">
        <Waves className="h-4 w-4 text-aqua" />
        Recommended Tank Mates
      </div>
      <p className="mb-3 text-xs text-muted-foreground">
        Based on the fish you&apos;ve selected — compatible temperament, swim
        level, and water parameters.
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((rec) => (
          <Button
            key={rec.productType}
            variant="outline"
            onClick={() => onBrowseType(rec.productType)}
            className="h-auto flex-col items-start gap-1 border-border/30 bg-card/50 p-3 text-left hover:border-aqua/30 hover:bg-aqua/5"
          >
            <div className="flex w-full items-center justify-between">
              <span className="text-xs font-medium">{rec.displayName}</span>
              <Badge
                className={`text-[9px] ${COMPAT_COLORS[rec.compatibility]}`}
              >
                {rec.compatibility}
              </Badge>
            </div>
            <span className="text-[10px] text-muted-foreground">
              {rec.reason}
            </span>
            {rec.profile && (
              <div className="flex items-center gap-1">
                <Badge
                  className={`px-1.5 py-0 text-[9px] ${TEMPERAMENT_COLORS[rec.profile.temperament] ?? ""}`}
                >
                  {rec.profile.temperament}
                </Badge>
                <Badge variant="secondary" className="px-1.5 py-0 text-[9px]">
                  {SWIM_LEVEL_LABELS[rec.profile.swimLevel] ?? rec.profile.swimLevel}
                </Badge>
              </div>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}
