import Link from "next/link";

import Reveal from "@/components/shared/Reveal";
import CategoryImage from "@/components/home/CategoryImage";
import { CATEGORIES } from "@/lib/constants";

export default function CategoriesSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <Reveal>
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Explore Our Menu
            </p>

            <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
              Explore Pizza Categories
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Find your favorite pizza from our delicious selection of
              categories.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c, index) => (
            <Reveal key={c.slug} delay={index * 0.05}>
              <Link
                href={`/menu?category=${c.slug}`}
                className="group flex h-full flex-col items-center overflow-hidden rounded-xl border bg-card p-3 text-center transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                  <CategoryImage slug={c.slug} alt={c.label} />
                </div>

                <h3 className="mt-3 font-semibold transition-colors group-hover:text-primary">
                  {c.label}
                </h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
