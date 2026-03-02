import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Tank Showcase Gallery",
  description:
    "Beautiful aquarium setups for inspiration. Browse freshwater, saltwater, and planted tank designs with equipment details.",
};

/** Tank showcase entry */
interface TankShowcase {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tankSize: string;
  type: "freshwater" | "saltwater" | "planted" | "reef";
  fish: string[];
  equipment: string[];
  submittedBy: string;
}

/** Curated gallery of tank setups */
const GALLERY: TankShowcase[] = [
  {
    id: "community-55",
    title: "55-Gallon Community Paradise",
    description:
      "A lush planted community tank with a mix of tetras, corydoras, and a centerpiece angelfish pair. Uses a canister filter and CO2 injection for plant growth.",
    imageUrl: "https://images.unsplash.com/photo-1520301255226-bf5f144451c1?w=800&h=600&fit=crop",
    tankSize: "55 gal",
    type: "freshwater",
    fish: ["Neon Tetra", "Angelfish", "Corydoras", "Cherry Barb"],
    equipment: ["Fluval 307 Canister", "Fluval Plant 3.0 LED", "CO2 Art Regulator"],
    submittedBy: "AquaAutomate",
  },
  {
    id: "betta-10",
    title: "Zen Betta Palace",
    description:
      "A serene 10-gallon planted tank designed for a single betta. Features driftwood, java fern, anubias, and a gentle sponge filter.",
    imageUrl: "https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=800&h=600&fit=crop",
    tankSize: "10 gal",
    type: "planted",
    fish: ["Betta"],
    equipment: ["Sponge Filter", "Preset Heater", "Finnex Planted+ 24/7"],
    submittedBy: "AquaAutomate",
  },
  {
    id: "reef-75",
    title: "75-Gallon Mixed Reef",
    description:
      "A vibrant mixed reef with SPS, LPS, and soft corals. Running on a sump with protein skimmer, auto top-off, and Radion lighting.",
    imageUrl: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800&h=600&fit=crop",
    tankSize: "75 gal",
    type: "reef",
    fish: ["Clownfish", "Royal Gramma", "Firefish"],
    equipment: ["Reef Octopus Skimmer", "Radion XR30", "AutoAqua ATO"],
    submittedBy: "AquaAutomate",
  },
  {
    id: "african-40",
    title: "Lake Malawi Cichlid Tank",
    description:
      "A rocky hardscape built for Mbuna cichlids. Stacked limestone creates caves and territories. High-flow canister filter handles the bioload.",
    imageUrl: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800&h=600&fit=crop",
    tankSize: "40 gal",
    type: "freshwater",
    fish: ["Yellow Lab", "Red Zebra", "Acei Cichlid"],
    equipment: ["Fluval FX4", "Nicrew SkyLED", "Crushed Coral Substrate"],
    submittedBy: "AquaAutomate",
  },
  {
    id: "nano-planted-5",
    title: "5-Gallon Iwagumi",
    description:
      "A minimalist Iwagumi-style nano tank with Seiryu stone, dwarf hairgrass carpet, and a small school of chili rasboras.",
    imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop",
    tankSize: "5 gal",
    type: "planted",
    fish: ["Chili Rasbora"],
    equipment: ["Aquaclear 20", "Twinstar 300E", "Pressurized CO2"],
    submittedBy: "AquaAutomate",
  },
  {
    id: "saltwater-125",
    title: "125-Gallon Predator Tank",
    description:
      "A FOWLR (fish-only with live rock) tank housing a snowflake eel, lionfish, and porcupine puffer. Massive sump and heavy skimming.",
    imageUrl: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=800&h=600&fit=crop",
    tankSize: "125 gal",
    type: "saltwater",
    fish: ["Snowflake Eel", "Lionfish", "Porcupine Puffer"],
    equipment: ["Reef Octopus 200INT", "Kessil AP700", "40-Gal Sump"],
    submittedBy: "AquaAutomate",
  },
];

const TYPE_COLORS: Record<string, string> = {
  freshwater: "bg-blue-600/20 text-blue-400",
  saltwater: "bg-cyan-600/20 text-cyan-400",
  planted: "bg-green-600/20 text-green-400",
  reef: "bg-purple-600/20 text-purple-400",
};

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Tank <span className="text-aqua">Showcase</span>
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Get inspired by beautiful aquarium setups. Each build includes fish
          species, equipment lists, and tank details.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {GALLERY.map((tank) => (
          <div
            key={tank.id}
            className="group overflow-hidden rounded-xl border border-border/50 bg-card/50 transition-colors hover:border-aqua/30"
          >
            {/* Image */}
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={tank.imageUrl}
                alt={tank.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute right-2 top-2">
                <Badge className={TYPE_COLORS[tank.type] || ""}>
                  {tank.type}
                </Badge>
              </div>
              <div className="absolute bottom-2 left-2">
                <Badge variant="secondary" className="bg-black/60 text-white">
                  {tank.tankSize}
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h2 className="text-lg font-semibold">{tank.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {tank.description}
              </p>

              {/* Fish */}
              <div className="mt-3">
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Fish
                </p>
                <div className="flex flex-wrap gap-1">
                  {tank.fish.map((f) => (
                    <Badge key={f} variant="secondary" className="text-[10px]">
                      {f}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Equipment */}
              <div className="mt-3">
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Equipment
                </p>
                <div className="flex flex-wrap gap-1">
                  {tank.equipment.map((e) => (
                    <Badge
                      key={e}
                      variant="outline"
                      className="border-border/50 text-[10px]"
                    >
                      {e}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Build CTA */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  by {tank.submittedBy}
                </span>
                <Link
                  href="/tools/build-your-tank"
                  className="text-xs font-medium text-aqua hover:underline"
                >
                  Build similar &rarr;
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
