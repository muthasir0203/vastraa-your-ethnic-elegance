import { Truck, RotateCcw, ShieldCheck, Factory, BadgeIndianRupee } from "lucide-react";

const features = [
  { icon: Truck, title: "Cash on Delivery", desc: "Pay when you receive" },
  { icon: RotateCcw, title: "7-Day Returns", desc: "Easy return policy" },
  { icon: ShieldCheck, title: "Quality Checked", desc: "Every product verified" },
  { icon: Factory, title: "Direct from Makers", desc: "No middlemen" },
  { icon: BadgeIndianRupee, title: "Best Prices", desc: "Affordable fashion" },
];

const TrustSection = () => (
  <section className="py-8 md:py-12 bg-muted">
    <div className="container">
      <h2 className="font-heading text-2xl md:text-3xl font-bold text-center text-foreground mb-6 md:mb-8">
        Why Shop with Vastraa?
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
        {features.map((f) => (
          <div key={f.title} className="flex flex-col items-center text-center p-4 rounded-xl bg-card shadow-soft">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <f.icon size={22} className="text-primary" />
            </div>
            <h3 className="font-body font-semibold text-sm text-foreground mb-0.5">{f.title}</h3>
            <p className="font-body text-xs text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustSection;
