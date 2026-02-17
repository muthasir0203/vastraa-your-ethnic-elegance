import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogIn } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            toast({
                title: "Welcome back!",
                description: "You have successfully signed in.",
            });
            navigate(from, { replace: true });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Login failed",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container max-w-md mx-auto py-20 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-border">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                        <LogIn size={32} />
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-primary mb-2">Welcome Back</h1>
                    <p className="text-muted-foreground font-body">Sign in to your Vastraa account</p>
                </div>

                <form className="space-y-4" onSubmit={handleLogin}>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            className="rounded-xl h-12"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link to="/forgot-password" title="Forgot password?" className="text-xs text-primary hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="rounded-xl h-12"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button
                        className="w-full h-12 rounded-xl text-lg font-medium transition-all hover:scale-[1.02]"
                        disabled={loading}
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-border text-center">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-primary font-semibold hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
