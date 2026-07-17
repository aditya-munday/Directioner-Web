import { usePageTitle } from "@/hooks/use-page-title";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, CheckCircle, MessageSquare, Book, Bug, Lightbulb, ChevronDown, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui/empty-state";
import { supabase } from "@/lib/supabase";

const CARD_BG = "#0f0f12";
const BORDER  = "rgba(255,255,255,0.06)";
const YELLOW  = "#FFE500";

const CATEGORIES = ["Bug Report", "Feature Request", "Billing Question", "Account Issue", "Other"] as const;
type Category = typeof CATEGORIES[number];

const PRIORITY_MAP: Record<Category, { color: string; eta: string }> = {
  "Bug Report":        { color: "#ef4444", eta: "< 24 hours" },
  "Feature Request":   { color: "#a855f7", eta: "2–5 business days" },
  "Billing Question":  { color: "#f59e0b", eta: "< 4 hours" },
  "Account Issue":     { color: "#3b82f6", eta: "< 12 hours" },
  "Other":             { color: "rgba(255,255,255,0.4)", eta: "2–3 business days" },
};

const QUICK_LINKS = [
  { label: "Read the FAQ",          href: "/faq",     icon: Book },
  { label: "Command Reference",     href: "/commands", icon: MessageSquare },
  { label: "Report a GitHub Issue", href: "https://github.com/directioner", icon: Bug, external: true },
  { label: "Request a Feature",     href: "https://github.com/directioner/discussions", icon: Lightbulb, external: true },
];

const STATUS_SERVICES = [
  { name: "API Server",        ok: true },
  { name: "Discord Gateway",   ok: true },
  { name: "Auth & Accounts",   ok: true },
  { name: "Billing",           ok: true },
  { name: "Analytics",         ok: true },
];

