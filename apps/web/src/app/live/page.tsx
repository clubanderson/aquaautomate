import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Radio } from "lucide-react";

export const metadata: Metadata = {
  title: "Live Aquarium Webcams",
  description:
    "Watch live aquarium webcams from Monterey Bay, Georgia Aquarium, National Aquarium, and more. Sharks, jellyfish, kelp forests, coral reefs — streaming 24/7.",
};

interface LiveFeed {
  /** YouTube video ID */
  videoId: string;
  /** Name of the exhibit/camera */
  title: string;
  /** Aquarium name */
  aquarium: string;
  /** Brief description of what you'll see */
  description: string;
  /** Whether this is a featured/priority feed */
  featured?: boolean;
  /** Badge label (e.g., "Sharks", "Jellyfish") */
  tag: string;
}

/**
 * Curated live aquarium webcam feeds.
 *
 * Note: YouTube live stream video IDs may change when streams restart.
 * These were verified as of March 2026.
 */
const LIVE_FEEDS: LiveFeed[] = [
  /* Monterey Bay Aquarium — the gold standard */
  {
    videoId: "tEtg5Kg3voQ",
    title: "Shark Cam",
    aquarium: "Monterey Bay Aquarium",
    description:
      "Sevengill sharks, leopard sharks, and spiny dogfish patrol the Open Sea exhibit.",
    featured: true,
    tag: "Sharks",
  },
  {
    videoId: "w3LjpFhySTg",
    title: "Kelp Forest Cam",
    aquarium: "Monterey Bay Aquarium",
    description:
      "Giant kelp sways with the current while leopard sharks, sardines, and garibaldi swim through.",
    featured: true,
    tag: "Kelp Forest",
  },
  {
    videoId: "NUnJc82ptd4",
    title: "Jelly Cam",
    aquarium: "Monterey Bay Aquarium",
    description:
      "Mesmerizing Pacific sea nettles drift in a circular tank. The most-watched aquarium cam on YouTube.",
    featured: true,
    tag: "Jellyfish",
  },
  {
    videoId: "nNTVZKz219U",
    title: "Open Sea Cam",
    aquarium: "Monterey Bay Aquarium",
    description:
      "Sharks, yellowfin tuna, sea turtles, and barracuda in the million-gallon Open Sea exhibit.",
    tag: "Open Sea",
  },
  {
    videoId: "IeWhbCe2Krk",
    title: "Moon Jelly Cam",
    aquarium: "Monterey Bay Aquarium",
    description:
      "Translucent moon jellies pulse gently under color-changing LED lights.",
    tag: "Jellyfish",
  },
  {
    videoId: "abbR-Ttd-cA",
    title: "Sea Otter Cam",
    aquarium: "Monterey Bay Aquarium",
    description:
      "Rescued southern sea otters play, groom, and nap in their outdoor habitat.",
    tag: "Otters",
  },
  {
    videoId: "dzmJXWmA2EM",
    title: "Spider Crab Cam",
    aquarium: "Monterey Bay Aquarium",
    description:
      "Giant Japanese spider crabs and other deep-sea creatures from the Into the Deep exhibit.",
    tag: "Deep Sea",
  },
  /* Georgia Aquarium */
  {
    videoId: "8WTFWvePutc",
    title: "Ocean Voyager",
    aquarium: "Georgia Aquarium",
    description:
      "Whale sharks, manta rays, and thousands of fish in the 6.3 million gallon Ocean Voyager exhibit — the largest in the Western hemisphere.",
    featured: true,
    tag: "Whale Sharks",
  },
  {
    videoId: "tsF00NVCjAQ",
    title: "Jellies Exhibit",
    aquarium: "Georgia Aquarium",
    description:
      "Colorful jellyfish float in backlit displays at the Georgia Aquarium.",
    tag: "Jellyfish",
  },
  /* National Aquarium Baltimore */
  {
    videoId: "_5zWp0bMgcI",
    title: "Blacktip Reef",
    aquarium: "National Aquarium",
    description:
      "Blacktip reef sharks, rays, and tropical fish in Baltimore's stunning reef exhibit.",
    tag: "Reef Sharks",
  },
  /* Aquarium of the Pacific */
  {
    videoId: "DHUnz4dyb54",
    title: "Tropical Reef Camera",
    aquarium: "Aquarium of the Pacific",
    description:
      "Colorful tropical reef fish, corals, and invertebrates from the Indo-Pacific.",
    tag: "Tropical Reef",
  },
  {
    videoId: "BLvr4K2eiRE",
    title: "Shark Lagoon Cam",
    aquarium: "Aquarium of the Pacific",
    description:
      "Nurse sharks, zebra sharks, and rays glide through the Shark Lagoon touch pool.",
    tag: "Sharks",
  },
  {
    videoId: "ObR7SBKrkXc",
    title: "Sea Nettle Jellyfish",
    aquarium: "Aquarium of the Pacific",
    description:
      "Graceful Pacific sea nettles drift under dramatic lighting.",
    tag: "Jellyfish",
  },
  {
    videoId: "yuhnCtTPtZo",
    title: "Blue Cavern Cam",
    aquarium: "Aquarium of the Pacific",
    description:
      "Kelp forest exhibit recreating the underwater world around Catalina Island, California.",
    tag: "Kelp Forest",
  },
  /* Seattle Aquarium */
  {
    videoId: "NqOmHpwMUxs",
    title: "Sea Otter Cam",
    aquarium: "Seattle Aquarium",
    description:
      "Pacific sea otters and fur seals play in the Seattle Aquarium's marine mammal exhibit.",
    tag: "Otters",
  },
  /* Coral City Camera */
  {
    videoId: "7i8ARjIeM2k",
    title: "Miami Underwater Reef",
    aquarium: "Coral City Camera",
    description:
      "Live underwater view of an urban coral reef in Miami, Florida. Watch wild fish, octopus, and marine life 24/7.",
    tag: "Wild Reef",
  },
  /* Explore.org Honduras */
  {
    videoId: "1zcIUk66HX4",
    title: "Utopia Reef — Wall View",
    aquarium: "Utopia Village, Honduras",
    description:
      "Live view from the top of a coral wall in the Caribbean. Wild reef fish, turtles, and occasional sharks.",
    tag: "Wild Reef",
  },
];

