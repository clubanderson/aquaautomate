import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/guide/difficulty-badge";
import { getAllGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guides & Automation Blueprints",
  description:
    "Step-by-step aquarium automation guides with copy-paste Home Assistant configs, species care guides, and getting started tutorials.",
};

export default function GuidesPage() {
  const guides = getAllGuides();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Guides & Blueprints</h1>
        <p className="mt-2 text-muted-foreground">
          Step-by-step automation guides with copy-paste Home Assistant
          configs, species care, and getting started tutorials.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group rounded-lg border border-border/50 bg-card/50 p-6 transition-all hover:border-aqua/30 hover:shadow-lg hover:shadow-aqua/5"
          >
            <div className="mb-3 flex items-center gap-2">
              <Badge
                variant="outline"
                className="capitalize text-muted-foreground"
              >
                {guide.category}
              </Badge>
              <DifficultyBadge level={guide.difficulty} />
            </div>

            <h2 className="text-lg font-semibold group-hover:text-aqua">
              {guide.title}
            </h2>

            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
              {guide.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-1">
              {(guide.tags || []).slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-[10px] capitalize"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {guides.length === 0 && (
        <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-border p-8 text-muted-foreground">
          No guides yet. Check back soon!
        </div>
      )}
    </div>
  );
}
