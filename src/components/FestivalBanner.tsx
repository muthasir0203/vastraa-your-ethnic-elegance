import { Link } from "react-router-dom";
import festivalDiwali from "@/assets/festival-diwali.jpg";

const FestivalBanner = () => (
  <section className="py-6 md:py-10">
    <div className="container">
      <Link to="/products?category=Festive+Collection" className="block relative rounded-2xl overflow-hidden aspect-[21/9] md:aspect-[21/7] shadow-elevated group">
        <img src={festivalDiwali} alt="Diwali Collection" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent flex items-center">
          <div className="pl-6 md:pl-12">
            <h2 className="font-heading text-2xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-1 md:mb-3">
              Diwali Collection
            </h2>
            <p className="text-primary-foreground/90 font-body text-sm md:text-base mb-3 md:mb-5">
              Celebrate in style — exclusive festive wear
            </p>
            <span className="inline-block bg-secondary text-secondary-foreground font-body font-semibold text-sm px-6 py-2 rounded-full">
              Shop Collection
            </span>
          </div>
        </div>
      </Link>
    </div>
  </section>
);

export default FestivalBanner;
