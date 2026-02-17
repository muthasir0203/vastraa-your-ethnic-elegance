import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ShieldCheck, Lock } from "lucide-react";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    // Check if already logged in as admin
    useEffect(() => {
        const isAdmin = sessionStorage.getItem("isAdmin") === "true";
        if (isAdmin) {
            navigate("/admin/dashboard");
        }
    }, [navigate]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Specific credentials as requested by user
        if (email === "aanya@gmail.com" && password === "aanya1234567") {
            sessionStorage.setItem("isAdmin", "true");
            toast({
                title: "Admin Access Granted",
                description: "Welcome back, Aanya.",
            });
            navigate("/admin/dashboard");
        } else {
            toast({
                variant: "destructive",
                title: "Access Denied",
                description: "Invalid admin credentials.",
            });
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-border">
                <div className="bg-primary p-8 text-center text-white">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-3xl font-heading font-bold mb-2">Admin Portal</h1>
                    <p className="opacity-80 font-body">Vastraa Management System</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email">Admin Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@vastraa.com"
                                className="h-12 rounded-xl"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Security Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="h-12 rounded-xl"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-12 rounded-xl text-lg font-bold transition-all hover:scale-[1.02] active:scale-95"
                            disabled={isLoading}
                        >
                            {isLoading ? "Verifying..." : "Login to Dashboard"}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold italic">
                            Authorized Personnel Only
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
