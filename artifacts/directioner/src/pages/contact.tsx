import { useState } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Github, Twitter, Send, CheckCircle, AlertTriangle } from "lucide-react";
import { PageHero, Reveal, DrawLine, Input, PrimaryBtn } from "@/components/ui/motion-primitives";
import { TiltCard } from "@/components/animations/TiltCard";
import { BorderBeam } from "@/components/animations/BorderBeam";
import { toast } from "sonner";

const YELLOW = "#FFE500";

const channels = [
  { icon: MessageSquare, label: "Discord Support Server", desc: "Fastest response — live community + team", action: "Join Discord", href: "https://discord.com/invite/directioner", color: "#5865F2" },
  { icon: Mail,          label: "Email Support",           desc: "Business inquiries and enterprise pricing", action: "Email Us",     href: "mailto:support@directioner.app",    color: "#FFE500" },
  { icon: Github,        label: "GitHub Issues",           desc: "Bug reports and feature requests",          action: "Open Issue",   href: "https://github.com/directioner",    color: "#a855f7" },
  { icon: Twitter,       label: "Twitter / X",             desc: "Announcements and quick updates",           action: "Follow Us",    href: "https://twitter.com/directioner",   color: "#0ea5e9" },
];

type FormState = { name: string; email: string; subject: string; message: string };
type Status = "idle" | "submitting" | "success" | "error";

