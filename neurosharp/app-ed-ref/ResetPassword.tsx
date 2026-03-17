import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function ResetPassword() {
  const [location, navigate] = useLocation();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Extract token from URL query param
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (t) setToken(t);
  }, [location]);

  const mutation = trpc.authExt.resetPassword.useMutation({
    onSuccess: () => setDone(true),
    onError: (e) => toast.error("Reset failed", { description: e.message }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    mutation.mutate({ token, newPassword: password });
  };

  const passwordsMatch = password && confirm && password === confirm;
  const passwordMismatch = password && confirm && password !== confirm;

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
          {done ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-white font-semibold text-lg mb-2">Password updated!</h2>
              <p className="text-white/50 text-sm mb-5">Your password has been reset successfully. You can now sign in with your new password.</p>
              <Button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold" onClick={() => navigate("/")}>
                Go to App
              </Button>
            </div>
          ) : !token ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-white font-semibold text-lg mb-2">Invalid link</h2>
              <p className="text-white/50 text-sm mb-5">This reset link is invalid or has expired. Please request a new one.</p>
              <Button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold" onClick={() => navigate("/forgot-password")}>
                Request New Link
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-white font-semibold text-lg mb-1">Set new password</h2>
              <p className="text-white/50 text-sm mb-5">Choose a strong password for your account.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-white/70 text-sm mb-1.5 block">New Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50 pr-10"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label className="text-white/70 text-sm mb-1.5 block">Confirm Password</Label>
                  <Input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
                    className={`bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50 ${
                      passwordMismatch ? "border-red-500/50" : passwordsMatch ? "border-emerald-500/50" : ""
                    }`}
                  />
                  {passwordMismatch && <p className="text-red-400 text-xs mt-1">Passwords do not match</p>}
                  {passwordsMatch && <p className="text-emerald-400 text-xs mt-1">Passwords match</p>}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold"
                  disabled={mutation.isPending || !!passwordMismatch}
                >
                  {mutation.isPending ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
