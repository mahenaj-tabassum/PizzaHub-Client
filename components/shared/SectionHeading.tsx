import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  light?: boolean;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  light,
}: Props) {
  return (
    <div className="mb-10 max-w-2xl text-left">
      {eyebrow && (
        <p
          className={cn(
            "mb-2 text-xs font-medium",
            light ? "text-secondary" : "text-primary",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-heading text-3xl font-bold md:text-4xl",
          light ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-3 text-sm md:text-base",
            light ? "text-white/70" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
