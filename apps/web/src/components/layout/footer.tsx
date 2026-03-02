import Link from "next/link";
import { Droplets } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

const FOOTER_LINKS = {
  Shop: [
    { label: "All Products", href: "/collections" },
    { label: "Compare Products", href: "/tools/compare" },
    { label: "Build Your Tank", href: "/tools/build-your-tank" },
    { label: "My Wishlist", href: "/wishlist" },
  ],
  Learn: [
    { label: "Species Care Sheets", href: "/species" },
    { label: "Blog", href: "/blog" },
    { label: "Guides", href: "/guides" },
    { label: "Tank Calculator", href: "/tools/tank-calculator" },
  ],
  Explore: [
    { label: "Automation", href: "/automation" },
    { label: "Live Aquarium Cams", href: "/live" },
    { label: "Tank Gallery", href: "/gallery" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-aqua" />
              <span className="font-bold">
                <span className="text-aqua">Aqua</span>
                <span className="text-foreground">Automate</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Where the aquarium hobby meets home automation. Shop fish, plants,
              and gear — then automate your tank with Home Assistant.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                {heading}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-aqua"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-border/50 pt-8 text-center text-xs text-muted-foreground">
          &copy; {currentYear} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
