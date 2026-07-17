import { useRef, useState } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Mail, MessageSquare, Github, Twitter, Send, CheckCircle } from "lucide-react";
import { PageHero, Reveal, DrawLine, Input, PrimaryBtn } from "@/components/ui/motion-primitives";
import { BorderBeam } from "@/components/animations/BorderBeam";
import { MagneticElement } from "@/components/animations";

const channels = [
  { icon: MessageSquare, label: "Discord Support Server", desc: "Fastest response — live community + team", action: "Join Discord", href: "https://discord.com/invite/directioner", color: "#5865F2" },
  { icon: Mail,          label: "Email Support",           desc: "Business inquiries and enterprise pricing", action: "Email Us",     href: "mailto:support@directioner.app",    color: "#FFE500" },
  { icon: Github,        label: "GitHub Issues",           desc: "Bug reports and feature requests",          action: "Open Issue",   href: "https://github.com/directioner",    color: "#a855f7" },
  { icon: Twitter,       label: "Twitter / X",             desc: "Announcements and quick updates",           action: "Follow Us",    href: "https://twitter.com/directioner",   color: "#0ea5e9" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any } },
};

export default function Contact() {
  usePageTitle("Contact");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const cardsRef = useRef(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: "-60px" });
  const formRef = useRef(null);
  const formInView = useInView(formRef, { once: true, margin: "-60px" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1400));
    setSubmitting(false);
    setDone(true);
  };

  return (
    <div style={{ background: "#070708" }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <motion.div
          className="absolute rounded-full"
          style={{ width: 800, height: 400, top: "10%", left: "50%", transform: "translateX(-50%)", background: "radial-gradient(ellipse, rgba(255,229,0,0.04) 0%, transparent 70%)", filter: "blur(80px)" }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        <PageHero
          eyebrow="Contact — Get in touch"
          heading="Let's talk."
          sub="Questions, feedback, partnership proposals — every message is read by a human."
        />

        {/* Channels */}
        <section className="pb-24 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              ref={cardsRef}
              variants={containerVariants}
              initial="hidden"
              animate={cardsInView ? "visible" : "hidden"}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-24"
            >
              {channels.map((ch, i) => (
                <motion.a
                  key={i}
                  variants={cardVariants}
                  href={ch.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -6 }}
                  className="relative p-6 flex flex-col gap-4 group overflow-hidden"
                  style={{ background: "#0f0f12", border: "1px solid rgba(255,255,255,0.06)", textDecoration: "none" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${ch.color}35`;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${ch.color}0a`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  {/* Color sweep on hover */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 50% 0%, ${ch.color}08 0%, transparent 70%)` }}
                  />

                  <motion.div
                    className="w-10 h-10 flex items-center justify-center relative z-10"
                    style={{ background: `${ch.color}15`, border: `1px solid ${ch.color}25` }}
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <ch.icon size={18} style={{ color: ch.color }} />
                  </motion.div>

                  <div className="relative z-10">
                    <div className="font-mono text-sm font-bold text-white mb-1">{ch.label}</div>
                    <div className="font-mono text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>{ch.desc}</div>
                  </div>

                  <motion.div
                    className="font-mono text-[10px] uppercase tracking-widest mt-auto relative z-10 flex items-center gap-1"
                    style={{ color: ch.color }}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    {ch.action} →
                  </motion.div>

                  <BorderBeam color={ch.color} duration={6} delay={i * 0.4} size={60} />
                </motion.a>
              ))}
            </motion.div>

            <DrawLine />
          </div>
        </section>

        {/* Contact form */}
        <section className="pb-32 px-6">
          <div className="max-w-2xl mx-auto" ref={formRef}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={formInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-12"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] mb-4" style={{ color: "rgba(255,255,255,0.25)" }}>
                SEND A MESSAGE
              </div>
              <h2 className="font-display font-bold text-white" style={{ fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-0.03em" }}>
                Write to us.
              </h2>
            </motion.div>

            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="p-14 text-center relative overflow-hidden"
                  style={{ background: "#0f0f12", border: "1px solid rgba(255,229,0,0.2)" }}
                >
                  <BorderBeam color="#FFE500" duration={3} />
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
                    style={{ background: "rgba(255,229,0,0.1)", border: "1px solid rgba(255,229,0,0.3)" }}
                  >
                    <CheckCircle size={32} style={{ color: "#FFE500" }} />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="font-display font-bold text-white text-2xl mb-3 tracking-tight"
                  >
                    Message sent.
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55 }}
                    className="font-mono text-xs"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    We'll respond within 24 hours. Check your Discord DMs too.
                  </motion.p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 16 }}
                  animate={formInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Your Name" type="text" placeholder="John Doe" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    <Input label="Email Address" type="email" placeholder="john@example.com" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <Input label="Subject" type="text" placeholder="Bug report / Feature request / Business inquiry" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest block" style={{ color: "rgba(255,255,255,0.35)" }}>Message</label>
                    <motion.textarea
                      rows={6}
                      placeholder="Describe your question or issue in as much detail as you can..."
                      required
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 font-mono text-sm text-white focus:outline-none resize-none transition-all"
                      style={{ background: "#0f0f12", border: "1px solid rgba(255,255,255,0.08)" }}
                      onFocus={e => { e.currentTarget.style.borderColor = "rgba(255,229,0,0.4)"; e.currentTarget.style.boxShadow = "0 0 0 1px rgba(255,229,0,0.1)"; }}
                      onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
                      whileFocus={{ scale: 1.005 }}
                    />
                  </div>
                  <MagneticElement strength={0.2}>
                    <PrimaryBtn type="submit" disabled={submitting}>
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <motion.span
                            className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                          />
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send size={14} /> Send Message
                        </span>
                      )}
                    </PrimaryBtn>
                  </MagneticElement>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}
