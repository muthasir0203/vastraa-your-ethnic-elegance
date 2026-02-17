import { Package, ChevronRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useOrders } from "@/hooks/useOrders";

const Orders = () => {
    const { orders, isLoading } = useOrders();

    if (isLoading) {
        return (
            <div className="container py-20 flex justify-center">
                <Loader2 className="animate-spin h-10 w-10 text-primary" />
            </div>
        );
    }

    return (
        <div className="container py-12 px-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <Package className="text-primary" size={32} />
                <h1 className="text-3xl font-heading font-bold text-primary">My Orders</h1>
            </div>

            {orders && orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md">
                            <div className="space-y-1">
                                <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider truncate max-w-[150px]">Order #{order.id}</div>
                                <div className="text-lg font-semibold font-body">{new Date(order.created_at || "").toLocaleDateString()}</div>
                            </div>
                            <div className="flex gap-8">
                                <div>
                                    <div className="text-xs text-muted-foreground uppercase mb-1">Status</div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground uppercase mb-1">Total</div>
                                    <div className="font-bold">₹{order.total_price.toLocaleString()}</div>
                                </div>
                            </div>
                            <Link to={`/account/orders/${order.id}`} className="flex items-center text-primary font-medium hover:underline">
                                View Details <ChevronRight size={18} />
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-border">
                    <p className="text-muted-foreground text-lg mb-4">You haven't placed any orders yet.</p>
                    <Link to="/products" className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium transition-all hover:scale-105">
                        Start Shopping
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Orders;
