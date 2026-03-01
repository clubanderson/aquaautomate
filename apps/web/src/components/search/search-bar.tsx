"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProductSearch } from "@/hooks/use-product-search";

/** Maximum autocomplete results to show in the dropdown */
const MAX_AUTOCOMPLETE_RESULTS = 5;

export function SearchBar() {
  const { query, search, results } = useProductSearch();
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayed = results.slice(0, MAX_AUTOCOMPLETE_RESULTS);

  /* Close dropdown when clicking outside */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* Cmd+K / Ctrl+K shortcut to focus search */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < displayed.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      if (highlightIndex >= 0 && displayed[highlightIndex]) {
        const item = displayed[highlightIndex];
        const href =
          item.source === "amazon" && item.externalUrl
            ? item.externalUrl
            : `/products/${item.handle}`;
        window.location.href = href;
      } else if (query.length > 0) {
        window.location.href = `/search?q=${encodeURIComponent(query)}`;
      }
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search products… (⌘K)"
          className="h-9 w-48 pl-9 pr-8 text-sm lg:w-64"
          value={query}
          onChange={(e) => {
            search(e.target.value);
            setOpen(true);
            setHighlightIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
            onClick={() => {
              search("");
              setOpen(false);
              inputRef.current?.focus();
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Autocomplete dropdown */}
      {open && displayed.length > 0 && (
        <div className="absolute left-0 top-full z-50 mt-1 w-80 overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
          {displayed.map((item, i) => {
            const href =
              item.source === "amazon" && item.externalUrl
                ? item.externalUrl
                : `/products/${item.handle}`;
            const price = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: item.currencyCode,
            }).format(Number(item.price));

            return (
              <Link
                key={item.handle}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-muted/50 ${
                  i === highlightIndex ? "bg-muted/50" : ""
                }`}
                onClick={() => setOpen(false)}
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-muted">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{item.title}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-aqua">{price}</span>
                    {item.inventoryStatus === "sold-out" && (
                      <Badge className="bg-red-600 text-white text-[10px] px-1 py-0">
                        Sold Out
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}

          {results.length > MAX_AUTOCOMPLETE_RESULTS && (
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              className="block border-t border-border px-3 py-2 text-center text-xs text-aqua hover:bg-muted/50"
              onClick={() => setOpen(false)}
            >
              View all {results.length} results
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
