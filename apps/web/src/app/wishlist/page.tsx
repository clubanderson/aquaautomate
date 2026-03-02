import type { Metadata } from "next";
import { WishlistView } from "./wishlist-view";

export const metadata: Metadata = {
  title: "My Wishlist",
  description:
    "Your saved aquarium products. Revisit items you're interested in and compare prices.",
};

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">
          My <span className="text-aqua">Wishlist</span>
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Products you&apos;ve saved for later. Your wishlist is stored locally
          in your browser.
        </p>
      </div>
      <WishlistView />
    </div>
  );
}
