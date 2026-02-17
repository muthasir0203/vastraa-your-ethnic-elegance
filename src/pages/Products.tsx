import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import CategoryBanner from "@/components/CategoryBanner";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

const fabrics = ["Cotton", "Silk", "Georgette", "Chiffon", "Rayon", "Velvet"];
const sortOptions = [
  { value: "popular", label: "Popularity" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Top Rated" },
];

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedFabric, setSelectedFabric] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Map selectedCategory for the hook
  const categorySlug = selectedCategory === "All Products" || selectedCategory === "" ? undefined : selectedCategory.toLowerCase();
  const { data: products, isLoading, error } = useProducts(categorySlug);
  const { data: categoriesData } = useCategories();
  const categoriesList = categoriesData?.map(c => c.name) || ["Sarees", "Kurtis", "Lehengas", "Suits", "Western Wear"];

  // Update selected category when URL param changes
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const filtered = useMemo(() => {
    if (!products) return [];
    let result = [...products];

    if (selectedFabric) result = result.filter((p) => p.fabric === selectedFabric);

    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "newest": result.reverse(); break;
    }
    return result;
  }, [products, selectedFabric, sortBy]);

  if (error) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold text-destructive">Error loading products</h2>
        <p className="text-muted-foreground">{(error as any).message}</p>
      </div>
    );
  }

  return (
    <div className="container py-4 md:py-8">
      {selectedCategory && <CategoryBanner category={selectedCategory} />}

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground">
          {selectedCategory || "All Products"}
          <span className="ml-2 text-sm font-body font-normal text-muted-foreground">
            {!isLoading && `(${filtered.length} items)`}
          </span>
        </h1>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-body bg-card border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button onClick={() => setFiltersOpen(!filtersOpen)} className="md:hidden p-2 border border-border rounded-lg text-foreground">
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className={`${filtersOpen ? "fixed inset-0 z-50 bg-background p-4 overflow-y-auto" : "hidden"} md:block md:static md:w-52 shrink-0`}>
          <div className="flex items-center justify-between md:hidden mb-4">
            <h2 className="font-body font-semibold text-foreground">Filters</h2>
            <button onClick={() => setFiltersOpen(false)}><X size={20} /></button>
          </div>
          <div className="mb-5">
            <h3 className="font-body font-semibold text-sm text-foreground mb-2">Category</h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory("")}
                className={`block text-xs font-body py-1 ${!selectedCategory ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}
              >
                All
              </button>
              {categoriesList.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`block text-xs font-body py-1 ${selectedCategory === c ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-5">
            <h3 className="font-body font-semibold text-sm text-foreground mb-2">Fabric</h3>
            <div className="space-y-1">
              <button onClick={() => setSelectedFabric("")} className={`block text-xs font-body py-1 ${!selectedFabric ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}>All</button>
              {fabrics.map((f) => (
                <button key={f} onClick={() => setSelectedFabric(f)} className={`block text-xs font-body py-1 ${selectedFabric === f ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}>{f}</button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <p className="font-body text-muted-foreground">No products found. Try different filters.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
