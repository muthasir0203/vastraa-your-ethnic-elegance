import { Bell, Mail, Smartphone, MessageSquare } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Notifications = () => {
    return (
        <div className="container py-12 px-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <Bell className="text-primary" size={32} />
                <h1 className="text-3xl font-heading font-bold text-primary">Notifications</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="p-8 border-b border-border">
                    <h2 className="text-xl font-heading font-semibold mb-2">Email Notifications</h2>
                    <p className="text-sm text-muted-foreground font-body">Decide what you want to hear about in your inbox.</p>
                </div>

                <div className="p-8 space-y-8">
                    {[
                        { id: "orders", title: "Order Updates", desc: "Get notified when your order is confirmed, shipped, or delivered.", icon: <Mail size={20} /> },
                        { id: "promos", title: "Promotions & Offers", desc: "Stay updated on the latest sales, discounts, and exclusive collections.", icon: <Mail size={20} /> },
                        { id: "stock", title: "In-stock Alerts", desc: "We'll let you know when items in your wishlist are back in stock.", icon: <Mail size={20} /> }
                    ].map((pref) => (
                        <div key={pref.id} className="flex items-start justify-between gap-4">
                            <div className="flex gap-4">
                                <div className="mt-1 text-primary/60">{pref.icon}</div>
                                <div>
                                    <Label htmlFor={pref.id} className="text-base font-bold cursor-pointer">{pref.title}</Label>
                                    <p className="text-sm text-muted-foreground font-body max-w-md">{pref.desc}</p>
                                </div>
                            </div>
                            <Switch id={pref.id} defaultChecked />
                        </div>
                    ))}
                </div>

                <div className="p-8 bg-muted/20 border-t border-border">
                    <h2 className="text-xl font-heading font-semibold mb-6 flex items-center gap-2">
                        <Smartphone size={22} className="text-secondary" /> Push Notifications
                    </h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-base font-bold">App Notifications</Label>
                            <p className="text-sm text-muted-foreground font-body">Enable push alerts on your mobile device.</p>
                        </div>
                        <Switch defaultChecked={false} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
