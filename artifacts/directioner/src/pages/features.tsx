import { usePageTitle } from "@/hooks/use-page-title";
import { motion } from "framer-motion";
import { Mic, MessageSquare, Database, Code2, GraduationCap, PenLine, Calendar, Users, Gamepad2, Globe2, Target, Users2 } from "lucide-react";
import { PageHero, SectionTag, Reveal, DrawLine, SplitReveal } from "@/components/ui/motion-primitives";

const features = [
  {
    num: "01", name: "VOICE", title: "Voice Conversations", icon: Mic, color: "#0ea5e9",
    desc: "Real-time, ultra-low latency voice responses directly in any Discord voice channel. Multi-speaker recognition, noise cancellation, wake word activation.",
    bullets: ["< 200ms audio latency", "Multi-speaker recognition", "Noise cancellation built-in", "Wake word activation", "Auto-join/leave channels"],
  },
  {
    num: "02", name: "TEXT", title: "Text Intelligence", icon: MessageSquare, color: "#FFE500",
    desc: "Understands thread context, replies naturally, and maintains conversational flow across 20+ languages with tone matching.",
    bullets: ["Thread context (up to 32k tokens)", "Natural conversational flow", "20+ languages supported", "Tone detection and matching", "Thread summarization"],
  },
  {
    num: "03", name: "MEMORY", title: "Memory System", icon: Database, color: "#a855f7",
    desc: "Long-term vector database remembers user preferences, facts, and past conversations across every session.",
    bullets: ["Vector database storage", "Cross-session memory recall", "Per-user preference learning", "5,000 memory nodes on Pro", "User / server / global scope"],
  },
  {
    num: "04", name: "CODE", title: "Coding Help", icon: Code2, color: "#FFE500",
    desc: "Syntax highlighting, code review, and generation for 15+ programming languages. Your AI pair programmer in Discord.",
    bullets: ["15+ programming languages", "Syntax highlighting", "Code review and suggestions", "Bug detection and fixes", "GitHub Gist integration"],
  },
  {
    num: "05", name: "LEARN", title: "Learning & Education", icon: GraduationCap, color: "#10b981",
    desc: "Tutor mode adapts explanations for 30+ academic subjects with quiz mode, flashcards, and source citations.",
    bullets: ["30+ academic subjects", "Adaptive explanation depth", "Quiz and flashcard mode", "Source citations", "Homework assistance"],
  },
  {
    num: "06", name: "WRITE", title: "Writing Tools", icon: PenLine, color: "#6366f1",
    desc: "Drafting, editing, and creative writing assistance on demand. Tone adjustment, grammar, clarity fixes.",
    bullets: ["Essay drafting and editing", "Creative fiction writing", "Tone and style adjustment", "Grammar and clarity fixes", "Content outlining"],
  },
  {
    num: "07", name: "PLAN", title: "Planning & Productivity", icon: Calendar, color: "#FFE500",
    desc: "Organize tasks, summarize meetings, and track project deadlines directly in Discord — async-native.",
    bullets: ["Task list management", "Meeting summary generation", "Project breakdown", "Deadline tracking", "Daily standups"],
  },
  {
    num: "08", name: "COMMUNITY", title: "Community Types", icon: Users, color: "#f43f5e",
    desc: "Adapts to the specific needs and culture of any server — gaming, study, creative, business, and beyond.",
    bullets: ["Gaming · Study · Developer", "Creative · Music · Sports", "Anime · Book Club · Investment", "Cooking · Travel · Language", "Business · Fan Clubs"],
  },
  {
    num: "09", name: "FUN", title: "Entertainment", icon: Gamepad2, color: "#FFE500",
    desc: "Keep the server engaged with interactive games, roleplay, and curated media recommendations.",
    bullets: ["Trivia games with scoring", "Interactive storytelling", "Joke mode", "Movie/music recommendations", "Character roleplay"],
  },
  {
    num: "10", name: "ADAPT", title: "Adaptable Communication", icon: Globe2, color: "#0ea5e9",
    desc: "Automatically adjusts tone to match the channel, user, or situation — formal, casual, emoji-fluent.",
    bullets: ["Formal/casual toggle", "Language auto-detection", "Age-appropriate responses", "Cultural sensitivity", "Emoji/meme fluency"],
  },
  {
    num: "11", name: "HABIT", title: "Habit Building", icon: Target, color: "#10b981",
    desc: "Personalized tracking and gentle reminders for daily goals with streak visibility and accountability.",
    bullets: ["Daily check-in reminders", "Streak tracking", "Goal setting and review", "Accountability partners", "Progress visualization"],
  },
  {
    num: "12", name: "TEAM", title: "Team Collaboration", icon: Users2, color: "#a855f7",
    desc: "The async AI teammate that captures decisions and keeps everyone aligned across time zones.",
    bullets: ["Meeting notes generation", "Action item tracking", "Decision logging", "Async thread summaries", "Cross-channel context"],
  },
];

