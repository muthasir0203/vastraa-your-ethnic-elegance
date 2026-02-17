import { Link, useNavigate } from "react-router-dom";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

const ProductCard = ({ product }: { product: any }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isWished = wishlistItems?.some((item: any) => item.product_id === product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await addToCart.mutateAsync({
        product_id: product.id,
        quantity: 1,
        size: product.sizes?.[0],
        color: product.colors?.[0],
      });
      toast({ title: "Added to cart", description: product.name });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await toggleWishlist.mutateAsync(product.id);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-all"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden">
        <img
          src={product.image || product.product_images?.[0]?.url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.original_price > product.price && (
          <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-body font-bold px-2 py-0.5 rounded">
            {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
          </span>
        )}
        <button
          onClick={handleToggleWishlist}
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
          <span className="text-[11px] text-muted-foreground font-body">({product.num_reviews || 0})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-body font-bold text-foreground">₹{product.price.toLocaleString()}</span>
          {product.original_price && (
            <span className="text-xs text-muted-foreground font-body line-through">₹{product.original_price.toLocaleString()}</span>
          )}
        </div>
        <div className="mt-2 flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-1.5 bg-muted text-foreground font-body font-medium text-[11px] py-2 rounded-lg hover:bg-muted/80 transition-all border border-border"
          >
            <ShoppingCart size={13} /> Add
          </button>
          <button
            onClick={async (e) => {
              await handleAddToCart(e);
              navigate("/checkout");
            }}
            className="flex-1 bg-secondary text-secondary-foreground font-body font-bold text-[11px] py-2 rounded-lg hover:brightness-110 transition-all shadow-sm"
          >
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
