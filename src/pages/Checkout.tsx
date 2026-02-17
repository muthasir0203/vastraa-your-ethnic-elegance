import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useOrders } from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, CreditCard, Smartphone, Banknote, Landmark, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const Checkout = () => {
    const { cartItems: items, isLoading: isCartLoading } = useCart();
    const { createOrder } = useOrders();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [paymentMethod, setPaymentMethod] = useState("upi");
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    // Address state
    const [address, setAddress] = useState({
        full_name: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        pincode: ""
    });

    const cartTotal = items?.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0) || 0;
    const totalAmount = cartTotal + (cartTotal >= 999 || cartTotal === 0 ? 0 : 49);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!address.full_name || !address.phone || !address.street || !address.pincode) {
            toast({ variant: "destructive", title: "Missing Information", description: "Please fill in all shipping details." });
            return;
        }

        setIsPlacingOrder(true);
        try {
            // 1. Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Please sign in to place an order");

            // 2. Simply use the address provided (for now just pass it to the order creator if it supported it, 
            // but our hook expects an address_id. Let's create an address first or use a default.)
            // For simplicity in this demo, we'll insert into addresses table first.
            const { data: addrData, error: addrError } = await supabase
                .from('addresses')
                .insert([{
                    user_id: user.id,
                    ...address,
                    is_default: true
                }])
                .select()
                .single();

            if (addrError) throw addrError;

            // 3. Create Order
            await createOrder.mutateAsync({
                total_price: totalAmount,
                payment_method: paymentMethod,
                shipping_address_id: addrData.id,
                items: items.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.product?.price || 0
                }))
            });

            toast({ title: "Order placed successfully!", description: "Redirecting to your orders..." });
            navigate("/account/orders");
        } catch (err: any) {
            toast({ variant: "destructive", title: "Order Failed", description: err.message });
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (isCartLoading) {
        return <div className="container py-20 flex justify-center"><Loader2 className="animate-spin" /></div>;
    }

    if (!items || items.length === 0) {
        return (
            <div className="container py-20 text-center">
                <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
                <Button asChild><Link to="/products">Go Shopping</Link></Button>
            </div>
        );
    }

    return (
        <div className="container py-8 max-w-5xl mx-auto">
            <Link to="/cart" className="flex items-center gap-1 text-muted-foreground hover:text-primary mb-6 transition-colors w-fit">
                <ChevronLeft size={18} /> Back to Cart
            </Link>

            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8">Checkout</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-8">
                    {/* Shipping Address */}
                    <section>
                        <h2 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
                            <span className="flex items-center justify-center w-7 h-7 bg-primary text-primary-foreground rounded-full text-sm">1</span>
                            Shipping Address
                        </h2>
                        <Card>
                            <CardContent className="pt-6 grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="full_name">Full Name</Label>
                                    <Input id="full_name" value={address.full_name} onChange={handleInputChange} placeholder="John Doe" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Mobile Number</Label>
                                    <Input id="phone" value={address.phone} onChange={handleInputChange} placeholder="10-digit mobile number" required />
                                </div>
                                <div className="sm:col-span-2 space-y-2">
                                    <Label htmlFor="street">Flat, House no., Building, Company, Apartment</Label>
                                    <Input id="street" value={address.street} onChange={handleInputChange} placeholder="Address line 1" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pincode">Pincode</Label>
                                    <Input id="pincode" value={address.pincode} onChange={handleInputChange} placeholder="6-digit pincode" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" value={address.city} onChange={handleInputChange} placeholder="City/Town" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input id="state" value={address.state} onChange={handleInputChange} placeholder="State" required />
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Payment Method */}
                    <section>
                        <h2 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
                            <span className="flex items-center justify-center w-7 h-7 bg-primary text-primary-foreground rounded-full text-sm">2</span>
                            Payment Method
                        </h2>
                        <Card>
                            <CardContent className="pt-6">
                                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                                    <div className="flex items-center space-x-3 border border-border p-4 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                        <RadioGroupItem value="upi" id="upi" />
                                        <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer flex-1">
                                            <Smartphone className="text-primary" size={20} />
                                            <div>
                                                <p className="font-medium">UPI (Google Pay, PhonePe, Paytm)</p>
                                                <p className="text-xs text-muted-foreground">Fast & Secure</p>
                                            </div>
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-3 border border-border p-4 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                        <RadioGroupItem value="card" id="card" />
                                        <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                                            <CreditCard className="text-primary" size={20} />
                                            <div>
                                                <p className="font-medium">Credit / Debit Card</p>
                                                <p className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</p>
                                            </div>
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-3 border border-border p-4 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                        <RadioGroupItem value="cod" id="cod" />
                                        <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
                                            <Banknote className="text-primary" size={20} />
                                            <div>
                                                <p className="font-medium">Cash on Delivery</p>
                                                <p className="text-xs text-muted-foreground">Pay when you receive</p>
                                            </div>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </CardContent>
                        </Card>
                    </section>
                </form>

                {/* Sidebar Order Summary */}
                <div className="space-y-6">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle className="text-lg">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Items ({items.reduce((s, i) => s + i.quantity, 0)})</span>
                                    <span>₹{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Delivery</span>
                                    <span className="text-green-600 font-medium">{cartTotal >= 999 ? "FREE" : "₹49"}</span>
                                </div>
                            </div>
                            <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>₹{totalAmount.toLocaleString()}</span>
                            </div>
                            <Button
                                onClick={handlePlaceOrder}
                                disabled={isPlacingOrder}
                                className="w-full py-6 text-base font-semibold rounded-xl gap-2"
                            >
                                {isPlacingOrder ? <Loader2 className="animate-spin" size={20} /> : "Place Order"}
                            </Button>
                            <p className="text-[10px] text-center text-muted-foreground">
                                By placing your order, you agree to Vastraa's terms and conditions.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
