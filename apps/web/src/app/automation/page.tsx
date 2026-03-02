import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Cpu,
  Thermometer,
  Lightbulb,
  Droplets,
  Zap,
  Fish,
  Waves,
  Timer,
  LayoutDashboard,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DifficultyBadge } from "@/components/guide/difficulty-badge";
import { getGuidesByCategory } from "@/lib/guides";
import { AMAZON_PRODUCTS } from "@/lib/commerce/amazon-catalog";

export const metadata: Metadata = {
  title: "Aquarium Automation with Home Assistant",
  description:
    "Automate your aquarium with Home Assistant — temperature monitoring, automated water changes, smart feeding, scene control, and energy management. Real YAML configs you can copy-paste.",
};

/** Number of equipment products to show */
const EQUIPMENT_DISPLAY_COUNT = 8;

/** Architecture diagram nodes */
const ARCHITECTURE_NODES = [
  {
    label: "Home Assistant",
    description: "Raspberry Pi or Proxmox LXC",
    icon: Cpu,
    color: "text-aqua",
    borderColor: "border-aqua/30",
  },
  {
    label: "Tuya Integration",
    description: "Smart plugs & power strips",
    icon: Zap,
    color: "text-coral",
    borderColor: "border-coral/30",
  },
  {
    label: "Shelly Integration",
    description: "Power monitoring plugs",
    icon: Zap,
    color: "text-coral",
    borderColor: "border-coral/30",
  },
  {
    label: "Lutron Caseta",
    description: "Pico scene remotes",
    icon: Lightbulb,
    color: "text-coral",
    borderColor: "border-coral/30",
  },
] as const;

/** Devices controlled by the system */
const CONTROLLED_DEVICES = [
  { label: "Heaters", icon: Thermometer },
  { label: "Lights", icon: Lightbulb },
  { label: "Filters", icon: Waves },
  { label: "Air Pumps", icon: Droplets },
  { label: "Auto Feeder", icon: Fish },
  { label: "AWC Pumps", icon: Droplets },
  { label: "UV Sterilizer", icon: Zap },
  { label: "Salt Station", icon: Waves },
] as const;

/** Daily automation schedule */
const DAILY_SCHEDULE = [
  { time: "6:30 AM", event: "Lights on (sunrise + 30 min)", icon: Lightbulb },
  { time: "7:00 AM", event: "Morning feed (auto feeder)", icon: Fish },
  { time: "6:00 PM", event: "Evening feed", icon: Fish },
  { time: "Sunset", event: "Lights off", icon: Lightbulb },
  { time: "10:00 PM", event: "Night mode (Pico remote)", icon: Timer },
  { time: "Sun 2 AM", event: "Weekly AWC (20% water change)", icon: Waves },
  { time: "Sat 2 AM", event: "Salt mixing station starts", icon: Droplets },
] as const;

