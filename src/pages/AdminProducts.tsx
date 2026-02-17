import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Package,
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    ExternalLink,
    LayoutDashboard,
    ShoppingBag,
    Users,
    LogOut,
    ChevronLeft
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useCategories } from "@/hooks/useCategories";

const AdminProducts = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { data: categories } = useCategories();

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        stock: "",
        category_id: "",
        description: "",
        image_url: ""
    });

    useEffect(() => {
        const isAdmin = sessionStorage.getItem("isAdmin") === "true";
        if (!isAdmin) {
            navigate("/admin");
            return;
        }
        fetchProducts();
    }, [navigate]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*, category:categories(name)');

            if (error) throw error;
            setProducts(data || []);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('products')
                .insert([{
                    name: formData.name,
                    price: parseFloat(formData.price),
                    stock_quantity: parseInt(formData.stock),
                    category_id: formData.category_id,
                    description: formData.description
                }]);

            if (error) throw error;

            toast({
                title: "Success",
                description: "Product added successfully",
            });
            setIsAddDialogOpen(false);
            fetchProducts();
            setFormData({ name: "", price: "", stock: "", category_id: "", description: "", image_url: "" });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast({
                title: "Deleted",
                description: "Product removed successfully",
            });
            fetchProducts();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("isAdmin");
        navigate("/admin");
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-muted/30 flex">
            {/* Sidebar (Same as Dashboard) */}
            <aside className="w-64 bg-white border-r border-border hidden md:flex flex-col">
                <div className="p-6 border-b border-border">
                    <h2 className="text-2xl font-heading font-bold text-primary">Vastraa Admin</h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-xl transition-all">
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link to="/admin/products" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-medium">
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
            <main className="flex-1 p-8">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <Link to="/admin/dashboard" className="text-sm text-primary flex items-center gap-1 mb-2 hover:underline">
                                <ChevronLeft size={14} /> Back to Dashboard
                            </Link>
                            <h1 className="text-3xl font-bold">Product Catalog</h1>
                        </div>

                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="rounded-xl gap-2 h-12 px-6">
                                    <Plus size={20} /> Add New Product
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] rounded-3xl">
                                <DialogHeader>
                                    <DialogTitle>Add New Product</DialogTitle>
                                    <DialogDescription>
                                        Enter the details of the new product to add to your store.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleAddProduct} className="space-y-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Product Name</Label>
                                        <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Traditional Silk Saree" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="price">Price (₹)</Label>
                                            <Input id="price" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="2999" required />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="stock">Stock</Label>
                                            <Input id="stock" type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} placeholder="50" required />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select onValueChange={val => setFormData({ ...formData, category_id: val })} required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories?.map((cat: any) => (
                                                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Input id="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Product details..." />
                                    </div>
                                    <DialogFooter className="pt-4">
                                        <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                        <Button type="submit">Create Product</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-3">
                            <Search className="text-muted-foreground" size={18} />
                            <Input
                                placeholder="Search by name or category..."
                                className="border-0 bg-transparent focus-visible:ring-0 px-0 h-auto text-sm"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-10">Loading products...</TableCell>
                                    </TableRow>
                                ) : filteredProducts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-10">No products found</TableCell>
                                    </TableRow>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">{product.name}</TableCell>
                                            <TableCell>{product.category?.name || "Uncategorized"}</TableCell>
                                            <TableCell>₹{product.price}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.stock_quantity > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {product.stock_quantity} in stock
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreVertical size={16} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40 rounded-xl">
                                                        <DropdownMenuItem className="gap-2 cursor-pointer">
                                                            <Edit size={14} /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 text-destructive cursor-pointer" onClick={() => handleDeleteProduct(product.id)}>
                                                            <Trash2 size={14} /> Delete
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                                                            <ExternalLink size={14} /> View Live
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminProducts;
