import { useRef, useState } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link } from "wouter";
import { PageHero, Reveal, DrawLine } from "@/components/ui/motion-primitives";
import { BorderBeam } from "@/components/animations/BorderBeam";

type FAQ = { q: string; a: string };

const faqData: { category: string; color: string; faqs: FAQ[] }[] = [
  { category: "General", color: "#FFE500", faqs: [
    { q: "What is Directioner?", a: "Directioner is an advanced AI-powered Discord bot that provides natural conversation, voice interaction, persistent memory, and specialized modes for productivity, learning, gaming, and more." },
    { q: "How is Directioner different from other bots?", a: "Three key differences: genuine long-term memory (per user, per server), real-time voice conversation support, and personality modes that adapt to your community's culture rather than giving generic responses." },
    { q: "What AI model does Directioner use?", a: "Directioner uses OpenAI's GPT-4o as its primary model for text intelligence. Voice synthesis uses ElevenLabs API. You can select GPT-4o Mini for faster responses on the Model setting." },
    { q: "Is Directioner safe for all ages?", a: "Directioner is designed for communities 13+ per Discord ToS. You can configure content filters in server settings to restrict explicit or sensitive topics." },
  ]},
  { category: "Setup & Installation", color: "#0ea5e9", faqs: [
    { q: "How do I add Directioner to my server?", a: "Click the 'Add to Discord' button, select your server, approve the requested permissions, and run /setup to configure the bot. Total time: under 60 seconds." },
    { q: "What permissions does Directioner need?", a: "Required: Send Messages, Read Message History, Connect (voice), Speak (voice). Optional: Manage Messages (for cleanup), Embed Links, Attach Files." },
    { q: "Can I use Directioner in multiple servers?", a: "Yes — each server has its own isolated settings, memory, and personality configuration. Your Pro plan allows up to 3 concurrent server instances." },
  ]},
  { category: "Features", color: "#a855f7", faqs: [
    { q: "How does the memory system work?", a: "Directioner uses a vector database to store and retrieve conversational context, user preferences, and factual information. Memories are categorized as user-level, channel-level, or server-level and automatically recalled when relevant." },
    { q: "What personality modes are available?", a: "Six modes: Chat (balanced and casual), Tutor (educational and patient), Coder (technical and precise), Chaos (unhinged and creative), Creative (imaginative storytelling), and Debate (analytical and Socratic)." },
    { q: "Does Directioner support voice channels?", a: "Yes. Use /join to have Directioner enter your voice channel. It will listen for its wake word, synthesize speech responses, and can speak back to the entire channel." },
    { q: "Can Directioner remember things between sessions?", a: "Yes. Memories persist across all sessions indefinitely (within your plan's node limit). Use /memory list to view stored memories and /forget [id] to delete specific ones." },
  ]},
  { category: "Pricing & Plans", color: "#10b981", faqs: [
    { q: "What's included in the free tier?", a: "The free tier includes 1 bot instance, 100 messages per day, 5 voice interactions per day, and basic text modes. It's a permanent free tier — no trial expiry." },
    { q: "Can I switch plans later?", a: "Upgrade anytime; it takes effect immediately on a prorated basis. Downgrades take effect at your next billing cycle renewal." },
    { q: "Is there a yearly discount?", a: "Yes — paying annually saves 20%. You can toggle between billing cycles on the pricing page." },
    { q: "Do you offer refunds?", a: "We offer a full refund within 7 days of your first payment if you're not satisfied. After that, no partial refunds are provided but you can cancel anytime." },
  ]},
  { category: "Privacy & Security", color: "#f43f5e", faqs: [
    { q: "Is my server's data private?", a: "Yes. Each server's memory and conversation data is completely siloed and never shared across servers or sold to third parties." },
    { q: "Can I delete all my data?", a: "Absolutely. Use /memory clear to wipe all server memories, or contact support to request full account data deletion within 48 hours." },
    { q: "Is the connection to Discord encrypted?", a: "Yes. All data in transit uses TLS 1.3. Memory data at rest is encrypted using AES-256." },
  ]},
  { category: "Technical", color: "#6366f1", faqs: [
    { q: "What is the uptime SLA?", a: "Free and Starter tiers have best-effort uptime. Pro provides a 99.9% monthly SLA. Max provides 99.99% with dedicated infrastructure." },
    { q: "How is latency handled for voice?", a: "Voice processing is optimized for < 200ms end-to-end latency using co-located inference nodes. Latency may vary by region." },
    { q: "Is there an API for developers?", a: "API access is available on the Max plan. Docs are available at api.directioner.app. Custom webhooks and integration SDKs are in development." },
  ]},
  { category: "Support", color: "#f97316", faqs: [
    { q: "How do I get support?", a: "Use /support in Discord for built-in help, email us at support@directioner.app, or join our official support server." },
    { q: "What are the support hours?", a: "Community support is 24/7 via Discord. Email support is Monday–Friday, 9 AM–6 PM IST. Max plan customers receive 24/7 phone support." },
    { q: "How do I report a bug?", a: "Use the /feedback command in any server, or open a GitHub issue at github.com/directioner-bot/directioner. We triage bug reports within 24 hours." },
  ]},
];

