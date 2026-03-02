"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, ExternalLink, Plus, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AMAZON_PRODUCTS } from "@/lib/commerce/amazon-catalog";
import type { NormalizedProduct } from "@/lib/commerce/types";

/** Maximum products that can be compared at once */
const MAX_COMPARE = 4;

/** Minimum products needed for a valid comparison */
const MIN_COMPARE = 2;

/** Image dimensions for product thumbnails */
const THUMB_SIZE = 96;

/** Spec rows to compare across products */
const SPEC_ROWS: { label: string; getValue: (p: NormalizedProduct) => string }[] = [
  { label: "Price", getValue: (p) => `$${p.price.amount}` },
  { label: "Vendor", getValue: (p) => p.vendor ?? "—" },
  { label: "Type", getValue: (p) => p.productType ?? "—" },
  {
    label: "Water Type",
    getValue: (p) =>
      p.waterType ? p.waterType.charAt(0).toUpperCase() + p.waterType.slice(1) : "—",
  },
  { label: "Source", getValue: (p) => (p.source === "amazon" ? "Amazon" : "Store") },
  {
    label: "Automation",
    getValue: (p) => (p.automationCompatible ? "Yes" : "—"),
  },
];

function productHref(p: NormalizedProduct): string {
  return p.source === "amazon" ? (p.externalUrl ?? "#") : `/products/${p.handle}`;
}

/** Group products by type for easier browsing */
function getProductTypes(): string[] {
  const types = new Set<string>();
  for (const p of AMAZON_PRODUCTS) {
    if (p.productType) types.add(p.productType);
  }
  return Array.from(types).sort();
}

