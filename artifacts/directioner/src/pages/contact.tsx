import { useState } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Github, Twitter, Send } from "lucide-react";
import { PageHero, Reveal, DrawLine, Input, PrimaryBtn } from "@/components/ui/motion-primitives";
import { TiltCard } from "@/components/animations/TiltCard";
import { BorderBeam } from "@/components/animations/BorderBeam";

const channels = [
  { icon: MessageSquare, label: "Discord Support Server", desc: "Fastest response — live community + team", action: "Join Discord", href: "https://discord.com/invite/directioner", color: "#5865F2" },
  { icon: Mail,          label: "Email Support",           desc: "Business inquiries and enterprise pricing", action: "Email Us",     href: "mailto:support@directioner.app",    color: "#FFE500" },
  { icon: Github,        label: "GitHub Issues",           desc: "Bug reports and feature requests",          action: "Open Issue",   href: "https://github.com/directioner",    color: "#a855f7" },
  { icon: Twitter,       label: "Twitter / X",             desc: "Announcements and quick updates",           action: "Follow Us",    href: "https://twitter.com/directioner",   color: "#0ea5e9" },
];

export default function Contact() {
  usePageTitle("Contact");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1400));
    setSubmitting(false);
    setDone(true);
  };

  return (
    <div style={{ background: "#070708" }}>
      <PageHero
        eyebrow="Contact — Get in touch"
        heading="Let's talk."
        sub="Questions, feedback, partnership proposals — every message is read by a human."
      />

      {/* Channels */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-24">
            {channels.map((ch, i) => (
              <motion.a
                key={i}
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
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
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${ch.color}30`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${ch.color}08`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: `${ch.color}15`, border: `1px solid ${ch.color}25` }}
                >
                  <ch.icon size={18} style={{ color: ch.color }} />
                </div>
                <div>
                  <div className="font-mono text-sm font-bold text-white mb-1">{ch.label}</div>
                  <div className="font-mono text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>{ch.desc}</div>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest mt-auto" style={{ color: ch.color }}>
                  {ch.action} →
                </div>
              </motion.a>
            ))}
          </div>

          <DrawLine />
        </div>
      </section>

      {/* Contact form */}
      <section className="pb-32 px-6" style={{ background: "#070708" }}>
        <div className="max-w-2xl mx-auto">
          <Reveal className="mb-12">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] mb-4" style={{ color: "rgba(255,255,255,0.25)" }}>
              SEND A MESSAGE
            </div>
            <h2 className="font-display font-bold text-white" style={{ fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-0.03em" }}>
              Write to us.
            </h2>
          </Reveal>

          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="p-12 rounded-xl text-center"
              style={{ background: "#0f0f12", border: "1px solid rgba(255,229,0,0.2)" }}
            >
              <div className="font-mono text-4xl mb-4">✓</div>
              <h3 className="font-display font-bold text-white text-2xl mb-3">Message sent.</h3>
              <p className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                We'll respond within 24 hours. Check your Discord DMs too — we sometimes reach out there.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <Input
                label="Subject"
                type="text"
                placeholder="Bug report / Feature request / Business inquiry"
                required
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
              />
              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-widest block"
                  style={{ color: "rgba(255,255,255,0.35)" }}>
                  Message
                </label>
                <textarea
                  rows={6}
                  placeholder="Describe your question or issue in as much detail as you can..."
                  required
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 font-mono text-sm text-white focus:outline-none resize-none transition-colors"
                  style={{
                    background: "#0f0f12",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "rgba(255,229,0,0.4)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                />
              </div>
              <PrimaryBtn type="submit" disabled={submitting}>
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border border-black border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send size={14} /> Send Message
                  </span>
                )}
              </PrimaryBtn>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
