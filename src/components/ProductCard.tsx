import { Link } from "react-router-dom";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/products";
import { motion } from "framer-motion";

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const isWished = wishlist.includes(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-all"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-body font-bold px-2 py-0.5 rounded">
            {product.discount}% OFF
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-colors ${isWished ? "bg-primary text-primary-foreground" : "bg-background/70 text-foreground hover:bg-primary hover:text-primary-foreground"}`}
        >
          <Heart size={16} fill={isWished ? "currentColor" : "none"} />
        </button>
      </Link>
      <div className="p-3">
        <p className="text-[11px] text-muted-foreground font-body mb-0.5">{product.seller}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-body font-medium text-sm text-foreground line-clamp-2 mb-1.5 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-1.5">
          <span className="flex items-center gap-0.5 bg-green-600 text-primary-foreground text-[10px] font-body font-bold px-1.5 py-0.5 rounded">
            {product.rating} <Star size={9} fill="currentColor" />
          </span>
          <span className="text-[11px] text-muted-foreground font-body">({product.reviews.toLocaleString()})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-body font-bold text-foreground">₹{product.price.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground font-body line-through">₹{product.originalPrice.toLocaleString()}</span>
        </div>
        <button
          onClick={() => addToCart(product, product.sizes[0], product.colors[0])}
          className="mt-2 w-full flex items-center justify-center gap-1.5 bg-primary text-primary-foreground font-body font-medium text-xs py-2 rounded-lg hover:brightness-110 transition-all"
        >
          <ShoppingCart size={14} /> Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
