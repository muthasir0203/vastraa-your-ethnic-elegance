import ProductCard from "./ProductCard";
import { useProducts } from "@/hooks/useProducts";

const TrendingProducts = () => {
  const { data: products, isLoading } = useProducts();

  return (
    <section className="py-8 md:py-12">
      <div className="container">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-center text-foreground mb-2">
          Trending Now
        </h2>
        <p className="text-center text-muted-foreground font-body text-sm mb-6 md:mb-8">
          Most loved picks by our customers
        </p>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {products?.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingProducts;
