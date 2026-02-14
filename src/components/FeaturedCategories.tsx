import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import catSarees from "@/assets/cat-sarees.jpg";
import catKurtis from "@/assets/cat-kurtis.jpg";
import catLehengas from "@/assets/cat-lehengas.jpg";
import catKurtaSets from "@/assets/cat-partywear.jpg";
import catDupattas from "@/assets/cat-dupattas.jpg";

const cats = [
  { name: "Sarees", image: catSarees },
  { name: "Kurtis", image: catKurtis },
  { name: "Lehengas", image: catLehengas },
  { name: "Kurta Sets", image: catKurtaSets },
  { name: "Dupattas", image: catDupattas },
];

const FeaturedCategories = () => (
  <section className="py-8 md:py-12 bg-ethnic-pattern">
    <div className="container">
      <h2 className="font-heading text-2xl md:text-3xl font-bold text-center text-foreground mb-2">
        Shop by Category
      </h2>
      <p className="text-center text-muted-foreground font-body text-sm mb-6 md:mb-8">
        Explore our curated collections of traditional Indian wear
      </p>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-5">
        {cats.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group block text-center"
            >
              <div className="aspect-square rounded-2xl overflow-hidden mb-2 shadow-card group-hover:shadow-elevated transition-shadow">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <span className="font-body font-semibold text-sm md:text-base text-foreground group-hover:text-primary transition-colors">
                {cat.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedCategories;
