import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/shared/Reveal";

const CtaBanner = () => {
  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <Image
        src="/images/cta-pizza.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-ink/80" />

      <div className="relative mx-auto flex min-h-[420px] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-lg">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
              Hungry? Your next pizza is a few taps away
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-base text-white/80">
              Pick a restaurant, choose your delivery date, and let a local
              kitchen do the rest.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Link
              href="/menu"
              className="group mt-8 inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-secondary px-7 text-sm font-semibold text-secondary-foreground shadow-md shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary/90 hover:shadow-lg active:translate-y-0 active:scale-95"
            >
              Explore Pizza Menu
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;
