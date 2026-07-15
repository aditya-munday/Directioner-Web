import { useState } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { PageHero, Reveal, DrawLine } from "@/components/ui/motion-primitives";

const capabilities = [
  { label: "Voice Conversation",   tag: "VOICE",   color: "#0ea5e9", desc: "Speak with Directioner in real-time Discord voice channels." },
  { label: "Memory Recall",        tag: "MEMORY",  color: "#a855f7", desc: "Remembers users, preferences, and facts across every session." },
  { label: "Code Review",          tag: "CODE",    color: "#FFE500", desc: "Inline code critique, bug detection, and style suggestions." },
  { label: "Homework Help",        tag: "LEARN",   color: "#10b981", desc: "Step-by-step explanations for 30+ academic subjects." },
  { label: "Creative Writing",     tag: "CREATE",  color: "#f97316", desc: "Fiction prompts, story feedback, and co-authoring mode." },
  { label: "Debate Mode",          tag: "DEBATE",  color: "#6366f1", desc: "Socratic partner that argues multiple sides of any topic." },
  { label: "Game Integration",     tag: "GAME",    color: "#0ea5e9", desc: "Stat queries, lore lookup, and raid coordination." },
  { label: "Language Learning",    tag: "LANG",    color: "#FFE500", desc: "Real-time grammar correction in 20+ languages." },
  { label: "Team Standup",         tag: "TEAM",    color: "#10b981", desc: "Async standup facilitation and action item extraction." },
  { label: "Music Recommendations",tag: "MUSIC",   color: "#f43f5e", desc: "Personalized music discovery via mood, genre, and era." },
  { label: "Habit Tracking",       tag: "HABIT",   color: "#a855f7", desc: "Daily goal reminders and streak accountability." },
  { label: "Trivia & Games",       tag: "FUN",     color: "#f97316", desc: "Multi-player trivia, riddles, and interactive stories." },
];

const prompts = [
  { category: "VOICE",   text: "Join #general and speak only when someone says your name." },
  { category: "CODE",    text: "Review this Python function and point out edge cases." },
  { category: "LEARN",   text: "Explain quantum entanglement like I'm 14 years old." },
  { category: "MEMORY",  text: "Remember that Kai prefers bullet points and no emojis." },
  { category: "DEBATE",  text: "Give me three strong arguments for and three against remote work." },
  { category: "GAME",    text: "What's the most efficient Baldur's Gate 3 build for solo play?" },
  { category: "CREATE",  text: "Continue this story: 'The last library on Earth opened its doors...'" },
  { category: "TEAM",    text: "Summarize what was decided in today's meeting thread." },
  { category: "FUN",     text: "Start a trivia game about 1990s movies in this channel." },
  { category: "LANG",    text: "Correct my Spanish and explain each mistake I make." },
  { category: "HABIT",   text: "Remind the server every morning at 9 AM to do their daily standup." },
  { category: "MUSIC",   text: "Recommend 5 artists similar to Radiohead but less depressing." },
];

const CAT_COLORS: Record<string, string> = {
  VOICE: "#0ea5e9", CODE: "#FFE500", LEARN: "#10b981", MEMORY: "#a855f7",
  DEBATE: "#6366f1", GAME: "#0ea5e9", CREATE: "#f97316", TEAM: "#10b981",
  FUN: "#f97316", LANG: "#FFE500", HABIT: "#a855f7", MUSIC: "#f43f5e",
};

