import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    TrendingUp,
    LogOut,
    Plus,
    Settings,
    Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const isAdmin = sessionStorage.getItem("isAdmin") === "true";
        if (!isAdmin) {
            navigate("/admin");
        }
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem("isAdmin");
        toast({
            title: "Logged Out",
            description: "Admin session ended successfully.",
        });
        navigate("/admin");
    };

    if (!mounted) return null;

    const stats = [
        { title: "Total Products", value: "124", icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
        { title: "Active Orders", value: "48", icon: ShoppingBag, color: "text-green-600", bg: "bg-green-100" },
        { title: "Review Requests", value: "12", icon: Bell, color: "text-amber-600", bg: "bg-amber-100" },
        { title: "Total Revenue", value: "₹24,500", icon: TrendingUp, color: "text-rose-600", bg: "bg-rose-100" },
    ];

    return (
        <div className="min-h-screen bg-muted/30 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-border hidden md:flex flex-col">
                <div className="p-6 border-b border-border">
                    <h2 className="text-2xl font-heading font-bold text-primary">Vastraa Admin</h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-medium">
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link to="/admin/products" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-xl transition-all">
                        <Package size={20} /> Products
                    </Link>
                    <Link to="/account/orders" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-xl transition-all">
                        <ShoppingBag size={20} /> Orders
                    </Link>
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-xl transition-all">
                        <Users size={20} /> Customers
                    </Link>
                </nav>
                <div className="p-4 border-t border-border">
                    <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 rounded-xl">
                        <LogOut size={20} /> Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <header className="h-16 bg-white border-b border-border flex items-center justify-between px-8">
                    <h1 className="text-xl font-semibold">Dashboard Overview</h1>
                    <div className="flex items-center gap-4">
                        <Button className="rounded-full gap-2">
                            <Plus size={18} /> Add Product
                        </Button>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            A
                        </div>
                    </div>
                </header>

                <div className="p-8 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, i) => (
                            <Card key={i} className="border-border shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                                        <p className="text-2xl font-bold">{stat.value}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Placeholder for table */}
                    <Card className="rounded-2xl border-border shadow-sm">
                        <CardHeader className="border-b border-border bg-muted/10">
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="p-12 text-center">
                            <div className="max-w-xs mx-auto space-y-4">
                                <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center">
                                    <ShoppingBag className="text-muted-foreground" size={24} />
                                </div>
                                <h3 className="text-lg font-medium">No recent activity</h3>
                                <p className="text-sm text-muted-foreground">Your store is set up and ready! Start adding products to see analytics here.</p>
                                <Button variant="outline" className="rounded-xl">Learn More</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
