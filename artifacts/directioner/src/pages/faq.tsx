import { useState } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link } from "wouter";
import { PageHero, Reveal, DrawLine } from "@/components/ui/motion-primitives";
import { ClipReveal } from "@/components/animations/ClipReveal";
import { TextScramble } from "@/components/animations/TextScramble";

type FAQ = { q: string; a: string };

const faqData: { category: string; color: string; faqs: FAQ[] }[] = [
  {
    category: "General",
    color: "#FFE500",
    faqs: [
      { q: "What is Directioner?", a: "Directioner is an advanced AI-powered Discord bot that provides natural conversation, voice interaction, persistent memory, and specialized modes for productivity, learning, gaming, and more." },
      { q: "How is Directioner different from other bots?", a: "Three key differences: genuine long-term memory (per user, per server), real-time voice conversation support, and personality modes that adapt to your community's culture rather than giving generic responses." },
      { q: "What AI model does Directioner use?", a: "Directioner uses OpenAI's GPT-4o as its primary model for text intelligence. Voice synthesis uses ElevenLabs API. You can select GPT-4o Mini for faster responses on the Model setting." },
      { q: "Is Directioner safe for all ages?", a: "Directioner is designed for communities 13+ per Discord ToS. You can configure content filters in server settings to restrict explicit or sensitive topics." },
    ],
  },
  {
    category: "Setup & Installation",
    color: "#0ea5e9",
    faqs: [
      { q: "How do I add Directioner to my server?", a: "Click the 'Add to Discord' button, select your server, approve the requested permissions, and run /setup to configure the bot. Total time: under 60 seconds." },
      { q: "What permissions does Directioner need?", a: "Required: Send Messages, Read Message History, Connect (voice), Speak (voice). Optional: Manage Messages (for cleanup), Embed Links, Attach Files." },
      { q: "Can I use Directioner in multiple servers?", a: "Yes — each server has its own isolated settings, memory, and personality configuration. Your Pro plan allows up to 3 concurrent server instances." },
    ],
  },
  {
    category: "Features",
    color: "#a855f7",
    faqs: [
      { q: "How does the memory system work?", a: "Directioner uses a vector database to store and retrieve conversational context, user preferences, and factual information. Memories are categorized as user-level, channel-level, or server-level and automatically recalled when relevant." },
      { q: "What personality modes are available?", a: "Six modes: Chat (balanced and casual), Tutor (educational and patient), Coder (technical and precise), Chaos (unhinged and creative), Creative (imaginative storytelling), and Debate (analytical and Socratic)." },
      { q: "Does Directioner support voice channels?", a: "Yes. Use /join to have Directioner enter your voice channel. It will listen for its wake word, synthesize speech responses, and can speak back to the entire channel." },
      { q: "Can Directioner remember things between sessions?", a: "Yes. Memories persist across all sessions indefinitely (within your plan's node limit). Use /memory list to view stored memories and /forget [id] to delete specific ones." },
    ],
  },
  {
    category: "Pricing & Plans",
    color: "#10b981",
    faqs: [
      { q: "What's included in the free tier?", a: "The free tier includes 1 bot instance, 100 messages per day, 5 voice interactions per day, and basic text modes. It's a permanent free tier — no trial expiry." },
      { q: "Can I switch plans later?", a: "Upgrade anytime; it takes effect immediately on a prorated basis. Downgrades take effect at your next billing cycle renewal." },
      { q: "Is there a yearly discount?", a: "Yes — paying annually saves 20%. You can toggle between billing cycles on the pricing page." },
      { q: "Do you offer refunds?", a: "We offer a full refund within 7 days of your first payment if you're not satisfied. After that, no partial refunds are provided but you can cancel anytime." },
    ],
  },
  {
    category: "Privacy & Security",
    color: "#f43f5e",
    faqs: [
      { q: "Is my server's data private?", a: "Yes. Each server's memory and conversation data is completely siloed and never shared across servers or sold to third parties." },
      { q: "Can I delete all my data?", a: "Absolutely. Use /memory clear to wipe all server memories, or contact support to request full account data deletion within 48 hours." },
      { q: "Is the connection to Discord encrypted?", a: "Yes. All data in transit uses TLS 1.3. Memory data at rest is encrypted using AES-256." },
    ],
  },
  {
    category: "Technical",
    color: "#6366f1",
    faqs: [
      { q: "What is the uptime SLA?", a: "Free and Starter tiers have best-effort uptime. Pro provides a 99.9% monthly SLA. Max provides 99.99% with dedicated infrastructure." },
      { q: "How is latency handled for voice?", a: "Voice processing is optimized for < 200ms end-to-end latency using co-located inference nodes. Latency may vary by region." },
      { q: "Is there an API for developers?", a: "API access is available on the Max plan. Docs are available at api.directioner.app. Custom webhooks and integration SDKs are in development." },
    ],
  },
  {
    category: "Support",
    color: "#f97316",
    faqs: [
      { q: "How do I get support?", a: "Use /support in Discord for built-in help, email us at support@directioner.app, or join our official support server." },
      { q: "What are the support hours?", a: "Community support is 24/7 via Discord. Email support is Monday–Friday, 9 AM–6 PM IST. Max plan customers receive 24/7 phone support." },
      { q: "How do I report a bug?", a: "Use the /feedback command in any server, or open a GitHub issue at github.com/directioner-bot/directioner. We triage bug reports within 24 hours." },
    ],
  },
];

