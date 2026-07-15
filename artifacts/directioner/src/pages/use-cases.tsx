import { usePageTitle } from "@/hooks/use-page-title";
import { motion } from "framer-motion";
import { Gamepad2, BookOpen, Code2, Music, Film, Dumbbell, Globe, Users, Briefcase } from "lucide-react";
import { PageHero, DrawLine, Reveal, SplitReveal } from "@/components/ui/motion-primitives";
import { ClipReveal } from "@/components/animations/ClipReveal";

/* Real Unsplash images for each use case */
const IMGS: Record<string, string> = {
  gaming:    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&q=80",
  study:     "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&q=80",
  developer: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=80",
  music:     "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&q=80",
  fan:       "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=900&q=80",
  fitness:   "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80",
  language:  "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=900&q=80",
  creative:  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900&q=80",
  pro:       "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80",
};

const useCases = [
  {
    n: "01", imgKey: "gaming", icon: Gamepad2, title: "Gaming Communities",
    color: "#0ea5e9",
    desc: "Directioner becomes the ultimate gaming companion — tracking stats, hosting lore discussions, running trivia, and managing raid sign-ups.",
    points: ["Live game stat queries", "Lore & world knowledge", "Trivia & achievement tracking", "Raid/party coordination", "Match recap generation"],
    quote: "\"Our raid prep time dropped by half since the bot started handling logistics.\"",
  },
  {
    n: "02", imgKey: "study", icon: BookOpen, title: "Study Groups",
    color: "#FFE500",
    desc: "Acts as a 24/7 tutoring assistant — explains concepts, quizzes members, tracks study goals, and motivates with streak rewards.",
    points: ["Concept explanation on demand", "Adaptive quiz generation", "Study streak tracking", "Source citation with context", "Exam prep mode"],
    quote: "\"It's like having a TA available every time someone gets stuck at midnight.\"",
  },
  {
    n: "03", imgKey: "developer", icon: Code2, title: "Developer Communities",
    color: "#a855f7",
    desc: "From code review to architecture discussion to debugging — Directioner keeps your dev community moving at shipping speed.",
    points: ["Inline code review", "Bug detection and fix suggestions", "Stack Overflow context aggregation", "PR summary generation", "Language switcher"],
    quote: "\"The code review feature alone saves us hours of back-and-forth every week.\"",
  },
  {
    n: "04", imgKey: "music", icon: Music, title: "Music Servers",
    color: "#f43f5e",
    desc: "Discuss, recommend, and analyze music with an AI that genuinely understands genres, artists, and the cultural context behind songs.",
    points: ["Artist & album recommendations", "Mood-based playlist curation", "Music theory explanations", "Concert info lookup", "Genre exploration mode"],
    quote: "\"People discover new music through the bot almost daily. It changed our culture.\"",
  },
  {
    n: "05", imgKey: "fan", icon: Film, title: "Fan Communities",
    color: "#FFE500",
    desc: "Deep lore expert for any franchise — anime, film, books, games. Discuss theories, recap episodes, and explore timelines together.",
    points: ["Full franchise lore database", "Theory discussion and debate", "Episode & chapter summaries", "Character deep-dives", "Spoiler-safe modes"],
    quote: "\"It remembered plot threads from three seasons ago that I'd forgotten. Wild.\"",
  },
  {
    n: "06", imgKey: "fitness", icon: Dumbbell, title: "Fitness Communities",
    color: "#10b981",
    desc: "Personal trainer for the whole server — custom workout plans, nutrition advice, progress tracking, and community accountability.",
    points: ["Custom workout generation", "Macro & nutrition tracking", "PR announcement support", "Daily challenge posting", "Weekly accountability check-ins"],
    quote: "\"The daily check-ins keep the whole community accountable. Our gym server is thriving.\"",
  },
  {
    n: "07", imgKey: "language", icon: Globe, title: "Language Learning",
    color: "#6366f1",
    desc: "Native-level conversation partner in 20+ languages. Corrects grammar in real time, teaches idioms, and adapts to learning level.",
    points: ["Real-time grammar correction", "Idiom and slang explanation", "Conversation practice partner", "Cultural context notes", "Vocabulary building exercises"],
    quote: "\"My Spanish improved more in two months with this bot than in two years of apps.\"",
  },
  {
    n: "08", imgKey: "creative", icon: Users, title: "Creative Communities",
    color: "#f97316",
    desc: "Writer's room, art critique, worldbuilding assistant — Directioner unlocks creativity with contextual feedback and generative brainstorming.",
    points: ["Writing prompt generation", "Character & story feedback", "Worldbuilding consistency checks", "Art critique mode", "Collaborative fiction mode"],
    quote: "\"It keeps our worldbuilding bible consistent better than any doc we've ever maintained.\"",
  },
  {
    n: "09", imgKey: "pro", icon: Briefcase, title: "Professional Teams",
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
        heading="Built for every server."
        sub="From 100-member gaming groups to 50k developer communities — Directioner adapts to your culture."
        image="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-2">
        {useCases.map((uc, i) => (
          <ClipReveal key={uc.n} delay={0.04}>
            <DrawLine />
            <div className={`grid lg:grid-cols-2 gap-0 items-stretch py-20 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>

              {/* Text */}
              <div className={`flex flex-col justify-center ${i % 2 === 1 ? "lg:pl-16" : "lg:pr-16"}`}>
                <motion.div
                  className="flex items-center gap-3 mb-8"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="font-mono text-[9px] uppercase tracking-[0.28em]" style={{ color: "rgba(255,255,255,0.22)" }}>{uc.n}</span>
                  <div className="h-px w-6" style={{ background: "rgba(255,255,255,0.08)" }} />
                  <span className="font-mono text-[9px] uppercase tracking-[0.22em]" style={{ color: uc.color, opacity: 0.7 }}>
                    {uc.title}
                  </span>
                </motion.div>

                <h2 className="font-display font-bold text-white leading-[0.9] tracking-tight mb-5"
                  style={{ fontSize: "clamp(32px, 4.5vw, 60px)" }}>
                  <SplitReveal text={uc.title} delay={0.05} />
                </h2>

                <Reveal delay={0.15}>
                  <p className="font-mono text-sm leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.38)" }}>{uc.desc}</p>
                </Reveal>

                <ul className="space-y-2.5 mb-8">
                  {uc.points.map((p, j) => (
                    <motion.li key={j}
                      initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: 0.1 + j * 0.06, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-4 h-4 rounded-sm flex items-center justify-center shrink-0"
                        style={{ background: `${uc.color}15`, border: `1px solid ${uc.color}30` }}>
                        <span className="text-[9px] font-bold" style={{ color: uc.color }}>✓</span>
                      </div>
                      <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{p}</span>
                    </motion.li>
                  ))}
                </ul>

                <Reveal delay={0.3}>
                  <blockquote className="font-mono text-xs italic leading-relaxed pl-4"
                    style={{ color: "rgba(255,255,255,0.28)", borderLeft: `2px solid ${uc.color}40` }}>
                    {uc.quote}
                  </blockquote>
                </Reveal>
              </div>

              {/* Real image */}
              <Reveal delay={0.1}>
                <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
                  <img
                    src={IMGS[uc.imgKey]}
                    alt={uc.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: "brightness(0.45) saturate(0.75)" }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0"
                    style={{ background: `linear-gradient(135deg, ${uc.color}18 0%, transparent 60%)` }} />
                  <div className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(7,7,8,0.7) 0%, transparent 50%)" }} />

                  {/* Label */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: `${uc.color}20`, border: `1px solid ${uc.color}35` }}>
                      <uc.icon size={13} style={{ color: uc.color }} />
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-1 rounded"
                      style={{ background: "rgba(7,7,8,0.7)", color: "rgba(255,255,255,0.5)", backdropFilter: "blur(8px)" }}>
                      FIG.{uc.n}
                    </span>
                  </div>

                  {/* Bottom stat */}
                  <div className="absolute bottom-4 right-4 font-mono text-[9px] uppercase tracking-widest px-2 py-1 rounded"
                    style={{ background: "rgba(7,7,8,0.7)", color: uc.color, backdropFilter: "blur(8px)", border: `1px solid ${uc.color}25` }}>
                    {uc.title}
                  </div>
                </div>
              </Reveal>

            </div>
          </ClipReveal>
        ))}
      </div>
    </div>
  );
}
