import { useNavigate, Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/ui/use-toast";

const Cart = () => {
  const { cartItems: items, isLoading, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const cartTotal = items?.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0) || 0;

  const handleUpdateQuantity = async (id: string, newQty: number) => {
    if (newQty < 1) return;
    try {
      await updateQuantity.mutateAsync({ id, quantity: newQty });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Update failed", description: err.message });
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeItem.mutateAsync(id);
      toast({ title: "Item removed" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Remove failed", description: err.message });
    }
  };

  if (isLoading) {
    return (
      <div className="container py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-4 md:py-8 min-h-[60vh]">
      <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-6">Shopping Cart</h1>

      {!items || items.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="font-body text-muted-foreground mb-4">Your cart is empty</p>
          <Link to="/products" className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-6 py-2.5 rounded-full">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-card rounded-xl p-3 shadow-soft">
                <Link to={`/product/${item.product_id}`} className="w-20 h-24 rounded-lg overflow-hidden shrink-0">
                  <img
                    src={item.product?.product_images?.[0]?.url || ""}
                    alt={item.product?.name}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product_id}`}>
                    <h3 className="font-body font-medium text-sm text-foreground line-clamp-1 hover:text-primary">
                      {item.product?.name}
                    </h3>
                  </Link>
                  <p className="text-[11px] text-muted-foreground font-body">{item.size} · {item.color}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-body font-bold text-sm text-foreground">₹{item.product?.price.toLocaleString()}</span>
                    {item.product?.original_price && (
                      <span className="text-[11px] text-muted-foreground font-body line-through">₹{item.product.original_price.toLocaleString()}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-muted"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 text-sm font-body font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-muted"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-xl p-5 shadow-card h-fit sticky top-32">
            <h3 className="font-body font-semibold text-foreground mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm font-body mb-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span className="text-green-600 font-medium">{cartTotal >= 999 ? "FREE" : "₹49"}</span>
              </div>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-body font-bold text-foreground mb-5">
              <span>Total</span>
              <span>₹{(cartTotal + (cartTotal >= 999 ? 0 : 49)).toLocaleString()}</span>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-primary text-primary-foreground font-body font-semibold py-3 rounded-xl hover:brightness-110 transition-all shadow-elevated"
            >
              Proceed to Checkout
            </button>
            <p className="text-[10px] text-muted-foreground font-body text-center mt-2">COD & UPI available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
