import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  matchProductToSpecies,
  getCompatibleSpecies,
  findTankMateProducts,
  getNonFishCompatibilityNote,
} from "@/lib/aquarium/match-species";
import type { NormalizedProduct } from "@/lib/commerce/types";
import type { Compatibility } from "@/lib/aquarium/tank-mates";

interface TankMatesProps {
  product: NormalizedProduct;
  allProducts: NormalizedProduct[];
}

/** Color classes for compatibility levels */
const COMPAT_COLORS: Record<Compatibility, string> = {
  compatible: "bg-green-600/20 text-green-400 border-green-600/30",
  caution: "bg-amber-600/20 text-amber-400 border-amber-600/30",
  incompatible: "bg-red-600/20 text-red-400 border-red-600/30",
};

const COMPAT_LABELS: Record<Compatibility, string> = {
  compatible: "Compatible",
  caution: "Caution",
  incompatible: "Incompatible",
};

/** Tank-mate compatibility section — shows on ALL product pages */
export function TankMates({ product, allProducts }: TankMatesProps) {
  const species = matchProductToSpecies(product);

  /* Fish product: show full compatibility table */
  if (species) {
    const mates = getCompatibleSpecies(species.species);
    const storeMatches = findTankMateProducts(
      species.species,
      allProducts,
      product.id
    );

    return (
      <section className="mt-16">
        <h2 className="mb-2 text-2xl font-bold">Tank-Mate Compatibility</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Compatibility data for {species.species} ({species.scientificName})
        </p>

        {/* Species care info */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-border/50 bg-card/50 p-3">
            <p className="text-xs text-muted-foreground">Temperature</p>
            <p className="text-sm font-medium">
              {species.waterParams.tempMinF}&ndash;{species.waterParams.tempMaxF}&deg;F
            </p>
          </div>
          <div className="rounded-lg border border-border/50 bg-card/50 p-3">
            <p className="text-xs text-muted-foreground">pH Range</p>
            <p className="text-sm font-medium">
              {species.waterParams.phMin}&ndash;{species.waterParams.phMax}
            </p>
          </div>
          <div className="rounded-lg border border-border/50 bg-card/50 p-3">
            <p className="text-xs text-muted-foreground">Min Tank Size</p>
            <p className="text-sm font-medium">{species.minTankGallons} gal</p>
          </div>
          <div className="rounded-lg border border-border/50 bg-card/50 p-3">
            <p className="text-xs text-muted-foreground">Temperament</p>
            <p className="text-sm font-medium capitalize">{species.temperament}</p>
          </div>
        </div>

        {/* Compatibility list */}
        <div className="space-y-2">
          {mates.map(({ profile, compatibility, note }) => (
            <div
              key={profile.species}
              className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/50 p-3"
            >
              <Badge className={COMPAT_COLORS[compatibility]}>
                {COMPAT_LABELS[compatibility]}
              </Badge>
              <div className="flex-1">
                <p className="text-sm font-medium">{profile.species}</p>
                <p className="text-xs text-muted-foreground">{note}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Available in store */}
        {storeMatches.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 text-lg font-semibold">
              Compatible Fish in Our Store
            </h3>
            <div className="flex flex-wrap gap-2">
              {storeMatches
                .filter((m) => m.compatibility !== "incompatible")
                .map(({ product: p, compatibility }) => (
                  <Link
                    key={p.id}
                    href={
                      p.source === "amazon"
                        ? p.externalUrl ?? "#"
                        : `/products/${p.handle}`
                    }
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors hover:border-aqua/50 ${
                      compatibility === "caution"
                        ? "border-amber-600/30"
                        : "border-border/50"
                    }`}
                  >
                    {p.title}
                    <Badge
                      className={`text-[10px] ${COMPAT_COLORS[compatibility]}`}
                    >
                      {COMPAT_LABELS[compatibility]}
                    </Badge>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </section>
    );
  }

  /* Non-fish product: show contextual note */
  const nonFishNote = getNonFishCompatibilityNote(product);
  if (!nonFishNote) return null;

  return (
    <section className="mt-16">
      <h2 className="mb-2 text-2xl font-bold">Aquarium Compatibility</h2>
      <div className="rounded-lg border border-border/50 bg-card/50 p-4">
        <p className="text-sm text-muted-foreground">{nonFishNote.note}</p>
        {nonFishNote.relatedSpecies.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {nonFishNote.relatedSpecies.map((sp) => {
              /* Find a matching product in the store for this species */
              const matchingProduct = allProducts.find((p) => {
                const text = p.title.toLowerCase();
                return sp
                  .toLowerCase()
                  .split(" ")
                  .some((word) => text.includes(word));
              });

              if (matchingProduct && matchingProduct.id !== product.id) {
                return (
                  <Link
                    key={sp}
                    href={`/products/${matchingProduct.handle}`}
                    className="rounded-md border border-aqua/20 bg-aqua/5 px-2 py-1 text-xs text-aqua hover:border-aqua/50"
                  >
                    {sp}
                  </Link>
                );
              }

              return (
                <span
                  key={sp}
                  className="rounded-md border border-border/50 px-2 py-1 text-xs text-muted-foreground"
                >
                  {sp}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
