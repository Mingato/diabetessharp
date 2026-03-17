import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, RefreshCw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface EmailVerificationModalProps {
  open: boolean;
  userId: number;
  email: string;
  name?: string;
  onVerified: () => void;
}

export function EmailVerificationModal({ open, userId, email, name, onVerified }: EmailVerificationModalProps) {
  const [code, setCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verified, setVerified] = useState(false);

  // Countdown for resend button
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const sendMutation = trpc.authExt.sendVerificationCode.useMutation({
    onSuccess: () => { toast.success("Verification code sent!"); setResendCooldown(60); },
    onError: (e: { message: string }) => toast.error("Failed to send code", { description: e.message }),
  });

  const verifyMutation = trpc.authExt.verifyEmailCode.useMutation({
    onSuccess: () => { setVerified(true); setTimeout(onVerified, 1500); },
    onError: (e: { message: string }) => toast.error("Invalid code", { description: e.message }),
  });

  // Auto-send on open
  useEffect(() => {
    if (open && userId && resendCooldown === 0) {
      sendMutation.mutate({ userId, email, name });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, userId]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length !== 6) return;
    verifyMutation.mutate({ userId, code });
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="bg-[#13131a] border-white/10 text-white sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            Verify Your Email
          </DialogTitle>
        </DialogHeader>

        {verified ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-9 h-9 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-1">Email verified!</h3>
            <p className="text-white/50 text-sm">Welcome to Vigronex. Setting up your account...</p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-start gap-3 bg-amber-500/10 rounded-xl p-4">
              <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-white/80 text-sm">We sent a 6-digit verification code to:</p>
                <p className="text-amber-400 font-semibold text-sm mt-0.5">{email}</p>
                <p className="text-white/40 text-xs mt-1">Check your inbox and spam folder.</p>
              </div>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  className="bg-white/5 border-white/10 text-white text-center text-2xl font-mono tracking-widest placeholder:text-white/20 focus:border-amber-500/50 h-14"
                  maxLength={6}
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold h-11"
                disabled={code.length !== 6 || verifyMutation.isPending}
              >
                {verifyMutation.isPending ? "Verifying..." : "Verify Email"}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-white/40 text-sm mb-2">Didn't receive the code?</p>
              <Button
                variant="ghost"
                size="sm"
                className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                disabled={resendCooldown > 0 || sendMutation.isPending}
                onClick={() => sendMutation.mutate({ userId, email, name })}
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
