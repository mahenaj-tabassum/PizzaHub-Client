import { MOCK_FEATURED_ITEMS } from "@/lib/mock-data";
import { MenuItem } from "@/types";
import React from "react";
import Reveal from "../shared/Reveal";
import SectionHeading from "../shared/SectionHeading";
import MenuGrid from "../menu/MenuGrid";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

const FeaturedItems = ({
  items = MOCK_FEATURED_ITEMS,
}: {
  items?: MenuItem[];
}) => {
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

        <MenuGrid items={items} />

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