export function ProductCompare() {
  const [selected, setSelected] = useState<NormalizedProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const productTypes = getProductTypes();

  const addProduct = (product: NormalizedProduct) => {
    if (selected.length >= MAX_COMPARE) return;
    if (selected.some((p) => p.id === product.id)) return;
    setSelected((prev) => [...prev, product]);
  };

  const removeProduct = (productId: string) => {
    setSelected((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearAll = () => setSelected([]);

  /* Filter available products */
  const filteredProducts = AMAZON_PRODUCTS.filter((p) => {
    if (selected.some((s) => s.id === p.id)) return false;
    if (typeFilter && p.productType !== typeFilter) return false;
    if (
      searchQuery &&
      !p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(p.vendor ?? "").toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const hasEnoughToCompare = selected.length >= MIN_COMPARE;

  return (
    <div className="space-y-6">
      {/* Selected products bar */}
      <div className="rounded-lg border border-border/50 bg-card/50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Selected ({selected.length}/{MAX_COMPARE})
          </h2>
          {selected.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-xs text-muted-foreground hover:text-red-400"
            >
              Clear All
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {selected.map((p) => (
            <div
              key={p.id}
              className="relative rounded-lg border border-aqua/30 bg-aqua/5 p-3"
            >
              <button
                onClick={() => removeProduct(p.id)}
                className="absolute -right-1.5 -top-1.5 rounded-full bg-card p-0.5 text-muted-foreground hover:text-red-400"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              {p.featuredImage && (
                <Image
                  src={p.featuredImage.url}
                  alt={p.featuredImage.altText}
                  width={THUMB_SIZE}
                  height={THUMB_SIZE}
                  className="mx-auto mb-2 h-16 w-16 rounded object-contain"
                />
              )}
              <p className="line-clamp-2 text-xs font-medium">{p.title}</p>
              <p className="mt-1 text-xs text-aqua">${p.price.amount}</p>
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: MAX_COMPARE - selected.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="flex items-center justify-center rounded-lg border border-dashed border-border/50 bg-card/30 p-3"
              style={{ minHeight: "120px" }}
            >
              <div className="text-center text-muted-foreground">
                <Plus className="mx-auto mb-1 h-5 w-5" />
                <p className="text-xs">Add product</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison table */}
      {hasEnoughToCompare && (
        <div className="overflow-x-auto rounded-lg border border-aqua/30 bg-card/50">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="p-3 text-left text-sm font-medium text-muted-foreground">
                  Spec
                </th>
                {selected.map((p) => (
                  <th key={p.id} className="p-3 text-center">
                    <p className="line-clamp-2 text-sm font-medium">{p.title}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Image row */}
              <tr className="border-b border-border/50">
                <td className="p-3 text-sm text-muted-foreground">Image</td>
                {selected.map((p) => (
                  <td key={p.id} className="p-3 text-center">
                    {p.featuredImage ? (
                      <Image
                        src={p.featuredImage.url}
                        alt={p.featuredImage.altText}
                        width={THUMB_SIZE}
                        height={THUMB_SIZE}
                        className="mx-auto h-20 w-20 rounded object-contain"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">No image</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Spec rows */}
              {SPEC_ROWS.map((row) => {
                const values = selected.map((p) => row.getValue(p));
                /* Highlight the best price (lowest) */
                const isPriceRow = row.label === "Price";
                const lowestPrice = isPriceRow
                  ? Math.min(
                      ...selected.map((p) => Number(p.price.amount))
                    )
                  : null;

                return (
                  <tr key={row.label} className="border-b border-border/50">
                    <td className="p-3 text-sm font-medium text-muted-foreground">
                      {row.label}
                    </td>
                    {selected.map((p, i) => {
                      const isBest =
                        isPriceRow &&
                        lowestPrice !== null &&
                        Number(p.price.amount) === lowestPrice &&
                        selected.length > 1;
                      return (
                        <td
                          key={p.id}
                          className={`p-3 text-center text-sm ${
                            isBest ? "font-bold text-green-400" : ""
                          }`}
                        >
                          {values[i]}
                          {isBest && (
                            <Badge
                              variant="secondary"
                              className="ml-1.5 bg-green-600/20 text-[9px] text-green-400"
                            >
                              Best
                            </Badge>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* Tags row */}
              <tr className="border-b border-border/50">
                <td className="p-3 text-sm font-medium text-muted-foreground">
                  Tags
                </td>
                {selected.map((p) => (
                  <td key={p.id} className="p-3 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {(p.tags || []).slice(0, 5).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-[9px]"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Description row */}
              <tr className="border-b border-border/50">
                <td className="p-3 text-sm font-medium text-muted-foreground">
                  Description
                </td>
                {selected.map((p) => (
                  <td key={p.id} className="p-3 text-center">
                    <p className="line-clamp-4 text-xs text-muted-foreground">
                      {p.description}
                    </p>
                  </td>
                ))}
              </tr>

              {/* Buy links row */}
              <tr>
                <td className="p-3 text-sm font-medium text-muted-foreground">
                  Link
                </td>
                {selected.map((p) => (
                  <td key={p.id} className="p-3 text-center">
                    <a
                      href={productHref(p)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md bg-aqua/10 px-3 py-1.5 text-xs font-medium text-aqua transition-colors hover:bg-aqua/20"
                    >
                      View
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Product browser */}
      {selected.length < MAX_COMPARE && (
        <div className="rounded-lg border border-border/50 bg-card/50 p-4">
          <h2 className="mb-3 text-lg font-semibold">Add Products</h2>

          {/* Search and filter */}
          <div className="mb-3 flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border/50 bg-background py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-aqua/50 focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setTypeFilter(null)}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  typeFilter === null
                    ? "bg-aqua/20 text-aqua"
                    : "bg-card/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              {productTypes.map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    setTypeFilter(typeFilter === type ? null : type)
                  }
                  className={`rounded-md px-2.5 py-1.5 text-xs font-medium capitalize transition-colors ${
                    typeFilter === type
                      ? "bg-aqua/20 text-aqua"
                      : "bg-card/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {type.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => addProduct(p)}
                className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/30 p-3 text-left transition-all hover:border-aqua/30"
              >
                {p.featuredImage && (
                  <Image
                    src={p.featuredImage.url}
                    alt={p.featuredImage.altText}
                    width={THUMB_SIZE}
                    height={THUMB_SIZE}
                    className="h-12 w-12 shrink-0 rounded object-contain"
                  />
                )}
                <div className="flex-1 overflow-hidden">
                  <p className="line-clamp-2 text-sm font-medium">{p.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs font-medium text-aqua">
                      ${p.price.amount}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-[9px] capitalize"
                    >
                      {(p.productType || "").toLowerCase()}
                    </Badge>
                  </div>
                </div>
                <Check className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No products match your search.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
