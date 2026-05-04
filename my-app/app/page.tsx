import Image from "next/image";
import HeroSection from "./components/hero";
import CategoriesSection from "./components/Categoriessection";
import FeaturedStores from "./components/featuredStoresSection";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQsection";
import ShopCTA from "./components/ctaSection";
import Footer from "./components/layouts/footer";
export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <FeaturedStores />
      <Testimonials />
      <FAQ />
      <ShopCTA />
      <Footer />
    </div>
  );
}
