import { Gift, CreditCard, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const denominations = ["₹500", "₹1,000", "₹2,500", "₹5,000"];

const GiftCards = () => {
    return (
        <div className="container py-12 px-4 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <Gift className="text-secondary" size={32} />
                <h1 className="text-3xl font-heading font-bold text-primary">Gift Cards</h1>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
                <div className="bg-gradient-to-br from-primary to-secondary p-8 rounded-[2rem] aspect-[1.6/1] flex flex-col justify-between text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold italic">Vastraa</h2>
                        <p className="opacity-80">Gift of Elegance</p>
                    </div>
                    <div className="relative z-10">
                        <div className="text-4xl font-bold tracking-widest mb-2">VALID ANYWHERE</div>
                        <div className="text-sm opacity-60 uppercase tracking-tighter">Powered by Vastraa Pay</div>
                    </div>
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
                </div>

                <div className="space-y-8">
                    <div>
                        <h3 className="text-xl font-heading font-bold mb-4">Choose Amount</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {denominations.map((val) => (
                                <button key={val} className="border border-border py-3 rounded-xl hover:border-primary hover:text-primary transition-all font-bold">
                                    {val}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-muted/30 p-6 rounded-2xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-white p-3 rounded-full shadow-sm">
                                <Send size={20} className="text-primary" />
                            </div>
                            <div>
                                <div className="font-bold">Send to a Friend</div>
                                <div className="text-sm text-muted-foreground font-body">Instant delivery via email</div>
                            </div>
                        </div>
                        <Button variant="secondary" className="rounded-full">Get Started</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GiftCards;
