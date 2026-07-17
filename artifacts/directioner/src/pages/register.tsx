import { useState } from "react";
import { Link } from "wouter";
import { usePageTitle } from "@/hooks/use-page-title";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Reveal, Input, PrimaryBtn } from "@/components/ui/motion-primitives";
import { useAuth } from "@/lib/auth";

const perks = [
  "Free forever tier — no credit card",
  "100 messages / day on free plan",
  "Upgrade or cancel anytime",
  "Your data stays yours — always",
];

export default function Register() {
  usePageTitle("Create Account");
  const { loginWithOAuth, register, configured } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"discord" | "google" | null>(null);
  const [error, setError] = useState("");

  const handleOAuth = async (provider: "discord" | "google") => {
    setError("");
    setOauthLoading(provider);
    try {
      await loginWithOAuth(provider);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "OAuth failed.");
      setOauthLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (!configured) throw new Error("Auth not configured — add Supabase secrets to enable registration.");
      const { needsVerification } = await register({ username: form.name, email: form.email, password: form.password });
      if (needsVerification) {
        setError("Check your email to verify your account before signing in.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2" style={{ background: "#070708" }}>
      {/* Left — brand panel */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "#0a0a0c", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>
          DIRECTIONER — CREATE ACCOUNT
        </div>
        <div className="absolute bottom-12 right-12 font-mono text-[9px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.15)" }}>
          EST. 2025
        </div>
        {/* Watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ fontFamily: "'TASA Orbiter Display', sans-serif", fontWeight: 800, fontSize: "16vw", color: "rgba(255,255,255,0.025)", letterSpacing: "-0.05em", lineHeight: 1 }}
        >
          D.
        </div>
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-display font-bold text-white mb-4 leading-[0.9]"
              style={{ fontSize: "clamp(36px, 4vw, 60px)", letterSpacing: "-0.04em" }}>
              Join the community.
            </h2>
            <p className="font-mono text-sm mb-12" style={{ color: "rgba(255,255,255,0.35)" }}>
              50,000 servers already use Directioner. Set yours up in under a minute.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-4"
          >
            {perks.map((perk, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-sm flex items-center justify-center shrink-0"
                  style={{ background: "rgba(255,229,0,0.15)", border: "1px solid rgba(255,229,0,0.3)" }}>
                  <Check size={11} style={{ color: "#FFE500" }} />
                </div>
                <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{perk}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          <Reveal className="mb-12">
            <Link href="/" className="font-display font-bold text-white text-2xl uppercase tracking-tight">
              Directioner
            </Link>
          </Reveal>
          <Reveal delay={0.05} className="mb-8">
            <h1 className="font-display font-bold text-white text-3xl uppercase">Create Account</h1>
            <p className="font-mono text-xs mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>
              Already have one?{" "}
              <Link href="/login" className="underline" style={{ color: "#FFE500" }}>
                Sign in
              </Link>
            </p>
          </Reveal>

          {/* OAuth Buttons */}
          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Discord */}
              <button
                type="button"
                onClick={() => handleOAuth("discord")}
                disabled={oauthLoading !== null}
                className="flex items-center justify-center gap-2.5 py-3.5 font-mono font-bold text-xs uppercase tracking-wide transition-opacity disabled:opacity-60"
                style={{ background: "#5865F2", color: "#fff" }}
              >
                {oauthLoading === "discord" ? (
                  <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg width="18" height="14" viewBox="0 0 71 55" fill="none">
                    <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.44077 45.4204 0.52529C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.52529C25.5141 0.44305 25.4218 0.40079 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978Z" fill="white"/>
                  </svg>
                )}
                Discord
              </button>
              {/* Google */}
              <button
                type="button"
                onClick={() => handleOAuth("google")}
                disabled={oauthLoading !== null}
                className="flex items-center justify-center gap-2.5 py-3.5 font-mono font-bold text-xs uppercase tracking-wide transition-opacity disabled:opacity-60"
                style={{ background: "#fff", color: "#111", border: "1px solid rgba(0,0,0,0.12)" }}
              >
                {oauthLoading === "google" ? (
                  <span className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                Google
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
              <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>or</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>
          </Reveal>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Reveal delay={0.14}>
              <Input label="Full Name" type="text" placeholder="Jane Doe" required
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </Reveal>
            <Reveal delay={0.16}>
              <Input label="Email" type="email" placeholder="jane@example.com" required
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </Reveal>
            <Reveal delay={0.18}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest block"
                    style={{ color: "rgba(255,255,255,0.35)" }}>Password</label>
                  <input type="password" placeholder="••••••••" required value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full px-4 py-3 font-mono text-sm text-white focus:outline-none transition-colors"
                    style={{ background: "#0f0f12", border: "1px solid rgba(255,255,255,0.08)" }}
                    onFocus={e => { e.currentTarget.style.borderColor = "rgba(255,229,0,0.4)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest block"
                    style={{ color: "rgba(255,255,255,0.35)" }}>Confirm</label>
                  <input type="password" placeholder="••••••••" required value={form.confirm}
                    onChange={e => setForm({ ...form, confirm: e.target.value })}
                    className="w-full px-4 py-3 font-mono text-sm text-white focus:outline-none transition-colors"
                    style={{ background: "#0f0f12", border: "1px solid rgba(255,255,255,0.08)" }}
                    onFocus={e => { e.currentTarget.style.borderColor = "rgba(255,229,0,0.4)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                  />
                </div>
              </div>
            </Reveal>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="font-mono text-xs px-4 py-3"
                style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)", color: "#f43f5e" }}>
                {error}
              </motion.div>
            )}

            <Reveal delay={0.2}>
              <p className="font-mono text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,0.25)" }}>
                By creating an account you agree to our{" "}
                <a href="#" className="underline" style={{ color: "rgba(255,255,255,0.4)" }}>Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="underline" style={{ color: "rgba(255,255,255,0.4)" }}>Privacy Policy</a>.
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <PrimaryBtn type="submit" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border border-black border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : "Create Account"}
              </PrimaryBtn>
            </Reveal>
          </form>
        </div>
      </div>
    </div>
  );
}
