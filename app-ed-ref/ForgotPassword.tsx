import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const mutation = trpc.authExt.requestPasswordReset.useMutation({
    onSuccess: () => setSent(true),
    onError: (e) => toast.error("Failed to send reset email", { description: e.message }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    mutation.mutate({ email, origin: window.location.origin });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30">
            <Zap className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-white text-2xl font-bold">Vigronex</h1>
          <p className="text-white/40 text-sm mt-1">Performance Program</p>
        </div>

        <div className="bg-[#13131a] border border-white/10 rounded-2xl p-6">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-white font-semibold text-lg mb-2">Check your email</h2>
              <p className="text-white/50 text-sm mb-5">
                We've sent a password reset link to <span className="text-white">{email}</span>.
                The link expires in 1 hour.
              </p>
              <Button
                variant="outline"
                className="border-white/10 text-white/70 hover:text-white w-full"
                onClick={() => navigate("/")}
              >
                Back to Home
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-white font-semibold text-lg mb-1">Forgot your password?</h2>
              <p className="text-white/50 text-sm mb-5">Enter your email and we'll send you a reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-white/70 text-sm mb-1.5 block">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </>
          )}
        </div>

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mx-auto mt-5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      </div>
    </div>
  );
}
