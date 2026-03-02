"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/** sessionStorage key prefix for saved scroll positions */
const SCROLL_KEY_PREFIX = "scroll:";

/**
 * Saves scroll position before navigation and restores it on
 * back/forward (popstate). New link-click navigations scroll to top
 * as usual.
 */
export function ScrollRestoration() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  /** Tracks whether the last navigation was a popstate (back/forward) */
  const isPopstate = useRef(false);
  /** Previous URL so we can save its scroll before leaving */
  const prevUrl = useRef(url);

  /* Detect back/forward via popstate event */
  useEffect(() => {
    function onPopState() {
      isPopstate.current = true;
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  /* Save scroll for the previous URL, restore for back/forward */
  useEffect(() => {
    /* Save scroll position of the page we're leaving */
    if (prevUrl.current !== url) {
      try {
        sessionStorage.setItem(
          `${SCROLL_KEY_PREFIX}${prevUrl.current}`,
          String(window.scrollY)
        );
      } catch {
        /* sessionStorage may be full or unavailable */
      }
      prevUrl.current = url;
    }

    /* Restore only on back/forward */
    if (isPopstate.current) {
      const saved = sessionStorage.getItem(`${SCROLL_KEY_PREFIX}${url}`);
      if (saved !== null) {
        const y = parseInt(saved, 10);
        /* Double rAF lets the DOM render before scrolling */
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo(0, y);
          });
        });
      }
      isPopstate.current = false;
    }
  }, [url]);

  return null;
}
