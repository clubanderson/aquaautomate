import type { Metadata } from "next";
import { Suspense } from "react";
import { TankWizard } from "./wizard";

export const metadata: Metadata = {
  title: "Build Your Tank — Shopping List Generator",
  description:
    "Step-by-step aquarium setup wizard. Pick your tank size, equipment, and fish — get a complete shopping list with prices.",
};

export default function BuildYourTankPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Build Your <span className="text-aqua">Tank</span>
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Walk through each step to build your ideal aquarium setup. We&apos;ll
          generate a shopping list with everything you need.
        </p>
      </div>
      <Suspense>
        <TankWizard />
      </Suspense>
    </div>
  );
}
