import { cn } from "@/lib/utils";

const TONES = {
  success: "bg-accent/15 text-accent",
  warning: "bg-secondary/30 text-[#7a5200] dark:text-secondary",
  danger: "bg-destructive/10 text-destructive",
  muted: "bg-muted text-muted-foreground",
  honey: "bg-secondary text-secondary-foreground",
} as const;

export type PillTone = keyof typeof TONES;

export default function Pill({
  tone = "muted",
  className,
  children,
}: {
  tone?: PillTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center whitespace-nowrap rounded-full px-3 text-xs font-medium capitalize",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
