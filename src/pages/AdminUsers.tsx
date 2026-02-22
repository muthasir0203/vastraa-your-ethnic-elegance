import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    LogOut,
    Search,
    Layers,
    ChevronLeft,
    X,
    TrendingUp,
    UserCheck,
    Mail,
    Calendar,
    IndianRupee,
    ChevronDown,
    ChevronUp,
    Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface UserStat {
    user_id: string;
    email: string;
    total_orders: number;
    total_spent: number;
    last_order_at: string;
    status: "active" | "inactive";
}

type SortKey = "email" | "total_orders" | "total_spent" | "last_order_at";

const AdminUsers = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [users, setUsers] = useState<UserStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("last_order_at");
    const [sortAsc, setSortAsc] = useState(false);

    useEffect(() => {
        const isAdmin = sessionStorage.getItem("isAdmin") === "true";
        if (!isAdmin) {
            navigate("/admin");
            return;
        }
        fetchUsers();
    }, [navigate]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Get all orders grouped by user
            const { data: orders, error } = await supabase
                .from("orders")
                .select("user_id, total_price, created_at, status")
                .order("created_at", { ascending: false });

            if (error) throw error;

            if (!orders || orders.length === 0) {
                setUsers([]);
                setLoading(false);
                return;
            }

            // Aggregate per-user stats
            const userMap: Record<string, Omit<UserStat, "email">> = {};
            orders.forEach((order: any) => {
                if (!order.user_id) return;
                if (!userMap[order.user_id]) {
                    userMap[order.user_id] = {
                        user_id: order.user_id,
                        total_orders: 0,
                        total_spent: 0,
                        last_order_at: order.created_at,
                        status: "active",
                    };
                }
                userMap[order.user_id].total_orders += 1;
                userMap[order.user_id].total_spent += Number(order.total_price);
            });

            // Try to get emails via admin API (works if using service role key in anon context)
            // Fallback: display shortened user_id as identifier
            const enriched: UserStat[] = Object.values(userMap).map((u) => ({
                ...u,
                email: `user-${u.user_id.slice(0, 8)}...`,
                status: u.total_orders > 0 ? "active" : "inactive",
            }));

            // Try fetching emails from addresses table (user may have stored a name)
            const { data: addresses } = await supabase
                .from("addresses")
                .select("user_id, full_name");

            const nameMap: Record<string, string> = {};
            (addresses || []).forEach((a: any) => {
                if (!nameMap[a.user_id]) nameMap[a.user_id] = a.full_name;
            });

            const withNames = enriched.map((u) => ({
                ...u,
                email: nameMap[u.user_id]
                    ? `${nameMap[u.user_id]} (${u.user_id.slice(0, 6)}…)`
                    : u.email,
            }));

            setUsers(withNames);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error loading users",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("isAdmin");
        navigate("/admin");
    };

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortAsc((prev) => !prev);
        } else {
            setSortKey(key);
            setSortAsc(false);
        }
    };

    const SortIcon = ({ field }: { field: SortKey }) => {
        if (sortKey !== field) return null;
        return sortAsc ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />;
    };

    const filtered = users
        .filter((u) => u.email.toLowerCase().includes(searchTerm.toLowerCase()) || u.user_id.includes(searchTerm))
        .sort((a, b) => {
            let valA: any = a[sortKey];
            let valB: any = b[sortKey];
            if (sortKey === "last_order_at") {
                valA = new Date(valA).getTime();
                valB = new Date(valB).getTime();
            }
            if (valA < valB) return sortAsc ? -1 : 1;
            if (valA > valB) return sortAsc ? 1 : -1;
            return 0;
        });

    const totalRevenue = users.reduce((sum, u) => sum + u.total_spent, 0);
    const avgOrderValue = users.length > 0
        ? users.reduce((sum, u) => sum + u.total_spent, 0) / users.reduce((sum, u) => sum + u.total_orders, 0)
        : 0;

    return (
        <div className="min-h-screen bg-muted/30 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-border hidden md:flex flex-col">
                <div className="p-6 border-b border-border">
                    <h2 className="text-2xl font-heading font-bold text-primary">Vastraa Admin</h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-xl transition-all"
                    >
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link
                        to="/admin/products"
                        className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-xl transition-all"
                    >
                        <Package size={20} /> Products
                    </Link>
                    <Link
                        to="/admin/collections"
                        className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-xl transition-all"
                    >
                        <Layers size={20} /> Collections
                    </Link>
                    <Link
                        to="/admin/orders"
                        className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-xl transition-all"
                    >
                        <ShoppingBag size={20} /> Orders
                    </Link>
                    <Link
                        to="/admin/users"
                        className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-medium"
                    >
                        <Users size={20} /> Users
                    </Link>
                </nav>
                <div className="p-4 border-t border-border">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 rounded-xl"
                    >
                        <LogOut size={20} /> Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <Link
                                to="/admin/dashboard"
                                className="text-sm text-primary flex items-center gap-1 mb-2 hover:underline"
                            >
                                <ChevronLeft size={14} /> Back to Dashboard
                            </Link>
                            <h1 className="text-3xl font-bold">Users</h1>
                            <p className="text-muted-foreground text-sm mt-1">
                                Customer activity based on order history
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3 shadow-sm">
                            <div className="p-2 rounded-xl bg-violet-100 text-violet-600">
                                <Users size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Total Users</p>
                                <p className="text-2xl font-bold">{users.length}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3 shadow-sm">
                            <div className="p-2 rounded-xl bg-green-100 text-green-600">
                                <UserCheck size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Active Buyers</p>
                                <p className="text-2xl font-bold">{users.filter(u => u.total_orders > 0).length}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3 shadow-sm">
                            <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
                                <IndianRupee size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Total Revenue</p>
                                <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString("en-IN")}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3 shadow-sm">
                            <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Avg. Order Value</p>
                                <p className="text-2xl font-bold">
                                    {isNaN(avgOrderValue) || !isFinite(avgOrderValue)
                                        ? "₹0"
                                        : `₹${Math.round(avgOrderValue).toLocaleString("en-IN")}`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-3">
                            <Search className="text-muted-foreground" size={18} />
                            <Input
                                placeholder="Search by name or user ID..."
                                className="border-0 bg-transparent focus-visible:ring-0 px-0 h-auto text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm("")} className="text-muted-foreground hover:text-foreground">
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead
                                        className="cursor-pointer select-none hover:text-foreground"
                                        onClick={() => handleSort("email")}
                                    >
                                        Customer <SortIcon field="email" />
                                    </TableHead>
                                    <TableHead>User ID</TableHead>
                                    <TableHead
                                        className="cursor-pointer select-none hover:text-foreground"
                                        onClick={() => handleSort("total_orders")}
                                    >
                                        Orders <SortIcon field="total_orders" />
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer select-none hover:text-foreground"
                                        onClick={() => handleSort("total_spent")}
                                    >
                                        Total Spent <SortIcon field="total_spent" />
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer select-none hover:text-foreground"
                                        onClick={() => handleSort("last_order_at")}
                                    >
                                        Last Order <SortIcon field="last_order_at" />
                                    </TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                            Loading users...
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-12">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                                    <Users className="text-muted-foreground" size={20} />
                                                </div>
                                                <p className="text-muted-foreground text-sm">
                                                    {searchTerm
                                                        ? "No users match your search."
                                                        : "No customers yet. Users appear here after placing their first order."}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filtered.map((user) => (
                                        <TableRow key={user.user_id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold uppercase">
                                                        {user.email.charAt(0)}
                                                    </div>
                                                    <span className="font-medium text-sm">{user.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <code className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
                                                    {user.user_id.slice(0, 12)}…
                                                </code>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <ShoppingBag size={14} className="text-muted-foreground" />
                                                    <span className="font-semibold">{user.total_orders}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-semibold text-green-700">
                                                    ₹{user.total_spent.toLocaleString("en-IN")}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={13} />
                                                    {new Date(user.last_order_at).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={user.status === "active" ? "default" : "secondary"}
                                                    className="rounded-full"
                                                >
                                                    {user.status === "active" ? "Active" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Eye size={16} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44 rounded-xl">
                                                        <DropdownMenuItem
                                                            className="gap-2 cursor-pointer"
                                                            onClick={() => navigate("/account/orders")}
                                                        >
                                                            <ShoppingBag size={14} /> View Orders
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="gap-2 cursor-pointer"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(user.user_id);
                                                                toast({ title: "Copied", description: "User ID copied to clipboard." });
                                                            }}
                                                        >
                                                            <Mail size={14} /> Copy User ID
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {filtered.length > 0 && (
                            <div className="px-4 py-3 border-t border-border bg-muted/10 text-xs text-muted-foreground">
                                Showing {filtered.length} of {users.length} user{users.length !== 1 ? "s" : ""}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminUsers;
