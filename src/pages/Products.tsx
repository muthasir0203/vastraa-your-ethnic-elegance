import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory || p.tags.includes(selectedCategory.replace(" Collection", "")));
    if (selectedFabric) result = result.filter((p) => p.fabric === selectedFabric);
    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "newest": result.reverse(); break;
    }
    return result;
  }, [selectedCategory, selectedFabric, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-4 md:py-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground">
            {selectedCategory || "All Products"}
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
                <button onClick={() => setSelectedCategory("")} className={`block text-xs font-body py-1 ${!selectedCategory ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}>All</button>
                {["Sarees", "Kurtis", "Kurta Sets", "Lehengas", "Dupattas", "Dress Materials"].map((c) => (
                  <button key={c} onClick={() => setSelectedCategory(c)} className={`block text-xs font-body py-1 ${selectedCategory === c ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}>{c}</button>
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
            {filtersOpen && (
              <button onClick={() => setFiltersOpen(false)} className="w-full bg-primary text-primary-foreground font-body font-semibold py-2.5 rounded-lg mt-4 md:hidden">
                Apply Filters
              </button>
            )}
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-body mb-3">{filtered.length} products found</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="font-body text-muted-foreground">No products found. Try different filters.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
