import Reveal from "@/components/shared/Reveal";
import SectionHeading from "@/components/shared/SectionHeading";

const steps = [
  {
    title: "Browse",
    text: "Search by name, category, or location to find a pizza you love.",
  },
  {
    title: "Choose",
    text: "Open the item page to see photos, description, price, and the restaurant.",
  },
  {
    title: "Order",
    text: "Enter your delivery date and address, then send your order.",
  },
  {
    title: "Track",
    text: "Watch the status update as the restaurant accepts your order.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-ink py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            light
            eyebrow="Simple steps"
            title="How PizzaHub Works"
            description="From craving to doorstep in four steps."
          />
        </Reveal>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <div className="flex flex-col items-center text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-secondary font-heading text-xl font-bold text-ink">
                  {i + 1}
                </span>
                <h3 className="mt-5 font-heading text-lg font-semibold text-white">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-60 text-sm leading-relaxed text-white/70">
                  {s.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
