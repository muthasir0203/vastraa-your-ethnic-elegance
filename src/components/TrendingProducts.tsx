import ProductCard from "./ProductCard";
import { products } from "@/data/products";

const TrendingProducts = () => (
  <section className="py-8 md:py-12">
    <div className="container">
      <h2 className="font-heading text-2xl md:text-3xl font-bold text-center text-foreground mb-2">
        Trending Now
      </h2>
      <p className="text-center text-muted-foreground font-body text-sm mb-6 md:mb-8">
        Most loved picks by our customers
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {products.slice(0, 8).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  </section>
);

export default TrendingProducts;
