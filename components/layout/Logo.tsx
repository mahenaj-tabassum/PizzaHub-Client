import { Pizza } from "lucide-react";
import Link from "next/link";

const Logo = ({ light = true }: { light?: boolean }) => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-primary">
        <Pizza className="size-4" />
      </span>
      <span
        className={`font-heading text-xl font-bold ${light ? "text-white" : "text-foreground"}`}
      >
        PizzaHub
      </span>
    </Link>
  );
};

export default Logo;
