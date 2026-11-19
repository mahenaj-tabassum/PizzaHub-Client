import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/shared/Reveal";
import HeroSearch from "@/components/home/HeroSearch";

const HeroBanner = () => {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-primary pb-32 pt-24 md:pb-36 md:pt-28">
      {/* Pizza image (right side) */}
      <div className="absolute inset-y-0 right-0 w-full md:w-[65%]">
        <Image
          src="/images/hero-pizza.png"
          alt="Freshly baked pizza with melted cheese"
          fill
          priority
          sizes="(min-width: 768px) 65vw, 100vw"
          className="object-cover opacity-30 md:opacity-100"
        />
        <div className="absolute inset-0 bg-linear-to-r from-primary via-primary/70 to-transparent md:via-primary/20" />
      </div>

      {/* Decorative dots */}
      <div
        aria-hidden="true"
        className="absolute left-4 top-24 hidden size-28 opacity-40 [background-image:radial-gradient(circle,#e0a458_1.5px,transparent_1.5px)] [background-size:14px_14px] md:block"
      />

      {/* Content */}
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-[600px]">
          <Reveal>
            <p className="mb-3 text-sm font-medium text-secondary">
              Fresh from local ovens
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="font-heading text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-[3.5rem]">
              Hot &amp; Fresh Pizza Delivered to Your Door
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mb-8 mt-5 max-w-md text-base text-white/80">
              Discover pizza shops near you, browse their menus, and place your
              order in a few taps.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <HeroSearch />
          </Reveal>

          <Reveal delay={0.4}>
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

export default HeroBanner;