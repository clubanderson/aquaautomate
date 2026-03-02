"use client";

import { useCallback, useSyncExternalStore, useState } from "react";
import { Bell, BellOff, Check } from "lucide-react";

/** localStorage key for price alert subscriptions */
const STORAGE_KEY = "aquaautomate-price-alerts";

/** Duration to show the confirmation message in milliseconds */
const CONFIRM_DURATION_MS = 2000;

interface PriceAlertButtonProps {
  productId: string;
  currentPrice: string;
}

/** Get all price alert product IDs from localStorage */
function getAlerts(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/** Toggle a product's price alert subscription */
function toggleAlert(productId: string): boolean {
  const alerts = getAlerts();
  let nowSubscribed: boolean;

  if (alerts.includes(productId)) {
    const updated = alerts.filter((id) => id !== productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    nowSubscribed = false;
  } else {
    const updated = [...alerts, productId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    nowSubscribed = true;
  }

  window.dispatchEvent(new CustomEvent("price-alert-change"));
  return nowSubscribed;
}

function subscribePriceAlerts(callback: () => void) {
  window.addEventListener("price-alert-change", callback);
  return () => window.removeEventListener("price-alert-change", callback);
}

/**
 * "Notify me when price drops" button.
 * Stores subscription in localStorage. In production, this would
 * register with a backend service that monitors prices.
 */
export function PriceAlertButton({
  productId,
  currentPrice,
}: PriceAlertButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const subscribed = useSyncExternalStore(
    subscribePriceAlerts,
    () => getAlerts().includes(productId),
    () => false
  );

  const handleClick = useCallback(() => {
    const nowSubscribed = toggleAlert(productId);
    if (nowSubscribed) {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), CONFIRM_DURATION_MS);
    }
  }, [productId]);

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-600/10 px-3 py-2 text-sm text-green-400">
        <Check className="h-4 w-4" />
        <span>
          We&apos;ll notify you when the price drops below ${currentPrice}
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
        subscribed
          ? "border-amber-500/30 bg-amber-600/10 text-amber-400 hover:bg-amber-600/20"
          : "border-border/50 text-muted-foreground hover:border-aqua/30 hover:text-aqua"
      }`}
    >
      {subscribed ? (
        <>
          <BellOff className="h-4 w-4" />
          Remove price alert
        </>
      ) : (
        <>
          <Bell className="h-4 w-4" />
          Notify me when price drops
        </>
      )}
    </button>
  );
}
