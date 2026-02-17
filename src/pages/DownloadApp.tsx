import { Download, Smartphone, Apple, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const DownloadApp = () => {
    return (
        <div className="container py-20 px-4 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary">
                    <Download size={32} />
                </div>
                <h1 className="text-5xl font-heading font-bold text-primary leading-tight">
                    Vastraa in Your Pocket
                </h1>
                <p className="text-xl text-muted-foreground font-body leading-relaxed">
                    Experience the finest ethnic wear shopping on the go. Faster checkout, exclusive app-only deals, and instant notifications.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                    <Button className="h-16 px-8 rounded-2xl bg-black hover:bg-black/90 text-white flex gap-3 text-lg transition-transform hover:scale-105">
                        <Apple size={28} />
                        <div className="text-left">
                            <div className="text-[10px] uppercase font-bold opacity-60 leading-none">Download on the</div>
                            <div className="font-bold">App Store</div>
                        </div>
                    </Button>
                    <Button className="h-16 px-8 rounded-2xl bg-black hover:bg-black/90 text-white flex gap-3 text-lg transition-transform hover:scale-105">
                        <Play size={28} />
                        <div className="text-left">
                            <div className="text-[10px] uppercase font-bold opacity-60 leading-none">Get it on</div>
                            <div className="font-bold">Google Play</div>
                        </div>
                    </Button>
                </div>
            </div>

            <div className="flex-1 relative">
                <div className="w-64 h-[500px] bg-slate-900 rounded-[3rem] border-8 border-slate-800 shadow-2xl relative z-10 overflow-hidden mx-auto">
                    <div className="w-full h-full bg-gradient-to-b from-primary to-secondary flex items-center justify-center p-6 text-center text-white">
                        <div>
                            <div className="text-3xl font-heading font-bold mb-2 italic">Vastraa</div>
                            <p className="text-xs opacity-70">The World of Ethnic Elegance</p>
                        </div>
                    </div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl"></div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/20 rounded-full blur-3xl -z-10"></div>
            </div>
        </div>
    );
};

export default DownloadApp;
