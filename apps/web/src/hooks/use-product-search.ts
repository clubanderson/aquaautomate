"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { SearchIndexEntry } from "@/app/api/search-index/route";

/** Debounce delay in milliseconds before triggering search */
const SEARCH_DEBOUNCE_MS = 200;
/** Minimum query length to trigger a search */
const MIN_QUERY_LENGTH = 2;
/** Scoring weights for search relevance */
const TITLE_MATCH_SCORE = 10;
const TAG_MATCH_SCORE = 5;
const TYPE_MATCH_SCORE = 3;
const DESCRIPTION_MATCH_SCORE = 1;

export interface SearchResult extends SearchIndexEntry {
  score: number;
}

/** Fetch the search index once and cache the promise */
let indexPromise: Promise<SearchIndexEntry[]> | null = null;

function fetchIndex(): Promise<SearchIndexEntry[]> {
  if (!indexPromise) {
    indexPromise = fetch("/api/search-index")
      .then((res) => res.json())
      .catch(() => [] as SearchIndexEntry[]);
  }
  return indexPromise;
}

export function useProductSearch() {
  const [index, setIndex] = useState<SearchIndexEntry[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [query, setQuery] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  /* Fetch the search index on first mount */
  useEffect(() => {
    let cancelled = false;
    fetchIndex().then((data) => {
      if (!cancelled) setIndex(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const search = useCallback(
    (q: string) => {
      setQuery(q);

      if (timerRef.current) clearTimeout(timerRef.current);

      if (q.length < MIN_QUERY_LENGTH) {
        setResults([]);
        return;
      }

      timerRef.current = setTimeout(() => {
        const terms = q.toLowerCase().split(/\s+/).filter(Boolean);

        const scored = index
          .map((entry) => {
            let score = 0;
            const titleLower = entry.title.toLowerCase();
            const descLower = entry.description.toLowerCase();
            const typeLower = entry.productType.toLowerCase();
            const tagsLower = (entry.tags || []).map((t) => t.toLowerCase());

            for (const term of terms) {
              if (titleLower.includes(term)) score += TITLE_MATCH_SCORE;
              if (tagsLower.some((t) => t.includes(term))) score += TAG_MATCH_SCORE;
              if (typeLower.includes(term)) score += TYPE_MATCH_SCORE;
              if (descLower.includes(term)) score += DESCRIPTION_MATCH_SCORE;
            }

            return { ...entry, score };
          })
          .filter((r) => r.score > 0)
          .sort((a, b) => b.score - a.score);

        setResults(scored);
      }, SEARCH_DEBOUNCE_MS);
    },
    [index]
  );

  const loading = index.length === 0;

  return { query, search, results, loading };
}
