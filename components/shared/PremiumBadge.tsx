import { Badge } from "@/components/ui/badge";

export default function PremiumBadge({ className }: { className?: string }) {
  return (
    <Badge variant="secondary" className={className}>
      Premium
    </Badge>
  );
}
