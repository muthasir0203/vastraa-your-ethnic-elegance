import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Heart, ShoppingCart, Truck, RotateCcw, ShieldCheck, ChevronLeft } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  if (!product) return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-20 text-center">
        <h1 className="font-heading text-2xl text-foreground">Product not found</h1>
        <Link to="/" className="text-primary font-body mt-4 inline-block">← Back to Home</Link>
      </div>
    </div>
  );

  const isWished = wishlist.includes(product.id);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + product.deliveryDays);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-4 md:py-8">
        <Link to="/" className="inline-flex items-center gap-1 text-sm font-body text-muted-foreground hover:text-primary mb-4">
          <ChevronLeft size={16} /> Back
        </Link>
        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          {/* Image */}
          <div className="aspect-[3/4] rounded-xl overflow-hidden bg-muted shadow-card">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>

          {/* Details */}
          <div>
            <p className="text-sm text-muted-foreground font-body mb-1">{product.seller}</p>
            <h1 className="font-heading text-xl md:text-3xl font-bold text-foreground mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center gap-1 bg-green-600 text-primary-foreground text-xs font-body font-bold px-2 py-1 rounded">
                {product.rating} <Star size={11} fill="currentColor" />
              </span>
              <span className="text-sm text-muted-foreground font-body">{product.reviews.toLocaleString()} Reviews</span>
            </div>

            <div className="flex items-baseline gap-3 mb-5">
              <span className="font-heading text-3xl font-bold text-foreground">₹{product.price.toLocaleString()}</span>
              <span className="text-lg text-muted-foreground font-body line-through">₹{product.originalPrice.toLocaleString()}</span>
              <span className="text-sm font-body font-bold text-green-600">{product.discount}% off</span>
            </div>

            {/* Colors */}
            <div className="mb-4">
              <h3 className="font-body font-semibold text-sm text-foreground mb-2">Color</h3>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button key={c} onClick={() => setSelectedColor(c)} className={`px-4 py-2 rounded-lg text-xs font-body border transition-all ${selectedColor === c ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-foreground hover:border-primary/50"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-5">
              <h3 className="font-body font-semibold text-sm text-foreground mb-2">Size</h3>
              <div className="flex gap-2">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => setSelectedSize(s)} className={`w-11 h-11 rounded-lg text-xs font-body font-medium border transition-all ${selectedSize === s ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground hover:border-primary/50"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => addToCart(product, selectedSize || product.sizes[0], selectedColor || product.colors[0])}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-body font-semibold py-3.5 rounded-xl hover:brightness-110 transition-all shadow-elevated"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-14 flex items-center justify-center rounded-xl border transition-all ${isWished ? "bg-primary border-primary text-primary-foreground" : "border-border text-foreground hover:border-primary"}`}
              >
                <Heart size={20} fill={isWished ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted">
                <Truck size={18} className="text-primary mb-1" />
                <span className="text-[10px] font-body text-muted-foreground">{product.cod ? "COD Available" : "Prepaid Only"}</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted">
                <RotateCcw size={18} className="text-primary mb-1" />
                <span className="text-[10px] font-body text-muted-foreground">7-Day Returns</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted">
                <ShieldCheck size={18} className="text-primary mb-1" />
                <span className="text-[10px] font-body text-muted-foreground">Quality Checked</span>
              </div>
            </div>

            <div className="text-sm font-body text-muted-foreground mb-1">
              Estimated delivery: <span className="text-foreground font-medium">{deliveryDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
            </div>

            {/* Description */}
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="font-body font-semibold text-foreground mb-2">Product Details</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-3">{product.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm font-body">
                <div><span className="text-muted-foreground">Fabric:</span> <span className="text-foreground font-medium">{product.fabric}</span></div>
                <div><span className="text-muted-foreground">Category:</span> <span className="text-foreground font-medium">{product.category}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-12 md:mt-16">
            <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-5">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
