import Link from "next/link";
import Reveal from "@/components/shared/Reveal";
import CategoryImage from "@/components/home/CategoryImage";
import { CATEGORIES } from "@/lib/constants";

const CategoriesSection = () => {
  return (
    <section className="relative z-10 -mt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.06} className="h-full">
              <Link
                href={`/menu?category=${c.slug}`}
                className="group flex h-full min-h-40 flex-col items-center justify-center gap-4 rounded-xl bg-card px-3 py-6 text-center shadow-lg shadow-black/10 ring-1 ring-foreground/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <CategoryImage slug={c.slug} alt={c.label} />
                <span className="text-sm font-medium leading-snug text-card-foreground">
                  {c.label}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
