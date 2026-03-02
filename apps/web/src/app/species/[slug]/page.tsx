import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Droplets,
  Fish,
  Heart,
  Ruler,
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
  CARE_SHEET_COMPAT_COUNT,
} from "@/lib/aquarium/species-care";
import { getCompatibleSpecies } from "@/lib/aquarium/match-species";
import type { Compatibility } from "@/lib/aquarium/tank-mates";
import { SITE_NAME } from "@/lib/constants";

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
    title: `${care.speciesName} Care Sheet | ${SITE_NAME}`,
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
  const compatibleMates = mates
    .filter((m) => m.compatibility === "compatible")
    .slice(0, CARE_SHEET_COMPAT_COUNT);
  const cautionMates = mates.filter((m) => m.compatibility === "caution");
  const incompatibleMates = mates.filter(
    (m) => m.compatibility === "incompatible"
  );

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

      {/* Compatibility */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-bold">Tank-Mate Compatibility</h2>

        {/* Compatible */}
        {compatibleMates.length > 0 && (
          <div className="mb-4">
            <h3 className="mb-2 text-sm font-semibold text-green-400">
              Compatible Species ({mates.filter((m) => m.compatibility === "compatible").length})
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {compatibleMates.map(({ profile: p, note }) => {
                const targetCare = SPECIES_CARE[p.species];
                return (
                  <Link
                    key={p.species}
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
                return (
                  <Link
                    key={p.species}
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

        <Link
          href={`/collections?q=${encodeURIComponent(care.speciesName.toLowerCase())}`}
          className="mt-4 inline-flex items-center gap-1 text-sm text-aqua hover:underline"
        >
          Shop {care.speciesName} in our store
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </section>
    </div>
  );
}