export default function Explore() {
  usePageTitle("Explore");
  const [activePrompt, setActivePrompt] = useState<number | null>(null);

  return (
    <div style={{ background: "#070708" }}>
      <PageHero
        eyebrow="Explore — Capability Browser"
        heading="Discover everything."
        sub="Browse Directioner's capabilities or see example prompts. Click any capability to see how to use it."
      />

      {/* Capability grid */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: "rgba(255,255,255,0.25)" }}>
              12 Core Capabilities
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-xl cursor-default transition-all"
                style={{ background: "#0f0f12", border: "1px solid rgba(255,255,255,0.06)" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${cap.color}30`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${cap.color}06`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-1 rounded"
                    style={{ background: `${cap.color}15`, color: cap.color, border: `1px solid ${cap.color}25` }}>
                    {cap.tag}
                  </span>
                </div>
                <h3 className="font-display font-bold text-white text-base uppercase mb-2 leading-tight">{cap.label}</h3>
                <p className="font-mono text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>{cap.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <DrawLine />

      {/* Prompt explorer */}
      <section className="py-24 px-6" style={{ background: "#0a0a0c" }}>
        <div className="max-w-4xl mx-auto">
          <Reveal className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} style={{ color: "#FFE500" }} />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: "#FFE500" }}>
                Prompt Examples
              </span>
            </div>
            <h2 className="font-display font-bold text-white" style={{ fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.03em" }}>
              Ask anything.
            </h2>
            <p className="font-mono text-xs mt-3" style={{ color: "rgba(255,255,255,0.35)" }}>
              Click a prompt to expand how it works and what Directioner would respond.
            </p>
          </Reveal>

          <div className="space-y-2">
            {prompts.map((p, i) => {
              const color = CAT_COLORS[p.category] ?? "#FFE500";
              const isOpen = activePrompt === i;
              return (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden transition-all"
                  style={{ border: `1px solid ${isOpen ? color + "30" : "rgba(255,255,255,0.06)"}` }}
                >
                  <button
                    onClick={() => setActivePrompt(isOpen ? null : i)}
                    className="w-full flex items-center gap-4 p-5 text-left transition-colors"
                    style={{ background: "#0f0f12" }}
                  >
                    <span className="font-mono text-[9px] uppercase tracking-widest shrink-0 px-2 py-1 rounded"
                      style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}>
                      {p.category}
                    </span>
                    <span className="font-mono text-sm text-white italic flex-1">"{p.text}"</span>
                    <motion.span
                      animate={{ x: isOpen ? 4 : 0, rotate: isOpen ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight size={15} style={{ color: isOpen ? color : "rgba(255,255,255,0.25)" }} />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-5 pb-5 pt-1" style={{ background: "#0f0f12" }}>
                          <div className="p-4 rounded-lg"
                            style={{ background: "#070708", border: `1px solid ${color}15` }}>
                            <div className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color }}>
                              Directioner would:
                            </div>
                            <p className="font-mono text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                              {p.category === "VOICE" && "Join your voice channel, apply the configured wake word, and begin listening. It will speak responses through voice synthesis at the volume you configured."}
                              {p.category === "CODE" && "Parse the code block, identify potential edge cases like null inputs, integer overflow, and empty arrays, then suggest specific fixes with inline examples."}
                              {p.category === "LEARN" && "Break down the concept into a simple analogy first, then layer in accurate scientific detail. It adjusts explanation depth based on follow-up questions."}
                              {p.category === "MEMORY" && "Store this as a user-level memory node tied to Kai's Discord ID. Future responses to Kai will automatically use bullet points without emojis."}
                              {p.category === "DEBATE" && "Present a balanced structured argument with three points per side, citing relevant studies or commonly cited examples without taking a personal stance."}
                              {p.category === "GAME" && "Pull from its built-in game knowledge to recommend a specific class/subclass build with equipment recommendations and tactical notes for the current patch."}
                              {p.category === "CREATE" && "Continue the story in a matching literary style for 2-3 paragraphs, then pause to ask which direction you'd like the narrative to develop."}
                              {p.category === "TEAM" && "Scan the last 50 messages in the designated meeting thread, extract key decisions and named action items, and post a structured summary."}
                              {p.category === "FUN" && "Start a public trivia game, post 10 questions one-by-one with 30-second timers, track correct answers, and announce the winner at the end."}
                              {p.category === "LANG" && "Respond in Spanish when spoken to, gently highlight any grammatical errors with correct alternatives, and explain the rule behind each correction."}
                              {p.category === "HABIT" && "Schedule a recurring morning message in the target channel at 9 AM server time using the configured timezone, with a daily check-in prompt."}
                              {p.category === "MUSIC" && "Analyze Radiohead's sonic and lyrical profile, then recommend 5 artists sharing their experimental and guitar-driven qualities but with more upbeat or hopeful themes."}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <DrawLine />

      {/* CTA */}
      <section className="py-32 px-6 text-center" style={{ background: "#070708" }}>
        <div className="max-w-xl mx-auto">
          <Reveal>
            <h2 className="font-display font-bold text-white mb-6" style={{ fontSize: "clamp(36px, 6vw, 80px)", letterSpacing: "-0.04em" }}>
              Start exploring.
            </h2>
            <p className="font-mono text-xs mb-10" style={{ color: "rgba(255,255,255,0.35)" }}>
              Add Directioner to your server and unlock all 12 capability modules.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <a
                href="https://discord.com/oauth2/authorize"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono font-bold text-sm uppercase tracking-wide px-8 py-4"
                style={{ background: "#FFE500", color: "#000" }}
              >
                Add to Discord
              </a>
              <a href="/commands"
                className="font-mono text-xs uppercase tracking-wide px-8 py-4 transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}>
                View Commands
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
