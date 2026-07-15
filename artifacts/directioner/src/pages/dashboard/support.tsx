import { usePageTitle } from "@/hooks/use-page-title";
import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, CheckCircle } from "lucide-react";

const CARD_BG = "#0f0f12";
const BORDER  = "rgba(255,255,255,0.06)";
const YELLOW  = "#FFE500";

export default function Support() {
  usePageTitle("Support");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("Bug Report");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setSubmitted(true); setLoading(false); }, 1200);
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      {/* Header */}
      <header className="pb-6" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] mb-2"
          style={{ color: "rgba(255,255,255,0.25)" }}>
          SUPPORT CENTER
        </div>
        <h1 className="font-display font-bold text-white leading-none"
          style={{ fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-0.03em" }}>
          Support.
        </h1>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left col */}
        <div className="space-y-4">
          {/* Status */}
          <div className="rounded-lg p-5"
            style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)" }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#10b981" }} />
              <span className="font-mono text-xs font-bold uppercase tracking-widest" style={{ color: "#10b981" }}>
                System Status
              </span>
            </div>
            <p className="font-mono text-sm text-white">All systems operational.</p>
            <div className="font-mono text-[9px] uppercase tracking-widest mt-3"
              style={{ color: "rgba(255,255,255,0.25)" }}>
              Last checked: Just now
            </div>
          </div>

          {/* Quick links */}
          <div className="rounded-lg p-5" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] mb-4"
              style={{ color: "rgba(255,255,255,0.25)" }}>
              Quick Links
            </div>
            <div className="space-y-3">
              {[
                { label: "Read the FAQ",           href: "/faq" },
                { label: "Command Reference",       href: "/commands" },
                { label: "Join Community Discord",  href: "https://discord.com" },
              ].map(link => (
                <a key={link.label} href={link.href}
                  className="flex items-center justify-between group py-2 transition-colors"
                  style={{ borderBottom: `1px solid rgba(255,255,255,0.04)`, color: "rgba(255,255,255,0.4)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = YELLOW; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; }}>
                  <span className="font-mono text-xs">{link.label}</span>
                  <ExternalLink size={12} />
                </a>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div className="rounded-lg p-5" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] mb-4"
              style={{ color: "rgba(255,255,255,0.25)" }}>
              Contact Info
            </div>
            <div className="space-y-2">
              {[
                { k: "Email",    v: "support@directioner.app" },
                { k: "Response", v: "Within 24 hours (email)" },
                { k: "Discord",  v: "Live — community server" },
              ].map(r => (
                <div key={r.k} className="flex justify-between font-mono text-xs py-2"
                  style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>{r.k}</span>
                  <span className="text-white">{r.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ticket form */}
        <div className="rounded-lg p-6" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] mb-6"
            style={{ color: YELLOW }}>
            Open a Ticket
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-16 text-center"
            >
              <CheckCircle size={40} className="mx-auto mb-4" style={{ color: "#10b981" }} />
              <div className="font-display font-bold text-white text-xl mb-2">Ticket Submitted</div>
              <div className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                ID: #TK-0042<br />We'll reply via email within 24 hours.
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-widest block"
                  style={{ color: "rgba(255,255,255,0.35)" }}>Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-3 font-mono text-sm text-white focus:outline-none appearance-none transition-colors"
                  style={{ background: "#070708", border: "1px solid rgba(255,255,255,0.08)" }}
                  onFocus={e => { e.currentTarget.style.borderColor = "rgba(255,229,0,0.4)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                >
                  {["Bug Report", "Billing Issue", "Feature Request", "Other"].map(o => (
                    <option key={o} style={{ background: "#0f0f12" }}>{o}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-widest block"
                  style={{ color: "rgba(255,255,255,0.35)" }}>Server ID (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 1234567890"
                  className="w-full px-4 py-3 font-mono text-sm text-white focus:outline-none transition-colors"
                  style={{ background: "#070708", border: "1px solid rgba(255,255,255,0.08)" }}
                  onFocus={e => { e.currentTarget.style.borderColor = "rgba(255,229,0,0.4)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-widest block"
                  style={{ color: "rgba(255,255,255,0.35)" }}>Description</label>
                <textarea
                  required
                  rows={5}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe your issue in detail…"
                  className="w-full px-4 py-3 font-mono text-sm text-white focus:outline-none resize-none transition-colors"
                  style={{ background: "#070708", border: "1px solid rgba(255,255,255,0.08)" }}
                  onFocus={e => { e.currentTarget.style.borderColor = "rgba(255,229,0,0.4)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center font-mono font-bold text-sm uppercase tracking-wide py-3.5 transition-all disabled:opacity-50"
                style={{ background: YELLOW, color: "#000" }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border border-black border-t-transparent rounded-full animate-spin" />
                    Submitting…
                  </span>
                ) : "Submit Ticket"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
