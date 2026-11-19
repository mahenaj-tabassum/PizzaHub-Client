import { Clock, ShieldCheck, Store, Truck } from "lucide-react";
import Reveal from "@/components/shared/Reveal";
import SectionHeading from "@/components/shared/SectionHeading";

const features = [
  {
    icon: Store,
    title: "Local pizza shops",
    text: "Browse menus from restaurants in your own area, all in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Reviewed menus",
    text: "Every item is checked by our admins before it appears on the menu.",
  },
  {
    icon: Clock,
    title: "Live order status",
    text: "Follow your order from pending to accepted, right from your dashboard.",
  },
  {
    icon: Truck,
    title: "Delivery on your date",
    text: "Pick the delivery date and address that suit you, and add notes for the kitchen.",
  },
];
const WhyChooseUs = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Why us"
            title="Why Choose PizzaHub?"
            description="One platform for the best local pizza, built to be simple for customers and fair for restaurants."
          />
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.08} className="h-full">
              <div className="h-full rounded-xl bg-card p-6 shadow-sm ring-1 ring-foreground/10">
                <span className="flex size-10 items-center justify-center rounded-lg bg-secondary/25 text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 font-heading text-lg font-semibold">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section> 
  );
};

export default WhyChooseUs;
