import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

const Register = () => {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [authStep, setAuthStep] = useState<'PHONE' | 'OTP'>('PHONE');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithOtp({
                phone: phone,
            });

            if (error) throw error;

            setAuthStep('OTP');
            toast({
                title: "OTP Sent!",
                description: "Please check your phone for the verification code.",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Failed to send OTP",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.verifyOtp({
                phone,
                token: otp,
                type: 'sms',
            });

            if (error) throw error;

            toast({
                title: "Welcome!",
                description: "Account verified successfully.",
            });
            // Navigate to home or complete profile if needed. 
            // Since we don't capture name here, they might need to update profile later.
            navigate("/");
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Verification failed",
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
                        <Phone size={32} />
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-primary mb-2">
                        {authStep === 'PHONE' ? 'Create Account' : 'Verify Phone'}
                    </h1>
                    <p className="text-muted-foreground font-body">
                        {authStep === 'PHONE'
                            ? 'Sign up with your phone number'
                            : `Enter the code sent to ${phone}`
                        }
                    </p>
                </div>

                {authStep === 'PHONE' ? (
                    <form className="space-y-4" onSubmit={handleSendOtp}>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+91 98765 43210"
                                className="rounded-xl h-12"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                        <Button
                            className="w-full h-12 rounded-xl text-lg font-medium transition-all hover:scale-[1.02]"
                            disabled={loading}
                        >
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </Button>
                    </form>
                ) : (
                    <form className="space-y-4" onSubmit={handleVerifyOtp}>
                        <div className="space-y-2 flex justify-center">
                            <InputOTP
                                maxLength={6}
                                value={otp}
                                onChange={(value) => setOtp(value)}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                        <Button
                            className="w-full h-12 rounded-xl text-lg font-medium transition-all hover:scale-[1.02]"
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full"
                            onClick={() => setAuthStep('PHONE')}
                            disabled={loading}
                        >
                            Change Phone Number
                        </Button>
                    </form>
                )}

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
