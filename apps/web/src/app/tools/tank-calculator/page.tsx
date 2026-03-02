import type { Metadata } from "next";
import { TankCalculator } from "./calculator";

export const metadata: Metadata = {
  title: "Tank Size Calculator",
  description:
    "Calculate the right tank size for your fish. Select species, see minimum tank requirements, stocking levels, and compatibility warnings.",
};

export default function TankCalculatorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Tank Size <span className="text-aqua">Calculator</span>
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Select the fish you want to keep and we&apos;ll calculate the minimum
          tank size, check compatibility, and flag any issues.
        </p>
      </div>
      <TankCalculator />
    </div>
  );
}