export default function AutomationPage() {
  const guides = getGuidesByCategory("automation");
  const equipment = AMAZON_PRODUCTS.filter(
    (p) => p.automationCompatible
  ).slice(0, EQUIPMENT_DISPLAY_COUNT);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-blue via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="max-w-2xl space-y-6">
            <Badge variant="outline" className="border-aqua/30 text-aqua">
              Home Assistant + Aquarium
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-aqua">Automate</span> every aspect of
              <br />
              your aquarium.
            </h1>

            <p className="text-lg text-muted-foreground">
              Home Assistant controls my lights, heaters, pumps, feeders, water
              changes, and salt mixing station. Every automation runs real YAML
              configs you can copy-paste into your own setup.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-aqua text-deep-blue hover:bg-aqua-dim"
                asChild
              >
                <Link href="/guides/ha-getting-started">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-coral/30 text-coral hover:bg-coral/10"
                asChild
              >
                <Link href="#guides">
                  Browse Guides
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-2 text-2xl font-bold">System Architecture</h2>
        <p className="mb-8 text-muted-foreground">
          Home Assistant is the hub. Tuya, Shelly, and Lutron integrations
          connect to every device on the tank.
        </p>

        {/* Hub + Integrations */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ARCHITECTURE_NODES.map((node) => (
            <div
              key={node.label}
              className={`flex items-start gap-3 rounded-lg border ${node.borderColor} bg-card/50 p-4`}
            >
              <node.icon className={`mt-0.5 h-6 w-6 shrink-0 ${node.color}`} />
              <div>
                <h3 className="font-semibold">{node.label}</h3>
                <p className="text-sm text-muted-foreground">
                  {node.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Arrow */}
        <div className="my-4 flex justify-center">
          <div className="flex flex-col items-center text-muted-foreground">
            <div className="h-6 w-px bg-border" />
            <ArrowRight className="h-4 w-4 rotate-90" />
            <span className="mt-1 text-xs">Controls</span>
          </div>
        </div>

        {/* Devices */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {CONTROLLED_DEVICES.map((device) => (
            <div
              key={device.label}
              className="flex flex-col items-center gap-2 rounded-lg border border-border/50 bg-card/30 p-3 text-center"
            >
              <device.icon className="h-5 w-5 text-aqua" />
              <span className="text-xs font-medium">{device.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Equipment Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Automation Equipment</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The smart plugs, controllers, and sensors I use. All Home
              Assistant compatible.
            </p>
          </div>
          <Button variant="ghost" className="text-aqua" asChild>
            <Link href="/collections?cat=AQUARIUM+CONTROLS,AWC+SYSTEM,AUTO+FEEDER">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {equipment.map((product) => (
            <a
              key={product.id}
              href={product.externalUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-lg border border-border/50 bg-card/50 p-4 transition-all hover:border-aqua/30 hover:shadow-lg hover:shadow-aqua/5"
            >
              {product.featuredImage && (
                <div className="mb-3 flex h-32 items-center justify-center overflow-hidden rounded-md bg-white/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText ?? product.title}
                    className="h-full w-auto object-contain"
                  />
                </div>
              )}
              <h3 className="line-clamp-2 text-sm font-semibold group-hover:text-aqua">
                {product.title}
              </h3>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-medium text-aqua">
                  ${product.price.amount}
                </span>
                <Badge variant="secondary" className="text-[10px]">
                  Amazon
                </Badge>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Automation Guides */}
      <section
        id="guides"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Automation Guides</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Step-by-step guides with real YAML configs. Copy-paste into your
              Home Assistant.
            </p>
          </div>
          <Button variant="ghost" className="text-aqua" asChild>
            <Link href="/guides?category=automation">
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
              className="group rounded-lg border border-border/50 bg-card/50 p-6 transition-all hover:border-aqua/30 hover:shadow-lg hover:shadow-aqua/5"
            >
              <div className="mb-3 flex items-center gap-2">
                <DifficultyBadge level={guide.difficulty} />
              </div>
              <h3 className="text-lg font-semibold group-hover:text-aqua">
                {guide.title}
              </h3>
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
      </section>

      {/* My Setup / Daily Schedule */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-2 text-2xl font-bold">My Daily Schedule</h2>
        <p className="mb-6 text-muted-foreground">
          Everything runs automatically. Here&apos;s what a typical week looks
          like on my 75-gallon freshwater tank.
        </p>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Schedule timeline */}
          <div className="space-y-3">
            {DAILY_SCHEDULE.map((item) => (
              <div
                key={item.event}
                className="flex items-center gap-4 rounded-lg border border-border/50 bg-card/30 px-4 py-3"
              >
                <item.icon className="h-4 w-4 shrink-0 text-aqua" />
                <span className="w-20 shrink-0 text-sm font-mono text-muted-foreground">
                  {item.time}
                </span>
                <span className="text-sm">{item.event}</span>
              </div>
            ))}
          </div>

          {/* Setup summary */}
          <div className="space-y-4 rounded-lg border border-aqua/20 bg-card/50 p-6">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-aqua" />
              <h3 className="text-lg font-semibold">My Setup</h3>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Tank:</span> 75
                gallon freshwater community
              </p>
              <p>
                <span className="font-medium text-foreground">Hub:</span> Home
                Assistant on Proxmox LXC
              </p>
              <p>
                <span className="font-medium text-foreground">Power:</span> 1x
                Tuya 4-outlet strip + 2x Shelly Plus Plug S (heater + filter)
              </p>
              <p>
                <span className="font-medium text-foreground">Scenes:</span>{" "}
                Lutron Pico 5-button remote — Day, Night, Feed, Movie,
                Maintenance
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Temperature:
                </span>{" "}
                Inkbird ITC-306A WiFi controller + backup heater on separate
                Tuya plug
              </p>
              <p>
                <span className="font-medium text-foreground">Feeding:</span>{" "}
                Eheim auto feeder on Tuya plug — 2x daily, vacation mode with
                randomized times
              </p>
              <p>
                <span className="font-medium text-foreground">AWC:</span>{" "}
                Kamoer dosing pumps, PEX plumbing, weekly 20% change every
                Sunday at 2 AM
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Dashboard:
                </span>{" "}
                Lovelace with temp gauge, energy graph, scene buttons, and
                mobile view
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-aqua/30 text-aqua hover:bg-aqua/10"
              asChild
            >
              <Link href="/guides/ha-getting-started">
                Build your own setup
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-aqua/20 bg-gradient-to-r from-deep-blue to-background p-8 text-center sm:p-12">
          <LayoutDashboard className="mx-auto mb-4 h-10 w-10 text-aqua" />
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to automate?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Start with the getting started guide. You&apos;ll have your first
            automation running in 30 minutes.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="bg-aqua text-deep-blue hover:bg-aqua-dim"
              asChild
            >
              <Link href="/guides/ha-getting-started">
                Get Started Guide
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-coral/30 text-coral hover:bg-coral/10"
              asChild
            >
              <Link href="/collections?cat=AQUARIUM+CONTROLS">
                Shop Equipment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
