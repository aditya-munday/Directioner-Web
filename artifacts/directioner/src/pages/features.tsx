import { useRef, useState } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { motion, useInView } from "framer-motion";
import {
  Mic, MessageSquare, Database, Code2, GraduationCap, PenLine,
  Calendar, Users, Gamepad2, Globe2, Target, Users2, ArrowUpRight,
} from "lucide-react";
import { PageHero, SectionTag, Reveal, DrawLine, SplitReveal } from "@/components/ui/motion-primitives";
import { TiltCard } from "@/components/animations/TiltCard";
import { BorderBeam } from "@/components/animations/BorderBeam";
import { ClipReveal } from "@/components/animations/ClipReveal";
import { Link } from "wouter";

const features = [
  {
    num: "01", name: "VOICE", title: "Voice Conversations", icon: Mic, color: "#0ea5e9",
    desc: "Real-time, ultra-low latency voice responses directly in any Discord voice channel. Multi-speaker recognition, noise cancellation, and wake word activation — built for natural conversation.",
    bullets: ["< 200ms audio latency", "Multi-speaker recognition", "Noise cancellation built-in", "Wake word activation", "Auto-join / leave channels"],
    demoLines: [
      { label: "LATENCY", value: "< 200ms", accent: true },
      { label: "SPEAKERS", value: "Up to 8 voices" },
      { label: "MODE", value: "Always-on / PTT" },
      { label: "QUALITY", value: "Neural TTS" },
    ],
  },
  {
    num: "02", name: "TEXT", title: "Text Intelligence", icon: MessageSquare, color: "#FFE500",
    desc: "Understands thread context, replies naturally, and maintains conversational flow across 20+ languages with automatic tone matching and emoji fluency.",
    bullets: ["Thread context up to 32k tokens", "Natural conversational flow", "20+ languages supported", "Tone detection and matching", "Thread summarization"],
    demoLines: [
      { label: "CONTEXT", value: "32,000 tokens", accent: true },
      { label: "LANGUAGES", value: "20+ supported" },
      { label: "FORMAT", value: "Markdown + code" },
      { label: "LATENCY", value: "< 400ms text" },
    ],
  },
  {
    num: "03", name: "MEMORY", title: "Memory System", icon: Database, color: "#a855f7",
    desc: "Long-term vector database remembers user preferences, facts, and past conversations across every session — indefinitely. Semantic search surfaces the right memory at the right moment.",
    bullets: ["Vector database storage", "Cross-session memory recall", "Per-user preference learning", "5,000 memory nodes on Pro", "User / server / global scope"],
    demoLines: [
      { label: "STORAGE", value: "Vector DB", accent: true },
      { label: "NODES (PRO)", value: "5,000" },
      { label: "SEARCH", value: "Semantic" },
      { label: "SCOPE", value: "User · Server · Global" },
    ],
  },
  {
    num: "04", name: "CODE", title: "Coding Help", icon: Code2, color: "#FFE500",
    desc: "Syntax highlighting, code review, and generation for 15+ programming languages. Your AI pair programmer in Discord — from bug detection to architecture advice.",
    bullets: ["15+ programming languages", "Syntax highlighting", "Code review and suggestions", "Bug detection and fixes", "GitHub Gist integration"],
    demoLines: [
      { label: "LANGUAGES", value: "15+ supported", accent: true },
      { label: "FEATURES", value: "Review · Debug · Gen" },
      { label: "INTEGRATION", value: "GitHub Gists" },
      { label: "ANALYSIS", value: "Big O complexity" },
    ],
  },
  {
    num: "05", name: "LEARN", title: "Learning & Education", icon: GraduationCap, color: "#10b981",
    desc: "Adaptive tutor mode explains 30+ academic subjects at your level. Quiz mode, flashcard generation, source citations, and homework assistance — a full study session in your server.",
    bullets: ["30+ academic subjects", "Adaptive explanation depth", "Quiz and flashcard mode", "Source citations", "Homework assistance"],
    demoLines: [
      { label: "SUBJECTS", value: "30+ academic", accent: true },
      { label: "MODES", value: "Quiz · Flashcard · Tutor" },
      { label: "CITATIONS", value: "Included" },
      { label: "DEPTH", value: "Adaptive to user level" },
    ],
  },
  {
    num: "06", name: "WRITE", title: "Writing Tools", icon: PenLine, color: "#6366f1",
    desc: "Drafting, editing, and creative writing assistance on demand. Essays to screenplays — tone adjustment, grammar, clarity, and style all handled in one conversation.",
    bullets: ["Essay drafting and editing", "Creative fiction writing", "Tone and style adjustment", "Grammar and clarity fixes", "Content outlining"],
    demoLines: [
      { label: "MODES", value: "Essay · Fiction · Copy", accent: true },
      { label: "TONE", value: "Academic · Casual · Sales" },
      { label: "FORMATS", value: "Script · Blog · Ad" },
      { label: "TOOLS", value: "Grammar + Paraphrase" },
    ],
  },
  {
    num: "07", name: "PLAN", title: "Planning & Productivity", icon: Calendar, color: "#FFE500",
    desc: "Organize tasks, summarize meetings, and track project deadlines directly in Discord — async-native team coordination that actually keeps everyone aligned.",
    bullets: ["Task list management", "Meeting summary generation", "Project breakdown", "Deadline tracking", "Daily standups"],
    demoLines: [
      { label: "FEATURES", value: "Tasks · Summaries · OKRs", accent: true },
      { label: "STANDUPS", value: "Daily facilitation" },
      { label: "DECISIONS", value: "Auto-logged" },
      { label: "TIMEZONE", value: "Async-native" },
    ],
  },
  {
    num: "08", name: "COMMUNITY", title: "Community Types", icon: Users, color: "#f43f5e",
    desc: "Adapts to the specific needs and culture of any server — gaming, study, creative, business, and beyond. Directioner understands your community's language.",
    bullets: ["Gaming · Study · Developer", "Creative · Music · Sports", "Anime · Book Club · Investment", "Cooking · Travel · Language", "Business · Fan Clubs"],
    demoLines: [
      { label: "SERVER TYPES", value: "20+ categories", accent: true },
      { label: "TONE", value: "Auto-adapts" },
      { label: "CULTURE", value: "Server-aware" },
      { label: "ONBOARDING", value: "Auto welcome flow" },
    ],
  },
  {
    num: "09", name: "FUN", title: "Entertainment", icon: Gamepad2, color: "#FFE500",
    desc: "Keep the server engaged with interactive games, trivia with live scoring, character roleplay, and curated movie or music recommendations.",
    bullets: ["Trivia games with scoring", "Interactive storytelling", "Joke mode", "Movie/music recommendations", "Character roleplay"],
    demoLines: [
      { label: "GAMES", value: "Trivia · Riddles · RPG", accent: true },
      { label: "ROLEPLAY", value: "DM + Character modes" },
      { label: "RECS", value: "Movie · Music · Book" },
      { label: "HIGHLIGHTS", value: "Weekly recaps" },
    ],
  },
  {
    num: "10", name: "ADAPT", title: "Adaptable Communication", icon: Globe2, color: "#0ea5e9",
    desc: "Automatically adjusts tone to match the channel, user, or situation — formal, casual, emoji-fluent. NSFW filtering and age-appropriate mode included.",
    bullets: ["Formal/casual toggle", "Language auto-detection", "Age-appropriate responses", "Cultural sensitivity", "Emoji/meme fluency"],
    demoLines: [
      { label: "TONES", value: "Formal · Casual · Gen-Z", accent: true },
      { label: "FILTERING", value: "NSFW configurable" },
      { label: "LANGUAGES", value: "Auto-detect + switch" },
      { label: "A11Y", value: "Plain language mode" },
    ],
  },
  {
    num: "11", name: "HABIT", title: "Habit Building", icon: Target, color: "#10b981",
    desc: "Personalized tracking and gentle reminders for daily goals with streak visibility and accountability partner pairing for group challenges.",
    bullets: ["Daily check-in reminders", "Streak tracking", "Goal setting and review", "Accountability partners", "Progress visualization"],
    demoLines: [
      { label: "TRACKING", value: "Streaks + Progress", accent: true },
      { label: "REMINDERS", value: "Custom schedule" },
      { label: "PARTNERS", value: "Accountability pairing" },
      { label: "REPORTS", value: "Monthly trends" },
    ],
  },
  {
    num: "12", name: "TEAM", title: "Team Collaboration", icon: Users2, color: "#a855f7",
    desc: "The async AI teammate that captures decisions, extracts action items, and keeps distributed teams aligned across time zones — all inside Discord.",
    bullets: ["Meeting notes generation", "Action item tracking", "Decision logging", "Async thread summaries", "Cross-channel context"],
    demoLines: [
      { label: "NOTES", value: "Auto-generated", accent: true },
      { label: "ACTIONS", value: "Extracted + tracked" },
      { label: "DECISIONS", value: "Context preserved" },
      { label: "SCOPE", value: "Cross-channel links" },
    ],
  },
];

