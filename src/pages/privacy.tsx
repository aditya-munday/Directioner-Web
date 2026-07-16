import { useRef, useState, useEffect } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { motion, useInView, useScroll, useSpring } from "framer-motion";

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

const sections = [
  { id: "overview", title: "1. Overview", content: `Directioner ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Discord bot and associated website and services.\n\nPlease read this policy carefully. By using the Service, you consent to the practices described here. If you disagree with any part of this policy, please discontinue use of the Service.` },
  { id: "information-collected", title: "2. Information We Collect", content: `We collect the following categories of information:\n\nDiscord Data: Discord user IDs, server IDs, channel IDs, usernames, and message content sent directly to the bot. We do not read all messages in a server — only those that explicitly invoke the bot.\n\nAccount Data: Email address, username, and billing information when you create a Directioner account on our website.\n\nUsage Data: Commands used, features accessed, interaction timestamps, error logs, and performance metrics.\n\nVoice Data: Audio processed during voice sessions is converted to text in real-time and not stored as audio. Transcripts may be temporarily cached to provide context-aware responses.\n\nDevice & Technical Data: IP address, browser type, and device information collected when you access our website.` },
  { id: "how-we-use", title: "3. How We Use Your Information", content: `We use collected information to:\n\n(a) Operate and improve the Service, including training and fine-tuning AI models on anonymized, aggregated data;\n(b) Provide personalized responses based on server memory and context;\n(c) Process payments and manage subscriptions;\n(d) Send service-related communications (e.g., billing, security alerts);\n(e) Analyze usage patterns to improve performance and features;\n(f) Enforce our Terms of Service and prevent abuse;\n(g) Comply with legal obligations.\n\nWe do not use your personal data for advertising or sell it to third parties.` },
  { id: "memory-context", title: "4. Memory & Context Storage", content: `A core feature of Directioner is its persistent memory system. This means:\n\nServer Memory: The bot retains context about your server, including topics discussed, member preferences mentioned in conversations, and community norms — to provide more relevant responses over time.\n\nUser Preferences: When you interact with the bot, preferences you express (e.g., "I prefer concise answers") are stored and applied in future interactions.\n\nRetention: Memory data is retained for as long as the bot is active in a server. Server administrators can request a full memory wipe at any time via /reset-memory.\n\nOpt-out: Users can opt out of being profiled by the memory system by using /privacy-mode. In this mode, no user-specific data is retained beyond the current session.` },
  { id: "sharing", title: "5. Data Sharing", content: `We share data only in the following limited circumstances:\n\nService Providers: We share data with third-party providers who help us operate the Service (e.g., cloud infrastructure, payment processors, AI model providers). These providers are contractually bound to protect your data.\n\nAI Model Providers: Message content sent to the bot is processed by AI model providers (including but not limited to OpenAI). These providers have their own privacy policies governing data retention.\n\nLegal Requirements: We may disclose information when required by law, court order, or to protect the rights, property, or safety of Directioner, our users, or the public.\n\nBusiness Transfers: In the event of a merger or acquisition, user data may be transferred to the acquiring entity, subject to this Privacy Policy.` },
  { id: "retention", title: "6. Data Retention", content: `We retain different categories of data for different periods:\n\n- Message content processed by AI models: not persistently stored; processed in real-time\n- Server memory data: retained while the bot is active in the server\n- Account data: retained until account deletion\n- Usage logs: 90 days for operational logs, up to 2 years for aggregated analytics\n- Billing data: as required by financial regulations (typically 7 years)\n\nYou may request deletion of your data at any time (see Section 9).` },
  { id: "security", title: "7. Security", content: `We implement industry-standard security measures to protect your data, including encryption in transit (TLS 1.3), encryption at rest for sensitive data, access controls limiting which employees can access user data, regular security audits and penetration testing, and SOC 2 Type II compliance (in progress).\n\nNo system is 100% secure. You use the Service at your own risk, and we cannot guarantee absolute security.` },
  { id: "children", title: "8. Children's Privacy", content: `The Service is not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If we learn that we have collected data from a child under 13, we will delete that data promptly.\n\nIf you believe we have collected data from a child under 13, please contact us at privacy@directioner.app.` },
  { id: "rights", title: "9. Your Rights & Choices", content: `Depending on your jurisdiction, you may have the following rights:\n\nAccess: Request a copy of the personal data we hold about you.\nCorrection: Request correction of inaccurate data.\nDeletion: Request deletion of your personal data ("right to be forgotten").\nPortability: Request your data in a machine-readable format.\nOpt-out: Opt out of memory profiling using /privacy-mode in Discord.\n\nTo exercise these rights, email privacy@directioner.app. We will respond within 30 days. For EU/EEA residents, you also have the right to lodge a complaint with your local data protection authority.` },
  { id: "international", title: "10. International Data Transfers", content: `Directioner operates in the United States. If you use the Service from outside the US, your data may be transferred to and processed in the US, which may have different data protection laws than your country.\n\nFor EU/EEA users, we rely on Standard Contractual Clauses (SCCs) for international data transfers. By using the Service, you consent to the transfer of your data to the US under these safeguards.` },
  { id: "cookies", title: "11. Cookies & Tracking", content: `Our website uses cookies and similar tracking technologies for session management, analytics, and fraud prevention. We do not use third-party advertising cookies.\n\nYou can control cookie settings through your browser. Disabling cookies may affect the functionality of our website but does not affect the bot's operation in Discord.` },
  { id: "changes", title: "12. Changes to This Policy", content: `We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top and notify you of material changes via email or an in-Discord announcement.\n\nYour continued use of the Service after a policy update constitutes your acceptance of the revised policy.` },
  { id: "contact-privacy", title: "13. Contact Us", content: `For privacy-related questions, requests, or concerns, contact our privacy team at privacy@directioner.app.\n\nFor GDPR-related requests, please include "GDPR Request" in the subject line. We will respond within 30 days as required by applicable law.` },
];

