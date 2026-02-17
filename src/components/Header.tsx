import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  UserPlus,
  Package,
  Store,
  Gift,
  Bell,
  Download,
  LogOut,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from "@/components/SupabaseAuthProvider";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useCategories } from "@/hooks/useCategories";

const Header = () => {
  const { user, signOut } = useSupabaseAuth();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { data: categoriesData } = useCategories();

  const categories = [
    "Sarees",
    "Kurtis",
    "Lehenghas",
    "Duppatas",
    "New Arrival",
    "Festive Collection",
    "Wedding Collection"
  ];

  const appPages = [
    { name: "Gift Cards", path: "/gift-cards" },
    { name: "Rewards", path: "/rewards" },
    { name: "Download App", path: "/download" }
  ];

  const cartCount = cartItems?.length || 0;
  const wishlistCount = wishlistItems?.length || 0;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get("category");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground text-xs py-1.5 text-center font-body tracking-wide">
        ✨ Free Delivery on orders above ₹999 | Use code <span className="font-semibold text-gold-light">VASTRAA10</span> for 10% off
      </div>

      <div className="container flex items-center justify-between h-14 md:h-16 gap-3">
        {/* Mobile menu toggle */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-1.5 text-foreground">
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Logo */}
        <Link to="/" className="font-heading text-2xl md:text-3xl font-bold text-primary tracking-tight">
          Vastraa
        </Link>

        {/* Search - desktop */}
        <div className="hidden md:flex flex-1 max-w-lg mx-6">
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
              size={18}
              onClick={() => handleSearch()}
            />
            <input
              type="text"
              placeholder="Search sarees, kurtis, lehengas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-muted border-0 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-1 md:gap-3">
          <button onClick={() => setSearchOpen(!searchOpen)} className="md:hidden p-2 text-foreground">
            <Search size={20} />
          </button>
          <Link to="/wishlist" className="relative p-2 text-foreground hover:text-primary transition-colors">
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative p-2 text-foreground hover:text-primary transition-colors">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hidden md:flex items-center gap-1 p-2 text-foreground hover:text-primary transition-colors focus:outline-none">
                <User size={20} />
                <ChevronDown size={14} className="text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 shadow-xl border-border bg-background/95 backdrop-blur-sm">
              {!user ? (
                <div className="p-3 mb-2 bg-muted/30 rounded-lg">
                  <DropdownMenuLabel className="font-heading text-sm font-semibold p-0 mb-1">New Customer?</DropdownMenuLabel>
                  <div className="flex items-center justify-between gap-2 mt-2">
                    <Link to="/login" className="w-full">
                      <Button variant="default" size="sm" className="w-full text-xs h-8">Sign In</Button>
                    </Link>
                    <Link to="/register" className="w-full">
                      <Button variant="outline" size="sm" className="w-full text-xs h-8">Sign Up</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-3 mb-2">
                  <DropdownMenuLabel className="font-heading text-sm font-semibold p-0">Welcome,</DropdownMenuLabel>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              )}

              <DropdownMenuSeparator className="my-1" />

              <DropdownMenuItem className="cursor-pointer py-2.5 rounded-md focus:bg-primary/10 focus:text-primary">
                <Link to="/account/orders" className="flex items-center w-full">
                  <Package size={18} className="mr-3 text-muted-foreground" />
                  <span className="flex-1">Orders</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer py-2.5 rounded-md focus:bg-primary/10 focus:text-primary">
                <Link to="/seller/register" className="flex items-center w-full">
                  <Store size={18} className="mr-3 text-muted-foreground" />
                  <span className="flex-1">Become Seller</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer py-2.5 rounded-md focus:bg-primary/10 focus:text-primary">
                <Link to="/rewards" className="flex items-center w-full">
                  <Gift size={18} className="mr-3 text-muted-foreground" />
                  <span className="flex-1">Rewards</span>
                </Link>
              </DropdownMenuItem>

              {user && (
                <>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer py-2.5 rounded-md focus:bg-destructive/10 focus:text-destructive text-destructive"
                  >
                    <div className="flex items-center w-full">
                      <LogOut size={18} className="mr-3" />
                      <span className="flex-1">Sign Out</span>
                    </div>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile search */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="md:hidden overflow-hidden border-t border-border">
            <div className="p-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={18}
                  onClick={() => handleSearch()}
                />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search sarees, kurtis, lehengas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-muted text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop nav */}
      <nav className="hidden md:block border-t border-border">
        <div className="container flex items-center justify-between h-10">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide pr-4 border-r border-border">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}`}
                className={`text-sm font-body font-medium whitespace-nowrap transition-colors ${currentCategory === cat
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-foreground/80 hover:text-primary"
                  }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6 pl-4 shrink-0">
            {appPages.map((page) => (
              <Link
                key={page.name}
                to={page.path}
                className="text-sm font-body font-medium text-foreground/80 hover:text-primary transition-colors whitespace-nowrap"
              >
                {page.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-0 top-[calc(3.5rem+1.75rem)] z-50 bg-background md:hidden"
          >
            <div className="p-4 space-y-1">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/products?category=${encodeURIComponent(cat)}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 px-4 text-sm font-body font-medium rounded-lg transition-colors ${currentCategory === cat
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                    }`}
                >
                  {cat}
                </Link>
              ))}
              <div className="pt-4 border-t border-border mt-4">
                {appPages.map((page) => (
                  <Link
                    key={page.name}
                    to={page.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 px-4 text-sm font-body font-medium text-foreground hover:bg-muted rounded-lg"
                  >
                    <Package size={18} className="text-muted-foreground" />
                    {page.name}
                  </Link>
                ))}
                <Link to="/account/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 py-3 px-4 text-sm font-body font-medium text-foreground hover:bg-muted rounded-lg">
                  <User size={18} /> My Account
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