function FeatureDemo({ feature, index }: { feature: typeof features[0]; index: number }) {
  const Icon = feature.icon;
  return (
    <TiltCard intensity={6} glowColor={`${feature.color}12`}>
      <div
        className="rounded-xl overflow-hidden relative"
        style={{
          background: "linear-gradient(145deg, #0d0d10, #0a0a0d)",
          border: `1px solid ${feature.color}20`,
          boxShadow: `0 0 80px ${feature.color}06, inset 0 1px 0 rgba(255,255,255,0.04)`,
          minHeight: 320,
        }}
      >
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-5 py-3.5 border-b"
          style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.2)" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: "#f43f5e" }} />
            <div className="w-2 h-2 rounded-full" style={{ background: "#FFE500" }} />
            <div className="w-2 h-2 rounded-full" style={{ background: "#10b981" }} />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.22em]" style={{ color: "rgba(255,255,255,0.2)" }}>
            MODULE {feature.num}/12
          </span>
        </div>

        {/* Icon center */}
        <div className="relative flex flex-col items-center justify-center py-8">
          {/* Large watermark icon */}
          <Icon size={120} className="absolute opacity-[0.04]" style={{ color: feature.color }} />

          {/* Pulsing ring */}
          <motion.div
            className="absolute rounded-full"
            style={{ width: 100, height: 100, border: `1px solid ${feature.color}20` }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{ width: 140, height: 140, border: `1px solid ${feature.color}10` }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.05, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />

          {/* Icon */}
          <motion.div
            className="relative z-10 flex items-center justify-center w-16 h-16 rounded-xl mb-4"
            style={{
              background: `${feature.color}12`,
              border: `1px solid ${feature.color}30`,
            }}
            whileHover={{ scale: 1.08, rotate: 3 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Icon size={28} style={{ color: feature.color }} />
          </motion.div>

          <span className="font-mono text-[10px] uppercase tracking-widest relative z-10" style={{ color: "rgba(255,255,255,0.2)" }}>
            FIG.{feature.num} — {feature.name}
          </span>
        </div>

        {/* Data rows */}
        <div className="border-t px-5 pb-5" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          {feature.demoLines.map((line, i) => (
            <motion.div
              key={i}
              className="flex items-center justify-between py-2 border-b last:border-0"
              style={{ borderColor: "rgba(255,255,255,0.04)" }}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>
                {line.label}
              </span>
              <span
                className="font-mono text-[10px]"
                style={{ color: line.accent ? feature.color : "rgba(255,255,255,0.5)" }}
              >
                {line.value}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Scanning line */}
        <motion.div
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent, ${feature.color}50, transparent)` }}
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />

        <BorderBeam color={feature.color} duration={5} delay={index * 0.3} />
      </div>
    </TiltCard>
  );
}

export default function Features() {
  usePageTitle("Features");
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToSection = (i: number) => {
    sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(i);
  };

  return (
    <div style={{ background: "#070708" }}>
      {/* Dot grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10">
        <PageHero
          eyebrow="12 MODULES"
          heading="Every capability you need."
          sub="Directioner brings voice, memory, code assistance, education, entertainment, and team productivity together in one Discord bot — built for communities of every kind."
        />

        <div className="max-w-[1400px] mx-auto px-6 pb-32 flex gap-16 relative">
          {/* Sticky sidebar */}
          <aside className="hidden lg:block w-52 shrink-0">
            <div className="sticky top-24">
              <div className="font-mono text-[9px] uppercase tracking-[0.22em] mb-6" style={{ color: "rgba(255,255,255,0.2)" }}>
                Navigation
              </div>
              <nav className="space-y-px">
                {features.map((f, i) => (
                  <button
                    key={f.num}
                    onClick={() => scrollToSection(i)}
                    className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded transition-all group"
                    style={{
                      background: activeSection === i ? `${f.color}10` : "transparent",
                      borderLeft: `2px solid ${activeSection === i ? f.color : "transparent"}`,
                    }}
                    onMouseEnter={e => {
                      if (activeSection !== i) {
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                      }
                    }}
                    onMouseLeave={e => {
                      if (activeSection !== i) {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                      }
                    }}
                  >
                    <span
                      className="font-mono text-[9px] w-6 shrink-0"
                      style={{ color: activeSection === i ? f.color : "rgba(255,255,255,0.2)" }}
                    >
                      {f.num}
                    </span>
                    <span
                      className="font-mono text-[10px] uppercase tracking-wide"
                      style={{ color: activeSection === i ? f.color : "rgba(255,255,255,0.3)" }}
                    >
                      {f.name}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              const isEven = i % 2 === 0;
              return (
                <div
                  key={feature.num}
                  ref={el => { sectionRefs.current[i] = el; }}
                >
                  <DrawLine />

                  <ClipReveal delay={0.02} duration={0.7}>
                    <div className="py-20">
                      {/* Section header */}
                      <motion.div
                        className="flex items-center gap-4 mb-10"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                        onViewportEnter={() => setActiveSection(i)}
                      >
                        <span
                          className="font-mono text-[10px] uppercase tracking-[0.22em]"
                          style={{ color: `${feature.color}70` }}
                        >
                          {feature.num}
                        </span>
                        <div className="h-px w-8" style={{ background: "rgba(255,255,255,0.08)" }} />
                        <span
                          className="font-mono text-[10px] uppercase tracking-[0.22em]"
                          style={{ color: "rgba(255,255,255,0.2)" }}
                        >
                          {feature.name}
                        </span>
                        <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.04)" }} />
                        <div
                          className="flex items-center gap-1.5 px-2 py-0.5 rounded"
                          style={{ background: `${feature.color}10`, border: `1px solid ${feature.color}25` }}
                        >
                          <Icon size={10} style={{ color: feature.color }} />
                          <span className="font-mono text-[8px] uppercase tracking-widest" style={{ color: feature.color }}>
                            Module
                          </span>
                        </div>
                      </motion.div>

                      {/* 2-col layout */}
                      <div
                        className={`grid lg:grid-cols-2 gap-12 items-center ${
                          !isEven ? "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1" : ""
                        }`}
                      >
                        {/* Text */}
                        <div>
                          <h2
                            className="font-display font-bold text-white leading-[0.9] tracking-tight mb-5"
                            style={{ fontSize: "clamp(30px, 4vw, 52px)" }}
                          >
                            <SplitReveal text={feature.title} delay={0.05} />
                          </h2>

                          <Reveal delay={0.15}>
                            <p
                              className="font-mono text-sm leading-relaxed mb-8"
                              style={{ color: "rgba(255,255,255,0.4)" }}
                            >
                              {feature.desc}
                            </p>
                          </Reveal>

                          <ul className="space-y-2.5">
                            {feature.bullets.map((b, j) => (
                              <motion.li
                                key={j}
                                initial={{ opacity: 0, x: -12 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-80px" }}
                                transition={{ delay: 0.1 + j * 0.07, ease: [0.16, 1, 0.3, 1] }}
                                className="flex items-center gap-3"
                              >
                                <motion.div
                                  className="w-4 h-4 rounded-sm flex items-center justify-center shrink-0"
                                  style={{
                                    background: `${feature.color}12`,
                                    border: `1px solid ${feature.color}30`,
                                  }}
                                  whileHover={{ scale: 1.25, borderColor: feature.color }}
                                >
                                  <span className="text-[8px] font-bold" style={{ color: feature.color }}>✓</span>
                                </motion.div>
                                <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                                  {b}
                                </span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>

                        {/* Demo */}
                        <Reveal delay={0.08}>
                          <FeatureDemo feature={feature} index={i} />
                        </Reveal>
                      </div>
                    </div>
                  </ClipReveal>
                </div>
              );
            })}

            {/* Final CTA */}
            <DrawLine />
            <Reveal className="py-24 text-center">
              <div
                className="font-mono text-[10px] uppercase tracking-[0.22em] mb-6"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                All 12 modules included
              </div>
              <h2
                className="font-display font-bold text-white mb-4 leading-[0.9]"
                style={{ fontSize: "clamp(32px, 5vw, 64px)" }}
              >
                <SplitReveal text="Ready to experience all 12 modules?" delay={0.04} />
              </h2>
              <Reveal delay={0.2}>
                <p className="font-mono text-sm mb-10" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Start free. No credit card required. Your first 100 messages/day are on us.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-2 font-mono font-bold text-sm uppercase tracking-wide px-8 py-4"
                      style={{ background: "#FFE500", color: "#000" }}
                    >
                      Get Started Free <ArrowUpRight size={15} />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="/pricing"
                      className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wide px-8 py-4 transition-colors"
                      style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)" }}
                    >
                      View Pricing
                    </Link>
                  </motion.div>
                </div>
              </Reveal>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
