import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SPECIES_PROFILES } from "@/lib/aquarium/compatibility-data";
import { SPECIES_CARE } from "@/lib/aquarium/species-care";

export const metadata: Metadata = {
  title: "Freshwater Species Care Sheets",
  description:
    "Complete care guides for 26+ freshwater fish, shrimp, and snail species. Water parameters, diet, tank size, compatibility, breeding, and expert tips.",
};

/** Temperament badge styling */
const TEMPERAMENT_COLORS: Record<string, string> = {
  peaceful: "bg-green-600/20 text-green-400 border-green-600/30",
  "semi-aggressive": "bg-amber-600/20 text-amber-400 border-amber-600/30",
  aggressive: "bg-red-600/20 text-red-400 border-red-600/30",
};

/** Swim level labels */
const SWIM_LABELS: Record<string, string> = {
  top: "Top",
  mid: "Mid",
  bottom: "Bottom",
  all: "All Levels",
};

export default function SpeciesListPage() {
  /* Only show species that have care data */
  const speciesWithCare = SPECIES_PROFILES.filter(
    (sp) => SPECIES_CARE[sp.species]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold sm:text-4xl">
          <span className="text-aqua">Species</span> Care Sheets
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Complete care guides for {speciesWithCare.length} freshwater species.
          Water parameters, diet, tank size, compatibility, breeding, and expert
          tips from experienced fishkeepers.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {speciesWithCare.map((sp) => {
          const care = SPECIES_CARE[sp.species];
          if (!care) return null;

          return (
            <Link
              key={sp.species}
              href={`/species/${care.slug}`}
              className="group rounded-lg border border-border/50 bg-card/50 p-5 transition-all hover:border-aqua/30 hover:shadow-lg hover:shadow-aqua/5"
            >
              <div className="mb-3 flex items-center gap-2">
                <Badge className={TEMPERAMENT_COLORS[sp.temperament]}>
                  {sp.temperament}
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  {SWIM_LABELS[sp.swimLevel]}
                </Badge>
              </div>

              <h2 className="text-lg font-semibold group-hover:text-aqua">
                {sp.species}
              </h2>
              <p className="text-xs italic text-muted-foreground">
                {sp.scientificName}
              </p>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {care.summary}
              </p>

              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>
                  {sp.waterParams.tempMinF}&ndash;{sp.waterParams.tempMaxF}
                  &deg;F
                </span>
                <span>&middot;</span>
                <span>pH {sp.waterParams.phMin}&ndash;{sp.waterParams.phMax}</span>
                <span>&middot;</span>
                <span>{sp.minTankGallons}+ gal</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
