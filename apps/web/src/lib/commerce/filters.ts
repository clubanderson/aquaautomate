import type { NormalizedProduct } from "./types";

export type SortOption = "relevance" | "price-asc" | "price-desc" | "name" | "newest";
export type AvailabilityFilter = "all" | "in-stock" | "on-sale";

export interface ProductFilters {
  categories: string[];
  priceMin?: number;
  priceMax?: number;
  waterTypes: string[];
  availability: AvailabilityFilter;
  sort: SortOption;
  q?: string;
}

/** Default filter state */
export const DEFAULT_FILTERS: ProductFilters = {
  categories: [],
  waterTypes: [],
  availability: "all",
  sort: "relevance",
};

/** Parse URL search params into ProductFilters */
export function parseFilters(params: Record<string, string | string[] | undefined>): ProductFilters {
  const get = (key: string): string | undefined => {
    const v = params[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const getArray = (key: string): string[] => {
    const v = get(key);
    return v ? v.split(",").filter(Boolean) : [];
  };

  return {
    categories: getArray("cat"),
    waterTypes: getArray("water"),
    priceMin: get("pmin") ? Number(get("pmin")) : undefined,
    priceMax: get("pmax") ? Number(get("pmax")) : undefined,
    availability: (get("avail") as AvailabilityFilter) || "all",
    sort: (get("sort") as SortOption) || "relevance",
    q: get("q"),
  };
}

/** Serialize filters to URL search param string */
export function serializeFilters(filters: ProductFilters): string {
  const params = new URLSearchParams();
  if (filters.categories.length > 0) params.set("cat", filters.categories.join(","));
  if (filters.waterTypes.length > 0) params.set("water", filters.waterTypes.join(","));
  if (filters.priceMin !== undefined) params.set("pmin", String(filters.priceMin));
  if (filters.priceMax !== undefined) params.set("pmax", String(filters.priceMax));
  if (filters.availability !== "all") params.set("avail", filters.availability);
  if (filters.sort !== "relevance") params.set("sort", filters.sort);
  if (filters.q) params.set("q", filters.q);
  return params.toString();
}

/** Apply filters to a product list */
export function applyFilters(
  products: NormalizedProduct[],
  filters: ProductFilters
): NormalizedProduct[] {
  let result = [...products];

  /* Category filter — normalize to uppercase + apply aliases to match facet keys */
  if (filters.categories.length > 0) {
    const cats = new Set(
      filters.categories.map((c) => {
        const upper = c.toUpperCase();
        return PRODUCT_TYPE_ALIASES[upper] || upper;
      })
    );
    result = result.filter((p) => {
      const raw = (p.productType || "").toUpperCase();
      const type = PRODUCT_TYPE_ALIASES[raw] || raw;
      return cats.has(type);
    });
  }

  /* Water type filter */
  if (filters.waterTypes.length > 0) {
    const types = new Set(filters.waterTypes);
    result = result.filter((p) => p.waterType && types.has(p.waterType));
  }

  /* Price range */
  if (filters.priceMin !== undefined) {
    result = result.filter((p) => Number(p.price.amount) >= (filters.priceMin ?? 0));
  }
  if (filters.priceMax !== undefined) {
    result = result.filter((p) => Number(p.price.amount) <= (filters.priceMax ?? Infinity));
  }

  /* Availability */
  if (filters.availability === "in-stock") {
    result = result.filter((p) => p.inventoryStatus !== "sold-out");
  } else if (filters.availability === "on-sale") {
    result = result.filter(
      (p) =>
        p.compareAtPrice &&
        Number(p.compareAtPrice.amount) > Number(p.price.amount)
    );
  }

  /* Text search */
  if (filters.q) {
    const terms = filters.q.toLowerCase().split(/\s+/).filter(Boolean);
    result = result.filter((p) => {
      const text = `${p.title} ${p.description} ${(p.tags || []).join(" ")} ${p.productType || ""}`.toLowerCase();
      return terms.every((t) => text.includes(t));
    });
  }

  /* Sort */
  switch (filters.sort) {
    case "price-asc":
      result.sort((a, b) => Number(a.price.amount) - Number(b.price.amount));
      break;
    case "price-desc":
      result.sort((a, b) => Number(b.price.amount) - Number(a.price.amount));
      break;
    case "name":
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
    /* "relevance" and "newest" keep the existing order */
  }

  return result;
}

/** Merge synonymous product types into a single canonical key */
const PRODUCT_TYPE_ALIASES: Record<string, string> = {
  PLANT: "PLANTS",
  "LIVE PLANT": "LIVE PLANTS",
  "LIVE PLANTS": "PLANTS",
};

/** Extract facet counts from a product list for dynamic filter UI */
export function extractFacets(products: NormalizedProduct[]) {
  const categories = new Map<string, number>();
  const waterTypes = new Map<string, number>();

  for (const p of products) {
    /* Normalize to uppercase then merge synonyms (e.g. "Plant" → "PLANTS") */
    const raw = (p.productType || "Other").toUpperCase();
    const type = PRODUCT_TYPE_ALIASES[raw] || raw;
    categories.set(type, (categories.get(type) || 0) + 1);

    if (p.waterType) {
      waterTypes.set(p.waterType, (waterTypes.get(p.waterType) || 0) + 1);
    }
  }

  return {
    categories: Array.from(categories.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count })),
    waterTypes: Array.from(waterTypes.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count })),
  };
}