/** Number of featured feeds shown larger at the top */
const FEATURED_COUNT = 4;

export default function LiveFeedsPage() {
  const featured = LIVE_FEEDS.filter((f) => f.featured).slice(
    0,
    FEATURED_COUNT
  );
  const rest = LIVE_FEEDS.filter((f) => !featured.includes(f));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 max-w-2xl">
        <div className="mb-3 flex items-center gap-2">
          <Radio className="h-5 w-5 text-red-500" />
          <Badge variant="outline" className="border-red-500/30 text-red-400">
            Live
          </Badge>
        </div>
        <h1 className="text-3xl font-bold sm:text-4xl">
          Live <span className="text-aqua">Aquarium</span> Webcams
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Watch sharks, jellyfish, kelp forests, and coral reefs from the
          world&apos;s best aquariums — streaming live 24/7. Perfect for
          relaxation, inspiration, or just watching fish.
        </p>
      </div>

      {/* Featured feeds — larger */}
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {featured.map((feed) => (
          <div
            key={feed.videoId}
            className="overflow-hidden rounded-lg border border-border/50 bg-card/50"
          >
            <div className="relative aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${feed.videoId}?autoplay=0&mute=1`}
                title={`${feed.title} — ${feed.aquarium}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px]">
                  {feed.tag}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {feed.aquarium}
                </span>
              </div>
              <h2 className="text-lg font-semibold">{feed.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {feed.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* All other feeds — smaller grid */}
      <h2 className="mb-4 text-xl font-bold">More Live Feeds</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((feed) => (
          <div
            key={feed.videoId}
            className="overflow-hidden rounded-lg border border-border/50 bg-card/50"
          >
            <div className="relative aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${feed.videoId}?autoplay=0&mute=1`}
                title={`${feed.title} — ${feed.aquarium}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
                loading="lazy"
              />
            </div>
            <div className="p-3">
              <div className="mb-1.5 flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px]">
                  {feed.tag}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {feed.aquarium}
                </span>
              </div>
              <h3 className="text-sm font-semibold">{feed.title}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {feed.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-8 rounded-lg border border-border/50 bg-card/30 p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Streams are provided by the aquariums and their partners via YouTube.
          Some feeds may be offline during maintenance or after hours.
        </p>
        <a
          href="https://www.youtube.com/results?search_query=aquarium+live+cam"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-sm text-aqua hover:underline"
        >
          Find more live aquarium streams on YouTube
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
