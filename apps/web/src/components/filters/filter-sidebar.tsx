"use client";

import { useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { ProductFilters, SortOption, AvailabilityFilter } from "@/lib/commerce/filters";
import { serializeFilters } from "@/lib/commerce/filters";

interface Facet {
  name: string;
  count: number;
}

interface FilterSidebarProps {
  filters: ProductFilters;
  categoryFacets: Facet[];
  waterTypeFacets: Facet[];
  totalResults: number;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "name", label: "Name A–Z" },
  { value: "newest", label: "Newest" },
];

const AVAILABILITY_OPTIONS: { value: AvailabilityFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "in-stock", label: "In Stock" },
  { value: "on-sale", label: "On Sale" },
];

export function FilterSidebar({
  filters,
  categoryFacets,
  waterTypeFacets,
  totalResults,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const updateFilters = useCallback(
    (newFilters: ProductFilters) => {
      const qs = serializeFilters(newFilters);
      router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, pathname]
  );

  const toggleCategory = useCallback(
    (cat: string) => {
      const current = [...filters.categories];
      const idx = current.indexOf(cat);
      if (idx >= 0) {
        current.splice(idx, 1);
      } else {
        current.push(cat);
      }
      updateFilters({ ...filters, categories: current });
    },
    [filters, updateFilters]
  );

  const toggleWaterType = useCallback(
    (wt: string) => {
      const current = [...filters.waterTypes];
      const idx = current.indexOf(wt);
      if (idx >= 0) {
        current.splice(idx, 1);
      } else {
        current.push(wt);
      }
      updateFilters({ ...filters, waterTypes: current });
    },
    [filters, updateFilters]
  );

  const clearAll = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.waterTypes.length > 0 ||
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined ||
    filters.availability !== "all" ||
    filters.sort !== "relevance";

  return (
    <aside className="space-y-6 rounded-lg border border-border/50 bg-card/50 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto px-2 py-1 text-xs text-muted-foreground"
            onClick={clearAll}
          >
            Clear All
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {totalResults} product{totalResults === 1 ? "" : "s"}
      </p>

      {/* Sort */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground">Sort By</h4>
        <select
          className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
          value={filters.sort}
          onChange={(e) =>
            updateFilters({ ...filters, sort: e.target.value as SortOption })
          }
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Availability */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground">Availability</h4>
        <div className="flex flex-wrap gap-1.5">
          {AVAILABILITY_OPTIONS.map((o) => (
            <Badge
              key={o.value}
              variant={filters.availability === o.value ? "default" : "outline"}
              className={`cursor-pointer text-xs ${
                filters.availability === o.value
                  ? "bg-aqua text-deep-blue"
                  : "hover:border-aqua/50"
              }`}
              onClick={() =>
                updateFilters({ ...filters, availability: o.value })
              }
            >
              {o.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Categories */}
      {categoryFacets.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground">Category</h4>
          <div className="space-y-1">
            {categoryFacets.map((facet) => {
              const active = filters.categories.includes(facet.name);
              return (
                <label
                  key={facet.name}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleCategory(facet.name)}
                    className="rounded border-border"
                  />
                  <span className={active ? "text-aqua" : ""}>
                    {facet.name}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {facet.count}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Water Type */}
      {waterTypeFacets.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground">Water Type</h4>
          <div className="space-y-1">
            {waterTypeFacets.map((facet) => {
              const active = filters.waterTypes.includes(facet.name);
              return (
                <label
                  key={facet.name}
                  className="flex cursor-pointer items-center gap-2 text-sm capitalize"
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleWaterType(facet.name)}
                    className="rounded border-border"
                  />
                  <span className={active ? "text-aqua" : ""}>
                    {facet.name}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {facet.count}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground">Price Range</h4>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            className="h-8 text-sm"
            value={filters.priceMin ?? ""}
            onChange={(e) =>
              updateFilters({
                ...filters,
                priceMin: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            placeholder="Max"
            className="h-8 text-sm"
            value={filters.priceMax ?? ""}
            onChange={(e) =>
              updateFilters({
                ...filters,
                priceMax: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
      </div>
    </aside>
  );
}
