import { useParams, Link } from "react-router-dom";
import { Package, ChevronLeft, Calendar, CreditCard, MapPin, Truck, CheckCircle2, Loader2 } from "lucide-react";
import { useOrder } from "@/hooks/useOrders";

const OrderDetail = () => {
    const { id } = useParams();
    const { data: order, isLoading, error } = useOrder(id!);

    if (isLoading) {
        return (
            <div className="container py-20 flex justify-center">
                <Loader2 className="animate-spin h-10 w-10 text-primary" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="container py-20 text-center">
                <h2 className="text-2xl font-bold text-destructive">Order not found</h2>
                <Link to="/account/orders" className="text-primary hover:underline mt-4 inline-block">Back to My Orders</Link>
            </div>
        );
    }

    const steps = [
        { label: "Order Placed", date: new Date(order.created_at).toLocaleDateString(), completed: true },
        { label: "Processing", date: "TBD", completed: order.status !== 'placed' },
        { label: "Shipped", date: "TBD", completed: ['shipped', 'delivered'].includes(order.status) },
        { label: "Delivered", date: "TBD", completed: order.status === 'delivered' }
    ];

    return (
        <div className="container py-8 md:py-12 px-4 max-w-5xl mx-auto">
            <Link to="/account/orders" className="inline-flex items-center text-primary font-medium hover:underline mb-8 group">
                <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" /> Back to My Orders
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-primary mb-2">Order Details</h1>
                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm font-body">
                        <span className="flex items-center gap-1.5"><Package size={16} /> Order #{order.id}</span>
                        <span className="flex items-center gap-1.5"><Calendar size={16} /> Placed on {new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {order.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Items */}
                    <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                        <div className="p-6 border-b border-border bg-muted/10">
                            <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
                                <Package size={20} className="text-primary" /> Items in your order
                            </h2>
                        </div>
                        <div className="divide-y divide-border">
                            {order.order_items?.map((item: any) => (
                                <div key={item.id} className="p-6 flex gap-4">
                                    <div className="w-24 h-32 rounded-lg overflow-hidden bg-muted shrink-0 shadow-sm">
                                        <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h3 className="font-body font-semibold text-foreground leading-tight">{item.product?.name}</h3>
                                        <p className="text-xs text-muted-foreground font-body">Seller: {item.product?.seller}</p>
                                        <div className="flex items-center justify-between mt-4">
                                            <span className="text-sm font-body text-muted-foreground">Qty: {item.quantity}</span>
                                            <span className="font-bold text-primary">₹{item.price_at_purchase.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Tracking */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-border">
                        <h2 className="font-heading font-semibold text-lg mb-8 flex items-center gap-2">
                            <Truck size={20} className="text-primary" /> Order Status
                        </h2>
                        <div className="relative">
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted-foreground/20 ml-[-1px]"></div>
                            <div className="space-y-8 relative">
                                {steps.map((step, index) => (
                                    <div key={index} className="flex gap-6 items-start">
                                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${step.completed ? 'bg-primary text-white' : 'bg-white border-2 border-muted-foreground/30 text-muted-foreground'}`}>
                                            {step.completed ? <CheckCircle2 size={18} /> : (index + 1)}
                                        </div>
                                        <div>
                                            <p className={`font-body font-semibold ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</p>
                                            <p className="text-xs text-muted-foreground font-body mt-1">{step.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Summary */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-border space-y-4">
                        <h2 className="font-heading font-semibold text-lg mb-4">Order Summary</h2>
                        <div className="space-y-2.5 pb-4 border-b border-border">
                            <div className="flex justify-between text-sm font-body text-muted-foreground">
                                <span>Subtotal</span>
                                <span>₹{order.total_price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm font-body text-muted-foreground">
                                <span>Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                        </div>
                        <div className="flex justify-between font-heading font-bold text-xl pt-2 text-primary">
                            <span>Total</span>
                            <span>₹{order.total_price.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Address & Payment */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-border space-y-8">
                        <div>
                            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                                <MapPin size={16} /> Shipping Address
                            </h3>
                            {order.addresses ? (
                                <div className="text-sm font-body space-y-1">
                                    <p className="font-semibold text-foreground">{order.addresses.full_name}</p>
                                    <p className="text-muted-foreground">{order.addresses.street}</p>
                                    <p className="text-muted-foreground">{order.addresses.city}, {order.addresses.state} - {order.addresses.pincode}</p>
                                    <p className="text-muted-foreground pt-2 font-medium">{order.addresses.phone}</p>
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground italic">Address information unavailable</p>
                            )}
                        </div>
                        <div>
                            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                                <CreditCard size={16} /> Payment Method
                            </h3>
                            <div className="text-sm font-body flex items-center gap-2 text-muted-foreground">
                                <span className="bg-muted px-2 py-0.5 rounded text-[10px] uppercase font-bold text-foreground capitalize">{order.payment_method}</span>
                                {order.payment_method === 'card' ? 'Credit/Debit Card' : order.payment_method.toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
