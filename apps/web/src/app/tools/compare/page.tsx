import type { Metadata } from "next";
import { ProductCompare } from "./compare";

export const metadata: Metadata = {
  title: "Compare Aquarium Products",
  description:
    "Side-by-side comparison of aquarium equipment. Compare filters, heaters, lights, and more to find the best gear for your setup.",
};

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">
          <span className="text-aqua">Compare</span> Products
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Select 2-4 products to compare side by side. Perfect for choosing
          between filters, heaters, lights, and other equipment.
        </p>
      </div>
      <ProductCompare />
    </div>
  );
}
