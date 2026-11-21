import Link from "next/link";

import MenuGrid from "@/components/menu/MenuGrid";
import EmptyState from "@/components/shared/EmptyState";
import Reveal from "@/components/shared/Reveal";
import SectionHeading from "@/components/shared/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import { getFeaturedItems } from "@/lib/api-server";
import { cn } from "@/lib/utils";

const FeaturedItems = async () => {
  const items = (await getFeaturedItems()).slice(0, 6);

  return (
    <section className="pb-16 pt-6 md:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Customer Favorites"
            title="Featured Menu Items"
            description="Hand-picked pizzas and sides from approved restaurants, ready to order."
          />
        </Reveal>

        {items.length > 0 ? (
          <MenuGrid items={items} />
        ) : (
          <EmptyState
            title="No featured items yet"
            description="Check back soon, or browse the full menu."
            actionLabel="Browse menu"
            actionHref="/menu"
          />
        )}

        <Reveal className="mt-10 flex justify-center">
          <Link
            href="/menu"
            className={cn(
              buttonVariants(),
              "h-10 rounded-full px-6 text-sm font-semibold",
            )}
          >
            View full menu
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default FeaturedItems;
