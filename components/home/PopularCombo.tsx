import Link from "next/link";
import Reveal from "@/components/shared/Reveal";
import SectionHeading from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";

const combos = [
  {
    title: "Family Feast",
    text: "Two large pizzas, a side of garlic bread, and drinks for everyone at the table.",
    card: "bg-primary text-primary-foreground",
    button: "bg-secondary text-secondary-foreground",
  },
  {
    title: "Date Night",
    text: "One gourmet pizza, a shared appetizer, and a dessert to finish.",
    card: "bg-secondary text-secondary-foreground",
    button: "bg-primary text-primary-foreground",
  },
  {
    title: "Game Day Box",
    text: "A meat lovers pizza, wings, and sides built for a crowd.",
    card: "bg-accent text-accent-foreground",
    button: "bg-secondary text-secondary-foreground",
  },
];

const PopularCombos = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Better together"
            title="Popular Pizza Combos"
            description="Bundles that make sharing easy."
          />
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {combos.map((combo, index) => (
            <Reveal key={combo.title} delay={index * 0.1} className="h-full">
              <div
                className={cn(
                  "flex h-full min-h-56 flex-col rounded-xl p-6 shadow-md",
                  combo.card,
                )}
              >
                <h3 className="font-heading text-2xl font-bold">
                  {combo.title}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed opacity-90">
                  {combo.text}
                </p>
                <div className="mt-auto pt-6">
                  <Link
                    href="/menu"
                    className={cn(
                      "inline-flex h-9 items-center rounded-full px-5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-95",
                      combo.button,
                    )}
                  >
                    See combo
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCombos;