export default function Privacy() {
  usePageTitle("Privacy Policy — Directioner");
  const [activeSection, setActiveSection] = useState("overview");
  const contentRef = useRef<HTMLDivElement>(null);

  /* Reading progress bar */
  const { scrollYProgress } = useScroll({ target: contentRef, offset: ["start start", "end end"] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { rootMargin: "-30% 0px -60% 0px" }
    );
    sections.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={contentRef} style={{ background: "#070708" }}>
      {/* Reading progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50"
        style={{ scaleX, background: "linear-gradient(90deg, #0ea5e9, rgba(14,165,233,0.4))" }}
      />

      {/* ── Hero ── */}
      <section className="relative pt-40 pb-16 px-6 overflow-hidden" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="grain-overlay" />
        <motion.div
          className="absolute pointer-events-none"
          style={{ width: 500, height: 300, top: 0, right: "10%", background: "radial-gradient(ellipse, rgba(14,165,233,0.05) 0%, transparent 70%)", filter: "blur(60px)" }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <div className="max-w-7xl mx-auto relative">
          <Reveal>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/25">Legal</span>
          </Reveal>
          <motion.h1
            className="font-display font-bold text-white leading-[0.9] tracking-tight mt-4 mb-6"
            style={{ fontSize: "clamp(40px, 6vw, 80px)", letterSpacing: "-0.04em" }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Privacy Policy
          </motion.h1>
          <Reveal delay={0.2}>
            <p className="font-mono text-sm text-white/35">
              Last updated: <span className="text-white/50">July 1, 2026</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto flex gap-16">
          {/* Sticky TOC */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24">
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/25 mb-5">Contents</p>
              <nav className="space-y-0.5">
                {sections.map(s => {
                  const active = activeSection === s.id;
                  return (
                    <motion.a
                      key={s.id}
                      href={`#${s.id}`}
                      className="flex items-center gap-2 py-1.5 transition-all duration-200 font-mono text-[10px] leading-relaxed"
                      style={{ color: active ? "#0ea5e9" : "rgba(255,255,255,0.3)", paddingLeft: active ? 6 : 0 }}
                      onClick={e => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                      whileHover={{ x: 3 }}
                    >
                      {active && (
                        <motion.div
                          layoutId="privacy-toc-dot"
                          className="w-1 h-1 rounded-full shrink-0"
                          style={{ background: "#0ea5e9" }}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      {s.title}
                    </motion.a>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Body */}
          <div className="flex-1 max-w-3xl space-y-16">
            {sections.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.02}>
                <div id={s.id} style={{ scrollMarginTop: "100px" }}>
                  <motion.div
                    className="h-px mb-6"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                    initial={{ scaleX: 0, originX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <h2 className="font-display font-bold text-white text-xl md:text-2xl mb-5 tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                    {s.title}
                  </h2>
                  <div className="space-y-4">
                    {s.content.split("\n\n").map((para, j) => (
                      <p key={j} className="font-mono text-[12px] leading-[1.9] text-white/45">{para}</p>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}

            <div className="pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="font-mono text-[11px] text-white/30">
                This policy was last updated on July 1, 2026. For previous versions, contact us at{" "}
                <span className="text-white/50">privacy@directioner.app</span>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
