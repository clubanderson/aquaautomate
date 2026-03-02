import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Droplets,
  ExternalLink,
  Fish,
  Heart,
  Ruler,
  ShoppingCart,
  Thermometer,
  Timer,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SPECIES_PROFILES } from "@/lib/aquarium/compatibility-data";
import {
  SPECIES_CARE,
  getAllSpeciesSlugs,
  getSpeciesCareBySlug,
} from "@/lib/aquarium/species-care";
import {
  getCompatibleSpecies,
  findTankMateProducts,
  matchProductToSpecies,
} from "@/lib/aquarium/match-species";
import { AMAZON_PRODUCTS } from "@/lib/commerce/amazon-catalog";
import type { Compatibility } from "@/lib/aquarium/tank-mates";

interface SpeciesPageProps {
  params: Promise<{ slug: string }>;
}

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
  top: "Top swimmer",
  mid: "Mid-level swimmer",
  bottom: "Bottom dweller",
  all: "All levels",
};

export async function generateMetadata({
  params,
}: SpeciesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const care = getSpeciesCareBySlug(slug);
  if (!care) return { title: "Species Not Found" };

  return {
    title: `${care.speciesName} Care Sheet`,
    description: care.summary,
  };
}

export async function generateStaticParams() {
  return getAllSpeciesSlugs().map((slug) => ({ slug }));
}

