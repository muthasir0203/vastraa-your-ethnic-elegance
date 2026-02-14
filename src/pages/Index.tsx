import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import FeaturedCategories from "@/components/FeaturedCategories";
import TrendingProducts from "@/components/TrendingProducts";
import FestivalBanner from "@/components/FestivalBanner";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main>
      <HeroBanner />
      <FeaturedCategories />
      <TrendingProducts />
      <FestivalBanner />
      <TrustSection />
    </main>
    <Footer />
  </div>
);

export default Index;