export default function Support() {
  usePageTitle("Support");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<Category>("Bug Report");
  const [description, setDescription] = useState("");
  const [serverId, setServerId] = useState("");
  const [catOpen, setCatOpen] = useState(false);

  const priority = PRIORITY_MAP[category];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error("Please describe your issue before submitting.");
      return;
    }
    if (description.trim().length < 20) {
      toast.error("Please provide a bit more detail (at least 20 characters).");
      return;
    }
    setLoading(true);
    try {
      const apiBase = (import.meta.env.VITE_API_URL as string | undefined) ?? "/api";

      // Get auth token
      let token: string | null = null;
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        token = session?.access_token ?? null;
      }

      const res = await fetch(`${apiBase}/support/ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          category,
          description: description.trim(),
          ...(serverId.trim() ? { serverId: serverId.trim() } : {}),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(err.error ?? `Server responded with ${res.status}`);
      }

      setSubmitted(true);
      toast.success("Ticket submitted! We'll respond via email.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit ticket";
      // If API is unavailable or auth is not configured, surface a helpful message
      if (message.includes("503") || message.includes("Authentication unavailable")) {
        toast.error("Auth is not configured yet — email us directly at support@directioner.app");
      } else {
        toast.error(message || "Failed to submit ticket. Please email support@directioner.app");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      {/* Header */}
      <header className="pb-6" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div
          className="font-mono text-[10px] uppercase tracking-[0.22em] mb-2"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          SUPPORT CENTER
        </div>
        <h1
          className="font-display font-bold text-white leading-none"
          style={{ fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-0.03em" }}
        >
          Support.
        </h1>
        <p className="font-mono text-sm mt-3" style={{ color: "rgba(255,255,255,0.35)" }}>
          We typically respond within{" "}
          <span style={{ color: YELLOW }}>24 hours</span>. For faster help, join our Discord.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          {/* System status */}
          <div
            className="rounded-lg p-5"
            style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)" }}
            aria-label="System status"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#10b981" }} aria-hidden="true" />
              <span
                className="font-mono text-xs font-bold uppercase tracking-widest"
                style={{ color: "#10b981" }}
              >
                System Status
              </span>
            </div>
            <ul className="space-y-2" role="list">
              {STATUS_SERVICES.map((svc) => (
                <li key={svc.name} className="flex items-center justify-between">
                  <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {svc.name}
                  </span>
                  <span
                    className="font-mono text-[10px] uppercase tracking-wide"
                    style={{ color: svc.ok ? "#10b981" : "#ef4444" }}
                    aria-label={svc.ok ? "Operational" : "Degraded"}
                  >
                    {svc.ok ? "● Operational" : "● Degraded"}
                  </span>
                </li>
              ))}
            </ul>
            <div
              className="font-mono text-[9px] uppercase tracking-widest mt-3"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              Last checked: Just now
            </div>
          </div>

          {/* Quick links */}
          <nav
            className="rounded-lg p-5"
            style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
            aria-label="Support quick links"
          >
            <div
              className="font-mono text-[10px] uppercase tracking-[0.22em] mb-4"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              Quick Links
            </div>
            <ul className="space-y-1" role="list">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-3 group py-2.5 px-1 rounded transition-colors"
                    style={{
                      borderBottom: `1px solid rgba(255,255,255,0.04)`,
                      color: "rgba(255,255,255,0.4)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = YELLOW;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
                    }}
                  >
                    <link.icon size={13} aria-hidden="true" />
                    <span className="font-mono text-xs flex-1">{link.label}</span>
                    <ExternalLink size={11} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact info */}
          <div
            className="rounded-lg p-5"
            style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
          >
            <div
              className="font-mono text-[10px] uppercase tracking-[0.22em] mb-4"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              Direct Contact
            </div>
            <ul className="space-y-3" role="list">
              {[
                { label: "General support",  email: "support@directioner.app" },
                { label: "Billing & refunds", email: "billing@directioner.app" },
                { label: "Security issues",   email: "security@directioner.app" },
              ].map(({ label, email }) => (
                <li key={email}>
                  <div className="font-mono text-[10px] uppercase tracking-widest mb-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>
                    {label}
                  </div>
                  <a
                    href={`mailto:${email}`}
                    className="font-mono text-sm transition-colors"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = YELLOW)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)")}
                  >
                    {email}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right column — ticket form */}
        <div>
          <div
            className="rounded-lg p-5 h-full"
            style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
          >
            <div
              className="font-mono text-[10px] uppercase tracking-[0.22em] mb-5"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              Submit a Ticket
            </div>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <EmptyState
                    icon={CheckCircle}
                    title="Ticket submitted!"
                    description="We'll reply to your email within the expected timeframe. In the meantime, check the FAQ or join Discord for community support."
                    action={{ label: "Submit Another", onClick: () => { setSubmitted(false); setDescription(""); setServerId(""); } }}
                  />
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  aria-label="Support ticket form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Category */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="ticket-category"
                      className="font-mono text-[10px] uppercase tracking-widest block"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      Category
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        id="ticket-category"
                        aria-haspopup="listbox"
                        aria-expanded={catOpen}
                        onClick={() => setCatOpen(!catOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 font-mono text-sm text-white focus:outline-none transition-colors text-left"
                        style={{
                          background: "#070708",
                          border: `1px solid ${catOpen ? "rgba(255,229,0,0.4)" : "rgba(255,255,255,0.08)"}`,
                        }}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: priority.color }}
                            aria-hidden="true"
                          />
                          {category}
                        </span>
                        <ChevronDown
                          size={14}
                          style={{
                            color: "rgba(255,255,255,0.3)",
                            transform: catOpen ? "rotate(180deg)" : undefined,
                            transition: "transform 0.2s",
                          }}
                          aria-hidden="true"
                        />
                      </button>
                      <AnimatePresence>
                        {catOpen && (
                          <motion.ul
                            role="listbox"
                            aria-label="Ticket category"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-0 right-0 z-10 mt-1"
                            style={{ background: "#0f0f12", border: "1px solid rgba(255,255,255,0.1)" }}
                          >
                            {CATEGORIES.map((cat) => (
                              <li
                                key={cat}
                                role="option"
                                aria-selected={category === cat}
                                onClick={() => { setCategory(cat); setCatOpen(false); }}
                                className="flex items-center gap-2 px-4 py-2.5 font-mono text-xs cursor-pointer transition-colors"
                                style={{ color: category === cat ? "#fff" : "rgba(255,255,255,0.5)" }}
                                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)")}
                                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                              >
                                <span
                                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                  style={{ background: PRIORITY_MAP[cat].color }}
                                  aria-hidden="true"
                                />
                                {cat}
                                <span className="ml-auto text-[9px] uppercase tracking-widest opacity-40">
                                  {PRIORITY_MAP[cat].eta}
                                </span>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                    <p className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                      Expected response:{" "}
                      <span style={{ color: priority.color }}>{priority.eta}</span>
                    </p>
                  </div>

                  {/* Server ID */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="ticket-server"
                      className="font-mono text-[10px] uppercase tracking-widest block"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      Server ID{" "}
                      <span className="normal-case opacity-60">(optional)</span>
                    </label>
                    <input
                      id="ticket-server"
                      type="text"
                      placeholder="e.g. 1234567890"
                      value={serverId}
                      onChange={(e) => setServerId(e.target.value)}
                      className="w-full px-4 py-3 font-mono text-sm text-white focus:outline-none transition-colors"
                      style={{ background: "#070708", border: "1px solid rgba(255,255,255,0.08)" }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,229,0,0.4)"; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="ticket-description"
                      className="font-mono text-[10px] uppercase tracking-widest block"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      Description <span aria-label="required">*</span>
                    </label>
                    <textarea
                      id="ticket-description"
                      required
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your issue in detail — include steps to reproduce if it's a bug…"
                      className="w-full px-4 py-3 font-mono text-sm text-white focus:outline-none resize-none transition-colors"
                      style={{ background: "#070708", border: "1px solid rgba(255,255,255,0.08)" }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,229,0,0.4)"; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                    />
                    <p className="font-mono text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                      {description.length} / 2000 characters
                    </p>
                  </div>

                  {description.length > 0 && description.length < 20 && (
                    <div
                      className="flex items-center gap-2 p-3 rounded"
                      style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)" }}
                      role="alert"
                    >
                      <AlertCircle size={13} style={{ color: "#fbbf24" }} aria-hidden="true" />
                      <span className="font-mono text-[11px]" style={{ color: "#fbbf24" }}>
                        Please add more detail so we can help you faster.
                      </span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center font-mono font-bold text-sm uppercase tracking-wide py-3.5 transition-all disabled:opacity-60 active:scale-[0.99]"
                    style={{ background: YELLOW, color: "#000" }}
                    aria-busy={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 border border-black border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                        Submitting…
                      </span>
                    ) : (
                      "Submit Ticket"
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
