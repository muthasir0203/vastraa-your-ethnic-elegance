import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    LogOut,
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Layers,
    ChevronLeft,
    X,
    Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface Collection {
    id: string;
    name: string;
    slug: string;
    created_at: string;
    product_count?: number;
}

const AdminCollections = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

    const [formData, setFormData] = useState({ name: "", slug: "" });

    useEffect(() => {
        const isAdmin = sessionStorage.getItem("isAdmin") === "true";
        if (!isAdmin) {
            navigate("/admin");
            return;
        }
        fetchCollections();
    }, [navigate]);

    const fetchCollections = async () => {
        setLoading(true);
        try {
            const { data: cats, error } = await supabase
                .from("categories")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;

            // Fetch product counts per category
            const { data: products } = await supabase
                .from("products")
                .select("category_id");

            const countMap: Record<string, number> = {};
            (products || []).forEach((p: any) => {
                if (p.category_id) {
                    countMap[p.category_id] = (countMap[p.category_id] || 0) + 1;
                }
            });

            const enriched = (cats || []).map((c: any) => ({
                ...c,
                product_count: countMap[c.id] || 0,
            }));

            setCollections(enriched);
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

    const slugify = (text: string) =>
        text
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");

    const handleNameChange = (name: string) => {
        setFormData({ name, slug: slugify(name) });
    };

    const handleAddCollection = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase.from("categories").insert([
                { name: formData.name, slug: formData.slug },
            ]);
            if (error) throw error;

            toast({ title: "Collection created", description: `"${formData.name}" added successfully.` });
            setIsAddDialogOpen(false);
            setFormData({ name: "", slug: "" });
            fetchCollections();
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        }
    };

    const openEditDialog = (collection: Collection) => {
        setEditingCollection(collection);
        setFormData({ name: collection.name, slug: collection.slug });
        setIsEditDialogOpen(true);
    };

    const handleEditCollection = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCollection) return;
        try {
            const { error } = await supabase
                .from("categories")
                .update({ name: formData.name, slug: formData.slug })
                .eq("id", editingCollection.id);

            if (error) throw error;

            toast({ title: "Collection updated", description: `"${formData.name}" updated successfully.` });
            setIsEditDialogOpen(false);
            setEditingCollection(null);
            setFormData({ name: "", slug: "" });
            fetchCollections();
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        }
    };

    const handleDeleteCollection = async (id: string, name: string) => {
        if (!confirm(`Delete collection "${name}"? Products in this collection will become uncategorized.`)) return;
        try {
            const { error } = await supabase.from("categories").delete().eq("id", id);
            if (error) throw error;

            toast({ title: "Deleted", description: `"${name}" removed successfully.` });
            fetchCollections();
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("isAdmin");
        navigate("/admin");
    };

    const filtered = collections.filter(
        (c) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const CollectionForm = ({ onSubmit, submitLabel }: { onSubmit: (e: React.FormEvent) => void; submitLabel: string }) => (
        <form onSubmit={onSubmit} className="space-y-4 py-4">
            <div className="grid gap-2">
                <Label htmlFor="col-name">Collection Name</Label>
                <Input
                    id="col-name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Silk Sarees"
                    required
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="col-slug">
                    URL Slug
                    <span className="ml-2 text-xs text-muted-foreground">(auto-generated)</span>
                </Label>
                <Input
                    id="col-slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. silk-sarees"
                    required
                />
            </div>
            <DialogFooter className="pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        setIsAddDialogOpen(false);
                        setIsEditDialogOpen(false);
                        setFormData({ name: "", slug: "" });
                    }}
                >
                    Cancel
                </Button>
                <Button type="submit" className="gap-2">
                    <Check size={16} /> {submitLabel}
                </Button>
            </DialogFooter>
        </form>
    );

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
                        className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-medium"
                    >
                        <Layers size={20} /> Collections
                    </Link>
                    <Link
                        to="/account/orders"
                        className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-xl transition-all"
                    >
                        <ShoppingBag size={20} /> Orders
                    </Link>
                    <Link
                        to="/admin/users"
                        className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-xl transition-all"
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
                <div className="max-w-5xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <Link
                                to="/admin/dashboard"
                                className="text-sm text-primary flex items-center gap-1 mb-2 hover:underline"
                            >
                                <ChevronLeft size={14} /> Back to Dashboard
                            </Link>
                            <h1 className="text-3xl font-bold">Collections</h1>
                            <p className="text-muted-foreground text-sm mt-1">
                                Manage your product categories and collections
                            </p>
                        </div>

                        {/* Add Dialog */}
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="rounded-xl gap-2 h-12 px-6">
                                    <Plus size={20} /> New Collection
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[460px] rounded-3xl">
                                <DialogHeader>
                                    <DialogTitle>Create Collection</DialogTitle>
                                    <DialogDescription>
                                        Add a new collection to organise your products.
                                    </DialogDescription>
                                </DialogHeader>
                                <CollectionForm onSubmit={handleAddCollection} submitLabel="Create" />
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Stats bar */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3 shadow-sm">
                            <div className="p-2 rounded-xl bg-violet-100 text-violet-600">
                                <Layers size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Total Collections</p>
                                <p className="text-2xl font-bold">{collections.length}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3 shadow-sm">
                            <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                                <Package size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Total Products</p>
                                <p className="text-2xl font-bold">
                                    {collections.reduce((a, c) => a + (c.product_count || 0), 0)}
                                </p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3 shadow-sm">
                            <div className="p-2 rounded-xl bg-green-100 text-green-600">
                                <Check size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Active</p>
                                <p className="text-2xl font-bold">{collections.filter(c => (c.product_count || 0) > 0).length}</p>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-3">
                            <Search className="text-muted-foreground" size={18} />
                            <Input
                                placeholder="Search collections..."
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
                                    <TableHead>Name</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Products</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                            Loading collections...
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                                    <Layers className="text-muted-foreground" size={20} />
                                                </div>
                                                <p className="text-muted-foreground text-sm">
                                                    {searchTerm ? "No collections match your search." : "No collections yet. Create your first one!"}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filtered.map((col) => (
                                        <TableRow key={col.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-semibold">{col.name}</TableCell>
                                            <TableCell>
                                                <code className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
                                                    {col.slug}
                                                </code>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={col.product_count && col.product_count > 0 ? "default" : "secondary"}
                                                    className="rounded-full"
                                                >
                                                    {col.product_count} {col.product_count === 1 ? "product" : "products"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {new Date(col.created_at).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreVertical size={16} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40 rounded-xl">
                                                        <DropdownMenuItem
                                                            className="gap-2 cursor-pointer"
                                                            onClick={() => openEditDialog(col)}
                                                        >
                                                            <Edit size={14} /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="gap-2 cursor-pointer"
                                                            onClick={() => navigate(`/products?category=${col.slug}`)}
                                                        >
                                                            <Package size={14} /> View Products
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="gap-2 text-destructive cursor-pointer"
                                                            onClick={() => handleDeleteCollection(col.id, col.name)}
                                                        >
                                                            <Trash2 size={14} /> Delete
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

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[460px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>Edit Collection</DialogTitle>
                        <DialogDescription>
                            Update the name or slug for this collection.
                        </DialogDescription>
                    </DialogHeader>
                    <CollectionForm onSubmit={handleEditCollection} submitLabel="Save Changes" />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminCollections;