export default async function SpeciesPage({ params }: SpeciesPageProps) {
  const { slug } = await params;
  const care = getSpeciesCareBySlug(slug);
  if (!care) notFound();

  const profile = SPECIES_PROFILES.find(
    (p) => p.species === care.speciesName
  )!;
  const mates = getCompatibleSpecies(care.speciesName);
  const compatibleMates = mates.filter(
    (m) => m.compatibility === "compatible"
  );
  const cautionMates = mates.filter((m) => m.compatibility === "caution");
  const incompatibleMates = mates.filter(
    (m) => m.compatibility === "incompatible"
  );

  /* Find products matching this species for the buy section */
  const speciesProducts = AMAZON_PRODUCTS.filter((p) => {
    const matched = matchProductToSpecies(p);
    return matched?.species === care.speciesName;
  });
  /* Also grab compatible tank-mate products for a "Complete your tank" section */
  const MAX_TANK_MATE_PRODUCTS = 4;
  const tankMateProducts = findTankMateProducts(
    care.speciesName,
    AMAZON_PRODUCTS,
    speciesProducts[0]?.id
  )
    .filter((m) => m.compatibility === "compatible")
    .slice(0, MAX_TANK_MATE_PRODUCTS);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <Link
        href="/species"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-aqua"
      >
        <ArrowLeft className="h-3 w-3" />
        All Species
      </Link>

      {/* Header */}
      <header className="mb-8 space-y-3">
        <div className="flex items-center gap-2">
          <Badge
            className={
              profile.temperament === "peaceful"
                ? "bg-green-600/20 text-green-400 border-green-600/30"
                : profile.temperament === "semi-aggressive"
                  ? "bg-amber-600/20 text-amber-400 border-amber-600/30"
                  : "bg-red-600/20 text-red-400 border-red-600/30"
            }
          >
            {profile.temperament}
          </Badge>
          <Badge variant="secondary">{SWIM_LABELS[profile.swimLevel]}</Badge>
        </div>
        <h1 className="text-3xl font-bold sm:text-4xl">
          {care.speciesName}{" "}
          <span className="text-lg font-normal text-muted-foreground">
            Care Sheet
          </span>
        </h1>
        <p className="text-sm italic text-muted-foreground">
          {profile.scientificName}
        </p>
        <p className="text-lg text-muted-foreground">{care.summary}</p>
      </header>

      {/* Quick Stats Grid */}
      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-border/50 bg-card/50 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Thermometer className="h-3.5 w-3.5" />
            Temperature
          </div>
          <p className="text-sm font-medium">
            {profile.waterParams.tempMinF}&ndash;{profile.waterParams.tempMaxF}
            &deg;F
          </p>
        </div>
        <div className="rounded-lg border border-border/50 bg-card/50 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Droplets className="h-3.5 w-3.5" />
            pH Range
          </div>
          <p className="text-sm font-medium">
            {profile.waterParams.phMin}&ndash;{profile.waterParams.phMax}
          </p>
        </div>
        <div className="rounded-lg border border-border/50 bg-card/50 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Fish className="h-3.5 w-3.5" />
            Min Tank Size
          </div>
          <p className="text-sm font-medium">{profile.minTankGallons} gallons</p>
        </div>
        <div className="rounded-lg border border-border/50 bg-card/50 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Timer className="h-3.5 w-3.5" />
            Lifespan
          </div>
          <p className="text-sm font-medium">{care.lifespan}</p>
        </div>
        <div className="rounded-lg border border-border/50 bg-card/50 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Ruler className="h-3.5 w-3.5" />
            Adult Size
          </div>
          <p className="text-sm font-medium">{care.adultSize}</p>
        </div>
        <div className="rounded-lg border border-border/50 bg-card/50 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            Group Size
          </div>
          <p className="text-sm font-medium">{care.groupSize}</p>
        </div>
        <div className="col-span-2 rounded-lg border border-border/50 bg-card/50 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Heart className="h-3.5 w-3.5" />
            Breeding
          </div>
          <p className="text-sm font-medium">{care.breeding}</p>
        </div>
      </div>

      {/* Diet */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-bold">Diet & Feeding</h2>
        <div className="rounded-lg border border-border/50 bg-card/50 p-4">
          <p className="text-sm text-muted-foreground">{care.diet}</p>
        </div>
      </section>

      {/* Habitat */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-bold">Natural Habitat</h2>
        <div className="rounded-lg border border-border/50 bg-card/50 p-4">
          <p className="text-sm text-muted-foreground">{care.habitat}</p>
        </div>
      </section>

      {/* Care Tips */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-bold">Care Tips</h2>
        <div className="space-y-2">
          {care.careTips.map((tip) => (
            <div
              key={tip}
              className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/50 p-3"
            >
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aqua" />
              <p className="text-sm text-muted-foreground">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Buy section */}
      {speciesProducts.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold">
            <ShoppingCart className="mr-2 inline h-5 w-5 text-aqua" />
            Buy {care.speciesName}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {speciesProducts.map((p) => {
              const href =
                p.source === "amazon"
                  ? (p.externalUrl ?? "#")
                  : `/products/${p.handle}`;
              const isExternal = p.source === "amazon";
              return (
                <Link
                  key={p.id}
                  href={href}
                  {...(isExternal
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group flex gap-3 rounded-lg border border-aqua/20 bg-card/50 p-3 transition-colors hover:border-aqua/50 hover:bg-card/80"
                >
                  {p.featuredImage && (
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={p.featuredImage.url}
                        alt={p.featuredImage.altText ?? p.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="line-clamp-2 text-sm font-medium group-hover:text-aqua">
                      {p.title}
                    </p>
                    <p className="mt-1 text-lg font-bold text-aqua">
                      ${p.price.amount}
                    </p>
                    {isExternal && (
                      <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                        <ExternalLink className="h-2.5 w-2.5" />
                        Available at Amazon
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
          {tankMateProducts.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                Compatible Tank-Mates to Buy
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {tankMateProducts.map(({ product: p }) => {
                  const href =
                    p.source === "amazon"
                      ? (p.externalUrl ?? "#")
                      : `/products/${p.handle}`;
                  const isExternal = p.source === "amazon";
                  return (
                    <Link
                      key={p.id}
                      href={href}
                      {...(isExternal
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="group rounded-lg border border-border/50 bg-card/50 p-2 transition-colors hover:border-aqua/30"
                    >
                      {p.featuredImage && (
                        <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                          <Image
                            src={p.featuredImage.url}
                            alt={p.featuredImage.altText ?? p.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, 25vw"
                          />
                        </div>
                      )}
                      <p className="mt-1.5 line-clamp-2 text-xs font-medium group-hover:text-aqua">
                        {p.title}
                      </p>
                      <p className="text-xs font-bold text-aqua">
                        ${p.price.amount}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Compatibility */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-bold">Tank-Mate Compatibility</h2>

        {/* Compatible */}
        {compatibleMates.length > 0 && (
          <div className="mb-4">
            <h3 className="mb-2 text-sm font-semibold text-green-400">
              Compatible Species ({compatibleMates.length})
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {compatibleMates.map(({ profile: p, note }) => {
                const targetCare = SPECIES_CARE[p.species];
                const targetProfile = SPECIES_PROFILES.find(
                  (sp) => sp.species === p.species
                );
                return (
                  <div key={p.species} className="group/row relative">
                    <Link
                      href={
                        targetCare
                          ? `/species/${targetCare.slug}`
                          : `/collections?q=${encodeURIComponent(p.species.toLowerCase())}`
                      }
                      className="flex items-start gap-3 rounded-lg border border-green-600/20 bg-card/50 p-3 transition-colors hover:border-aqua/30"
                    >
                      <Badge className={COMPAT_COLORS.compatible}>
                        {COMPAT_LABELS.compatible}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{p.species}</p>
                        <p className="text-xs text-muted-foreground">{note}</p>
                      </div>
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    </Link>
                    {/* Hover tooltip */}
                    {targetProfile && (
                      <div className="pointer-events-none absolute bottom-full left-0 z-50 mb-2 hidden w-72 opacity-0 transition-opacity group-hover/row:opacity-100 lg:block">
                        <div className="rounded-lg border border-border bg-card p-3 shadow-xl shadow-black/30">
                          <p className="text-sm font-semibold">{p.species}</p>
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
                            {targetCare && (
                              <div>
                                <span className="text-muted-foreground">Size: </span>
                                <span className="font-medium">{targetCare.adultSize}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Caution */}
        {cautionMates.length > 0 && (
          <div className="mb-4">
            <h3 className="mb-2 text-sm font-semibold text-amber-400">
              Use Caution ({cautionMates.length})
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {cautionMates.map(({ profile: p, note }) => {
                const targetCare = SPECIES_CARE[p.species];
                const targetProfile = SPECIES_PROFILES.find(
                  (sp) => sp.species === p.species
                );
                return (
                  <div key={p.species} className="group/row relative">
                    <Link
                      href={
                        targetCare
                          ? `/species/${targetCare.slug}`
                          : `/collections?q=${encodeURIComponent(p.species.toLowerCase())}`
                      }
                      className="flex items-start gap-3 rounded-lg border border-amber-600/20 bg-card/50 p-3 transition-colors hover:border-aqua/30"
                    >
                      <Badge className={COMPAT_COLORS.caution}>
                        {COMPAT_LABELS.caution}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{p.species}</p>
                        <p className="text-xs text-muted-foreground">{note}</p>
                      </div>
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    </Link>
                    {targetProfile && (
                      <div className="pointer-events-none absolute bottom-full left-0 z-50 mb-2 hidden w-72 opacity-0 transition-opacity group-hover/row:opacity-100 lg:block">
                        <div className="rounded-lg border border-border bg-card p-3 shadow-xl shadow-black/30">
                          <p className="text-sm font-semibold">{p.species}</p>
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
                            {targetCare && (
                              <div>
                                <span className="text-muted-foreground">Size: </span>
                                <span className="font-medium">{targetCare.adultSize}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Incompatible */}
        {incompatibleMates.length > 0 && (
          <div className="mb-4">
            <h3 className="mb-2 text-sm font-semibold text-red-400">
              Incompatible ({incompatibleMates.length})
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {incompatibleMates.map(({ profile: p, note }) => {
                const targetCare = SPECIES_CARE[p.species];
                return (
                  <Link
                    key={p.species}
                    href={
                      targetCare
                        ? `/species/${targetCare.slug}`
                        : `/collections?q=${encodeURIComponent(p.species.toLowerCase())}`
                    }
                    className="flex items-start gap-3 rounded-lg border border-red-600/20 bg-card/50 p-3 transition-colors hover:border-aqua/30"
                  >
                    <Badge className={COMPAT_COLORS.incompatible}>
                      {COMPAT_LABELS.incompatible}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{p.species}</p>
                      <p className="text-xs text-muted-foreground">{note}</p>
                    </div>
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