export default function Features() {
  usePageTitle("Features");

  return (
    <div style={{ background: "#070708" }}>
      <PageHero
        eyebrow="Features — 12 Modules"
        heading="Capabilities."
        sub="Every tool your Discord server needs — voice, memory, code, education, entertainment, and team productivity."
      />

      <div className="max-w-7xl mx-auto px-6 py-20 space-y-4">
        {features.map((sec, i) => (
          <motion.div
            key={sec.num}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <DrawLine />
            <div
              className={`grid lg:grid-cols-2 gap-12 items-center py-20 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              {/* Text */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em]"
                    style={{ color: "rgba(255,255,255,0.25)" }}>{sec.num}</span>
                  <div className="h-px w-6" style={{ background: "rgba(255,255,255,0.08)" }} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em]"
                    style={{ color: "rgba(255,255,255,0.25)" }}>{sec.name}</span>
                </div>
                <h2
                  className="font-display font-bold text-white leading-[0.9] tracking-tight mb-4"
                  style={{ fontSize: "clamp(32px, 4.5vw, 56px)" }}
                >
                  {sec.title}
                </h2>
                <p className="font-mono text-sm leading-relaxed mb-8"
                  style={{ color: "rgba(255,255,255,0.38)" }}>
                  {sec.desc}
                </p>
                <ul className="space-y-2.5">
                  {sec.bullets.map((b, j) => (
                    <motion.li
                      key={j}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + j * 0.06 }}
                      className="flex items-center gap-3"
                    >
                      <div
                        className="w-4 h-4 rounded-sm flex items-center justify-center shrink-0"
                        style={{
                          background: `${sec.color}15`,
                          border: `1px solid ${sec.color}35`,
                        }}
                      >
                        <span className="text-[9px] font-bold" style={{ color: sec.color }}>✓</span>
                      </div>
                      <span className="font-mono text-xs text-white/70">{b}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Visual */}
              <Reveal delay={0.1}>
                <div
                  className="rounded-xl overflow-hidden aspect-video relative flex items-center justify-center"
                  style={{
                    background: "#0f0f12",
                    border: `1px solid ${sec.color}18`,
                    boxShadow: `0 0 60px ${sec.color}06`,
                  }}
                >
                  <sec.icon
                    size={80}
                    style={{ color: sec.color, opacity: 0.08 }}
                    className="absolute"
                  />
                  <div className="relative text-center">
                    <sec.icon size={40} style={{ color: sec.color }} className="mx-auto mb-4" />
                    <div className="font-mono text-[10px] uppercase tracking-widest"
                      style={{ color: "rgba(255,255,255,0.25)" }}>
                      FIG.{sec.num} — {sec.name}
                    </div>
                  </div>
                  <div
                    className="absolute bottom-4 right-4 font-mono text-[9px] uppercase tracking-widest"
                    style={{ color: "rgba(255,255,255,0.15)" }}
                  >
                    MODULE {sec.num}/12
                  </div>
                </div>
              </Reveal>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
