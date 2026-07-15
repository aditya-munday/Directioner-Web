import { usePageTitle } from "@/hooks/use-page-title";
import { motion } from "framer-motion";
import { Mic, MessageSquare, Database, Code2, GraduationCap, PenLine, Calendar, Users, Gamepad2, Globe2, Target, Users2 } from "lucide-react";
import { PageHero, SectionTag, Reveal, DrawLine, SplitReveal } from "@/components/ui/motion-primitives";
import { TiltCard } from "@/components/animations/TiltCard";
import { TextScramble } from "@/components/animations/TextScramble";
import { BorderBeam } from "@/components/animations/BorderBeam";
import { ClipReveal } from "@/components/animations/ClipReveal";

/* Real Unsplash images for each feature module */
const FEATURE_IMGS: Record<string, string> = {
  "01": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=900&q=80",  // voice/mic
  "02": "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&q=80",  // AI
  "03": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=900&q=80",  // data viz
  "04": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=80",  // code
  "05": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&q=80",  // study
  "06": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=900&q=80",  // writing
  "07": "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=900&q=80",  // planning
  "08": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&q=80",     // gaming community
  "09": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&q=80",  // entertainment/music
  "10": "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=900&q=80",     // language
  "11": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80",  // habit/fitness
  "12": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80",  // team
};

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
        image="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920&q=80"
      />

      <div className="max-w-7xl mx-auto px-6 py-20 space-y-4">
        {features.map((sec, i) => (
          <ClipReveal key={sec.num} delay={0.05}>
            <DrawLine />
            <div
              className={`grid lg:grid-cols-2 gap-12 items-center py-20 ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              {/* Text */}
              <div>
                <motion.div
                  className="flex items-center gap-3 mb-6"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <TextScramble
                    text={sec.num}
                    className="font-mono text-[10px] uppercase tracking-[0.22em]"
                    delay={0}
                    duration={0.6}
                    tag="span"
                  />
                  <div className="h-px w-6" style={{ background: "rgba(255,255,255,0.08)" }} />
                  <TextScramble
                    text={sec.name}
                    className="font-mono text-[10px] uppercase tracking-[0.22em]"
                    delay={0.1}
                    duration={0.5}
                    tag="span"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                  />
                </motion.div>

                <h2
                  className="font-display font-bold text-white leading-[0.9] tracking-tight mb-4"
                  style={{ fontSize: "clamp(32px, 4.5vw, 56px)" }}
                >
                  <SplitReveal text={sec.title} delay={0.05} />
                </h2>

                <Reveal delay={0.15}>
                  <p
                    className="font-mono text-sm leading-relaxed mb-8"
                    style={{ color: "rgba(255,255,255,0.38)" }}
                  >
                    {sec.desc}
                  </p>
                </Reveal>

                <ul className="space-y-2.5">
                  {sec.bullets.map((b, j) => (
                    <motion.li
                      key={j}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + j * 0.07, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-center gap-3"
                    >
                      <motion.div
                        className="w-4 h-4 rounded-sm flex items-center justify-center shrink-0"
                        style={{
                          background: `${sec.color}15`,
                          border: `1px solid ${sec.color}35`,
                        }}
                        whileHover={{ scale: 1.25, borderColor: sec.color }}
                      >
                        <span className="text-[9px] font-bold" style={{ color: sec.color }}>✓</span>
                      </motion.div>
                      <span className="font-mono text-xs text-white/70">{b}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Visual card — real photo + icon overlay + BorderBeam */}
              <Reveal delay={0.1}>
                <TiltCard intensity={5} glowColor={`${sec.color}0a`}>
                  <div
                    className="rounded-xl overflow-hidden aspect-[4/3] relative"
                    style={{ border: `1px solid ${sec.color}18` }}
                  >
                    {/* Real photo */}
                    <img
                      src={FEATURE_IMGS[sec.num] ?? FEATURE_IMGS["01"]}
                      alt={sec.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ filter: "brightness(0.35) saturate(0.6)" }}
                      loading="lazy"
                    />
                    {/* Colour tint */}
                    <div className="absolute inset-0"
                      style={{ background: `linear-gradient(135deg, ${sec.color}18 0%, transparent 60%)` }} />
                    <div className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, rgba(7,7,8,0.9) 0%, transparent 55%)" }} />

                    {/* Top-left icon badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: `${sec.color}20`, border: `1px solid ${sec.color}35`, backdropFilter: "blur(8px)" }}>
                        <sec.icon size={14} style={{ color: sec.color }} />
                      </div>
                    </div>

                    {/* Bottom label */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: sec.color, opacity: 0.8 }}>
                          {sec.name}
                        </div>
                        <div className="font-mono text-[9px] uppercase tracking-widest mt-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>
                          Module {sec.num}/12
                        </div>
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.15)" }}>
                        FIG.{sec.num}
                      </span>
                    </div>

                    {/* Scanning line */}
                    <motion.div
                      className="absolute left-0 right-0 h-px pointer-events-none"
                      style={{ background: `linear-gradient(90deg, transparent, ${sec.color}35, transparent)` }}
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    />
                    <BorderBeam color={sec.color} duration={5} delay={i * 0.3} />
                  </div>
                </TiltCard>
              </Reveal>
            </div>
          </ClipReveal>
        ))}
      </div>
    </div>
  );
}
