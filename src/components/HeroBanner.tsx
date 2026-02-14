import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroWedding from "@/assets/hero-wedding.jpg";
import heroFestive from "@/assets/hero-festive.jpg";

const slides = [
  {
    image: heroWedding,
    title: "Wedding Collection",
    subtitle: "Exquisite bridal sarees & lehengas",
    cta: "Shop Now",
    link: "/products?category=Wedding+Collection",
  },
  {
    image: heroFestive,
    title: "Festive Sale",
    subtitle: "Up to 70% off on ethnic wear",
    cta: "Explore Deals",
    link: "/products?category=Festive+Collection",
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full aspect-[16/7] md:aspect-[16/6] overflow-hidden bg-muted">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <img src={slides[current].image} alt={slides[current].title} className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="max-w-md"
              >
                <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-2 md:mb-4 leading-tight">
                  {slides[current].title}
                </h1>
                <p className="text-primary-foreground/90 text-sm md:text-lg font-body mb-4 md:mb-6">
                  {slides[current].subtitle}
                </p>
                <Link
                  to={slides[current].link}
                  className="inline-block bg-secondary text-secondary-foreground font-body font-semibold text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3 rounded-full hover:brightness-110 transition-all shadow-elevated"
                >
                  {slides[current].cta}
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Nav dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? "bg-secondary w-6" : "bg-primary-foreground/50"}`}
          />
        ))}
      </div>

      <button onClick={() => setCurrent((p) => (p - 1 + slides.length) % slides.length)} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/30 backdrop-blur-sm text-primary-foreground hover:bg-background/50 hidden md:block">
        <ChevronLeft size={20} />
      </button>
      <button onClick={() => setCurrent((p) => (p + 1) % slides.length)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/30 backdrop-blur-sm text-primary-foreground hover:bg-background/50 hidden md:block">
        <ChevronRight size={20} />
      </button>
    </section>
  );
};

export default HeroBanner;