function FAQAccordion({ faqs, color }: { faqs: FAQ[]; color: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className="space-y-2">
      {faqs.map((faq, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden relative"
          style={{ border: `1px solid ${open === i ? color + "30" : "rgba(255,255,255,0.06)"}`, transition: "border-color 0.3s" }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between p-5 text-left transition-colors group"
            style={{ background: open === i ? `${color}05` : "#0f0f12" }}
          >
            <span className="font-mono text-sm text-white pr-6 group-hover:text-white transition-colors">{faq.q}</span>
            <motion.div
              animate={{ rotate: open === i ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="shrink-0"
            >
              <ChevronDown size={16} style={{ color: open === i ? color : "rgba(255,255,255,0.3)" }} />
            </motion.div>
          </button>

          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  initial={{ y: -8 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="px-5 pb-5 pt-2 font-mono text-xs leading-[1.8] relative"
                  style={{ background: `${color}04`, color: "rgba(255,255,255,0.5)", borderTop: `1px solid ${color}15` }}
                >
                  {/* Left accent bar */}
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-[2px]"
                    style={{ background: color }}
                    initial={{ scaleY: 0, originY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <div className="pl-3">{faq.a}</div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

export default function FAQ() {
  usePageTitle("FAQ");
  const [activeCategory, setActiveCategory] = useState("General");
  const current = faqData.find(f => f.category === activeCategory)!;

  return (
    <div style={{ background: "#070708" }}>
      <PageHero
        eyebrow="FAQ — Help Center"
        heading="Answers."
        sub="Everything you need to know about Directioner. Can't find the answer? Reach out on Discord."
      />

      <div className="max-w-7xl mx-auto px-6 pb-24 flex flex-col lg:flex-row gap-12">
        {/* Category nav */}
        <div className="w-full lg:w-56 shrink-0">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/20 mb-4">Categories</p>
          <div className="space-y-px">
            {faqData.map(cat => {
              const active = activeCategory === cat.category;
              return (
                <button
                  key={cat.category}
                  onClick={() => setActiveCategory(cat.category)}
                  className="w-full text-left flex items-center justify-between px-4 py-3 relative overflow-hidden transition-all group"
                  style={{
                    background: active ? `${cat.color}08` : "transparent",
                    borderLeft: `2px solid ${active ? cat.color : "transparent"}`,
                  }}
                >
                  {/* Hover sweep */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ background: `${cat.color}06` }}
                  />

                  <span
                    className="font-mono text-xs uppercase tracking-wide transition-colors relative z-10"
                    style={{ color: active ? cat.color : "rgba(255,255,255,0.35)" }}
                  >
                    {cat.category}
                  </span>
                  <div className="flex items-center gap-2 relative z-10">
                    {active && (
                      <motion.div
                        layoutId="faq-active-dot"
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: cat.color }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="font-mono text-[9px]" style={{ color: active ? cat.color : "rgba(255,255,255,0.2)" }}>
                      {cat.faqs.length}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-8">
                <motion.div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: current.color, boxShadow: `0 0 10px ${current.color}` }}
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {current.category} — {current.faqs.length} question{current.faqs.length !== 1 ? "s" : ""}
                </span>
              </div>

              <FAQAccordion faqs={current.faqs} color={current.color} />
            </motion.div>
          </AnimatePresence>

          <DrawLine />

          <Reveal className="pt-12">
            <div
              className="p-8 text-center relative overflow-hidden"
              style={{ background: "#0f0f12", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <BorderBeam color="#FFE500" duration={6} size={80} />
              <p className="font-mono text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
                Still have questions? We're here.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/contact"
                    className="inline-flex font-mono font-bold text-xs uppercase tracking-wide px-6 py-3"
                    style={{ background: "#FFE500", color: "#000" }}
                  >
                    Contact Support
                  </Link>
                </motion.div>
                <motion.a
                  href="https://discord.com/invite/directioner"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex font-mono text-xs uppercase tracking-wide px-6 py-3 transition-all"
                  style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}
                  whileHover={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}
                >
                  Join Discord
                </motion.a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
