import { Badge } from "@/components/ui/badge";
import type { ProductSource } from "@/lib/commerce/types";

const SOURCE_CONFIG: Record<
  ProductSource,
  { label: string; className: string }
> = {
  shopify: {
    label: "Local Shop",
    className: "bg-aqua/20 text-aqua border-aqua/30",
  },
  amazon: {
    label: "Amazon",
    className: "bg-coral/20 text-coral border-coral/30",
  },
};

interface SourceBadgeProps {
  source: ProductSource;
  vendorLabel?: string;
}

export function SourceBadge({ source, vendorLabel }: SourceBadgeProps) {
  const config = SOURCE_CONFIG[source];
  return (
    <Badge variant="outline" className={config.className}>
      {vendorLabel ?? config.label}
    </Badge>
  );
}
