import { useState } from "react";
import { Link } from "wouter";
import { usePageTitle } from "@/hooks/use-page-title";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/motion-primitives";
import { useAuth } from "@/lib/auth";

const DISCORD_ICON = (
  <svg width="18" height="14" viewBox="0 0 71 55" fill="none" aria-hidden>
    <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.44077 45.4204 0.52529C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.52529C25.5141 0.44305 25.4218 0.40079 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978Z" fill="white"/>
  </svg>
);

const GOOGLE_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

function Spinner({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin"
      style={{ borderColor: dark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)", borderTopColor: "transparent" }}
    />
  );
}

export default function Login() {
  usePageTitle("Sign In");
  const { loginWithOAuth, login, configured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"discord" | "google" | null>(null);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });

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
    setLoading(true);
    setError("");
    try {
      if (!configured) throw new Error("Auth not configured — add Supabase secrets to enable login.");
      await login(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const emailInvalid = touched.email && email.length > 0 && !email.includes("@");
  const passwordInvalid = touched.password && password.length > 0 && password.length < 6;

  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_480px]" style={{ background: "#070708" }}>
      {/* ── Left panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between p-14 relative overflow-hidden"
        style={{ background: "#07070a", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Animated background orb */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,229,0,0.07) 0%, rgba(99,102,241,0.05) 50%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)",
            bottom: "15%",
            left: "10%",
          }}
          animate={{ x: [0, 20, 0], y: [0, -15, 0], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Corner label */}
        <div className="font-mono text-[9px] uppercase tracking-widest relative z-10" style={{ color: "rgba(255,255,255,0.18)" }}>
          Directioner — Sign In
        </div>

        {/* Large watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{
            fontFamily: "'TASA Orbiter Display', sans-serif",
            fontWeight: 800,
            fontSize: "22vw",
            color: "rgba(255,255,255,0.018)",
            letterSpacing: "-0.05em",
            lineHeight: 1,
          }}
        >
          D.
        </div>

        {/* Center content */}
        <div className="relative z-10">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10"
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-8"
              style={{ background: "rgba(255,229,0,0.1)", border: "1px solid rgba(255,229,0,0.2)" }}
            >
              <span style={{ fontFamily: "'TASA Orbiter Display', sans-serif", fontWeight: 800, fontSize: 28, color: "#FFE500", lineHeight: 1 }}>
                D
              </span>
            </div>
            <h2
              className="font-display font-bold text-white leading-[0.9] mb-4"
              style={{ fontSize: "clamp(36px, 3.5vw, 58px)", letterSpacing: "-0.04em" }}
            >
              Welcome back.
            </h2>
            <p className="font-mono text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.32)" }}>
              Sign in to manage your bots, view analytics, and configure your Discord server settings.
            </p>
          </motion.div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="border-l-2 pl-5 mb-14"
            style={{ borderColor: "rgba(255,229,0,0.3)" }}
          >
            <p className="font-mono text-xs leading-relaxed italic" style={{ color: "rgba(255,255,255,0.3)" }}>
              "Directioner transformed our study server — it's like having a tutor, coder, and community manager in one."
            </p>
            <p className="font-mono text-[9px] uppercase tracking-widest mt-2" style={{ color: "rgba(255,255,255,0.18)" }}>
              — @devkid, 12k-member server
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-3 gap-6"
          >
            {[
              { value: "50K+",  label: "Active Servers" },
              { value: "2M+",   label: "Messages / Day" },
              { value: "99.9%", label: "Uptime SLA" },
            ].map(stat => (
              <div key={stat.label}>
                <div
                  className="font-display font-bold text-white"
                  style={{ fontSize: "clamp(22px, 2vw, 32px)" }}
                >
                  {stat.value}
                </div>
                <div
                  className="font-mono text-[9px] uppercase tracking-widest mt-1"
                  style={{ color: "rgba(255,255,255,0.22)" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom corner */}
        <div className="font-mono text-[9px] uppercase tracking-widest relative z-10" style={{ color: "rgba(255,255,255,0.12)" }}>
          Est. 2025
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div
        className="flex items-center justify-center px-6 py-16 relative"
        style={{ borderLeft: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="w-full max-w-sm">
          {/* Logo (mobile) */}
          <Reveal className="mb-10 lg:hidden">
            <Link href="/" className="font-display font-bold text-white text-xl uppercase tracking-tight">
              Directioner
            </Link>
          </Reveal>

          <Reveal className="mb-8">
            <h1 className="font-display font-bold text-white uppercase" style={{ fontSize: "clamp(26px, 4vw, 36px)" }}>
              Sign In
            </h1>
            <p className="font-mono text-xs mt-2" style={{ color: "rgba(255,255,255,0.3)" }}>
              New here?{" "}
              <Link
                href="/register"
                className="transition-colors"
                style={{ color: "#FFE500" }}
              >
                Create an account
              </Link>
            </p>
          </Reveal>

          {/* OAuth buttons */}
          <Reveal delay={0.08} className="space-y-3 mb-6">
            {/* Discord — full width primary */}
            <motion.button
              type="button"
              onClick={() => handleOAuth("discord")}
              disabled={oauthLoading !== null || loading}
              className="flex items-center justify-center gap-2.5 w-full py-3.5 font-mono font-bold text-sm uppercase tracking-wide transition-all disabled:opacity-60"
              style={{ background: "#5865F2", color: "#fff" }}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
            >
              {oauthLoading === "discord" ? <Spinner /> : DISCORD_ICON}
              Continue with Discord
            </motion.button>

            {/* Google */}
            <motion.button
              type="button"
              onClick={() => handleOAuth("google")}
              disabled={oauthLoading !== null || loading}
              className="flex items-center justify-center gap-2.5 w-full py-3.5 font-mono font-bold text-sm uppercase tracking-wide transition-all disabled:opacity-60"
              style={{ background: "#fff", color: "#111", border: "1px solid rgba(0,0,0,0.1)" }}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
            >
              {oauthLoading === "google" ? <Spinner /> : GOOGLE_ICON}
              Continue with Google
            </motion.button>
          </Reveal>

          {/* Divider */}
          <Reveal delay={0.1} className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.18)" }}>
              or sign in with email
            </span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
          </Reveal>

          {/* Email/password form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Reveal delay={0.12}>
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-widest block" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 font-mono text-sm text-white focus:outline-none transition-all"
                  style={{
                    background: "#0f0f12",
                    border: `1px solid ${emailInvalid ? "rgba(244,63,94,0.5)" : "rgba(255,255,255,0.08)"}`,
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = emailInvalid ? "rgba(244,63,94,0.6)" : "rgba(255,229,0,0.4)"; }}
                  onBlur={e => { setTouched(t => ({ ...t, email: true })); e.currentTarget.style.borderColor = emailInvalid ? "rgba(244,63,94,0.5)" : "rgba(255,255,255,0.08)"; }}
                />
                {emailInvalid && (
                  <p className="font-mono text-[10px]" style={{ color: "#f43f5e" }}>Enter a valid email address.</p>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="font-mono text-[10px] uppercase tracking-widest transition-colors"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#FFE500"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.25)"; }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onBlur={() => setTouched(t => ({ ...t, password: true }))}
                    className="w-full px-4 py-3 pr-10 font-mono text-sm text-white focus:outline-none transition-all"
                    style={{
                      background: "#0f0f12",
                      border: `1px solid ${passwordInvalid ? "rgba(244,63,94,0.5)" : "rgba(255,255,255,0.08)"}`,
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = passwordInvalid ? "rgba(244,63,94,0.6)" : "rgba(255,229,0,0.4)"; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.25)"; }}
                    tabIndex={-1}
                  >
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {passwordInvalid && (
                  <p className="font-mono text-[10px]" style={{ color: "#f43f5e" }}>Password must be at least 6 characters.</p>
                )}
              </div>
            </Reveal>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="font-mono text-xs px-4 py-3"
                  style={{
                    background: "rgba(244,63,94,0.07)",
                    border: "1px solid rgba(244,63,94,0.25)",
                    color: "#f43f5e",
                  }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <Reveal delay={0.18}>
              <motion.button
                type="submit"
                disabled={loading || oauthLoading !== null}
                className="flex items-center justify-center gap-2.5 w-full font-mono font-bold text-sm uppercase tracking-wide py-4 transition-all disabled:opacity-50"
                style={{ background: "#FFE500", color: "#000" }}
                whileHover={{ scale: loading ? 1 : 1.015 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <>
                    <Spinner dark />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={15} />
                  </>
                )}
              </motion.button>
            </Reveal>
          </form>

          {/* Bottom link */}
          <Reveal delay={0.22} className="mt-6 text-center">
            <p className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.22)" }}>
              Don't have an account?{" "}
              <Link href="/register" style={{ color: "#FFE500" }}>
                Register
              </Link>
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

/* Needed for AnimatePresence usage in this file */
import { AnimatePresence } from "framer-motion";
