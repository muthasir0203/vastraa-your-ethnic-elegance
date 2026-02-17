import { useState } from "react";
import { Gift, Star, Award, TrendingUp, User, Crown, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

type RewardState = "guest" | "member" | "loyalty";

const Rewards = () => {
    const [state, setState] = useState<RewardState>("guest");

    const getBannerContent = () => {
        switch (state) {
            case "member":
                return {
                    title: "Welcome Back, Vastraa Member",
                    subtitle: "Track your progress and earn more with every purchase.",
                    points: "125",
                    cta: "Earn More Points",
                    icon: <User className="text-secondary" size={24} />
                };
            case "loyalty":
                return {
                    title: "Vastraa Plus Elite",
                    subtitle: "You're at the top of your elegance. Enjoy exclusive benefits.",
                    points: "1,250",
                    cta: "Redeem Points",
                    icon: <Crown className="text-gold" size={24} />
                };
            default:
                return {
                    title: "Vastraa Plus",
                    subtitle: "Loyalty that looks as good as you do.",
                    points: "0",
                    cta: "Join Now",
                    icon: <Star className="text-white/70" size={24} />
                };
        }
    };

    const content = getBannerContent();

    return (
        <div className="container py-12 px-4 max-w-5xl mx-auto">
            {/* Admin Toggle - For demonstration and viewing every state */}
            <div className="bg-muted/50 p-4 rounded-xl mb-8 flex flex-wrap items-center justify-center gap-4 border border-border">
                <span className="text-sm font-semibold uppercase tracking-wider opacity-60">View State:</span>
                <div className="flex bg-white rounded-lg p-1 border border-border shadow-sm">
                    {(["guest", "member", "loyalty"] as RewardState[]).map((s) => (
                        <button
                            key={s}
                            onClick={() => setState(s)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${state === s
                                ? "bg-primary text-white shadow-md scale-105"
                                : "text-muted-foreground hover:bg-muted"
                                }`}
                        >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-primary text-white p-10 rounded-3xl mb-12 relative overflow-hidden shadow-2xl transition-all duration-500">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            {state !== "guest" && (
                                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                    {content.icon}
                                </div>
                            )}
                            <h1 className="text-4xl md:text-5xl font-heading font-bold">{content.title}</h1>
                        </div>
                        <p className="text-xl opacity-90 font-body">{content.subtitle}</p>
                        <div className="flex gap-4 pt-2">
                            <Button variant="secondary" className="rounded-full px-8 h-12 text-lg font-bold transition-all hover:scale-105">
                                {content.cta}
                            </Button>
                            {state === "guest" && (
                                <Button variant="outline" className="rounded-full px-8 h-12 text-lg border-white/30 text-white hover:bg-white/10">
                                    Learn More
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className={`p-8 rounded-2xl border text-center min-w-[220px] transition-all duration-500 transform ${state === 'loyalty' ? 'bg-white/20 border-gold/50 scale-105' : 'bg-white/10 border-white/20'}`}>
                        <div className="text-xs uppercase tracking-widest opacity-70 mb-1">Your Balance</div>
                        <div className="text-5xl font-bold mb-2 flex items-center justify-center gap-2">
                            {content.points}
                            {state === "loyalty" && <BadgeCheck className="text-gold" size={24} />}
                        </div>
                        <div className="text-sm font-medium">Vastraa Points</div>
                    </div>
                </div>
                {/* Background decorative elements */}
                <div className={`absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 rounded-full blur-3xl transition-all duration-1000 ${state === 'loyalty' ? 'bg-gold/40' : 'bg-secondary/30'}`}></div>
                <div className={`absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl opacity-50 transition-all duration-1000 ${state === 'member' ? 'bg-primary/40' : 'bg-white/5'}`}></div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { icon: <Star className="text-gold" />, title: "Earn Points", desc: "Get 5 points for every ₹100 spent on any purchase." },
                    { icon: <Award className="text-secondary" />, title: "Exclusive Access", desc: "Early access to seasonal sales and new collections." },
                    { icon: <TrendingUp className="text-primary" />, title: "Bonus Rewards", desc: "Extra points on your birthday and special anniversaries." }
                ].map((feat, i) => (
                    <div key={i} className={`bg-white p-8 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg ${state === 'loyalty' && i === 1 ? 'border-gold shadow-md ring-1 ring-gold/20' : 'border-border'}`}>
                        <div className="mb-4">{feat.icon}</div>
                        <h3 className="text-xl font-heading font-bold mb-2">{feat.title}</h3>
                        <p className="text-muted-foreground font-body">{feat.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Rewards;
