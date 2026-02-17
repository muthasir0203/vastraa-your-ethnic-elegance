import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Truck, ShieldCheck, ShoppingBag, Heart, ChevronLeft, RotateCcw } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useToast } from "@/components/ui/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const { toast } = useToast();

  const { data: product, isLoading, error } = useProduct(id!);
  const { data: relatedProducts } = useProducts(product?.category?.toLowerCase());
  const { addToCart } = useCart();
  const { toggleWishlist, wishlistItems } = useWishlist();

  const isWishlisted = wishlistItems?.some((item: any) => item.product_id === id);

  if (isLoading) {
    return (
      <div className="container py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold text-destructive">Product not found</h2>
        <Button variant="link" asChild>
          <Link to="/products">Go Back to Products</Link>
        </Button>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!selectedSize && product.sizes?.length > 0) {
      toast({
        variant: "destructive",
        title: "Please select a size",
      });
      return;
    }

    try {
      await addToCart.mutateAsync({
        product_id: product.id,
        quantity: 1,
        size: selectedSize,
        color: selectedColor,
      });
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to add to cart",
        description: err.message,
      });
    }
  };

  const handleToggleWishlist = async () => {
    try {
      await toggleWishlist.mutateAsync(product.id);
      toast({
        title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to update wishlist",
        description: err.message,
      });
    }
  };

  return (
    <div className="container py-4 md:py-8">
      <Link to="/products" className="inline-flex items-center gap-1 text-sm font-body text-muted-foreground hover:text-primary mb-4">
        <ChevronLeft size={16} /> Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-6 md:gap-10 mb-16">
        <div className="aspect-[3/4] rounded-xl overflow-hidden bg-muted shadow-card">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="flex flex-col">
          <p className="text-sm text-muted-foreground font-body mb-1">{product.seller}</p>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-foreground mb-3">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center gap-1 bg-green-600 text-primary-foreground text-xs font-body font-bold px-2 py-1 rounded">
              {product.rating} <Star size={11} fill="currentColor" />
            </span>
            <span className="text-sm text-muted-foreground font-body">
              {product.numReviews} Reviews
            </span>
            {product.is_cod_available && (
              <Badge variant="outline" className="text-[10px] font-normal border-border font-body ml-2">
                COD Available
              </Badge>
            )}
          </div>

          <div className="flex items-baseline gap-3 mb-5">
            <span className="font-heading text-3xl font-bold text-foreground">₹{product.price.toLocaleString()}</span>
            {product.original_price && (
              <>
                <span className="text-lg text-muted-foreground font-body line-through">₹{product.original_price.toLocaleString()}</span>
                <span className="text-sm font-body font-bold text-green-600">
                  {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% off
                </span>
              </>
            )}
          </div>

          {product.sizes?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-body font-semibold text-sm text-foreground mb-2">Size</h3>
              <div className="flex gap-2">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-11 h-11 rounded-lg text-xs font-body font-medium border transition-all ${selectedSize === size
                        ? "border-primary bg-primary text-primary-foreground shadow-md"
                        : "border-border text-foreground hover:border-primary/50"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors?.length > 0 && (
            <div className="mb-5">
              <h3 className="font-body font-semibold text-sm text-foreground mb-2">Color</h3>
              <div className="flex gap-2">
                {product.colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg text-xs font-body border transition-all ${selectedColor === color
                        ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                        : "border-border text-foreground hover:border-primary/50"
                      }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mb-6">
            <Button
              onClick={handleAddToCart}
              className="flex-[1.5] h-14 rounded-xl text-lg font-bold gap-2 shadow-xl hover:shadow-2xl transition-all"
            >
              <ShoppingBag size={20} /> Add to Cart
            </Button>
            <Button
              onClick={handleToggleWishlist}
              variant="outline"
              className={`w-14 h-14 rounded-xl border transition-all ${isWishlisted ? "bg-primary border-primary text-primary-foreground" : "border-border text-foreground hover:border-primary"
                }`}
            >
              <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted">
              <Truck size={18} className="text-primary mb-1" />
              <span className="text-[10px] font-body text-muted-foreground">Free Delivery</span>
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

      {relatedProducts && relatedProducts.length > 0 && (
        <section className="mt-12 md:mt-16">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-5">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {relatedProducts.filter((p: any) => p.id !== id).slice(0, 4).map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
