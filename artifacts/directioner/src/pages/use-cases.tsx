import { usePageTitle } from "@/hooks/use-page-title";
import { motion } from "framer-motion";
import { Gamepad2, BookOpen, Code2, Music, Film, Dumbbell, Globe, Users, Briefcase } from "lucide-react";
import { PageHero, DrawLine, Reveal, SplitReveal } from "@/components/ui/motion-primitives";
import { TiltCard } from "@/components/animations/TiltCard";
import { BorderBeam } from "@/components/animations/BorderBeam";
import { ClipReveal } from "@/components/animations/ClipReveal";

const useCases = [
  {
    n: "01", icon: Gamepad2, title: "Gaming Communities",
    color: "#0ea5e9",
    desc: "Directioner becomes the ultimate gaming companion — tracking stats, hosting lore discussions, running trivia, and managing raid sign-ups.",
    points: ["Live game stat queries", "Lore & world knowledge", "Trivia & achievement tracking", "Raid/party coordination", "Match recap generation"],
    quote: "\"Our raid prep time dropped by half since the bot started handling logistics.\"",
  },
  {
    n: "02", icon: BookOpen, title: "Study Groups",
    color: "#FFE500",
    desc: "Acts as a 24/7 tutoring assistant — explains concepts, quizzes members, tracks study goals, and motivates with streak rewards.",
    points: ["Concept explanation on demand", "Adaptive quiz generation", "Study streak tracking", "Source citation with context", "Exam prep mode"],
    quote: "\"It's like having a TA available every time someone gets stuck at midnight.\"",
  },
  {
    n: "03", icon: Code2, title: "Developer Communities",
    color: "#a855f7",
    desc: "From code review to architecture discussion to debugging — Directioner keeps your dev community moving at shipping speed.",
    points: ["Inline code review", "Bug detection and fix suggestions", "Stack Overflow context aggregation", "PR summary generation", "Language switcher"],
    quote: "\"The code review feature alone saves us hours of back-and-forth every week.\"",
  },
  {
    n: "04", icon: Music, title: "Music Servers",
    color: "#f43f5e",
    desc: "Discuss, recommend, and analyze music with an AI that genuinely understands genres, artists, and the cultural context behind songs.",
    points: ["Artist & album recommendations", "Mood-based playlist curation", "Music theory explanations", "Concert info lookup", "Genre exploration mode"],
    quote: "\"People discover new music through the bot almost daily. It changed our culture.\"",
  },
  {
    n: "05", icon: Film, title: "Fan Communities",
    color: "#FFE500",
    desc: "Deep lore expert for any franchise — anime, film, books, games. Discuss theories, recap episodes, and explore timelines together.",
    points: ["Full franchise lore database", "Theory discussion and debate", "Episode & chapter summaries", "Character deep-dives", "Spoiler-safe modes"],
    quote: "\"It remembered plot threads from three seasons ago that I'd forgotten. Wild.\"",
  },
  {
    n: "06", icon: Dumbbell, title: "Fitness Communities",
    color: "#10b981",
    desc: "Personal trainer for the whole server — custom workout plans, nutrition advice, progress tracking, and community accountability.",
    points: ["Custom workout generation", "Macro & nutrition tracking", "PR announcement support", "Daily challenge posting", "Weekly accountability check-ins"],
    quote: "\"The daily check-ins keep the whole community accountable. Our gym server is thriving.\"",
  },
  {
    n: "07", icon: Globe, title: "Language Learning",
    color: "#6366f1",
    desc: "Native-level conversation partner in 20+ languages. Corrects grammar in real time, teaches idioms, and adapts to learning level.",
    points: ["Real-time grammar correction", "Idiom and slang explanation", "Conversation practice partner", "Cultural context notes", "Vocabulary building exercises"],
    quote: "\"My Spanish improved more in two months with this bot than in two years of apps.\"",
  },
  {
    n: "08", icon: Users, title: "Creative Communities",
    color: "#f97316",
    desc: "Writer's room, art critique, worldbuilding assistant — Directioner unlocks creativity with contextual feedback and generative brainstorming.",
    points: ["Writing prompt generation", "Character & story feedback", "Worldbuilding consistency checks", "Art critique mode", "Collaborative fiction mode"],
    quote: "\"It keeps our worldbuilding bible consistent better than any doc we've ever maintained.\"",
  },
  {
    n: "09", icon: Briefcase, title: "Professional Teams",
    color: "#FFE500",
    desc: "Async-first team companion — captures decisions, generates standup summaries, tracks action items, and keeps remote teams aligned.",
    points: ["Meeting summary generation", "Action item extraction", "Decision documentation", "Async standup facilitation", "Cross-timezone context relay"],
    quote: "\"We stopped losing decisions in the thread scroll. The bot archives everything.\"",
  },
];

