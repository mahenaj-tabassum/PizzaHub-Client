import HeroBanner from "@/components/home/HeroBanner";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedItems from "@/components/home/FeaturedItems";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import HowItWorks from "@/components/home/HowItWorks";
import PopularCombos from "@/components/home/PopularCombo";
import Testimonials from "@/components/home/Testimonials";
import CtaBanner from "@/components/home/CTABanner";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <CategoriesSection />
      <FeaturedItems />
      <WhyChooseUs />
      <HowItWorks />
      <PopularCombos />
      <Testimonials />
      <CtaBanner />
    </>
  );
}
