import { Store, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const BecomeSeller = () => {
    return (
        <div className="container py-16 px-4 max-w-3xl mx-auto">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/10 text-secondary mb-6">
                    <Store size={40} />
                </div>
                <h1 className="text-4xl font-heading font-bold text-primary mb-4">Grow Your Business with Vastraa</h1>
                <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
                    Reach millions of customers across India. Register as a Vastraa seller today and start selling your ethnic elegance.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mb-16">
                <div className="space-y-6">
                    <h2 className="text-2xl font-heading font-semibold text-foreground">Why sell on Vastraa?</h2>
                    <div className="space-y-4">
                        {[
                            "0% Commission on first 30 days",
                            "Access to 10M+ potential customers",
                            "Fastest payments in the industry",
                            "Dedicated account manager support",
                        ].map((benefit, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <CheckCircle2 className="text-secondary shrink-0" size={20} />
                                <span className="font-body text-foreground/80">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-xl border border-border">
                    <h3 className="text-xl font-heading font-bold mb-6">Seller Registration</h3>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="businessName">Business Name</Label>
                            <Input id="businessName" placeholder="e.g. Elegant Weaves" className="h-11 rounded-lg" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gstin">GSTIN (Optional)</Label>
                            <Input id="gstin" placeholder="GST Number" className="h-11 rounded-lg" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Primary Category</Label>
                            <Input id="category" placeholder="e.g. Sarees, Kurtis" className="h-11 rounded-lg" />
                        </div>
                        <Button className="w-full h-12 bg-secondary hover:bg-secondary/90 text-white rounded-lg mt-4 font-semibold">
                            Start Selling
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BecomeSeller;