function FAQAccordion({ faqs, color }: { faqs: FAQ[]; color: string }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="rounded-lg overflow-hidden"
          style={{ border: `1px solid ${open === i ? color + "25" : "rgba(255,255,255,0.06)"}` }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between p-5 text-left transition-colors"
            style={{ background: "#0f0f12" }}
          >
            <span className="font-mono text-sm text-white pr-6">{faq.q}</span>
            <motion.span animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.25 }}>
              <ChevronDown size={16} style={{ color: open === i ? color : "rgba(255,255,255,0.3)" }} />
            </motion.span>
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  className="px-5 pb-5 font-mono text-xs leading-relaxed"
                  style={{ background: "#0f0f12", color: "rgba(255,255,255,0.45)" }}
                >
                  {faq.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
        image="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1920&q=80"
      />

      <div className="max-w-7xl mx-auto px-6 pb-24 flex flex-col lg:flex-row gap-12">
        {/* Category nav */}
        <div className="w-full lg:w-52 shrink-0 space-y-1">
          {faqData.map(cat => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(cat.category)}
              className="w-full text-left flex items-center justify-between px-4 py-3 rounded font-mono text-xs uppercase tracking-wide transition-all"
              style={{
                background: activeCategory === cat.category ? `${cat.color}10` : "transparent",
                color: activeCategory === cat.category ? cat.color : "rgba(255,255,255,0.35)",
                borderLeft: activeCategory === cat.category ? `2px solid ${cat.color}` : "2px solid transparent",
              }}
            >
              <span>{cat.category}</span>
              <span className="text-[9px] opacity-50">{cat.faqs.length}</span>
            </button>
          ))}
        </div>

        {/* FAQ content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-2 rounded-full" style={{ background: current.color }} />
            <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
              {current.category} — {current.faqs.length} questions
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <FAQAccordion faqs={current.faqs} color={current.color} />
            </motion.div>
          </AnimatePresence>

          <DrawLine />
          <Reveal className="pt-12">
            <div className="p-8 rounded-xl text-center"
              style={{ background: "#0f0f12", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="font-mono text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
                Still have questions? We're here.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link href="/contact"
                  className="font-mono font-bold text-xs uppercase tracking-wide px-6 py-3 transition-all"
                  style={{ background: "#FFE500", color: "#000" }}>
                  Contact Support
                </Link>
                <a href="https://discord.com/invite/directioner" target="_blank" rel="noopener noreferrer"
                  className="font-mono text-xs uppercase tracking-wide px-6 py-3 transition-all"
                  style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}>
                  Join Discord
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
