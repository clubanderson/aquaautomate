import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  matchProductToSpecies,
  getCompatibleSpecies,
  findTankMateProducts,
  getNonFishCompatibilityNote,
} from "@/lib/aquarium/match-species";
import { SPECIES_PROFILES } from "@/lib/aquarium/compatibility-data";
import { SPECIES_CARE } from "@/lib/aquarium/species-care";
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

const SWIM_LABELS: Record<string, string> = {
  top: "Top",
  mid: "Mid",
  bottom: "Bottom",
  all: "All",
};

/** Number of recommended tank-mate product cards to display */
const RECOMMENDED_TANK_MATES_COUNT = 4;

/** Build a href for a product — internal page or external Amazon link */
function productHref(p: NormalizedProduct): string {
  return p.source === "amazon" ? (p.externalUrl ?? "#") : `/products/${p.handle}`;
}

/** Build a search link to find a species in the store */
function speciesSearchHref(speciesName: string): string {
  return `/collections?q=${encodeURIComponent(speciesName.toLowerCase())}`;
}

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

    /* Build a lookup: species name → best store product match */
    const speciesProductMap = new Map<string, NormalizedProduct>();
    for (const { product: p } of storeMatches) {
      const matched = matchProductToSpecies(p);
      if (matched && !speciesProductMap.has(matched.species)) {
        speciesProductMap.set(matched.species, p);
      }
    }

    /* Top 4 compatible products with images for the recommendation cards */
    const recommendedProducts = storeMatches
      .filter((m) => m.compatibility === "compatible")
      .slice(0, RECOMMENDED_TANK_MATES_COUNT);

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

        {/* Recommended tank-mate product cards */}
        {recommendedProducts.length > 0 && (
          <div className="mb-8">
            <h3 className="mb-3 text-lg font-semibold">
              Shop Compatible Tank-Mates
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {recommendedProducts.map(({ product: p, compatibility }) => {
                const href = productHref(p);
                const isExternal = p.source === "amazon";

                return (
                  <Link
                    key={p.id}
                    href={href}
                    {...(isExternal
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="group rounded-lg border border-border/50 bg-card/50 transition-all hover:border-aqua/30 hover:shadow-lg hover:shadow-aqua/5"
                  >
                    {/* Product image */}
                    <div className="relative aspect-square overflow-hidden rounded-t-lg bg-muted">
                      {p.featuredImage ? (
                        <Image
                          src={p.featuredImage.url}
                          alt={p.featuredImage.altText ?? p.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Product info */}
                    <div className="p-3">
                      <p className="line-clamp-2 text-sm font-medium group-hover:text-aqua">
                        {p.title}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-aqua">
                          ${p.price.amount}
                        </span>
                        <Badge
                          className={`text-[10px] ${COMPAT_COLORS[compatibility]}`}
                        >
                          {COMPAT_LABELS[compatibility]}
                        </Badge>
                      </div>
                      {isExternal && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                          <ExternalLink className="h-2.5 w-2.5" />
                          Amazon
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Compatibility list — each row links to the product or a search */}
        <h3 className="mb-3 text-lg font-semibold">All Species Compatibility</h3>
        <div className="space-y-2">
          {mates.map(({ profile, compatibility, note }) => {
            const storeProduct = speciesProductMap.get(profile.species);
            const href = storeProduct
              ? productHref(storeProduct)
              : speciesSearchHref(profile.species);
            const isExternal =
              storeProduct?.source === "amazon";

            /* Look up hover preview data */
            const targetProfile = SPECIES_PROFILES.find(
              (p) => p.species === profile.species
            );
            const care = SPECIES_CARE[profile.species];

            return (
              <div key={profile.species} className="group/row relative">
                <Link
                  href={href}
                  {...(isExternal
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/50 p-3 transition-colors hover:border-aqua/30 hover:bg-card/80"
                >
                  <Badge className={COMPAT_COLORS[compatibility]}>
                    {COMPAT_LABELS[compatibility]}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{profile.species}</p>
                    <p className="text-xs text-muted-foreground">{note}</p>
                  </div>
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>

                {/* Hover preview card — hidden on mobile, shown on desktop hover */}
                {targetProfile && (
                  <div className="pointer-events-none absolute bottom-full left-0 z-50 mb-2 hidden w-72 opacity-0 transition-opacity group-hover/row:opacity-100 lg:block">
                    <div className="rounded-lg border border-border bg-card p-3 shadow-xl shadow-black/30">
                      <p className="text-sm font-semibold">{profile.species}</p>
                      <p className="text-[10px] italic text-muted-foreground">
                        {targetProfile.scientificName}
                      </p>
                      <div className="mt-2 grid grid-cols-3 gap-1.5 text-[10px]">
                        <div>
                          <span className="text-muted-foreground">Temp: </span>
                          <span className="font-medium">
                            {targetProfile.waterParams.tempMinF}&ndash;
                            {targetProfile.waterParams.tempMaxF}&deg;F
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">pH: </span>
                          <span className="font-medium">
                            {targetProfile.waterParams.phMin}&ndash;
                            {targetProfile.waterParams.phMax}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tank: </span>
                          <span className="font-medium">
                            {targetProfile.minTankGallons}+ gal
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Swim: </span>
                          <span className="font-medium">
                            {SWIM_LABELS[targetProfile.swimLevel]}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Nature: </span>
                          <span className="font-medium capitalize">
                            {targetProfile.temperament}
                          </span>
                        </div>
                        {care && (
                          <div>
                            <span className="text-muted-foreground">Size: </span>
                            <span className="font-medium">
                              {care.adultSize}
                            </span>
                          </div>
                        )}
                      </div>
                      {care && (
                        <Link
                          href={`/species/${care.slug}`}
                          className="pointer-events-auto mt-2 block text-[10px] text-aqua hover:underline"
                        >
                          View full care sheet &rarr;
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
                <Link
                  key={sp}
                  href={speciesSearchHref(sp)}
                  className="rounded-md border border-border/50 px-2 py-1 text-xs text-muted-foreground hover:border-aqua/30 hover:text-aqua"
                >
                  {sp}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
