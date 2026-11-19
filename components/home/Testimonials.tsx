import { Star } from "lucide-react";
import Reveal from "@/components/shared/Reveal";
import SectionHeading from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";

const reviews = [
  {
    quote:
      "Found a new favorite shop in minutes. The order form was quick and my pizza showed up on the day I picked.",
    name: "Ayesha R.",
    role: "customer",
    initials: "AR",
    rating: 5,
  },
  {
    quote:
      "Managing orders from the vendor dashboard is easy. Accepting or rejecting takes one click.",
    name: "Karim H.",
    role: "restaurant owner",
    initials: "KH",
    rating: 5,
  },
  {
    quote:
      "I like that every menu item is reviewed first, so what I see is what I get.",
    name: "Nusrat S.",
    role: "customer",
    initials: "NS",
    rating: 4,
  },
];

const Testimonials = () => {
  return (
    <section className="pb-16 md:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Kind words"
            title="What Pizza Lovers Say"
            description="What customers and restaurant owners like about PizzaHub."
          />
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.1} className="h-full">
              <figure className="flex h-full flex-col rounded-xl bg-card p-6 shadow-sm ring-1 ring-foreground/10">
                <div
                  className="flex gap-0.5"
                  aria-label={`${r.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className={cn(
                        "size-4",
                        s < r.rating
                          ? "fill-secondary text-secondary"
                          : "text-muted-foreground/40",
                      )}
                    />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed">
                  {r.quote}
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {r.initials}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {r.name}, {r.role}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
