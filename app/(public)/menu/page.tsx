import { Suspense } from "react";
import type { Metadata } from "next";

import MenuFilters from "@/components/menu/MenuFilters";
import MenuResults from "@/components/menu/MenuResults";
import { MenuResultsSkeleton } from "@/components/menu/MenuCardSkeleton";
import { getLocations } from "@/lib/api-server";

export const metadata: Metadata = {
  title: "Browse Menu",
  description:
    "Search approved pizzas, sides, and drinks from local restaurants.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function MenuPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const get = (key: string) =>
    typeof sp[key] === "string" ? (sp[key] as string) : undefined;

  const filters = {
    q: get("q"),
    category: get("category"),
    location: get("location"),
    sort: get("sort"),
    page: get("page"),
  };

  const locations = await getLocations();

  return (
    <>
      <section className="bg-primary pb-28 pt-28 md:pb-32 md:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-bold text-white md:text-5xl">
            Browse Menu
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/80">
            Search approved pizzas, sides, and drinks from local restaurants,
            then order your favorite.
          </p>
        </div>
      </section>

      <div className="mx-auto -mt-16 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <Suspense>
          <MenuFilters locations={locations} />
        </Suspense>

        <Suspense
          key={JSON.stringify(filters)}
          fallback={<MenuResultsSkeleton />}
        >
          <MenuResults filters={filters} />
        </Suspense>
      </div>
    </>
  );
}
