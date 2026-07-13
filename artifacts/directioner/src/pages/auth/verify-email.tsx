import { useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { usePageTitle } from "@/hooks/use-page-title";
import { BlueprintBackground } from "@/components/animations";
import { Loader2, Mail, CheckCircle, RefreshCw } from "lucide-react";

/**
 * /auth/verify-email
 * Shown immediately after email/password registration.
 * The email is passed via sessionStorage so it survives the redirect.
 */
export default function VerifyEmail() {
  usePageTitle("Verify Your Email");
  const [, setLocation] = useLocation();

  const email = sessionStorage.getItem("pending_verification_email") ?? "";
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState("");

  const handleResend = async () => {
    if (!email) {
      setError("No email on record. Please register again.");
      return;
    }
    setResending(true);
    setError("");
    try {
      const { error: err } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (err) throw err;
      setResent(true);
    } catch (err: any) {
      setError(err.message || "Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background pt-16">
      {/* Left decoration */}
      <BlueprintBackground className="hidden md:flex flex-1 flex-col items-center justify-center p-12 border-r border-border">
        <div className="max-w-md w-full relative">
          <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-8">
            <Mail className="text-primary" size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black leading-tight text-white mb-6 text-center">
            Check your <span className="text-primary block mt-2">inbox.</span>
          </h1>
          <p className="font-mono text-xs text-muted-foreground text-center">
            A verification link has been sent to your email address.
          </p>
        </div>
      </BlueprintBackground>

      {/* Right side content */}
      <div className="flex-1 flex flex-col justify-center p-6 sm:p-12 md:p-24">
        <div className="w-full max-w-sm mx-auto space-y-8">
          {/* Mobile header */}
          <div className="md:hidden">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-6">
              <Mail className="text-primary" size={28} />
            </div>
            <h1 className="text-3xl font-display font-black text-white">Check your inbox.</h1>
          </div>

          <div className="space-y-3">
            <p className="font-mono text-sm text-muted-foreground">
              We sent a verification link to:
            </p>
            {email && (
              <div className="p-3 bg-card border border-border font-mono text-sm text-primary truncate">
                {email}
              </div>
            )}
            <p className="font-mono text-xs text-muted-foreground">
              Click the link in the email to activate your account. The link expires in 24 hours.
            </p>
          </div>

          <div className="h-px bg-border" />

          {/* Resend section */}
          <div className="space-y-4">
            <p className="font-mono text-xs uppercase text-muted-foreground">
              Didn&apos;t receive it?
            </p>

            {resent ? (
              <div className="flex items-center gap-2 p-3 border border-accent/50 bg-accent/10 font-mono text-xs text-accent">
                <CheckCircle size={14} />
                Verification email resent successfully.
              </div>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="w-full border border-border p-3 font-mono text-xs uppercase text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {resending ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  <RefreshCw size={14} />
                )}
                Resend Verification Email
              </button>
            )}

            {error && (
              <div className="p-3 border border-red-500/50 bg-red-500/10 text-red-500 font-mono text-xs uppercase">
                // ERROR: {error}
              </div>
            )}
          </div>

          <div className="space-y-2 font-mono text-xs text-muted-foreground">
            <p>Check your spam folder if you don&apos;t see it.</p>
            <p>
              Wrong email?{" "}
              <button
                onClick={() => setLocation("/register")}
                className="text-primary hover:underline uppercase"
              >
                Register again
              </button>
            </p>
          </div>

          <div className="h-px bg-border" />

          <p className="font-mono text-xs text-muted-foreground text-center uppercase">
            Already verified?{" "}
            <button
              onClick={() => setLocation("/login")}
              className="text-primary hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
