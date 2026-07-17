import { useState } from "react";
import { Link } from "wouter";
import { usePageTitle } from "@/hooks/use-page-title";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Reveal, Input, PrimaryBtn } from "@/components/ui/motion-primitives";

export default function ForgotPassword() {
  usePageTitle("Reset Password");
  const [email, setEmail]       = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

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
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
      style={{ background: "#070708" }}
    >
      {/* Watermark */}
      <div
        className="fixed inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{
          fontFamily: "'TASA Orbiter Display', sans-serif",
          fontWeight: 800,
          fontSize: "30vw",
          color: "rgba(255,255,255,0.015)",
          letterSpacing: "-0.05em",
          lineHeight: 1,
        }}
      >
        D.
      </div>

      <div className="w-full max-w-md relative">
        <Reveal className="mb-10">
          <Link href="/" className="font-display font-bold text-white text-xl uppercase tracking-tight">
            Directioner
          </Link>
        </Reveal>

        <div className="rounded-xl p-10" style={{ background: "#0f0f12", border: "1px solid rgba(255,255,255,0.06)" }}>
          {/* Yellow top line */}
          <div className="absolute top-0 left-10 right-10 h-px" style={{ background: "#FFE500", opacity: 0.6 }} />

          <Reveal>
            <h1 className="font-display font-bold text-white text-3xl uppercase mb-2">Reset Password.</h1>
            <p className="font-mono text-xs mb-8" style={{ color: "rgba(255,255,255,0.35)" }}>
              Enter your email and we'll send a reset link.
            </p>
          </Reveal>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-10 text-center"
            >
              <div className="text-3xl mb-4">✓</div>
              <div className="font-mono text-sm font-bold text-white mb-2">Email Sent.</div>
              <div className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.38)" }}>
                Check your inbox for the reset link.
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-mono text-xs px-4 py-3"
                  style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)", color: "#f43f5e" }}
                >
                  {error}
                </motion.div>
              )}
              <Input
                label="Account Email"
                type="email"
                placeholder="admin@server.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <PrimaryBtn type="submit" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border border-black border-t-transparent rounded-full animate-spin" />
                    Sending…
                  </span>
                ) : "Send Reset Link"}
              </PrimaryBtn>
            </form>
          )}
        </div>

        <Reveal delay={0.2} className="mt-6 text-center">
          <Link href="/login"
            className="font-mono text-xs uppercase tracking-widest transition-colors"
            style={{ color: "rgba(255,255,255,0.3)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"; }}>
            ← Return to Sign In
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
