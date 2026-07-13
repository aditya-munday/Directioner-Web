import { useState } from "react";
import { Link } from "wouter";
import { usePageTitle } from "@/hooks/use-page-title";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ForgotPassword() {
  usePageTitle("Forgot Password");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (err) throw err;
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md border border-border bg-card p-12 relative overflow-hidden">
        {/* Blueprint line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
        
        <h1 className="text-3xl font-display font-black text-white mb-2">Reset.</h1>
        <p className="font-mono text-xs text-muted-foreground uppercase mb-8">
          System recovery protocol initialized.
        </p>

        {submitted ? (
          <div className="p-4 border border-accent bg-accent/10 text-accent font-mono text-sm uppercase text-center mb-8">
            // EMAIL SENT ——————————— CHECK INBOX
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 border border-red-500/50 bg-red-500/10 text-red-500 font-mono text-xs uppercase">
                // ERROR: {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-muted-foreground">Account Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-background border border-border p-3 font-mono text-sm text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="admin@server.com"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-black font-mono font-bold px-6 py-4 uppercase text-sm corner-brackets hover:bg-primary/90 transition-colors flex justify-center items-center h-14"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="mt-8 text-center font-mono text-xs uppercase">
          <Link href="/login" className="text-muted-foreground hover:text-white transition-colors">
            ← Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