export default function Contact() {
  usePageTitle("Contact");
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  const handleChange = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");

    try {
      // Try the API server first if VITE_API_URL is configured
      const apiUrl = import.meta.env.VITE_API_URL;
      if (apiUrl) {
        const res = await fetch(`${apiUrl}/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("API returned " + res.status);
        setStatus("success");
        toast.success("Message sent! We'll get back to you within 24 hours.");
        setForm({ name: "", email: "", subject: "", message: "" });
        return;
      }

      // Fallback: open the user's email client with the form pre-filled
      const mailBody = [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        ``,
        form.message,
      ].join("\n");

      const mailtoLink =
        `mailto:support@directioner.app` +
        `?subject=${encodeURIComponent(`[Contact] ${form.subject}`)}` +
        `&body=${encodeURIComponent(mailBody)}`;

      window.open(mailtoLink, "_blank");
      setStatus("success");
      toast.success("Your email client has opened — just hit send!");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
      toast.error("Something went wrong. Please email us directly at support@directioner.app");
    }
  };

  const inputStyle = {
    background: "#0f0f12",
    border: "1px solid rgba(255,255,255,0.08)",
  };
  const focusHandlers = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = "rgba(255,229,0,0.4)";
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
    },
  };

  return (
    <div style={{ background: "#070708" }}>
      <PageHero
        eyebrow="Contact — Get in touch"
        heading="Let's talk."
        sub="Questions, feedback, partnership proposals — every message is read by a human."
      />

      {/* Channels */}
      <section className="pb-24 px-6" aria-label="Contact channels">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-24" role="list">
            {channels.map((ch, i) => (
              <motion.a
                key={i}
                href={ch.href}
                target={ch.href.startsWith("http") ? "_blank" : undefined}
                rel={ch.href.startsWith("http") ? "noopener noreferrer" : undefined}
                role="listitem"
                aria-label={`${ch.label}: ${ch.desc}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-xl flex flex-col gap-4 group transition-all"
                style={{
                  background: "#0f0f12",
                  border: "1px solid rgba(255,255,255,0.06)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${ch.color}30`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${ch.color}08`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: `${ch.color}15`, border: `1px solid ${ch.color}25` }}
                >
                  <ch.icon size={18} style={{ color: ch.color }} aria-hidden="true" />
                </div>
                <div>
                  <div className="font-mono text-sm font-bold text-white mb-1">{ch.label}</div>
                  <div className="font-mono text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {ch.desc}
                  </div>
                </div>
                <div
                  className="mt-auto font-mono text-[10px] uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                  style={{ color: ch.color }}
                >
                  {ch.action} →
                </div>
              </motion.a>
            ))}
          </div>

          <DrawLine />

          {/* Contact form */}
          <div className="max-w-2xl mx-auto mt-24">
            <Reveal>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] mb-3 text-center"
                style={{ color: "rgba(255,255,255,0.25)" }}>
                Send a message
              </div>
              <h2 className="font-display font-bold text-white text-center mb-12"
                style={{ fontSize: "clamp(28px, 5vw, 44px)", letterSpacing: "-0.03em" }}>
                Direct message.
              </h2>
            </Reveal>

            <TiltCard>
              <div className="relative rounded-xl overflow-hidden" style={{ background: "#0c0c0f", border: "1px solid rgba(255,255,255,0.07)" }}>
                <BorderBeam size={300} duration={12} />

                {status === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-10 text-center flex flex-col items-center gap-4"
                    role="status"
                    aria-live="polite"
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}
                    >
                      <CheckCircle size={28} style={{ color: "#10b981" }} aria-hidden="true" />
                    </div>
                    <h3 className="font-display font-bold text-white text-xl" style={{ letterSpacing: "-0.02em" }}>
                      Message sent!
                    </h3>
                    <p className="font-mono text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                      We'll get back to you within 24 hours. In the meantime, join our Discord for instant community support.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="font-mono text-[10px] uppercase tracking-widest mt-2 transition-colors"
                      style={{ color: YELLOW }}
                    >
                      Send another →
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="p-8 space-y-5" noValidate aria-label="Contact form">
                    {status === "error" && (
                      <div
                        className="flex items-center gap-2 p-3 rounded-lg"
                        style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
                        role="alert"
                      >
                        <AlertTriangle size={14} style={{ color: "#ef4444" }} aria-hidden="true" />
                        <span className="font-mono text-xs" style={{ color: "#ef4444" }}>
                          Failed to send. Email us at{" "}
                          <a href="mailto:support@directioner.app" className="underline">
                            support@directioner.app
                          </a>
                        </span>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="contact-name"
                          className="font-mono text-[10px] uppercase tracking-widest block"
                          style={{ color: "rgba(255,255,255,0.35)" }}
                        >
                          Name <span aria-label="required">*</span>
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          autoComplete="name"
                          placeholder="Your name"
                          required
                          value={form.name}
                          onChange={handleChange("name")}
                          className="w-full px-4 py-3 font-mono text-sm text-white focus:outline-none transition-colors"
                          style={inputStyle}
                          {...focusHandlers}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label
                          htmlFor="contact-email"
                          className="font-mono text-[10px] uppercase tracking-widest block"
                          style={{ color: "rgba(255,255,255,0.35)" }}
                        >
                          Email <span aria-label="required">*</span>
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          required
                          value={form.email}
                          onChange={handleChange("email")}
                          className="w-full px-4 py-3 font-mono text-sm text-white focus:outline-none transition-colors"
                          style={inputStyle}
                          {...focusHandlers}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-subject"
                        className="font-mono text-[10px] uppercase tracking-widest block"
                        style={{ color: "rgba(255,255,255,0.35)" }}
                      >
                        Subject <span aria-label="required">*</span>
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        placeholder="Bug report / Feature request / Business inquiry"
                        required
                        value={form.subject}
                        onChange={handleChange("subject")}
                        className="w-full px-4 py-3 font-mono text-sm text-white focus:outline-none transition-colors"
                        style={inputStyle}
                        {...focusHandlers}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-message"
                        className="font-mono text-[10px] uppercase tracking-widest block"
                        style={{ color: "rgba(255,255,255,0.35)" }}
                      >
                        Message <span aria-label="required">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        rows={6}
                        placeholder="Describe your question or issue in as much detail as you can…"
                        required
                        value={form.message}
                        onChange={handleChange("message")}
                        className="w-full px-4 py-3 font-mono text-sm text-white focus:outline-none resize-none transition-colors"
                        style={inputStyle}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,229,0,0.4)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                      />
                    </div>

                    <PrimaryBtn type="submit" disabled={status === "submitting"}>
                      {status === "submitting" ? (
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 border border-black border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                          Sending…
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send size={14} aria-hidden="true" /> Send Message
                        </span>
                      )}
                    </PrimaryBtn>
                  </form>
                )}
              </div>
            </TiltCard>
          </div>
        </div>
      </section>
    </div>
  );
}