export default function UseCases() {
  usePageTitle("Use Cases");

  return (
    <div style={{ background: "#070708" }}>
      <PageHero
        eyebrow="Use Cases — 9 Community Types"
        heading="Who uses Directioner."
        sub="One AI. Every kind of community. See how different servers unlock value from Directioner's capabilities."
      />

      {useCases.map((uc, i) => (
        <div key={uc.n}>
          <DrawLine />
          <section
            className="py-24 px-6"
            style={{ background: i % 2 === 0 ? "#0a0a0c" : "#070708" }}
          >
            <div className="max-w-7xl mx-auto">
              <div className={`grid lg:grid-cols-2 gap-16 items-center ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                {/* Text */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em]"
                      style={{ color: "rgba(255,255,255,0.25)" }}>{uc.n}</span>
                    <div className="h-px w-6" style={{ background: "rgba(255,255,255,0.08)" }} />
                    <div className="flex items-center gap-2">
                      <uc.icon size={14} style={{ color: uc.color }} />
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em]"
                        style={{ color: uc.color }}>{uc.title}</span>
                    </div>
                  </div>
                  <h2
                    className="font-display font-bold text-white leading-[0.9] tracking-tight mb-4"
                    style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}
                  >
                    <SplitReveal text={uc.title} delay={0.1} />
                  </h2>
                  <p className="font-mono text-sm leading-relaxed mb-8"
                    style={{ color: "rgba(255,255,255,0.38)" }}>
                    {uc.desc}
                  </p>
                  <ul className="space-y-2 mb-10">
                    {uc.points.map((p, j) => (
                      <motion.li
                        key={j}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: j * 0.07 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: uc.color }} />
                        <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>{p}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <Reveal>
                    <div className="p-5 rounded-lg italic font-mono text-xs leading-relaxed"
                      style={{ background: "#0f0f12", border: `1px solid ${uc.color}20`, color: "rgba(255,255,255,0.45)", borderLeft: `3px solid ${uc.color}` }}>
                      {uc.quote}
                    </div>
                  </Reveal>
                </div>

                {/* Visual */}
                <Reveal delay={0.15}>
                  <div
                    className="rounded-xl aspect-square relative flex items-center justify-center overflow-hidden"
                    style={{
                      background: "#0f0f12",
                      border: `1px solid ${uc.color}18`,
                    }}
                  >
                    <uc.icon size={120} style={{ color: uc.color, opacity: 0.05 }} className="absolute" />
                    <uc.icon size={56} style={{ color: uc.color }} className="relative" />
                    {/* Corner tags */}
                    <div className="absolute top-4 left-4 font-mono text-[9px] uppercase tracking-widest"
                      style={{ color: "rgba(255,255,255,0.2)" }}>
                      USE CASE {uc.n}
                    </div>
                    <div className="absolute bottom-4 right-4 font-mono text-[9px] uppercase tracking-widest"
                      style={{ color: "rgba(255,255,255,0.2)" }}>
                      {uc.title.split(" ")[0].toUpperCase()}
                    </div>
                    {/* Dot ring */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-48 h-48 rounded-full"
                        style={{ border: `1px dashed ${uc.color}20` }}
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-32 h-32 rounded-full"
                        style={{ border: `1px solid ${uc.color}12` }}
                      />
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        </div>
      ))}

      <DrawLine />

      {/* Bottom CTA */}
      <section className="py-32 px-6 text-center" style={{ background: "#070708" }}>
        <div className="max-w-2xl mx-auto">
          <Reveal>
            <h2 className="font-display font-bold text-white mb-4" style={{ fontSize: "clamp(36px, 6vw, 80px)", letterSpacing: "-0.04em" }}>
              Your turn.
            </h2>
            <p className="font-mono text-sm mb-10" style={{ color: "rgba(255,255,255,0.35)" }}>
              Add Directioner to your server in under 60 seconds.
            </p>
            <a
              href="https://discord.com/oauth2/authorize"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono font-bold text-sm uppercase tracking-wide px-8 py-4 transition-all"
              style={{ background: "#FFE500", color: "#000" }}
            >
              Add to Discord
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
