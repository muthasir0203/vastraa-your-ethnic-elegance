import { useWishlist } from "@/hooks/useWishlist";
import ProductCard from "@/components/ProductCard";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Wishlist = () => {
    const { wishlistItems, isLoading } = useWishlist();

    return (
        <div className="container py-8 min-h-[60vh]">
            <div className="flex items-center gap-3 mb-8">
                <Heart className="text-primary" size={28} fill="currentColor" />
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">My Wishlist</h1>
                {!isLoading && (
                    <span className="text-muted-foreground font-body text-sm mt-1">({wishlistItems?.length || 0} items)</span>
                )}
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="aspect-[3/4] rounded-xl bg-muted animate-pulse" />
                    ))}
                </div>
            ) : wishlistItems && wishlistItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {wishlistItems.map((item) => (
                        <ProductCard key={item.id} product={item.product} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mb-6">
                        <Heart size={40} className="text-muted-foreground/30" />
                    </div>
                    <h2 className="font-heading text-xl font-semibold mb-2">Your wishlist is empty</h2>
                    <p className="text-muted-foreground font-body mb-8 max-w-md">
                        Save your favorite items here to track them and buy them later.
                    </p>
                    <Link to="/products">
                        <Button className="font-body px-8 py-6 rounded-full">Continue Shopping</Button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Wishlist;
