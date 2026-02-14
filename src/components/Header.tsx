import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Heart, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { categories } from "@/data/products";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const { cartCount, wishlist } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search sarees, kurtis, lehengas..."
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
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlist.length}
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
          <Link to="/account" className="hidden md:block p-2 text-foreground hover:text-primary transition-colors">
            <User size={20} />
          </Link>
        </div>
      </div>

      {/* Mobile search */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="md:hidden overflow-hidden border-t border-border">
            <div className="p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search sarees, kurtis, lehengas..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-muted text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop nav */}
      <nav className="hidden md:block border-t border-border">
        <div className="container flex items-center gap-6 h-10 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${encodeURIComponent(cat)}`}
              className="text-sm font-body font-medium text-foreground/80 hover:text-primary whitespace-nowrap transition-colors"
            >
              {cat}
            </Link>
          ))}
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
                  className="block py-3 px-4 text-sm font-body font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  {cat}
                </Link>
              ))}
              <div className="pt-4 border-t border-border mt-4">
                <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 py-3 px-4 text-sm font-body font-medium text-foreground hover:bg-muted rounded-lg">
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
