"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FilterSidebar } from "./filter-sidebar";
import type { ProductFilters } from "@/lib/commerce/filters";

interface Facet {
  name: string;
  count: number;
}

interface MobileFilterTriggerProps {
  filters: ProductFilters;
  categoryFacets: Facet[];
  waterTypeFacets: Facet[];
  totalResults: number;
}

export function MobileFilterTrigger({
  filters,
  categoryFacets,
  waterTypeFacets,
  totalResults,
}: MobileFilterTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="lg:hidden"
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal className="mr-2 h-4 w-4" />
        Filters
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-3/4 sm:max-w-sm overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <FilterSidebar
              filters={filters}
              categoryFacets={categoryFacets}
              waterTypeFacets={waterTypeFacets}
              totalResults={totalResults}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
