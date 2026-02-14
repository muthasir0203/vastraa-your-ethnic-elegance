import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground pt-10 pb-6">
    <div className="container">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 className="font-heading text-xl font-bold mb-3 text-gradient-gold">Vastraa</h3>
          <p className="font-body text-sm text-primary-foreground/70 leading-relaxed">
            India's premium marketplace for women's ethnic fashion. Direct from artisans to your wardrobe.
          </p>
        </div>
        <div>
          <h4 className="font-body font-semibold text-sm mb-3">Shop</h4>
          {["Sarees", "Kurtis", "Lehengas", "Kurta Sets"].map((l) => (
            <Link key={l} to={`/products?category=${encodeURIComponent(l)}`} className="block font-body text-sm text-primary-foreground/60 hover:text-secondary transition-colors py-1">{l}</Link>
          ))}
        </div>
        <div>
          <h4 className="font-body font-semibold text-sm mb-3">Help</h4>
          {["Track Order", "Returns", "FAQs", "Contact Us"].map((l) => (
            <span key={l} className="block font-body text-sm text-primary-foreground/60 py-1">{l}</span>
          ))}
        </div>
        <div>
          <h4 className="font-body font-semibold text-sm mb-3">Sell on Vastraa</h4>
          <p className="font-body text-sm text-primary-foreground/60 leading-relaxed mb-3">
            Start selling your ethnic wear to millions of customers.
          </p>
          <Link to="/seller" className="inline-block bg-secondary text-secondary-foreground font-body font-semibold text-xs px-5 py-2 rounded-full hover:brightness-110 transition-all">
            Become a Seller
          </Link>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 pt-4 text-center">
        <p className="font-body text-xs text-primary-foreground/40">© 2026 Vastraa. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
