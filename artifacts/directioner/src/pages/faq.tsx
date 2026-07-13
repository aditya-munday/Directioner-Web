import { usePageTitle } from "@/hooks/use-page-title";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionLabel } from "@/components/layout/SectionLabel";
import { Link } from "wouter";

export default function FAQ() {
  usePageTitle("FAQ");
  const [openId, setOpenId] = useState<string | null>(null);

  const categories = [
    {
      title: "1. Getting Started",
      faqs: [
        { id: "1-1", q: "How do I add Directioner to my Discord server?", a: "Click 'Add to Discord' on our website, authorize the bot with the required permissions, and it'll appear in your server within seconds. No configuration required to get started." },
        { id: "1-2", q: "What permissions does Directioner need?", a: "Send Messages, Read Message History, Connect (voice), Speak (voice), and Embed Links. We request only what we need." },
        { id: "1-3", q: "How long does setup take?", a: "Under 5 minutes. Add the bot, optionally configure which channels it can respond in, and you're done." },
        { id: "1-4", q: "Is there a free trial?", a: "Yes — the Free tier is completely free forever. No credit card required. Upgrade only when you need more credits or features." }
      ]
    },
    {
      title: "2. Features",
      faqs: [
        { id: "2-1", q: "How many memory nodes do I get?", a: "Free: 50 nodes. Basic: 500. Pro: 5,000. Max: Unlimited. Memory nodes store user preferences, facts, and conversation summaries." },
        { id: "2-2", q: "Does it work in voice channels?", a: "Yes, on Basic and above. The bot joins voice channels, listens, and responds with ultra-low-latency voice synthesis." },
        { id: "2-3", q: "How do I switch between AI modes?", a: "Use /chatmode [mode] where mode is: chat, tutor, coder, chaos, creative, or debate. Or use /chatmode in DM to set a global default." },
        { id: "2-4", q: "What languages does it support?", a: "20+ languages including English, Spanish, French, German, Japanese, Chinese, Korean, Arabic, Portuguese, Italian, and more." }
      ]
    },
    {
      title: "3. Privacy & Security",
      faqs: [
        { id: "3-1", q: "Does Directioner store my messages?", a: "We store only what's explicitly saved as memory nodes. Regular conversation messages are processed but not permanently stored after the response is generated." },
        { id: "3-2", q: "Who can see my server's data?", a: "Nobody but you and your server admins. Data is strictly siloed per Discord server and never shared." },
        { id: "3-3", q: "Are you GDPR compliant?", a: "Yes. You can export all your data via /export and delete everything via /deletedata. We honor all data subject requests within 30 days." },
        { id: "3-4", q: "Is the communication encrypted?", a: "Yes. All data in transit uses TLS 1.3. Data at rest is encrypted using AES-256." }
      ]
    },
    {
      title: "4. Technical",
      faqs: [
        { id: "4-1", q: "What's the typical response latency?", a: "Under 200ms for text responses. Voice responses are 150-250ms end-to-end." },
        { id: "4-2", q: "What's your uptime SLA?", a: "99.9% uptime for Pro and Max tiers. Free and Basic have best-effort availability." },
        { id: "4-3", q: "Are there rate limits?", a: "Yes, based on your daily credit cap: Free 50/day, Basic 300/day, Pro 1,500/day, Max unlimited." },
        { id: "4-4", q: "Do you offer an API?", a: "API access is available on the Max tier. It allows you to trigger bot actions, read analytics, and manage memory programmatically." }
      ]
    },
    {
      title: "5. Modes",
      faqs: [
        { id: "5-1", q: "What's the difference between /chat and /tutor mode?", a: "/chat is natural conversation. /tutor is optimized for education — more patient, uses examples, breaks down concepts, and asks comprehension questions." },
        { id: "5-2", q: "Can I set a mode permanently for my server?", a: "Yes. Admins can use /chatmode [mode] to set the server-wide default. Individual users can still override in DM." },
        { id: "5-3", q: "Is /chaos mode safe?", a: "/chaos mode is unpredictable and playful, but still follows Discord's terms of service and our content policies." },
        { id: "5-4", q: "Can I create custom personality modes?", a: "On Max tier, you can define custom personality presets with specific traits, tone, and behavior guidelines." }
      ]
    },
    {
      title: "6. Voice & Text",
      faqs: [
        { id: "6-1", q: "How good is the voice quality?", a: "We use state-of-the-art neural TTS with natural prosody. Most users can't distinguish it from human voice at normal conversation speed." },
        { id: "6-2", q: "Can it hear multiple people talking at once?", a: "Yes. Multi-speaker mode identifies and responds to the primary speaker while tracking context from others." },
        { id: "6-3", q: "Does it support Discord formatting?", a: "Yes. It uses **bold**, *italic*, `code blocks`, and > quotes natively in Discord." },
        { id: "6-4", q: "Can I attach files for it to analyze?", a: "Yes on Pro and Max. The bot can analyze images, PDFs, and code files attached to messages." }
      ]
    },
    {
      title: "7. For Communities",
      faqs: [
        { id: "7-1", q: "Will it handle 10,000-member servers?", a: "Yes. Directioner is horizontally scaled and battle-tested on servers with 50k+ members." },
        { id: "7-2", q: "Can I restrict it to specific channels?", a: "Yes. Use /channels to toggle which text and voice channels the bot is active in." },
        { id: "7-3", q: "Can mods control what the bot does?", a: "Yes. Server admins and roles you designate can use admin commands like /enable, /disable, /reset, and /logs." },
        { id: "7-4", q: "Can it moderate the server?", a: "Not directly, but it can flag messages, summarize conflicts, and explain community rules. Full moderation features are on the roadmap." }
      ]
    },
    {
      title: "8. Content & Creativity",
      faqs: [
        { id: "8-1", q: "Can it write long-form content?", a: "Yes. On Pro and Max, responses can be up to 4,000 tokens (roughly 3,000 words). Use /response-length long to enable this." },
        { id: "8-2", q: "Does it have an NSFW mode?", a: "No. Directioner does not generate NSFW content. This cannot be changed." },
        { id: "8-3", q: "Can it maintain a character for roleplay?", a: "Yes. Use /personality to set a character description. The bot will maintain that persona across the session." },
        { id: "8-4", q: "What creative writing styles can it mimic?", a: "Any style you describe — minimalist, Hemingway, sci-fi, fantasy, academic, casual blog, ad copy, and more." }
      ]
    },
    {
      title: "9. Productivity",
      faqs: [
        { id: "9-1", q: "Can it set reminders?", a: "Yes. 'Remind me to submit the report tomorrow at 9am' and it will send a DM reminder." },
        { id: "9-2", q: "Can it summarize long threads?", a: "Yes. Reply to any message with /summary and it'll summarize the last 50 messages in that channel." },
        { id: "9-3", q: "Does it integrate with external tools?", a: "On Max tier, it integrates with GitHub, Linear, Notion, and Google Calendar via slash commands." },
        { id: "9-4", q: "Can it track team tasks?", a: "Yes. In /tutor or default mode, say 'create a task list' and it'll format and track items through the conversation." }
      ]
    }
  ];

  return (
    <div className="pt-32 pb-32 px-6 max-w-4xl mx-auto min-h-screen">
      <div className="mb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-display font-black uppercase mb-6 text-white">FAQ.</h1>
        <div className="font-mono text-primary text-sm uppercase border border-primary bg-primary/10 inline-block px-4 py-2">
          Frequently Asked Questions
        </div>
      </div>

      <div className="space-y-16">
        {categories.map((cat, i) => (
          <div key={i} className="space-y-6">
            <h2 className="font-display font-bold text-2xl uppercase text-white border-b border-border pb-4">{cat.title}</h2>
            
            <div className="space-y-4">
              {cat.faqs.map((faq) => (
                <div key={faq.id} className="border border-border bg-card overflow-hidden">
                  <button 
                    className="w-full text-left p-6 font-mono font-bold text-sm md:text-base uppercase flex justify-between items-center hover:bg-white/5 transition-colors text-white"
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  >
                    <span className="pr-4">{faq.q}</span>
                    <ChevronDown className={`transform transition-transform shrink-0 text-primary ${openId === faq.id ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openId === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-6 pb-6 pt-2 text-muted-foreground font-sans text-base leading-relaxed border-t border-border mt-2">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-24 text-center border border-border p-12 bg-card">
        <p className="font-mono text-sm uppercase mb-6 text-white">Still have questions?</p>
        <Link href="/contact" className="inline-block bg-primary text-black font-mono font-bold px-8 py-4 uppercase text-sm corner-brackets hover:bg-white transition-colors">
          Contact Support
        </Link>
      </div>
    </div>
  );
}
