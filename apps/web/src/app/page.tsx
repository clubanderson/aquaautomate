import Link from "next/link";
import { ArrowRight, Droplets, Cpu, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductGrid } from "@/components/product-grid";
import { DEMO_PRODUCTS, DEMO_COLLECTIONS } from "@/lib/commerce/demo-data";
import { getAllGuides } from "@/lib/guides";

/** Number of featured products to show on the homepage */
const FEATURED_PRODUCT_COUNT = 4;
/** Number of guides to show on the homepage */
const FEATURED_GUIDE_COUNT = 3;

export default function HomePage() {
  const guides = getAllGuides().slice(0, FEATURED_GUIDE_COUNT);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-blue via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="max-w-2xl space-y-6">
            <Badge variant="outline" className="border-aqua/30 text-aqua">
              Aquarium + Home Automation
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-aqua">Automate</span> your aquarium.
              <br />
              <span className="text-coral">Enjoy</span> your fish.
            </h1>

            <p className="text-lg text-muted-foreground">
              Shop fish, plants, and equipment from local shops — then automate
              your tank with Home Assistant. Copy-paste configs, step-by-step
              guides, and shoppable blueprints.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-aqua text-deep-blue hover:bg-aqua-dim"
                asChild
              >
                <Link href="/collections">
                  Shop Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-coral/30 text-coral hover:bg-coral/10"
                asChild
              >
                <Link href="/guides">
                  Browse Guides
                  <BookOpen className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            {
              icon: Droplets,
              title: "Fish & Plants",
              description:
                "Quality livestock and plants from Danbury Aquarium, shipped to your door.",
              color: "text-aqua",
            },
            {
              icon: Cpu,
              title: "Smart Automation",
              description:
                "Tuya plugs, Lutron remotes, and Home Assistant configs — all tested and documented.",
              color: "text-coral",
            },
            {
              icon: BookOpen,
              title: "Copy-Paste Guides",
              description:
                "Step-by-step blueprints with real YAML configs you can paste directly into Home Assistant.",
              color: "text-aqua",
            },
          ].map((prop) => (
            <div
              key={prop.title}
              className="space-y-3 rounded-lg border border-border/50 bg-card/50 p-6"
            >
              <prop.icon className={`h-8 w-8 ${prop.color}`} />
              <h3 className="text-lg font-semibold">{prop.title}</h3>
              <p className="text-sm text-muted-foreground">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Button variant="ghost" className="text-aqua" asChild>
            <Link href="/collections">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <ProductGrid
          products={DEMO_PRODUCTS.slice(0, FEATURED_PRODUCT_COUNT)}
        />
      </section>

      {/* Collections */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold">Shop by Category</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DEMO_COLLECTIONS.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.handle}`}
              className="group rounded-lg border border-border/50 bg-card/50 p-6 transition-all hover:border-aqua/30 hover:shadow-lg hover:shadow-aqua/5"
            >
              <h3 className="text-lg font-semibold group-hover:text-aqua">
                {col.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {col.description}
              </p>
              <span className="mt-3 inline-flex items-center text-sm text-aqua">
                Browse
                <ArrowRight className="ml-1 h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Guides */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Latest Guides</h2>
          <Button variant="ghost" className="text-aqua" asChild>
            <Link href="/guides">
              All guides
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group rounded-lg border border-border/50 bg-card/50 p-6 transition-all hover:border-aqua/30"
            >
              <Badge
                variant="outline"
                className="mb-3 capitalize text-muted-foreground"
              >
                {guide.category}
              </Badge>
              <h3 className="text-lg font-semibold group-hover:text-aqua">
                {guide.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {guide.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
