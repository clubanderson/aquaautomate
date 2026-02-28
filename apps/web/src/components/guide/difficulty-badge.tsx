import { Badge } from "@/components/ui/badge";

export type DifficultyLevel = "easy" | "intermediate" | "advanced";

const DIFFICULTY_CONFIG: Record<
  DifficultyLevel,
  { label: string; className: string }
> = {
  easy: {
    label: "Easy",
    className: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  intermediate: {
    label: "Intermediate",
    className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  advanced: {
    label: "Advanced",
    className: "bg-red-500/20 text-red-400 border-red-500/30",
  },
};

interface DifficultyBadgeProps {
  level: DifficultyLevel;
}

export function DifficultyBadge({ level }: DifficultyBadgeProps) {
  const config = DIFFICULTY_CONFIG[level];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
