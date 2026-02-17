import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullname,
                    },
                },
            });

            if (error) throw error;

            if (data.user) {
                toast({
                    title: "Account created!",
                    description: "Please check your email for a confirmation link.",
                });
                navigate("/login");
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Registration failed",
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
                        <UserPlus size={32} />
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-primary mb-2">Create Account</h1>
                    <p className="text-muted-foreground font-body">Join Vastraa and start shopping</p>
                </div>

                <form className="space-y-4" onSubmit={handleRegister}>
                    <div className="space-y-2">
                        <Label htmlFor="fullname">Full Name</Label>
                        <Input
                            id="fullname"
                            type="text"
                            placeholder="John Doe"
                            className="rounded-xl h-12"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            required
                        />
                    </div>
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
                        <Label htmlFor="password">Password</Label>
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
                        {loading ? "Creating Account..." : "Sign Up"}
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-border text-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary font-semibold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
