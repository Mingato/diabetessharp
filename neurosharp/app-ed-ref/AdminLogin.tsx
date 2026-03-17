import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAdmin } from "@/contexts/AdminContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const { login, isAuthenticated } = useAdmin();

  // If already authenticated (session admin or JWT), skip login page
  useEffect(() => {
    if (isAuthenticated) navigate("/admin/dashboard");
  }, [isAuthenticated]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: (data) => {
      login(data.token, data.username);
      navigate("/admin/dashboard");
    },
    onError: (err) => {
      toast.error("Login failed", { description: err.message });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    loginMutation.mutate({ username, password });
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
          <div className="flex items-center gap-1.5 text-amber-500 text-sm font-medium mt-1">
            <ShieldCheck className="w-4 h-4" />
            Admin Panel
          </div>
        </div>

        {/* Form */}
        <div className="bg-[#13131a] border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-lg mb-5">Sign in to Admin</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-white/70 text-sm mb-1.5 block">Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50"
                autoComplete="username"
              />
            </div>
            <div>
              <Label className="text-white/70 text-sm mb-1.5 block">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold mt-2"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          Restricted access — authorized personnel only
        </p>
      </div>
    </div>
  );
}
